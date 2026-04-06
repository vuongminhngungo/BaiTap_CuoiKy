import { Search } from "lucide-react";

import { ProductGrid } from "@/components/home/ProductGrid";
import { SearchSidebar } from "@/components/search/SearchSidebar";
import { SortBar } from "@/components/search/SortBar";
import { Input } from "@/components/ui/input";
import { getSearchProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const keyword = q ?? "";
  const products = await getSearchProducts(keyword);

  return (
    <main className="bg-bg">
      <div className="container-page py-6 md:py-8">
        <div className="mb-5 rounded-3xl bg-white p-4 shadow-shopee md:hidden">
          <div className="relative">
            <Input
              defaultValue={q}
              placeholder="Tìm kiếm sản phẩm..."
              className="h-12 pr-12"
            />
            <button className="absolute right-1 top-1 inline-flex h-10 w-10 items-center justify-center rounded-full shopee-gradient text-white">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <SearchSidebar />
          <div className="space-y-4">
            <SortBar />
            <div className="rounded-3xl bg-white p-5 shadow-shopee md:p-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-text-primary">
                    Kết quả tìm kiếm {keyword ? `cho “${keyword}”` : ""}
                  </h1>
                  <p className="mt-1 text-sm text-text-secondary">
                    Đang hiển thị {products.length} sản phẩm từ cơ sở dữ liệu.
                  </p>
                </div>
              </div>
            </div>
            {products.length > 0 ? (
              <ProductGrid
                title="Sản phẩm tìm thấy"
                subtitle="Kết quả được lấy từ dữ liệu PostgreSQL"
                products={products}
              />
            ) : (
              <section className="rounded-3xl bg-white p-8 text-center shadow-shopee">
                <h2 className="text-lg font-bold text-text-primary">
                  Không tìm thấy sản phẩm
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                  Thử thay đổi từ khóa tìm kiếm hoặc kiểm tra lại dữ liệu trong
                  PostgreSQL.
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
