export type CategoryNode = {
  id: number;
  parentId: number | null;
  name: string;
  slug: string;
  icon: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
};

export type ShopNode = {
  id: number;
  shopName: string;
  slug: string;
  avatar: string;
  banner: string;
  description: string;
  rating: number;
  totalSales: number;
  isOfficial: boolean;
  isMall: boolean;
};

export type VariantNode = {
  id: number;
  sku: string;
  productId: number;
  price: number;
  originalPrice: number;
  stock: number;
  attributes: Record<string, string>;
  images: string[];
};

export type ProductNode = {
  id: number;
  shopId: number;
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  images: string[];
  status: "active" | "inactive" | "banned";
  isFeatured: boolean;
  soldCount: number;
  viewCount: number;
  ratingAvg: number;
  ratingCount: number;
  variants: VariantNode[];
};

export type VoucherNode = {
  id: number;
  code: string;
  type: "percentage" | "fixed" | "free_ship";
  value: number;
  minOrderValue: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  shopId: number | null;
};

export const heroBanners = [
  {
    id: "banner-1",
    title: "Flash Sale công nghệ",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    href: "/search?q=tech",
  },
  {
    id: "banner-2",
    title: "Thời trang 2026",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050",
    href: "/search?q=thoi-trang",
  },
  {
    id: "banner-3",
    title: "Gia dụng & đời sống",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba",
    href: "/search?q=gia-dung",
  },
];

export const featuredCategories: CategoryNode[] = [
  {
    id: 1,
    parentId: null,
    name: "Điện tử",
    slug: "dien-tu",
    icon: "📱",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 2,
    parentId: 1,
    name: "Điện thoại",
    slug: "dien-thoai",
    icon: "📞",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 3,
    parentId: 1,
    name: "Laptop",
    slug: "laptop",
    icon: "💻",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 4,
    parentId: 1,
    name: "Phụ kiện",
    slug: "phu-kien",
    icon: "🎧",
    image: "https://images.unsplash.com/photo-1518441902111-8aa2f6d8f4c9",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 5,
    parentId: null,
    name: "Thời trang",
    slug: "thoi-trang",
    icon: "👕",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 6,
    parentId: 5,
    name: "Thời trang nam",
    slug: "thoi-trang-nam",
    icon: "🧥",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 7,
    parentId: 5,
    name: "Thời trang nữ",
    slug: "thoi-trang-nu",
    icon: "👗",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 8,
    parentId: 5,
    name: "Giày dép",
    slug: "giay-dep",
    icon: "👟",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 9,
    parentId: null,
    name: "Nhà cửa & Đời sống",
    slug: "nha-cua-doi-song",
    icon: "🏠",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 10,
    parentId: 9,
    name: "Nhà bếp",
    slug: "nha-bep",
    icon: "🍳",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 11,
    parentId: 9,
    name: "Thiết bị gia dụng",
    slug: "thiet-bi-gia-dung",
    icon: "🧺",
    image: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 12,
    parentId: null,
    name: "Làm đẹp",
    slug: "lam-dep",
    icon: "💄",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
    sortOrder: 4,
    isActive: true,
  },
  {
    id: 13,
    parentId: 12,
    name: "Chăm sóc da",
    slug: "cham-soc-da",
    icon: "🧴",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 14,
    parentId: 12,
    name: "Trang điểm",
    slug: "trang-diem",
    icon: "✨",
    image: "https://images.unsplash.com/photo-1583241800698-9d60c5f5b9b6",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 15,
    parentId: null,
    name: "Tạp hóa",
    slug: "tap-hoa",
    icon: "🛒",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e",
    sortOrder: 5,
    isActive: true,
  },
  {
    id: 16,
    parentId: 15,
    name: "Đồ ăn vặt",
    slug: "do-an-vat",
    icon: "🍪",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 17,
    parentId: 15,
    name: "Đồ uống",
    slug: "do-uong",
    icon: "🥤",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c",
    sortOrder: 2,
    isActive: true,
  },
];

export const shops: ShopNode[] = [
  {
    id: 1,
    shopName: "Shopee Mall Tech",
    slug: "shopee-mall-tech",
    avatar: "https://images.unsplash.com/photo-1512499617640-c2f999018b72",
    banner: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    description:
      "Cửa hàng Mall chính hãng chuyên điện thoại, laptop và phụ kiện công nghệ.",
    rating: 4.95,
    totalSales: 125000,
    isOfficial: true,
    isMall: true,
  },
  {
    id: 2,
    shopName: "Tech Store Pro",
    slug: "tech-store-pro",
    avatar: "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
    banner: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    description: "Thiết bị công nghệ, phụ kiện, đồ điện gia dụng thông minh.",
    rating: 4.87,
    totalSales: 86000,
    isOfficial: false,
    isMall: false,
  },
  {
    id: 3,
    shopName: "Fashion House VN",
    slug: "fashion-house-vn",
    avatar: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
    banner: "https://images.unsplash.com/photo-1445205170230-053b83016050",
    description:
      "Thời trang nam nữ, giày dép, mỹ phẩm và hàng tiêu dùng chọn lọc.",
    rating: 4.81,
    totalSales: 64000,
    isOfficial: false,
    isMall: false,
  },
];

