export default function NotificationsPage() {
  return (
    <section className="space-y-6 rounded-3xl bg-white p-5 shadow-shopee md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Thông báo</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Cập nhật trạng thái đơn hàng, voucher và khuyến mãi.
        </p>
      </div>
      <div className="space-y-3">
        <article className="rounded-2xl bg-bg p-4">
          <p className="font-semibold text-text-primary">
            Đơn hàng đã xác nhận
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Đơn hàng #OD0001 đã được xác nhận.
          </p>
        </article>
        <article className="rounded-2xl bg-bg p-4">
          <p className="font-semibold text-text-primary">
            Voucher mới khả dụng
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Bạn có voucher FREESHIPVN.
          </p>
        </article>
      </div>
    </section>
  );
}
