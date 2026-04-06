import Link from "next/link";

import { featuredCategories } from "@/lib/mock-data";

export function CategoryGrid() {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <h2 className="text-xl font-bold text-text-primary">Danh mục</h2>
        <Link
          href="/search?q=danh-muc"
          className="text-sm font-semibold text-primary"
        >
          Xem tất cả
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
        {featuredCategories.slice(1, 17).map((category) => (
          <Link
            key={category.id}
            href={`/search?q=${category.slug}`}
            className="flex flex-col items-center gap-2 rounded-2xl bg-white p-3 text-center shadow-shopee transition hover:-translate-y-0.5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg text-xl">
              {category.icon}
            </div>
            <span className="text-xs font-medium leading-4 text-text-primary">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