export const products: ProductNode[] = [
  {
    id: 1,
    shopId: 1,
    categoryId: 2,
    name: "iPhone 15 Pro Max 256GB",
    slug: "iphone-15-pro-max-256gb",
    description:
      "Điện thoại flagship với chip A17 Pro, camera Pro và khung titan.",
    thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab",
    ],
    status: "active",
    isFeatured: true,
    soldCount: 1820,
    viewCount: 120000,
    ratingAvg: 4.95,
    ratingCount: 612,
    variants: [
      {
        id: 101,
        sku: "IP15PM-256-TITAN-DEN",
        productId: 1,
        price: 33990000,
        originalPrice: 36990000,
        stock: 28,
        attributes: { color: "Titan Đen", capacity: "256GB" },
        images: [
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
        ],
      },
      {
        id: 102,
        sku: "IP15PM-256-TITAN-NATURAL",
        productId: 1,
        price: 34490000,
        originalPrice: 36990000,
        stock: 18,
        attributes: { color: "Titan Tự Nhiên", capacity: "256GB" },
        images: [
          "https://images.unsplash.com/photo-1592750475338-74b7b21085ab",
        ],
      },
    ],
  },
  {
    id: 2,
    shopId: 1,
    categoryId: 2,
    name: "Samsung Galaxy S24 Ultra 256GB",
    slug: "samsung-galaxy-s24-ultra-256gb",
    description: "Màn hình lớn, bút S Pen, camera zoom xa và AI thông minh.",
    thumbnail: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5",
    images: [
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    ],
    status: "active",
    isFeatured: true,
    soldCount: 1420,
    viewCount: 95000,
    ratingAvg: 4.93,
    ratingCount: 488,
    variants: [
      {
        id: 103,
        sku: "S24U-256-BLACK",
        productId: 2,
        price: 27990000,
        originalPrice: 30990000,
        stock: 32,
        attributes: { color: "Đen", capacity: "256GB" },
        images: [
          "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5",
        ],
      },
      {
        id: 104,
        sku: "S24U-256-VIOLET",
        productId: 2,
        price: 27990000,
        originalPrice: 30990000,
        stock: 24,
        attributes: { color: "Tím", capacity: "256GB" },
        images: [
          "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5",
        ],
      },
    ],
  },
  {
    id: 21,
    shopId: 2,
    categoryId: 10,
    name: "Nồi chiên không dầu 5L",
    slug: "noi-chien-khong-dau-5l",
    description: "Nồi chiên dung tích lớn, tiết kiệm dầu, dễ vệ sinh.",
    thumbnail: "https://images.unsplash.com/photo-1556911220-bff31c812dba",
    images: ["https://images.unsplash.com/photo-1556911220-bff31c812dba"],
    status: "active",
    isFeatured: true,
    soldCount: 3400,
    viewCount: 56000,
    ratingAvg: 4.85,
    ratingCount: 470,
    variants: [
      {
        id: 121,
        sku: "AIRFRYER-5L-BLACK",
        productId: 21,
        price: 1590000,
        originalPrice: 1990000,
        stock: 40,
        attributes: { color: "Đen", capacity: "5L" },
        images: ["https://images.unsplash.com/photo-1556911220-bff31c812dba"],
      },
      {
        id: 122,
        sku: "AIRFRYER-5L-WHITE",
        productId: 21,
        price: 1590000,
        originalPrice: 1990000,
        stock: 36,
        attributes: { color: "Trắng", capacity: "5L" },
        images: ["https://images.unsplash.com/photo-1556911220-bff31c812dba"],
      },
    ],
  },
  {
    id: 31,
    shopId: 3,
    categoryId: 13,
    name: "Kem dưỡng ẩm Ceramide 100ml",
    slug: "kem-duong-am-ceramide-100ml",
    description: "Dưỡng ẩm sâu, phục hồi hàng rào da, phù hợp da nhạy cảm.",
    thumbnail: "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
    images: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883"],
    status: "active",
    isFeatured: true,
    soldCount: 4200,
    viewCount: 52000,
    ratingAvg: 4.9,
    ratingCount: 680,
    variants: [
      {
        id: 131,
        sku: "CERAMIDE-100-CREAM",
        productId: 31,
        price: 320000,
        originalPrice: 420000,
        stock: 90,
        attributes: { type: "Không mùi", size: "100ml" },
        images: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883"],
      },
      {
        id: 132,
        sku: "CERAMIDE-100-ROSE",
        productId: 31,
        price: 320000,
        originalPrice: 420000,
        stock: 82,
        attributes: { type: "Hoa hồng", size: "100ml" },
        images: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883"],
      },
    ],
  },
  {
    id: 41,
    shopId: 3,
    categoryId: 16,
    name: "Bánh quy bơ Đan Mạch 454g",
    slug: "banh-quy-bo-dan-mach-454g",
    description: "Bánh quy bơ giòn thơm, hộp lớn phù hợp gia đình.",
    thumbnail: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
    images: ["https://images.unsplash.com/photo-1563805042-7684c019e1cb"],
    status: "active",
    isFeatured: true,
    soldCount: 8700,
    viewCount: 54000,
    ratingAvg: 4.86,
    ratingCount: 1000,
    variants: [
      {
        id: 141,
        sku: "COOKIE-454G",
        productId: 41,
        price: 149000,
        originalPrice: 199000,
        stock: 260,
        attributes: { size: "454g" },
        images: ["https://images.unsplash.com/photo-1563805042-7684c019e1cb"],
      },
      {
        id: 142,
        sku: "COOKIE-908G",
        productId: 41,
        price: 269000,
        originalPrice: 329000,
        stock: 180,
        attributes: { size: "908g" },
        images: ["https://images.unsplash.com/photo-1563805042-7684c019e1cb"],
      },
    ],
  },
];

