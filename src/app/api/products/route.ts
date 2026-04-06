import { NextResponse } from "next/server";

import { allProducts } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const categoryId = searchParams.get("categoryId");
  const shopId = searchParams.get("shopId");
  const minPrice = Number(searchParams.get("minPrice") ?? 0);
  const maxPrice = Number(
    searchParams.get("maxPrice") ?? Number.MAX_SAFE_INTEGER,
  );

  const filtered = allProducts.filter((product) => {
    const matchesQuery =
      !q ||
      [product.name, product.description, product.slug].some((value) =>
        value.toLowerCase().includes(q),
      );
    const matchesCategory =
      !categoryId || product.categoryId.toString() === categoryId;
    const matchesShop = !shopId || product.shopId.toString() === shopId;
    const price = product.variants[0]?.price ?? 0;
    const matchesPrice = price >= minPrice && price <= maxPrice;
    return matchesQuery && matchesCategory && matchesShop && matchesPrice;
  });

  return NextResponse.json({
    data: filtered,
    meta: {
      total: filtered.length,
    },
  });
}
