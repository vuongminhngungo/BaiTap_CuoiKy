import { notFound } from "next/navigation";
import { Star, Truck, ShieldCheck } from "lucide-react";

import { ProductGrid } from "@/components/home/ProductGrid";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductDetailPurchasePanel } from "@/components/product/ProductDetailPurchasePanel";
import { Button } from "@/components/ui/button";
import { getCatalogProducts, getProductDetailBySlug } from "@/lib/catalog";
import { formatCurrencyVND } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getProductDetailBySlug(slug);
  if (!detail) notFound();

  const { product, shop } = detail;
  const primaryVariant = product.variants[0];
  const allProducts = await getCatalogProducts();
  const similarProducts = allProducts
    .filter(
      (item) =>
        item.categoryId === product.categoryId && item.id !== product.id,
    )
    .slice(0, 6);

  return (
    <main className="bg-bg">
      <div className="container-page space-y-6 py-6 md:py-8">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <ProductGallery images={product.images} name={product.name} />
          <div className="space-y-5 rounded-3xl bg-white p-5 shadow-shopee md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Shopee Mall / {shop.shopName}
            </p>
            <h1 className="text-2xl font-bold leading-tight text-text-primary">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
              <span className="inline-flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-amber-500" />
                {product.ratingAvg.toFixed(2)}
              </span>
              <span>|</span>
              <span>{product.ratingCount} đánh giá</span>
              <span>|</span>
              <span>Đã bán {product.soldCount.toLocaleString("vi-VN")}</span>
            </div>
            <div className="rounded-3xl bg-bg p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-3xl font-black text-primary">
                  {formatCurrencyVND(primaryVariant.price)}
                </span>
                <span className="text-base text-text-secondary line-through">
                  {formatCurrencyVND(primaryVariant.originalPrice)}
                </span>
              </div>
              <p className="mt-2 text-sm text-text-secondary">
                Tiết kiệm{" "}
                {formatCurrencyVND(
                  primaryVariant.originalPrice - primaryVariant.price,
                )}
              </p>
            </div>
            <ProductDetailPurchasePanel product={product} />
            <div className="grid gap-3 rounded-3xl bg-bg p-4 text-sm text-text-secondary sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <Truck className="mt-0.5 h-4 w-4 text-primary" />
                <span>Giao nhanh 2h tại Hà Nội & HCM</span>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
                <span>Hàng chính hãng, hoàn tiền nếu giả</span>
              </div>
              <div className="flex items-start gap-3">
                <Star className="mt-0.5 h-4 w-4 text-primary" />
                <span>Đánh giá shop 4.9/5</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6 rounded-3xl bg-white p-5 shadow-shopee md:p-6">
            <div>
              <h2 className="text-lg font-bold text-text-primary">
                Mô tả sản phẩm
              </h2>
              <div className="prose mt-4 max-w-none text-sm leading-7 text-text-secondary">
                <p>{product.description}</p>
                <p>
                  Thiết kế theo chuẩn UI Shopee 2026 với gallery ảnh lớn,
                  variant selector rõ ràng, CTA nổi bật và tối ưu mua nhanh.
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">Đánh giá</h2>
              <div className="mt-4 space-y-4 text-sm text-text-secondary">
                <article className="rounded-2xl bg-bg p-4">
                  <p className="font-semibold text-text-primary">
                    Nguyễn Minh Anh
                  </p>
                  <p className="mt-1">Sản phẩm đẹp, đóng gói kỹ, giao nhanh.</p>
                </article>
                <article className="rounded-2xl bg-bg p-4">
                  <p className="font-semibold text-text-primary">
                    Trần Quốc Huy
                  </p>
                  <p className="mt-1">Giá tốt, đúng mô tả, đáng mua.</p>
                </article>
              </div>
            </div>
          </div>
          <aside className="space-y-4">
            <div className="rounded-3xl bg-white p-5 shadow-shopee">
              <div className="flex items-center gap-4">
                <img
                  src={shop.avatar}
                  alt={shop.shopName}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
                <div>
                  <h3 className="text-base font-bold text-text-primary">
                    {shop.shopName}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Phản hồi nhanh, uy tín cao
                  </p>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                Theo dõi shop
              </Button>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-shopee">
              <h3 className="text-base font-bold text-text-primary">
                Sản phẩm tương tự
              </h3>
              <div className="mt-4 space-y-3">
                {similarProducts.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-2xl bg-bg p-3"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-medium text-text-primary">
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm font-bold text-primary">
                        {formatCurrencyVND(item.variants[0].price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <ProductGrid
          title="Gợi ý thêm cho bạn"
          subtitle="Khám phá thêm các sản phẩm cùng ngành hàng đang được quan tâm"
          products={similarProducts}
        />
      </div>
    </main>
  );
}
