import Link from "next/link";

import { Button } from "@/components/ui/button";
import { formatCurrencyVND } from "@/lib/utils";

export function CartSummary({
  subtotal,
  shippingFee = 0,
  discount = 0,
}: {
  subtotal: number;
  shippingFee?: number;
  discount?: number;
}) {
  const total = Math.max(0, subtotal + shippingFee - discount);

  return (
    <aside className="sticky top-32 rounded-3xl bg-white p-5 shadow-shopee">
      <h3 className="text-lg font-bold text-text-primary">Tổng đơn hàng</h3>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between text-text-secondary">
          <span>Tạm tính</span>
          <span>{formatCurrencyVND(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-text-secondary">
          <span>Phí ship</span>
          <span>{formatCurrencyVND(shippingFee)}</span>
        </div>
        <div className="flex items-center justify-between text-text-secondary">
          <span>Giảm giá</span>
          <span>-{formatCurrencyVND(discount)}</span>
        </div>
        <div className="border-t border-black/5 pt-3 flex items-center justify-between text-base font-bold text-text-primary">
          <span>Tổng cộng</span>
          <span className="text-primary">{formatCurrencyVND(total)}</span>
        </div>
      </div>
      <Link href="/checkout" className="mt-5 block">
        <Button className="w-full">Mua Hàng</Button>
      </Link>
    </aside>
  );
}
