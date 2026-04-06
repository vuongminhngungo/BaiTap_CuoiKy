import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <div className="container-page flex min-h-screen items-center justify-center py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-shopee lg:grid-cols-2">
        <section className="shopee-gradient p-8 text-white md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
            Test MyShop
          </p>
          <h1 className="mt-4 text-3xl font-black leading-tight md:text-4xl">
            Đăng nhập để tiếp tục mua sắm, theo dõi đơn hàng và voucher
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/85">
            Kết nối bằng Google hoặc email/mật khẩu. Hỗ trợ khách hàng, seller
            center và trải nghiệm thanh toán nhanh.
          </p>
        </section>
        <form className="space-y-5 p-8 md:p-12">
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Email
            </label>
            <Input type="email" placeholder="you@example.com" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Mật khẩu
            </label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full">
            Đăng nhập
          </Button>
          <Button type="button" variant="outline" className="w-full">
            Đăng nhập với Google
          </Button>
          <p className="text-center text-sm text-text-secondary">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="font-semibold text-primary">
              Đăng ký
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
