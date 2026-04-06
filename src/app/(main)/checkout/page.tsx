import { Button } from "@/components/ui/button";
import { shippingProviders, vouchers } from "@/lib/mock-data";
import { getCheckoutPreviewProducts } from "@/lib/catalog";
import { formatCurrencyVND } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const orderItems = await getCheckoutPreviewProducts(3);
  const subtotal = orderItems.reduce(
    (sum, product) => sum + product.variants[0].price,
    0,
  );

  return (
    <main className="bg-bg">
      <div className="container-page py-6 md:py-8 space-y-6">
        <div className="rounded-3xl bg-white p-5 shadow-shopee">
          <h1 className="text-2xl font-bold text-text-primary">Thanh toán</h1>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="space-y-4">
            <div className="rounded-3xl bg-white p-5 shadow-shopee">
              <h2 className="text-lg font-bold text-text-primary">
                Địa chỉ giao hàng
              </h2>
              <div className="mt-4 rounded-2xl bg-bg p-4 text-sm text-text-secondary">
                Nguyễn Minh Anh · 0900000005 · 12 Nguyễn Huệ, Phường Bến Nghé,
                Quận 1, TP. Hồ Chí Minh
              </div>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-shopee">
              <h2 className="text-lg font-bold text-text-primary">Sản phẩm</h2>
              <div className="mt-4 space-y-4">
                {orderItems.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 rounded-2xl bg-bg p-4"
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">
                        {product.name}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {Object.values(product.variants[0].attributes).join(
                          " • ",
                        )}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-primary">
                      {formatCurrencyVND(product.variants[0].price)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-shopee">
              <h2 className="text-lg font-bold text-text-primary">
                Vận chuyển
              </h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {shippingProviders.map((provider) => (
                  <label
                    key={provider.id}
                    className="flex items-start gap-3 rounded-2xl border border-black/5 p-4 text-sm text-text-secondary"
                  >
                    <input
                      type="radio"
                      name="shipping"
                      defaultChecked={provider.id === 1}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold text-text-primary">
                        {provider.name}
                      </p>
                      <p>{provider.services.join(" · ")}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-shopee">
              <h2 className="text-lg font-bold text-text-primary">Voucher</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {vouchers.slice(0, 6).map((voucher) => (
                  <div
                    key={voucher.id}
                    className="rounded-2xl bg-bg p-4 text-sm"
                  >
                    <p className="font-bold text-primary">{voucher.code}</p>
                    <p className="mt-1 text-text-secondary">
                      Giảm{" "}
                      {voucher.type === "percentage"
                        ? `${voucher.value}%`
                        : formatCurrencyVND(voucher.value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <aside className="sticky top-32 space-y-4 rounded-3xl bg-white p-5 shadow-shopee">
            <h2 className="text-lg font-bold text-text-primary">
              Tóm tắt đơn hàng
            </h2>
            <div className="space-y-3 text-sm text-text-secondary">
              <div className="flex items-center justify-between">
                <span>Tạm tính</span>
                <span>{formatCurrencyVND(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Phí ship</span>
                <span>{formatCurrencyVND(30000)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Giảm giá</span>
                <span>-{formatCurrencyVND(50000)}</span>
              </div>
              <div className="border-t border-black/5 pt-3 flex items-center justify-between text-base font-bold text-text-primary">
                <span>Tổng cộng</span>
                <span className="text-primary">
                  {formatCurrencyVND(Math.max(0, subtotal + 30000 - 50000))}
                </span>
              </div>
            </div>
            <Button className="w-full">Xác nhận đặt hàng</Button>
            <div className="rounded-2xl bg-bg p-4 text-xs leading-6 text-text-secondary">
              Phương thức thanh toán: COD · Ví Shopee · Thẻ · MoMo. Hỗ trợ
              Stripe, MoMo, ZaloPay cho production.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
