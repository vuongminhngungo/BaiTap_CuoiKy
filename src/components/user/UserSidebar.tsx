import Link from "next/link";

const items = [
  { href: "/user/profile", label: "Hồ sơ" },
  { href: "/user/orders", label: "Đơn hàng" },
  { href: "/user/vouchers", label: "Voucher" },
  { href: "/user/notifications", label: "Thông báo" },
];

export function UserSidebar() {
  return (
    <aside className="rounded-3xl bg-white p-5 shadow-shopee">
      <h2 className="text-lg font-bold text-text-primary">Tài khoản của tôi</h2>
      <nav className="mt-4 space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-2xl px-4 py-3 text-sm font-medium text-text-primary transition hover:bg-primary/10 hover:text-primary"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
