import Link from "next/link";

import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import { HeroSlider } from "@/components/home/HeroSlider";
import { HomeInteractiveShowcase } from "@/components/home/HomeInteractiveShowcase";
import { ProductGrid } from "@/components/home/ProductGrid";
import { MainLayout } from "@/components/layout/MainLayout";
import { getCatalogCategories, getCatalogProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [allProducts, categories] = await Promise.all([
    getCatalogProducts(),
    getCatalogCategories(),
  ]);

  const topCategories = categories
    .filter((category) => category.parentId === null)
    .slice(0, 5);

  const productSections = [
    {
      title: "Điện thoại nổi bật",
      subtitle: "Flagship và tầm trung đáng mua nhất",
      products: allProducts
        .filter((product) => product.categoryId === 2)
        .slice(0, 12),
    },
    {
      title: "Thời trang hot trend",
      subtitle: "Áo quần, giày dép và phụ kiện đang lên top",
      products: allProducts
        .filter((product) => [6, 7, 8].includes(product.categoryId))
        .slice(0, 12),
    },
    {
      title: "Nhà cửa & gia dụng",
      subtitle: "Đồ bếp, thiết bị thông minh và tiện ích",
      products: allProducts
        .filter((product) => [10, 11].includes(product.categoryId))
        .slice(0, 12),
    },
    {
      title: "Làm đẹp & chăm sóc cá nhân",
      subtitle: "Skincare, makeup và mỹ phẩm bán chạy",
      products: allProducts
        .filter((product) => [13, 14].includes(product.categoryId))
        .slice(0, 12),
    },
  ];

  return (
    <MainLayout>
      <main className="bg-bg">
        <div className="container-page space-y-6 py-6 md:py-8">
          <HomeInteractiveShowcase products={allProducts} />

          <HeroSlider />
          <FlashSaleSection />
          <CategoryGrid />

          <section className="grid gap-4 md:grid-cols-5">
            {topCategories.map((category) => (
              <Link
                key={category.id}
                href={`/search?q=${category.slug}`}
                className="group rounded-3xl bg-white p-4 text-center shadow-shopee transition hover:-translate-y-0.5"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-bg text-2xl">
                  {category.icon}
                </div>
                <p className="mt-3 text-sm font-semibold text-text-primary group-hover:text-primary">
                  {category.name}
                </p>
              </Link>
            ))}
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {[
              [
                "50+ sản phẩm mẫu",
                "Nhiều ngành hàng với variants và giá VNĐ thực tế",
              ],
              [
                "Flash sale liên tục",
                "Tối ưu hiển thị cho chuyển đổi mua nhanh",
              ],
              [
                "AI chatbot tiếng Việt",
                "Tư vấn size, màu sắc và gợi ý sản phẩm",
              ],
            ].map(([title, description]) => (
              <article key={title} className="card-surface p-6">
                <h2 className="text-lg font-semibold text-text-primary">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {description}
                </p>
              </article>
            ))}
          </section>

          {productSections.map((section) => (
            <ProductGrid
              key={section.title}
              title={section.title}
              subtitle={section.subtitle}
              products={section.products}
            />
          ))}

          <section className="space-y-4 rounded-3xl bg-white p-5 shadow-shopee md:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-text-primary">
                  Kho sản phẩm mở rộng
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  Hiển thị thêm nhiều sản phẩm để trang chủ sống động hơn và dễ
                  khám phá hơn.
                </p>
              </div>
              <Link
                href="/search?q="
                className="text-sm font-semibold text-primary"
              >
                Xem tất cả
              </Link>
            </div>
            <ProductGrid
              title="Bộ sưu tập siêu thị sản phẩm"
              subtitle="Nhiều sản phẩm hơn để hiển thị trực quan trên trang chủ"
              products={allProducts.slice(0, 50)}
            />
          </section>
        </div>
      </main>
    </MainLayout>
  );
}
