"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  ChevronDown,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Sparkles,
  Store,
  UserCircle2,
  Wallet,
  X,
} from "lucide-react";

import { featuredCategories } from "@/lib/mock-data";
import { useCartStore } from "@/store/useCartStore";
import { useUiStore } from "@/store/useUiStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const sellerTabs = [
  {
    id: "products",
    label: "Quản lý sản phẩm",
    icon: Package,
    title: "Kho sản phẩm đang bán",
    description:
      "Theo dõi sản phẩm sắp hết hàng, tối ưu ảnh bìa và cập nhật giá cạnh tranh mỗi ngày.",
    stats: [
      { label: "Sản phẩm online", value: "128" },
      { label: "Sắp hết hàng", value: "12" },
      { label: "Đề xuất tối ưu", value: "9" },
    ],
  },
  {
    id: "orders",
    label: "Đơn hàng",
    icon: Store,
    title: "Đơn hàng cần xử lý",
    description:
      "Ưu tiên xác nhận đơn trong 30 phút để tăng tỷ lệ hiển thị và điểm phản hồi shop.",
    stats: [
      { label: "Chờ xác nhận", value: "24" },
      { label: "Đang giao", value: "56" },
      { label: "Hoàn tất hôm nay", value: "31" },
    ],
  },
  {
    id: "revenue",
    label: "Doanh thu",
    icon: Wallet,
    title: "Hiệu suất bán hàng",
    description:
      "Tổng quan GMV, tỉ lệ chuyển đổi và doanh thu theo chiến dịch đang chạy.",
    stats: [
      { label: "Doanh thu hôm nay", value: "₫48.500.000" },
      { label: "Tăng trưởng", value: "+18%" },
      { label: "Tỉ lệ chuyển đổi", value: "6.4%" },
    ],
  },
  {
    id: "settings",
    label: "Cài đặt shop",
    icon: Settings,
    title: "Thiết lập shop chuyên nghiệp",
    description:
      "Cập nhật banner, thông tin giao hàng, phản hồi tự động và chính sách đổi trả.",
    stats: [
      { label: "Mức hoàn thiện", value: "92%" },
      { label: "Banner đang chạy", value: "4" },
      { label: "Tự động phản hồi", value: "Bật" },
    ],
  },
] as const;

type SearchResultItem = {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  description: string;
  price: number;
  originalPrice: number;
};

