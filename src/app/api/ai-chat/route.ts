import { NextResponse } from "next/server";

import { getCatalogProducts } from "@/lib/catalog";
import { formatCurrencyVND } from "@/lib/utils";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function buildCatalogContext(
  products: Awaited<ReturnType<typeof getCatalogProducts>>,
) {
  return products
    .slice(0, 30)
    .map((product) => {
      const firstVariant = product.variants[0];
      return `- ${product.name} | slug: ${product.slug} | categoryId: ${product.categoryId} | giá: ${formatCurrencyVND(firstVariant?.price ?? 0)} | giá gốc: ${formatCurrencyVND(firstVariant?.originalPrice ?? 0)} | tồn kho: ${firstVariant?.stock ?? 0} | mô tả: ${product.description}`;
    })
    .join("\n");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      message?: string;
    };
    const message = (body.message ?? "").trim();

    if (!message) {
      return NextResponse.json(
        {
          reply: "Bạn hãy nhập câu hỏi để tôi tư vấn sản phẩm phù hợp hơn.",
          suggestions: [],
        },
        { status: 400 },
      );
    }

    const products = await getCatalogProducts();
    const suggestions = products
      .filter((product) => {
        const haystack = [product.name, product.description, product.slug]
          .join(" ")
          .toLowerCase();
        return message
          .toLowerCase()
          .split(/\s+/)
          .some((keyword) => haystack.includes(keyword));
      })
      .slice(0, 5)
      .map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        thumbnail: product.thumbnail,
        price: product.variants[0]?.price ?? 0,
        originalPrice: product.variants[0]?.originalPrice ?? 0,
      }));

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply:
          "Chưa cấu hình OPENROUTER_API_KEY. Tôi tạm thời chưa thể trả lời bằng AI, nhưng vẫn có thể gợi ý sản phẩm theo dữ liệu dự án.",
        suggestions,
      });
    }

    const context = buildCatalogContext(products);
    const prompt = `Bạn là trợ lý bán hàng tiếng Việt cho website Shopee clone. Chỉ tư vấn dựa trên dữ liệu sản phẩm sau đây của dự án. Nếu không tìm thấy sản phẩm phù hợp, hãy nói rõ là chưa có trong dữ liệu hiện tại. Trả lời ngắn gọn, rõ ràng, ưu tiên tư vấn thực tế theo ngân sách, nhu cầu, size, màu sắc và đề xuất sản phẩm cụ thể nếu có.\n\nDỮ LIỆU SẢN PHẨM:\n${context}\n\nCÂU HỎI KHÁCH HÀNG: ${message}`;

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Test MyShop AI Assistant",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Bạn là trợ lý AI bán hàng cho một website thương mại điện tử Việt Nam. Chỉ dùng dữ liệu được cung cấp để tư vấn. Không bịa sản phẩm không tồn tại.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.4,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          reply:
            "AI hiện chưa phản hồi thành công qua OpenRouter. Tôi đã fallback sang gợi ý sản phẩm từ dữ liệu dự án.",
          suggestions,
          error: errorText,
        },
        { status: 200 },
      );
    }

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Tôi đã tìm thấy một số sản phẩm phù hợp trong dữ liệu dự án.";

    return NextResponse.json({ reply, suggestions });
  } catch (error) {
    return NextResponse.json(
      {
        reply:
          "Đã xảy ra lỗi khi xử lý AI chat qua OpenRouter. Tôi tạm thời chưa thể phản hồi chi tiết.",
        suggestions: [],
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
