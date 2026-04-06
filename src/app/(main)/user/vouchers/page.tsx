import { vouchers } from "@/lib/mock-data";
import { formatCurrencyVND } from "@/lib/utils";

export default function VouchersPage() {
  return (
    <section className="space-y-6 rounded-3xl bg-white p-5 shadow-shopee md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Voucher của tôi
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Danh sách voucher shop và voucher toàn sàn.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {vouchers.map((voucher) => (
          <article
            key={voucher.id}
            className="rounded-2xl border border-black/5 p-4"
          >
            <p className="text-sm font-bold text-primary">{voucher.code}</p>
            <p className="mt-2 text-sm text-text-secondary">
              Loại: {voucher.type} · Điều kiện tối thiểu{" "}
              {formatCurrencyVND(voucher.minOrderValue)}
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              Còn lại: {voucher.usageLimit - voucher.usedCount}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
