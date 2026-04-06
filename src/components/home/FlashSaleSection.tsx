import Link from "next/link";
import { Clock3 } from "lucide-react";

import { formatCurrencyVND } from "@/lib/utils";
import { flashSaleProducts, products } from "@/lib/mock-data";

export function FlashSaleSection() {
  const saleProducts = flashSaleProducts.map((sale) => ({
    ...sale,
    product: products.find((product) => product.id === sale.productId)!,
  }));

  return (
    <section className="space-y-4 rounded-3xl bg-white p-4 shadow-shopee md:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-bold text-primary">FLASH SALE</h2>
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          <Clock3 className="h-4 w-4" /> Còn 05:23:18
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5">
        {saleProducts.map(
          ({ product, flashPrice, originalPrice, remaining, endsAt }) => (
            <Link
              key={`${product.id}-${flashPrice}`}
              href={`/product/${product.slug}`}
              className="overflow-hidden rounded-2xl border border-black/5 bg-bg transition hover:-translate-y-0.5"
            >
              <div className="relative aspect-square">
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-white">
                  -{Math.round((1 - flashPrice / originalPrice) * 100)}%
                </div>
              </div>
              <div className="space-y-2 p-3">
                <p className="line-clamp-2 text-xs font-medium text-text-primary">
                  {product.name}
                </p>
                <p className="text-sm font-bold text-primary">
                  {formatCurrencyVND(flashPrice)}
                </p>
                <p className="text-[11px] text-text-secondary line-through">
                  {formatCurrencyVND(originalPrice)}
                </p>
                <div className="space-y-1">
                  <div className="h-2 overflow-hidden rounded-full bg-black/10">
                    <div
                      className="h-full rounded-full shopee-gradient"
                      style={{
                        width: `${Math.min(100, (1 - remaining / 60) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] font-medium text-text-secondary">
                    Đã bán {product.soldCount.toLocaleString("vi-VN")} · Kết
                    thúc{" "}
                    {new Date(endsAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ),
        )}
      </div>
    </section>
  );
}
