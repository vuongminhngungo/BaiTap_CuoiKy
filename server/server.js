const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Google AI Studio API key. Prefer using environment variable in production.
const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || "AIzaSyDUZr3igNWKtp7YKB7P_dgegEIwx_-QnZk";

const PRODUCT_CATALOG = [
  {
    id: "p1",
    name: "Tai nghe không dây HiFi",
    price: 1299000,
    description:
      "Âm thanh sống động, đeo nhẹ nhàng và hỗ trợ kết nối nhiều thiết bị.",
  },
  {
    id: "p2",
    name: "Đồng hồ thông minh",
    price: 2890000,
    description: "Theo dõi sức khỏe, thông báo thông minh và pin dài lâu.",
  },
  {
    id: "p3",
    name: "Laptop mỏng nhẹ",
    price: 13990000,
    description:
      "Hiệu năng ổn định cho học tập và làm việc, thiết kế hiện đại.",
  },
  {
    id: "p4",
    name: "Balo du lịch thời trang",
    price: 790000,
    description: "Chống nước, nhiều ngăn tiện lợi và phong cách năng động.",
  },
  {
    id: "p5",
    name: "Máy pha cà phê mini",
    price: 2190000,
    description: "Pha espresso chuyên nghiệp tại nhà, dễ sử dụng và vệ sinh.",
  },
  {
    id: "p6",
    name: "Đèn bàn LED thông minh",
    price: 450000,
    description: "Ánh sáng điều chỉnh, bảo vệ mắt và kiểu dáng sang trọng.",
  },
];

function formatCurrencyVND(value) {
  return `${value.toLocaleString("vi-VN")}₫`;
}

function buildProductContext() {
  return PRODUCT_CATALOG.map(
    (p) =>
      `- Tên: ${p.name} | Giá: ${formatCurrencyVND(p.price)} | Mô tả: ${p.description}`,
  ).join("\n");
}

// Use global fetch when available, otherwise fall back to node-fetch for older Node versions.
let fetchFn = typeof fetch === "function" ? fetch : null;
if (!fetchFn) {
  try {
    fetchFn = require("node-fetch");
    console.log("[SERVER] Using node-fetch polyfill for API requests.");
  } catch (err) {
    console.error(
      "[SERVER] fetch is not available and node-fetch could not be loaded.",
    );
    console.error("Install it with: npm install node-fetch");
    process.exit(1);
  }
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));

// API endpoint for chatbot messages
app.post("/api/chat", async (req, res) => {
  console.log("[CHAT] Incoming request from", req.ip, "body:", req.body);

  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      console.warn("[CHAT] Invalid payload received:", req.body);
      return res.status(400).json({ error: "Invalid message payload" });
    }

    const context = buildProductContext();

    const systemPrompt = `Bạn là một AI tư vấn bán hàng chuyên nghiệp cho website thương mại điện tử.

## 🎯 Nhiệm vụ:
- Tư vấn sản phẩm phù hợp với nhu cầu khách
- Luôn dựa vào dữ liệu sản phẩm được cung cấp
- KHÔNG trả lời chung chung

## ⚠️ Quy tắc bắt buộc:
1. CHỈ được dùng dữ liệu sản phẩm đã cung cấp
2. KHÔNG được tự bịa sản phẩm
3. Nếu không tìm thấy sản phẩm phù hợp, trả lời đúng 1 câu: "Hiện tại shop chưa có sản phẩm phù hợp với nhu cầu của bạn"
4. Nếu có sản phẩm, luôn trả lời ngắn gọn theo format:
- Tên sản phẩm
- Giá
- Mô tả ngắn (1 câu)
- Gợi ý vì sao phù hợp
5. Nếu có nhiều sản phẩm phù hợp, chỉ chọn tối đa 2-3 sản phẩm tốt nhất

## 🎯 Tối ưu bán hàng:
- Ưu tiên sản phẩm liên quan trực tiếp đến nhu cầu
- Nếu câu hỏi mơ hồ thì suy đoán hợp lý dựa trên dữ liệu hiện có
- Giọng văn thân thiện, tự nhiên như nhân viên bán hàng

## 🚫 Cấm:
- Không nói chung chung kiểu "chúng tôi có nhiều sản phẩm"
- Không trả lời dài dòng
- Không lặp lại câu hỏi người dùng`;

    const requestBody = {
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Dữ liệu sản phẩm:\n${context}\n\nCâu hỏi khách:\n${message}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 512,
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    };

    const modelCandidates = [
      "gemini-2.0-flash-lite-001",
      "gemini-2.0-flash",
      "gemini-2.5-flash",
    ];

    console.log(
      "[CHAT] Sending request to Gemini:",
      JSON.stringify(requestBody),
    );

    let responseText = "";
    let data;
    let lastError = "";

    for (const model of modelCandidates) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      console.log(`[CHAT] Trying Gemini model: ${model}`);

      const geminiResponse = await fetchFn(geminiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      responseText = await geminiResponse.text();
      console.log(
        `[CHAT] Gemini (${model}) response status: ${geminiResponse.status} ${geminiResponse.statusText}`,
      );
      console.log(`[CHAT] Gemini (${model}) response body:`, responseText);

      if (!geminiResponse.ok) {
        lastError = responseText;

        // Try the next model on NOT_FOUND or quota/rate-limit errors.
        if (geminiResponse.status === 404 || geminiResponse.status === 429) {
          continue;
        }

        return res
          .status(502)
          .json({ error: "Gemini API error", details: responseText });
      }

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("[CHAT] Failed to parse Gemini JSON:", parseError);
        return res.status(502).json({
          error: "Gemini response parse error",
          details: responseText,
        });
      }

      break;
    }

    if (!data) {
      const quotaHint =
        lastError &&
        (lastError.includes("RESOURCE_EXHAUSTED") ||
          lastError.includes("Quota exceeded") ||
          lastError.includes("rate-limits"));

      return res.status(502).json({
        error: "Gemini API error",
        details: quotaHint
          ? "Gemini quota/billing exceeded or not enabled for this project. Check AI Studio quota and billing, then retry."
          : lastError || "No available Gemini model",
      });
    }

    const aiMessage =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Xin lỗi, tôi không thể trả lời ngay bây giờ.";
    console.log("[CHAT] AI reply generated:", aiMessage);

    res.json({ reply: aiMessage.trim() });
  } catch (error) {
    console.error("[CHAT] Unexpected server error:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// Serve index.html for any unmatched route to allow simple SPA behavior
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

const server = app.listen(PORT, () => {
  console.log(`[SERVER] Running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `[SERVER] Port ${PORT} is already in use. Use a different PORT environment variable or stop the process using this port.`,
    );
  } else {
    console.error("[SERVER] Server error:", err);
  }
  process.exit(1);
});
