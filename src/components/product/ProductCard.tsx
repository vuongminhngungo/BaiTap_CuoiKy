import Link from "next/link";
import { Star } from "lucide-react";

import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { formatCurrencyVND } from "@/lib/utils";
import type { ProductNode } from "@/lib/mock-data";

export function ProductCard({ product }: { product: ProductNode }) {
  const firstVariant = product.variants[0];
  const salePercent = Math.round(
    (1 - firstVariant.price / firstVariant.originalPrice) * 100,
  );

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group overflow-hidden rounded-2xl bg-white shadow-shopee transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-bg">
        <ImageWithFallback
          src={product.thumbnail}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2 py-1 text-xs font-semibold text-white">
            Yêu thích
          </span>
        )}
      </div>
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 text-sm font-medium text-text-primary">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1 text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-500" />
            {product.ratingAvg.toFixed(2)}
          </span>
          <span>Đã bán {product.soldCount.toLocaleString("vi-VN")}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-bold text-primary">
            {formatCurrencyVND(firstVariant.price)}
          </span>
          <span className="text-xs text-text-secondary line-through">
            {formatCurrencyVND(firstVariant.originalPrice)}
          </span>
          <span className="ml-auto rounded bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
            -{salePercent}%
          </span>
        </div>
      </div>
    </Link>
  );
}
