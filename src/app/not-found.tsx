import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="card-surface max-w-md p-8 text-center">
        <h1 className="text-3xl font-bold text-text-primary">404</h1>
        <p className="mt-3 text-sm text-text-secondary">
          Trang bạn tìm kiếm không tồn tại hoặc đã bị thay đổi.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full shopee-gradient px-5 py-3 text-sm font-semibold text-white"
        >
          Về trang chủ
        </Link>
      </div>
    </main>
  );
}
