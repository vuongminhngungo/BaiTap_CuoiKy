import { Star } from "lucide-react";

import type { ShopNode } from "@/lib/mock-data";

export function ShopHero({ shop }: { shop: ShopNode }) {
  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-shopee">
      <div className="relative h-48 md:h-64">
        <img
          src={shop.banner}
          alt={shop.shopName}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
      </div>
      <div className="-mt-16 flex flex-col gap-4 p-5 md:flex-row md:items-end md:justify-between md:p-6">
        <div className="flex items-end gap-4">
          <img
            src={shop.avatar}
            alt={shop.shopName}
            className="h-28 w-28 rounded-3xl border-4 border-white object-cover shadow-lg"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black text-text-primary">
                {shop.shopName}
              </h1>
              {shop.isMall && (
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                  Mall
                </span>
              )}
              {shop.isOfficial && (
                <span className="rounded-full bg-black px-3 py-1 text-xs font-bold text-white">
                  Official
                </span>
              )}
            </div>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              {shop.description}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              <span className="inline-flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-amber-500" />{" "}
                {shop.rating.toFixed(2)}
              </span>
              <span>Đã bán {shop.totalSales.toLocaleString("vi-VN")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
