export function SortBar() {
  const tabs = ["Liên quan", "Mới nhất", "Bán chạy", "Giá tăng", "Giá giảm"];
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-3xl bg-white p-3 shadow-shopee">
      <span className="text-sm font-semibold text-text-secondary">
        Sắp xếp:
      </span>
      {tabs.map((tab, index) => (
        <button
          key={tab}
          type="button"
          className={`rounded-full px-4 py-2 text-sm font-medium ${index === 0 ? "bg-primary text-white" : "bg-bg text-text-primary hover:bg-primary/10 hover:text-primary"}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