export const vouchers: VoucherNode[] = [
  {
    id: 1,
    code: "SHOPEE50K",
    type: "fixed",
    value: 50000,
    minOrderValue: 300000,
    maxDiscount: 50000,
    usageLimit: 1000,
    usedCount: 120,
    shopId: null,
  },
  {
    id: 2,
    code: "FREESHIPVN",
    type: "free_ship",
    value: 30000,
    minOrderValue: 0,
    maxDiscount: 30000,
    usageLimit: 2000,
    usedCount: 340,
    shopId: null,
  },
  {
    id: 3,
    code: "SALE10",
    type: "percentage",
    value: 10,
    minOrderValue: 200000,
    maxDiscount: 50000,
    usageLimit: 1500,
    usedCount: 210,
    shopId: null,
  },
  {
    id: 4,
    code: "APPONLY20",
    type: "percentage",
    value: 20,
    minOrderValue: 500000,
    maxDiscount: 80000,
    usageLimit: 800,
    usedCount: 90,
    shopId: null,
  },
  {
    id: 5,
    code: "MALL100K",
    type: "fixed",
    value: 100000,
    minOrderValue: 1000000,
    maxDiscount: 100000,
    usageLimit: 300,
    usedCount: 35,
    shopId: 1,
  },
  {
    id: 6,
    code: "MALL5",
    type: "percentage",
    value: 5,
    minOrderValue: 500000,
    maxDiscount: 70000,
    usageLimit: 500,
    usedCount: 60,
    shopId: 1,
  },
  {
    id: 7,
    code: "TECH30K",
    type: "fixed",
    value: 30000,
    minOrderValue: 250000,
    maxDiscount: 30000,
    usageLimit: 900,
    usedCount: 110,
    shopId: 2,
  },
  {
    id: 8,
    code: "TECHFREE",
    type: "free_ship",
    value: 25000,
    minOrderValue: 0,
    maxDiscount: 25000,
    usageLimit: 700,
    usedCount: 55,
    shopId: 2,
  },
  {
    id: 9,
    code: "FASHION15",
    type: "percentage",
    value: 15,
    minOrderValue: 150000,
    maxDiscount: 50000,
    usageLimit: 1000,
    usedCount: 130,
    shopId: 3,
  },
  {
    id: 10,
    code: "LIFE20K",
    type: "fixed",
    value: 20000,
    minOrderValue: 100000,
    maxDiscount: 20000,
    usageLimit: 1200,
    usedCount: 75,
    shopId: 3,
  },
];

export const flashSaleProducts = [
  {
    productId: 1,
    variantId: 101,
    flashPrice: 32990000,
    originalPrice: 36990000,
    remaining: 10,
    sold: 18,
    endsAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    productId: 21,
    variantId: 121,
    flashPrice: 1490000,
    originalPrice: 1990000,
    remaining: 12,
    sold: 8,
    endsAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    productId: 31,
    variantId: 131,
    flashPrice: 299000,
    originalPrice: 420000,
    remaining: 25,
    sold: 30,
    endsAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    productId: 41,
    variantId: 141,
    flashPrice: 129000,
    originalPrice: 199000,
    remaining: 60,
    sold: 40,
    endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  },
];

export const shippingProviders = [
  {
    id: 1,
    name: "GHN",
    code: "ghn",
    services: ["express", "standard", "economy"],
  },
  { id: 2, name: "GHTK", code: "ghtk", services: ["express", "standard"] },
  {
    id: 3,
    name: "Viettel Post",
    code: "viettelpost",
    services: ["express", "economy"],
  },
  {
    id: 4,
    name: "J&T Express",
    code: "jtexpress",
    services: ["express", "standard"],
  },
];

export const allProducts = [...products];
