"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Flame, ShieldCheck, Sparkles } from "lucide-react";

import { ProductGrid } from "@/components/home/ProductGrid";
import type { ProductNode } from "@/lib/mock-data";

type ShowcaseKey = "deal" | "mall" | "trend";

const showcaseCards: Array<{
  key: ShowcaseKey;
  title: string;
  description: string;
  icon: typeof Flame;
  accent: string;
}> = [
  {
    key: "deal",
    title: "Deal nóng hôm nay",
    description: "Giảm sâu cho công nghệ, thời trang và đồ gia dụng đang hot.",
    icon: Flame,
    accent: "from-red-500 via-orange-500 to-amber-400",
  },
  {
    key: "mall",
    title: "Mall chính hãng",
    description: "Gợi ý từ shop uy tín, chính hãng với ưu đãi nổi bật.",
    icon: ShieldCheck,
    accent: "from-sky-500 via-cyan-500 to-emerald-400",
  },
  {
    key: "trend",
    title: "Gợi ý theo xu hướng",
    description: "Sản phẩm bán chạy, lượt xem cao và được đánh giá tốt.",
    icon: Sparkles,
    accent: "from-fuchsia-500 via-violet-500 to-indigo-500",
  },
];

function getFilteredProducts(products: ProductNode[], filter: ShowcaseKey) {
  switch (filter) {
    case "deal":
      return [...products]
        .filter((product) => {
          const firstVariant = product.variants[0];
          if (!firstVariant) return false;
          return firstVariant.originalPrice > firstVariant.price;
        })
        .sort((a, b) => {
          const aDiscount =
            ((a.variants[0]?.originalPrice ?? 0) -
              (a.variants[0]?.price ?? 0)) /
            Math.max(a.variants[0]?.originalPrice ?? 1, 1);
          const bDiscount =
            ((b.variants[0]?.originalPrice ?? 0) -
              (b.variants[0]?.price ?? 0)) /
            Math.max(b.variants[0]?.originalPrice ?? 1, 1);
          return bDiscount - aDiscount;
        })
        .slice(0, 12);
    case "mall":
      return [...products]
        .filter((product) => product.shopId === 1 || product.isFeatured)
        .sort((a, b) => b.ratingAvg - a.ratingAvg)
        .slice(0, 12);
    case "trend":
      return [...products]
        .sort(
          (a, b) =>
            b.soldCount +
            b.viewCount +
            b.ratingAvg * 100 -
            (a.soldCount + a.viewCount + a.ratingAvg * 100),
        )
        .slice(0, 12);
    default:
      return products.slice(0, 12);
  }
}

function getShowcaseCopy(filter: ShowcaseKey) {
  switch (filter) {
    case "deal":
      return {
        title: "Kết quả: Deal nóng hôm nay",
        subtitle: "Danh sách ưu đãi nổi bật được lọc ngay trên trang chủ.",
      };
    case "mall":
      return {
        title: "Kết quả: Mall chính hãng",
        subtitle: "Sản phẩm ưu tiên từ shop nổi bật và thương hiệu uy tín.",
      };
    case "trend":
      return {
        title: "Kết quả: Gợi ý theo xu hướng",
        subtitle:
          "Các sản phẩm đang thu hút lượt xem, đơn hàng và đánh giá cao.",
      };
    default:
      return {
        title: "Sản phẩm nổi bật",
        subtitle: "Danh sách sản phẩm được chọn lọc cho bạn.",
      };
  }
}

export function HomeInteractiveShowcase({
  products,
}: {
  products: ProductNode[];
}) {
  const [activeFilter, setActiveFilter] = useState<ShowcaseKey>("deal");
  const resultsRef = useRef<HTMLElement | null>(null);

  const filteredProducts = useMemo(
    () => getFilteredProducts(products, activeFilter),
    [activeFilter, products],
  );

  const copy = getShowcaseCopy(activeFilter);

  useEffect(() => {
    if (!resultsRef.current) return;
    resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeFilter]);

  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        {showcaseCards.map((card) => {
          const Icon = card.icon;
          const isActive = activeFilter === card.key;

          return (
            <button
              key={card.key}
              type="button"
              onClick={() => setActiveFilter(card.key)}
              className={`group overflow-hidden rounded-3xl border p-5 text-left shadow-shopee transition hover:-translate-y-0.5 ${
                isActive
                  ? "border-primary/30 bg-white ring-2 ring-primary/20"
                  : "border-transparent bg-white"
              }`}
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-white shadow-lg`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-text-primary group-hover:text-primary">
                {card.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {card.description}
              </p>
              <p className="mt-4 text-sm font-semibold text-primary">
                {isActive ? "Đang hiển thị bên dưới" : "Click để lọc sản phẩm"}
              </p>
            </button>
          );
        })}
      </section>

      <section
        ref={resultsRef}
        className="scroll-mt-32 rounded-3xl bg-white/70 p-1"
      >
        <ProductGrid
          title={copy.title}
          subtitle={copy.subtitle}
          products={filteredProducts}
        />
      </section>
    </>
  );
}
