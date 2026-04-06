const tabs = ["Tất cả", "Chờ xác nhận", "Đang giao", "Đã giao", "Đã hủy"];

export default function OrdersPage() {
  return (
    <section className="space-y-6 rounded-3xl bg-white p-5 shadow-shopee md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Đơn hàng</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Theo dõi trạng thái đơn hàng theo tab.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={`rounded-full px-4 py-2 text-sm font-medium ${index === 0 ? "bg-primary text-white" : "bg-bg text-text-primary"}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="rounded-2xl bg-bg p-5 text-sm text-text-secondary">
        Đơn hàng mẫu #OD0001 · iPhone 15 Pro Max 256GB · Trạng thái: Đang xử lý
      </div>
    </section>
  );
}
