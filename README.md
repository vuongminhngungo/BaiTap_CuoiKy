# BaiTap_CuoiKy

Dự án Shopee clone sử dụng Next.js 15, TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL và chatbot AI tích hợp OpenRouter.

## Công nghệ chính

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- NextAuth
- Zustand
- OpenRouter AI chat

## Cấu trúc chính

- [`src/app`](src/app) - routes và layout
- [`src/components`](src/components) - UI components
- [`src/lib`](src/lib) - db, auth, catalog, utils
- [`prisma/schema.prisma`](prisma/schema.prisma) - Prisma schema
- [`sql/shopee_clone_init.sql`](sql/shopee_clone_init.sql) - SQL schema + seed dữ liệu

## Chạy dự án

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
npm run start
```

## Lưu ý bảo mật

Không commit các file chứa secret như [`.env.local`](.env.local).
