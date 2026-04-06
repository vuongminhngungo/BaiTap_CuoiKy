export default function ProfilePage() {
  return (
    <section className="space-y-6 rounded-3xl bg-white p-5 shadow-shopee md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Hồ sơ của tôi</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Quản lý thông tin cá nhân, avatar và liên hệ.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="font-medium text-text-primary">Họ và tên</span>
          <input
            className="h-11 w-full rounded-2xl border border-black/10 px-4"
            defaultValue="Nguyễn Minh Anh"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium text-text-primary">Số điện thoại</span>
          <input
            className="h-11 w-full rounded-2xl border border-black/10 px-4"
            defaultValue="0900000005"
          />
        </label>
      </div>
      <div className="rounded-2xl bg-bg p-4 text-sm text-text-secondary">
        Avatar upload, thông tin tài khoản và liên kết Google sẽ được đồng bộ
        bằng NextAuth v5.
      </div>
    </section>
  );
}
