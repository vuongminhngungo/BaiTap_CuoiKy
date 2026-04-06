import { ProductCard } from "@/components/product/ProductCard";
import type { ProductNode } from "@/lib/mock-data";

export function ProductGrid({
  title = "Gợi ý hôm nay",
  subtitle = "Sản phẩm nổi bật theo xu hướng và hành vi mua sắm",
  products,
}: {
  title?: string;
  subtitle?: string;
  products: ProductNode[];
}) {
  return (
    <section className="space-y-4 rounded-3xl bg-white p-5 shadow-shopee md:p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-text-primary">{title}</h2>
          <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
