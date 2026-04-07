# Test MyShop

Test MyShop là dự án website thương mại điện tử mô phỏng theo mô hình Shopee clone, được xây dựng để phục vụ mục tiêu học tập, báo cáo môn học và thực hành phát triển ứng dụng web full-stack hiện đại.

Hệ thống tập trung mô phỏng các chức năng cốt lõi của một sàn thương mại điện tử như hiển thị sản phẩm, tìm kiếm, xem chi tiết sản phẩm, quản lý giỏ hàng, thanh toán, theo dõi đơn hàng, quản lý hồ sơ người dùng, voucher, thông báo và chatbot AI hỗ trợ tư vấn sản phẩm.

## Tính năng chính

- Trang chủ hiển thị banner, danh mục, flash sale và nhiều nhóm sản phẩm nổi bật.
- Tìm kiếm sản phẩm theo từ khóa hoặc danh mục.
- Xem chi tiết sản phẩm, biến thể, giá bán, đánh giá và thông tin shop.
- Thêm sản phẩm vào giỏ hàng và quản lý số lượng trong giỏ.
- Trang thanh toán với địa chỉ giao hàng, đơn vị vận chuyển, voucher và tóm tắt đơn hàng.
- Khu vực người dùng gồm hồ sơ cá nhân, đơn hàng, thông báo và voucher.
- Xác thực người dùng bằng [`NextAuth`](package.json).
- Chatbot AI hỗ trợ tư vấn sản phẩm qua API tại [`POST()`](src/app/api/ai-chat/route.ts:20).

## Công nghệ sử dụng

### Frontend

- [`Next.js 15`](package.json) với App Router.
- [`React 19`](package.json).
- [`TypeScript`](package.json).
- [`Tailwind CSS`](package.json).
- [`Framer Motion`](package.json).
- [`Lucide React`](package.json).

### Backend và dữ liệu

- [`Next.js API Routes`](src/app/api) cho các endpoint nội bộ.
- [`Prisma ORM`](package.json).
- [`PostgreSQL`](package.json).
- [`NextAuth`](package.json) cho xác thực.
- [`Zod`](package.json) cho validate dữ liệu.
- [`bcryptjs`](package.json) cho xử lý mật khẩu.

### State management và tích hợp

- [`Zustand`](package.json) để quản lý state phía client.
- [`@tanstack/react-query`](package.json) cho dữ liệu bất đồng bộ.
- OpenRouter/OpenAI SDK phục vụ chatbot AI.
- Các phụ thuộc mở rộng như [`Stripe`](package.json), [`Redis`](package.json), [`Socket.IO`](package.json) cho định hướng phát triển tương lai.

## Cấu trúc thư mục chính

- [`src/app`](src/app): routes, layouts, pages và API routes.
- [`src/components`](src/components): các UI components và component nghiệp vụ.
- [`src/lib`](src/lib): logic dùng chung như auth, db, catalog, utils.
- [`src/store`](src/store): state phía client như giỏ hàng và UI store.
- [`prisma/schema.prisma`](prisma/schema.prisma): mô hình dữ liệu Prisma.
- [`sql/shopee_clone_init.sql`](sql/shopee_clone_init.sql): SQL schema và dữ liệu khởi tạo tham khảo.
- [`plans/`](plans): các file nội dung báo cáo theo từng chương.

## Yêu cầu môi trường

Trước khi chạy dự án, cần chuẩn bị:

- [`Node.js`](package.json) phiên bản mới, khuyến nghị từ 18 trở lên.
- [`npm`](package.json).
- PostgreSQL đang hoạt động nếu muốn dùng dữ liệu thật qua Prisma.
- File môi trường như [`.env`](.env), [`.env.local`](.env.local) hoặc tham khảo từ [`.env.example`](.env.example).

## Cài đặt dự án

### 1. Clone source code

