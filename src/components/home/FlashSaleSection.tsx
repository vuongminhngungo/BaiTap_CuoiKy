"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Clock3 } from "lucide-react";

import { formatCurrencyVND } from "@/lib/utils";
import { flashSaleProducts, products } from "@/lib/mock-data";

function formatTimeLeft(milliseconds: number) {
  if (milliseconds <= 0) return "00:00:00";

  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

export function FlashSaleSection() {
  const saleProducts = useMemo(
    () =>
      flashSaleProducts
        .map((sale) => ({
          ...sale,
          product: products.find((product) => product.id === sale.productId),
        }))
        .filter(
          (
            sale,
          ): sale is (typeof flashSaleProducts)[number] & {
            product: (typeof products)[number];
          } => Boolean(sale.product),
        ),
    [],
  );

  const saleEndTime = useMemo(() => {
    if (saleProducts.length === 0) return Date.now();

    return Math.max(
      ...saleProducts.map((sale) => new Date(sale.endsAt).getTime()),
    );
  }, [saleProducts]);

  const [timeLeft, setTimeLeft] = useState(
    Math.max(0, saleEndTime - Date.now()),
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTimeLeft(Math.max(0, saleEndTime - Date.now()));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [saleEndTime]);

  const isEnded = timeLeft <= 0;

  if (saleProducts.length === 0) {
    return (
      <section className="rounded-3xl bg-white p-6 shadow-shopee">
        <div className="rounded-3xl bg-bg p-8 text-center">
          <h2 className="text-xl font-bold text-text-primary">FLASH SALE</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Hiện chưa có sản phẩm flash sale để hiển thị.
          </p>
        </div>
      </section>
    );
  }

  if (isEnded) {
    return (
      <section className="rounded-3xl bg-white p-6 shadow-shopee">
        <div className="rounded-[28px] border border-primary/10 bg-gradient-to-r from-primary/10 via-orange-100 to-amber-100 p-8 text-center">
          <h2 className="text-xl font-bold text-primary">FLASH SALE</h2>
          <p className="mt-3 text-base font-semibold text-text-primary">
            Flash Sale đã kết thúc
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            Các ưu đãi mới sẽ được cập nhật trong khung giờ tiếp theo.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-3xl bg-white p-4 shadow-shopee md:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-bold text-primary">FLASH SALE</h2>
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          <Clock3 className="h-4 w-4" /> Còn {formatTimeLeft(timeLeft)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5">
        {saleProducts.map(
          ({ product, flashPrice, originalPrice, remaining, sold, endsAt }) => (
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
                        width: `${Math.min(100, ((sold + (60 - remaining)) / 120) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] font-medium text-text-secondary">
                    Đã bán {(product.soldCount + sold).toLocaleString("vi-VN")}{" "}
                    · Kết thúc{" "}
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
