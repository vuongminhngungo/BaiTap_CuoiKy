import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  return (
    <div className="container-page flex min-h-screen items-center justify-center py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-shopee lg:grid-cols-2">
        <section className="shopee-gradient p-8 text-white md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
            Test MyShop
          </p>
          <h1 className="mt-4 text-3xl font-black leading-tight md:text-4xl">
            Tạo tài khoản để mua hàng nhanh, nhận voucher và quản lý hồ sơ
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/85">
            Tài khoản buyer, seller, admin được thiết kế đầy đủ cho hệ thống
            thương mại điện tử production-ready.
          </p>
        </section>
        <form className="space-y-5 p-8 md:p-12">
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Họ và tên
            </label>
            <Input placeholder="Nguyễn Minh Anh" />
          </div>
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
            <Input type="password" placeholder="Tối thiểu 8 ký tự" />
          </div>
          <Button type="submit" className="w-full">
            Tạo tài khoản
          </Button>
          <p className="text-center text-sm text-text-secondary">
            Đã có tài khoản?{" "}
            <Link href="/login" className="font-semibold text-primary">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