```bash
git clone <repository-url>
cd Test_MyShop
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình biến môi trường

Tạo file [`.env`](.env) hoặc [`.env.local`](.env.local) và cấu hình các biến cần thiết như:

- `DATABASE_URL`
- `AUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `OPENROUTER_API_KEY`

Có thể tham khảo cấu trúc ban đầu từ [`.env.example`](.env.example).

### 4. Khởi tạo Prisma Client

```bash
npm run prisma:generate
```

### 5. Khởi tạo cơ sở dữ liệu

Có thể chọn một trong hai cách:

**Cách 1: dùng Prisma migrate**

```bash
npm run prisma:migrate
```

**Cách 2: dùng script SQL thủ công**

Sử dụng file [`sql/shopee_clone_init.sql`](sql/shopee_clone_init.sql) để tạo schema và seed dữ liệu trực tiếp trong PostgreSQL.

## Chạy dự án ở môi trường development

```bash
npm run dev
```

Sau khi chạy thành công, truy cập địa chỉ:

```text
http://localhost:3000
```

## Build và chạy production

### Build project

```bash
npm run build
```

### Chạy production server

```bash
npm run start
```

## Các lệnh hữu ích

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

## Các màn hình và module tiêu biểu

- Trang chủ tại [`HomePage`](src/app/page.tsx:13).
- Tìm kiếm sản phẩm tại [`SearchPage`](<src/app/(main)/search/page.tsx:11>).
- Chi tiết sản phẩm tại [`ProductPage`](<src/app/(main)/product/[slug]/page.tsx:13>).
- Giỏ hàng tại [`CartPage`](<src/app/(main)/cart/page.tsx:7>).
- Thanh toán tại [`CheckoutPage`](<src/app/(main)/checkout/page.tsx:8>).
- Đăng nhập tại [`LoginPage`](<src/app/(auth)/login/page.tsx:6>).
- Đăng ký tại [`RegisterPage`](<src/app/(auth)/register/page.tsx:6>).
- Đơn hàng người dùng tại [`OrdersPage`](<src/app/(main)/user/orders/page.tsx:3>).
- Chatbot AI tại [`ChatBot`](src/components/ai/ChatBot.tsx:34).

## Kiến trúc dữ liệu

Dự án sử dụng Prisma với schema trung tâm tại [`prisma/schema.prisma`](prisma/schema.prisma). Một số thực thể chính gồm:

- User
- Shop
- Category
- Product
- ProductVariant
- Cart và CartItem
- Order và OrderItem
- Review
- Voucher
- Notification
- Wishlist
- ChatSession
- ShippingProvider

## Gợi ý quy trình chạy thử nhanh

Nếu muốn chạy demo nhanh trong môi trường local, có thể làm theo thứ tự sau:

1. Cài dependencies bằng `npm install`.
2. Cấu hình [`.env.local`](.env.local).
3. Generate Prisma Client bằng `npm run prisma:generate`.
4. Khởi tạo database bằng migrate hoặc SQL script.
5. Chạy `npm run dev`.
6. Truy cập trang chủ, trang tìm kiếm, trang sản phẩm, giỏ hàng và chatbot để kiểm tra luồng chính.

## Lưu ý

- Một số chức năng backend hiện đang ở mức mô phỏng phù hợp với mục tiêu học tập và báo cáo.
- Chatbot AI sẽ fallback về gợi ý nội bộ nếu chưa cấu hình `OPENROUTER_API_KEY` trong [`POST()`](src/app/api/ai-chat/route.ts:20).
- Không nên commit các file chứa secret như [`.env.local`](.env.local).

## Tài liệu báo cáo

Các file nội dung báo cáo đã được tách theo từng chương trong thư mục [`plans/`](plans), thuận tiện để chuyển sang Word và định dạng lại theo mẫu báo cáo.

## Tác giả và mục đích sử dụng

Dự án được thực hiện phục vụ học tập, báo cáo môn học và minh họa quy trình phát triển hệ thống web thương mại điện tử theo hướng full-stack hiện đại.
