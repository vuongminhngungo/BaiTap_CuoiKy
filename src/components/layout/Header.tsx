"use client";

import Link from "next/link";
import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  ShoppingCart,
  Store,
  UserCircle2,
} from "lucide-react";

import { featuredCategories } from "@/lib/mock-data";
import { useCartStore } from "@/store/useCartStore";
import { useUiStore } from "@/store/useUiStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const setChatOpen = useUiStore((state) => state.setChatOpen);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="shopee-gradient text-white">
        <div className="container-page flex h-11 items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-5 font-semibold">
            <Link href="/" className="hover:opacity-90">
              Kênh Người Bán
            </Link>
            <Link href="/" className="hidden sm:inline-flex hover:opacity-90">
              Trở thành Người bán Shopee
            </Link>
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

            <Link href="/" className="flex items-center gap-3 shrink-0">
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
              placeholder="Tìm kiếm sản phẩm, shop, danh mục..."
              className="h-14 rounded-full bg-bg pl-5 pr-16 text-base"
            />
            <button className="absolute right-1 top-1 inline-flex h-12 w-12 items-center justify-center rounded-full shopee-gradient text-white shadow-lg">
              <Search className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-3 xl:gap-4">
            <Link
              href="/search?q=deal"
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-text-primary transition hover:bg-black/5 xl:inline-flex"
            >
              <Store className="h-4 w-4 text-primary" />
              Seller center
            </Link>

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
  );
}
