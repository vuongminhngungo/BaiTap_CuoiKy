import { db } from "@/lib/db";
import type {
  CategoryNode,
  ProductNode,
  ShopNode,
  VariantNode,
} from "@/lib/mock-data";

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function toStringRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.entries(value as Record<string, unknown>).reduce<
    Record<string, string>
  >((acc, [key, currentValue]) => {
    if (typeof currentValue === "string") {
      acc[key] = currentValue;
    } else if (
      typeof currentValue === "number" ||
      typeof currentValue === "boolean"
    ) {
      acc[key] = String(currentValue);
    }
    return acc;
  }, {});
}

function mapVariant(variant: {
  id: bigint;
  productId: bigint;
  sku: string;
  attributes: unknown;
  price: bigint;
  originalPrice: bigint;
  stock: number;
  images: unknown;
}): VariantNode {
  return {
    id: Number(variant.id),
    productId: Number(variant.productId),
    sku: variant.sku,
    attributes: toStringRecord(variant.attributes),
    price: Number(variant.price),
    originalPrice: Number(variant.originalPrice),
    stock: variant.stock,
    images: toStringArray(variant.images),
  };
}

function mapProduct(product: {
  id: bigint;
  shopId: bigint;
  categoryId: bigint;
  name: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  images: unknown;
  status: "active" | "inactive" | "banned";
  isFeatured: boolean;
  soldCount: bigint;
  viewCount: bigint;
  ratingAvg: unknown;
  ratingCount: bigint;
  variants: Array<{
    id: bigint;
    productId: bigint;
    sku: string;
    attributes: unknown;
    price: bigint;
    originalPrice: bigint;
    stock: number;
    images: unknown;
  }>;
}): ProductNode {
  return {
    id: Number(product.id),
    shopId: Number(product.shopId),
    categoryId: Number(product.categoryId),
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    thumbnail: product.thumbnail ?? "",
    images: toStringArray(product.images),
    status: product.status,
    isFeatured: product.isFeatured,
    soldCount: Number(product.soldCount),
    viewCount: Number(product.viewCount),
    ratingAvg: Number(product.ratingAvg),
    ratingCount: Number(product.ratingCount),
    variants: product.variants.map(mapVariant),
  };
}

function mapShop(shop: {
  id: bigint;
  shopName: string;
  slug: string;
  avatar: string | null;
  banner: string | null;
  description: string | null;
  rating: unknown;
  totalSales: bigint;
  isOfficial: boolean;
  isMall: boolean;
}): ShopNode {
  return {
    id: Number(shop.id),
    shopName: shop.shopName,
    slug: shop.slug,
    avatar: shop.avatar ?? "",
    banner: shop.banner ?? "",
    description: shop.description ?? "",
    rating: Number(shop.rating),
    totalSales: Number(shop.totalSales),
    isOfficial: shop.isOfficial,
    isMall: shop.isMall,
  };
}

function mapCategory(category: {
  id: bigint;
  parentId: bigint | null;
  name: string;
  slug: string;
  icon: string | null;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
}): CategoryNode {
  return {
    id: Number(category.id),
    parentId: category.parentId ? Number(category.parentId) : null,
    name: category.name,
    slug: category.slug,
    icon: category.icon ?? "",
    image: category.image ?? "",
    sortOrder: category.sortOrder,
    isActive: category.isActive,
  };
}

export async function getCatalogProducts() {
  const products = await db.product.findMany({
    where: { status: "active" },
    include: { variants: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return products.map(mapProduct);
}

export async function getCatalogCategories() {
  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });

  return categories.map(mapCategory);
}

export async function getCatalogShops() {
  const shops = await db.shop.findMany({
    orderBy: [{ isMall: "desc" }, { rating: "desc" }],
  });
  return shops.map(mapShop);
}

export async function getProductDetailBySlug(slug: string) {
  const product = await db.product.findUnique({
    where: { slug },
    include: {
      shop: true,
      variants: true,
    },
  });

  if (!product) return null;

  return {
    product: mapProduct(product),
    shop: mapShop(product.shop),
  };
}

export async function getShopDetailBySlug(slug: string) {
  const shop = await db.shop.findUnique({
    where: { slug },
    include: {
      products: {
        where: { status: "active" },
        include: { variants: true },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!shop) return null;

  return {
    shop: mapShop(shop),
    products: shop.products.map(mapProduct),
  };
}

export async function getSearchProducts(query: string) {
  const [products, categories] = await Promise.all([
    getCatalogProducts(),
    getCatalogCategories(),
  ]);
  const keyword = query.trim().toLowerCase();

  if (!keyword) return products;

  const matchedCategory = categories.find(
    (category) =>
      category.slug.toLowerCase() === keyword ||
      category.name.toLowerCase() === keyword,
  );

  if (matchedCategory) {
    const allowedCategoryIds = new Set<number>([matchedCategory.id]);

    categories.forEach((category) => {
      if (category.parentId === matchedCategory.id) {
        allowedCategoryIds.add(category.id);
      }
    });

    return products.filter((product) =>
      allowedCategoryIds.has(product.categoryId),
    );
  }

  return products.filter((product) =>
    [product.name, product.description, product.slug].some((value) =>
      value.toLowerCase().includes(keyword),
    ),
  );
}

export async function getCheckoutPreviewProducts(count = 3) {
  const products = await getCatalogProducts();
  return products.slice(0, count);
}
