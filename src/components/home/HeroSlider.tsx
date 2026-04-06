import Link from "next/link";

import { heroBanners } from "@/lib/mock-data";

export function HeroSlider() {
  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <div className="overflow-hidden rounded-3xl bg-white shadow-shopee">
        <div className="relative h-[220px] md:h-[320px]">
          <img
            src={heroBanners[0].image}
            alt={heroBanners[0].title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
          <div className="absolute left-6 top-1/2 max-w-xl -translate-y-1/2 text-white md:left-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
              2026 Shopee-style UI
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
              Mở bán flash sale, voucher và checkout tối ưu chuyển đổi
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/90 md:text-base">
              Tối ưu mobile-first, sticky header, mega menu, AI tư vấn, thanh
              toán nội địa và realtime chat.
            </p>
            <Link
              href={heroBanners[0].href}
              className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary shadow-lg"
            >
              Mua ngay
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {heroBanners.slice(1).map((banner) => (
          <Link
            key={banner.id}
            href={banner.href}
            className="group overflow-hidden rounded-3xl bg-white shadow-shopee"
          >
            <div className="relative h-[98px] md:h-[150px]">
              <img
                src={banner.image}
                alt={banner.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/35 to-transparent" />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
                <p className="text-sm font-semibold">{banner.title}</p>
                <p className="mt-1 text-xs text-white/80">Khám phá ngay</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
