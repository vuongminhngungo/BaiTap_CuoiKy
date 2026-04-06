import { featuredCategories, shops } from "@/lib/mock-data";

export function SearchSidebar() {
  return (
    <aside className="space-y-4 lg:sticky lg:top-32">
      <div className="rounded-3xl bg-white p-5 shadow-shopee">
        <h3 className="text-base font-bold text-text-primary">Bộ lọc</h3>
        <div className="mt-4 space-y-4 text-sm">
          <div>
            <p className="mb-2 font-semibold text-text-primary">Danh mục</p>
            <div className="space-y-2 text-text-secondary">
              {featuredCategories.slice(0, 6).map((cat) => (
                <label key={cat.id} className="flex items-center gap-2">
                  <input type="checkbox" /> {cat.name}
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 font-semibold text-text-primary">Shop</p>
            <div className="space-y-2 text-text-secondary">
              {shops.map((shop) => (
                <label key={shop.id} className="flex items-center gap-2">
                  <input type="checkbox" /> {shop.shopName}
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 font-semibold text-text-primary">Khoảng giá</p>
            <div className="space-y-2 text-text-secondary">
              <input
                type="range"
                min="0"
                max="50000000"
                defaultValue="15000000"
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs">
                <span>0đ</span>
                <span>50.000.000đ</span>
              </div>
            </div>
          </div>
          <div>
            <p className="mb-2 font-semibold text-text-primary">Đánh giá</p>
            <div className="space-y-2 text-text-secondary">
              {[5, 4, 3].map((star) => (
                <label key={star} className="flex items-center gap-2">
                  <input type="radio" name="rating" /> {star} sao trở lên
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 font-semibold text-text-primary">Loại shop</p>
            <div className="space-y-2 text-text-secondary">
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Mall
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Thường
              </label>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