export function Header() {
  const router = useRouter();
  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const setChatOpen = useUiStore((state) => state.setChatOpen);

  const [keyword, setKeyword] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [sellerOpen, setSellerOpen] = useState(false);
  const [activeTab, setActiveTab] =
    useState<(typeof sellerTabs)[number]["id"]>("products");

  const activeSellerTab = useMemo(
    () => sellerTabs.find((tab) => tab.id === activeTab) ?? sellerTabs[0],
    [activeTab],
  );

  useEffect(() => {
    if (!isSearchOpen && !sellerOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setSellerOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isSearchOpen, sellerOpen]);

  const handleSearch = async () => {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) return;

    setIsSearching(true);
    setIsSearchOpen(true);

    try {
      const response = await fetch(
        `/api/products?q=${encodeURIComponent(trimmedKeyword)}`,
      );
      const payload = (await response.json()) as {
        data?: Array<{
          id: number;
          name: string;
          slug: string;
          thumbnail: string;
          description: string;
          variants?: Array<{ price: number; originalPrice: number }>;
        }>;
      };

      const mappedResults = (payload.data ?? []).map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        thumbnail: product.thumbnail,
        description: product.description,
        price: product.variants?.[0]?.price ?? 0,
        originalPrice: product.variants?.[0]?.originalPrice ?? 0,
      }));

      setSearchResults(mappedResults);
    } finally {
      setIsSearching(false);
    }
  };

  const goToSearchPage = () => {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) return;
    router.push(`/search?q=${encodeURIComponent(trimmedKeyword)}`);
    setIsSearchOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
        <div className="shopee-gradient text-white">
          <div className="container-page flex h-11 items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-5 font-semibold">
              <button
                type="button"
                onClick={() => setSellerOpen(true)}
                className="hover:opacity-90"
              >
                Kênh Người Bán
              </button>
              <button
                type="button"
                onClick={() => setSellerOpen(true)}
                className="hidden sm:inline-flex hover:opacity-90"
              >
                Trở thành Người bán Shopee
              </button>
            </div>
            <div className="flex items-center gap-5 font-semibold">
              <Link href="/user/vouchers" className="hover:opacity-90">
                Khuyến mãi
              </Link>
              <Link href="/user/profile" className="hover:opacity-90">
                Tài khoản
              </Link>
            </div>
          </div>
        </div>

        <div className="border-b border-black/5 bg-white">
          <div className="container-page flex flex-col gap-3 py-4 xl:flex-row xl:items-center xl:gap-6">
            <div className="flex items-center justify-between gap-3 xl:justify-start">
              <Button variant="ghost" size="sm" className="xl:hidden">
                <Menu className="h-5 w-5" />
              </Button>

              <Link href="/" className="flex shrink-0 items-center gap-3">
                <div className="flex h-13 w-13 items-center justify-center rounded-3xl shopee-gradient text-2xl font-black text-white shadow-shopee">
                  S
                </div>
                <div>
                  <p className="text-[28px] font-black leading-none text-primary">
                    Test MyShop
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Shopee 2026 clone
                  </p>
                </div>
              </Link>
            </div>

            <div className="relative flex-1 xl:max-w-3xl">
              <Input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void handleSearch();
                  }
                }}
                placeholder="Tìm kiếm sản phẩm, shop, danh mục..."
                className="h-14 rounded-full bg-bg pl-5 pr-16 text-base"
              />
              <button
                type="button"
                onClick={() => void handleSearch()}
                className="absolute right-1 top-1 inline-flex h-12 w-12 items-center justify-center rounded-full shopee-gradient text-white shadow-lg"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 xl:gap-4">
              <button
                type="button"
                onClick={() => setSellerOpen(true)}
                className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-text-primary transition hover:bg-black/5 xl:inline-flex"
              >
                <Store className="h-4 w-4 text-primary" />
                Seller center
              </button>

              <button className="relative inline-flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-black/5">
                <Bell className="h-5 w-5 text-text-primary" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
              </button>

              <Link
                href="/cart"
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-black/5"
              >
                <ShoppingCart className="h-5 w-5 text-text-primary" />
                {cartCount > 0 && (
                  <Badge className="absolute -right-1 top-0 min-w-5 justify-center px-1 text-[10px]">
                    {cartCount}
                  </Badge>
                )}
              </Link>

              <button
                className="hidden items-center gap-1 rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-black/5 md:inline-flex"
                onClick={() => setChatOpen(true)}
              >
                <UserCircle2 className="h-4 w-4" />
                Nguyễn Minh Anh
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <nav className="border-t border-black/5 bg-white">
          <div className="container-page flex gap-3 overflow-x-auto py-3 hide-scrollbar">
            {featuredCategories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                href={`/search?q=${category.slug}`}
                className="whitespace-nowrap rounded-full bg-bg px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-primary/10 hover:text-primary"
              >
                {category.icon} {category.name}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {isSearchOpen && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/40 px-4 py-24 backdrop-blur-sm">
          <div className="w-full max-w-4xl overflow-hidden rounded-[32px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/5 px-5 py-4 md:px-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  Search results
                </p>
                <h2 className="mt-1 text-xl font-bold text-text-primary">
                  Kết quả cho “{keyword.trim()}”
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-5 md:p-6">
              {isSearching ? (
                <div className="rounded-3xl bg-bg p-10 text-center text-sm text-text-secondary">
                  Đang tìm kiếm sản phẩm phù hợp...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {searchResults.slice(0, 8).map((product) => {
                      const salePercent =
                        product.originalPrice > product.price
                          ? Math.round(
                              ((product.originalPrice - product.price) /
                                product.originalPrice) *
                                100,
                            )
                          : 0;

                      return (
                        <Link
                          key={product.id}
                          href={`/product/${product.slug}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="group flex gap-4 rounded-3xl border border-black/5 p-3 transition hover:border-primary/20 hover:bg-primary/5"
                        >
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="h-24 w-24 rounded-2xl object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <h3 className="line-clamp-2 text-sm font-semibold text-text-primary group-hover:text-primary">
                              {product.name}
                            </h3>
                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-text-secondary">
                              {product.description}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <span className="text-base font-bold text-primary">
                                ₫{product.price.toLocaleString("vi-VN")}
                              </span>
                              {product.originalPrice > product.price && (
                                <>
                                  <span className="text-xs text-text-secondary line-through">
                                    ₫
                                    {product.originalPrice.toLocaleString(
                                      "vi-VN",
                                    )}
                                  </span>
                                  <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
                                    -{salePercent}%
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-bg px-4 py-4">
                    <p className="text-sm text-text-secondary">
                      Hiển thị {searchResults.length} sản phẩm phù hợp với từ
                      khóa của bạn.
                    </p>
                    <button
                      type="button"
                      onClick={goToSearchPage}
                      className="inline-flex items-center gap-2 rounded-full shopee-gradient px-5 py-3 text-sm font-semibold text-white shadow-lg"
                    >
                      Xem toàn bộ kết quả
                      <Sparkles className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl bg-bg p-10 text-center">
                  <h3 className="text-lg font-bold text-text-primary">
                    Không tìm thấy sản phẩm phù hợp
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary">
                    Hãy thử từ khóa khác hoặc mở trang tìm kiếm để xem thêm gợi
                    ý.
                  </p>
                  <button
                    type="button"
                    onClick={goToSearchPage}
                    className="mt-5 inline-flex rounded-full border border-primary/20 px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
                  >
                    Mở trang tìm kiếm
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {sellerOpen && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center bg-black/45 px-4 py-10 backdrop-blur-sm">
          <div className="w-full max-w-5xl overflow-hidden rounded-[36px] bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-black/5 px-5 py-5 md:px-7">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  Seller Center
                </p>
                <h2 className="mt-1 text-2xl font-bold text-text-primary">
                  Trung tâm người bán
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                  Giao diện tổng quan để quản lý sản phẩm, đơn hàng, doanh thu
                  và cấu hình shop theo phong cách Shopee.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSellerOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-black/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
              <aside className="border-b border-black/5 bg-bg/70 p-4 lg:border-b-0 lg:border-r">
                <div className="space-y-2">
                  {sellerTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = tab.id === activeTab;

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                          isActive
                            ? "bg-white text-primary shadow-shopee"
                            : "text-text-primary hover:bg-white/80"
                        }`}
                      >
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold">
                            {tab.label}
                          </span>
                          <span className="block text-xs text-text-secondary">
                            Xem chi tiết nhanh
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </aside>

              <div className="space-y-6 p-5 md:p-7">
                <div className="rounded-[28px] bg-gradient-to-r from-primary via-orange-500 to-amber-400 p-6 text-white shadow-lg">
                  <h3 className="text-2xl font-bold">
                    {activeSellerTab.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/90">
                    {activeSellerTab.description}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {activeSellerTab.stats.map((stat) => (
                    <article
                      key={stat.label}
                      className="rounded-3xl border border-black/5 bg-white p-5 shadow-shopee"
                    >
                      <p className="text-sm text-text-secondary">
                        {stat.label}
                      </p>
                      <p className="mt-3 text-2xl font-black text-text-primary">
                        {stat.value}
                      </p>
                    </article>
                  ))}
                </div>

                <section className="grid gap-4 md:grid-cols-2">
                  <article className="rounded-3xl bg-bg p-5">
                    <h4 className="text-lg font-bold text-text-primary">
                      Nhiệm vụ ưu tiên hôm nay
                    </h4>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-text-secondary">
                      <li>• Tối ưu 5 sản phẩm có CTR thấp bằng ảnh bìa mới.</li>
                      <li>
                        • Xử lý toàn bộ đơn hàng chờ xác nhận trước 10:00.
                      </li>
                      <li>
                        • Thiết lập voucher freeship cho chiến dịch cuối tuần.
                      </li>
                    </ul>
                  </article>
                  <article className="rounded-3xl bg-bg p-5">
                    <h4 className="text-lg font-bold text-text-primary">
                      Gợi ý tăng trưởng
                    </h4>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-text-secondary">
                      <li>
                        • Thêm video ngắn cho sản phẩm chủ lực để tăng chuyển
                        đổi.
                      </li>
                      <li>• Kết hợp Flash Sale với combo mua kèm giảm sâu.</li>
                      <li>
                        • Bật phản hồi tự động cho khung giờ cao điểm buổi tối.
                      </li>
                    </ul>
                  </article>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
