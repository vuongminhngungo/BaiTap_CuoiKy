import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="container-page grid gap-8 py-10 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Test MyShop</h3>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Shopee clone 2026 UI cho trải nghiệm mua sắm nhanh, tối ưu
            mobile-first và sẵn sàng mở rộng production.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-text-primary">Liên kết</h4>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            <li>
              <Link href="/search?q=iphone">Sản phẩm nổi bật</Link>
            </li>
            <li>
              <Link href="/cart">Giỏ hàng</Link>
            </li>
            <li>
              <Link href="/checkout">Thanh toán</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-text-primary">Hỗ trợ</h4>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            <li>Email: support@myshop.vn</li>
            <li>Hotline: 1900 8888</li>
            <li>Giờ làm việc: 8:00 - 22:00</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
