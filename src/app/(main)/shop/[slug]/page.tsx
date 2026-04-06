import { notFound } from "next/navigation";

import { ProductGrid } from "@/components/home/ProductGrid";
import { ShopHero } from "@/components/shop/ShopHero";
import { getShopDetailBySlug } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getShopDetailBySlug(slug);
  if (!detail) notFound();

  const { shop, products: shopProducts } = detail;

  return (
    <main className="bg-bg">
      <div className="container-page py-6 md:py-8 space-y-6">
        <ShopHero shop={shop} />
        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div className="rounded-3xl bg-white p-4 shadow-shopee">
              <h2 className="text-lg font-bold text-text-primary">
                Tất cả sản phẩm
              </h2>
            </div>
            <ProductGrid
              title="Sản phẩm của shop"
              subtitle="Dữ liệu lấy từ PostgreSQL"
              products={shopProducts}
            />
          </div>
          <aside className="space-y-4 rounded-3xl bg-white p-5 shadow-shopee">
            <h3 className="text-base font-bold text-text-primary">
              Thông tin shop
            </h3>
            <p className="text-sm leading-6 text-text-secondary">
              {shop.description}
            </p>
            <div className="space-y-2 text-sm text-text-secondary">
              <p>Đánh giá: {shop.rating.toFixed(2)}</p>
              <p>Đã bán: {shop.totalSales.toLocaleString("vi-VN")}</p>
              <p>Loại shop: {shop.isMall ? "Mall" : "Thường"}</p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
