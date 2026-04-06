BEGIN;

DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS shipping_providers CASCADE;
DROP TABLE IF EXISTS vouchers CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS flash_sales CASCADE;
DROP TABLE IF EXISTS product_attributes CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS shops CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS product_status CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS voucher_type CASCADE;

CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE product_status AS ENUM ('active', 'inactive', 'banned');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled', 'refunded');
CREATE TYPE voucher_type AS ENUM ('percentage', 'fixed', 'free_ship');

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT,
    full_name VARCHAR(255) NOT NULL,
    avatar TEXT,
    phone VARCHAR(30),
    role user_role NOT NULL DEFAULT 'buyer',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE shops (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    shop_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    avatar TEXT,
    banner TEXT,
    description TEXT,
    rating NUMERIC(3,2) NOT NULL DEFAULT 0,
    total_sales BIGINT NOT NULL DEFAULT 0,
    is_official BOOLEAN NOT NULL DEFAULT FALSE,
    is_mall BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    parent_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    icon TEXT,
    image TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    shop_id BIGINT NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    thumbnail TEXT,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    status product_status NOT NULL DEFAULT 'active',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    sold_count BIGINT NOT NULL DEFAULT 0,
    view_count BIGINT NOT NULL DEFAULT 0,
    rating_avg NUMERIC(3,2) NOT NULL DEFAULT 0,
    rating_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_variants (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL UNIQUE,
    attributes JSONB NOT NULL,
    price BIGINT NOT NULL CHECK (price >= 0),
    original_price BIGINT NOT NULL CHECK (original_price >= 0),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    images JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE product_attributes (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    attribute_name VARCHAR(120) NOT NULL,
    attribute_values JSONB NOT NULL
);

CREATE TABLE flash_sales (
    id BIGSERIAL PRIMARY KEY,
    product_variant_id BIGINT NOT NULL UNIQUE REFERENCES product_variants(id) ON DELETE CASCADE,
    flash_price BIGINT NOT NULL CHECK (flash_price >= 0),
    original_price BIGINT NOT NULL CHECK (original_price >= 0),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    sold INT NOT NULL DEFAULT 0 CHECK (sold >= 0),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CHECK (end_time > start_time)
);

CREATE TABLE carts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_variant_id BIGINT NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    is_selected BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (cart_id, product_variant_id)
);

CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    shop_id BIGINT NOT NULL REFERENCES shops(id) ON DELETE RESTRICT,
    order_code VARCHAR(40) NOT NULL UNIQUE,
    status order_status NOT NULL DEFAULT 'pending',
    shipping_address JSONB NOT NULL,
    subtotal BIGINT NOT NULL CHECK (subtotal >= 0),
    shipping_fee BIGINT NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
    discount BIGINT NOT NULL DEFAULT 0 CHECK (discount >= 0),
    total BIGINT NOT NULL CHECK (total >= 0),
    payment_method VARCHAR(30) NOT NULL,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'pending',
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_variant_id BIGINT NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
    product_snapshot JSONB NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price BIGINT NOT NULL CHECK (unit_price >= 0),
    total_price BIGINT NOT NULL CHECK (total_price >= 0)
);

CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    order_item_id BIGINT NOT NULL UNIQUE REFERENCES order_items(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    seller_reply TEXT,
    is_verified_purchase BOOLEAN NOT NULL DEFAULT TRUE,
    helpful_count INT NOT NULL DEFAULT 0 CHECK (helpful_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    address_detail TEXT NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE vouchers (
    id BIGSERIAL PRIMARY KEY,
    shop_id BIGINT REFERENCES shops(id) ON DELETE SET NULL,
    code VARCHAR(80) NOT NULL UNIQUE,
    type voucher_type NOT NULL,
    value BIGINT NOT NULL CHECK (value >= 0),
    min_order_value BIGINT NOT NULL DEFAULT 0 CHECK (min_order_value >= 0),
    max_discount BIGINT NOT NULL DEFAULT 0 CHECK (max_discount >= 0),
    usage_limit INT NOT NULL DEFAULT 0 CHECK (usage_limit >= 0),
    used_count INT NOT NULL DEFAULT 0 CHECK (used_count >= 0),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    CHECK (end_date > start_date)
);

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(80) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE wishlists (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, product_id)
);

CREATE TABLE chat_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE shipping_providers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(80) NOT NULL UNIQUE,
    api_endpoint TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    supported_services JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX idx_shops_slug ON shops(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);
CREATE INDEX idx_products_shop_id ON products(shop_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_search ON products USING GIN (to_tsvector('simple', name || ' ' || coalesce(description, '')));
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_flash_sales_active ON flash_sales(is_active, start_time, end_time);
CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_variant_id ON cart_items(product_variant_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_shop_id ON orders(shop_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_vouchers_shop_id ON vouchers(shop_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);
CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);

INSERT INTO users (id, email, password_hash, full_name, avatar, phone, role, is_verified) VALUES
(1, 'admin@myshop.vn', '$2b$10$adminhashplaceholder', 'System Admin', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', '0900000001', 'admin', TRUE),
(2, 'official@myshop.vn', '$2b$10$sellerhash1', 'Shopee Mall Official', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d', '0900000002', 'seller', TRUE),
(3, 'shoptech@myshop.vn', '$2b$10$sellerhash2', 'Tech Store Owner', 'https://images.unsplash.com/photo-1504593811423-6dd665756598', '0900000003', 'seller', TRUE),
(4, 'shopfashion@myshop.vn', '$2b$10$sellerhash3', 'Fashion Store Owner', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', '0900000004', 'seller', TRUE),
(5, 'buyer@myshop.vn', '$2b$10$buyerhash1', 'Nguyễn Minh Anh', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', '0900000005', 'buyer', TRUE),
(6, 'buyer2@myshop.vn', '$2b$10$buyerhash2', 'Trần Quốc Huy', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d', '0900000006', 'buyer', TRUE);

INSERT INTO shops (id, user_id, shop_name, slug, avatar, banner, description, rating, total_sales, is_official, is_mall) VALUES
(1, 2, 'Shopee Mall Tech', 'shopee-mall-tech', 'https://images.unsplash.com/photo-1512499617640-c2f999018b72', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', 'Cửa hàng Mall chính hãng chuyên điện thoại, laptop và phụ kiện công nghệ.', 4.95, 125000, TRUE, TRUE),
(2, 3, 'Tech Store Pro', 'tech-store-pro', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', 'Thiết bị công nghệ, phụ kiện, đồ điện gia dụng thông minh.', 4.87, 86000, FALSE, FALSE),
(3, 4, 'Fashion House VN', 'fashion-house-vn', 'https://images.unsplash.com/photo-1483985988355-763728e1935b', 'https://images.unsplash.com/photo-1445205170230-053b83016050', 'Thời trang nam nữ, giày dép, mỹ phẩm và hàng tiêu dùng chọn lọc.', 4.81, 64000, FALSE, FALSE);

INSERT INTO categories (id, parent_id, name, slug, icon, image, sort_order, is_active) VALUES
(1, NULL, 'Điện tử', 'dien-tu', 'smartphone', 'https://images.unsplash.com/photo-1498049794561-7780e7231661', 1, TRUE),
(2, 1, 'Điện thoại', 'dien-thoai', 'phone', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', 1, TRUE),
(3, 1, 'Laptop', 'laptop', 'laptop', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', 2, TRUE),
(4, 1, 'Phụ kiện', 'phu-kien', 'headphones', 'https://images.unsplash.com/photo-1518441902111-8aa2f6d8f4c9', 3, TRUE),
(5, NULL, 'Thời trang', 'thoi-trang', 'shirt', 'https://images.unsplash.com/photo-1483985988355-763728e1935b', 2, TRUE),
(6, 5, 'Thời trang nam', 'thoi-trang-nam', 'user-round', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f', 1, TRUE),
(7, 5, 'Thời trang nữ', 'thoi-trang-nu', 'user', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c', 2, TRUE),
(8, 5, 'Giày dép', 'giay-dep', 'footprints', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', 3, TRUE),
(9, NULL, 'Nhà cửa & Đời sống', 'nha-cua-doi-song', 'home', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85', 3, TRUE),
(10, 9, 'Nhà bếp', 'nha-bep', 'chef-hat', 'https://images.unsplash.com/photo-1556911220-bff31c812dba', 1, TRUE),
(11, 9, 'Thiết bị gia dụng', 'thiet-bi-gia-dung', 'washing-machine', 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77', 2, TRUE),
(12, NULL, 'Làm đẹp', 'lam-dep', 'sparkles', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9', 4, TRUE),
(13, 12, 'Chăm sóc da', 'cham-soc-da', 'droplets', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883', 1, TRUE),
(14, 12, 'Trang điểm', 'trang-diem', 'palette', 'https://images.unsplash.com/photo-1583241800698-9d60c5f5b9b6', 2, TRUE),
(15, NULL, 'Tạp hóa', 'tap-hoa', 'shopping-basket', 'https://images.unsplash.com/photo-1542838132-92c53300491e', 5, TRUE),
(16, 15, 'Đồ ăn vặt', 'do-an-vat', 'cookie', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', 1, TRUE),
(17, 15, 'Đồ uống', 'do-uong', 'glass-water', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c', 2, TRUE);

INSERT INTO products (id, shop_id, category_id, name, slug, description, thumbnail, images, status, is_featured, sold_count, view_count, rating_avg, rating_count) VALUES
(1, 1, 2, 'iPhone 15 Pro Max 256GB', 'iphone-15-pro-max-256gb', 'Điện thoại flagship với chip A17 Pro, camera Pro và khung titan.', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9","https://images.unsplash.com/photo-1592750475338-74b7b21085ab"]', 'active', TRUE, 1820, 120000, 4.95, 612),
(2, 1, 2, 'Samsung Galaxy S24 Ultra 256GB', 'samsung-galaxy-s24-ultra-256gb', 'Màn hình lớn, bút S Pen, camera zoom xa và AI thông minh.', 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5', '["https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"]', 'active', TRUE, 1420, 95000, 4.93, 488),
(3, 2, 2, 'Xiaomi Redmi Note 13 Pro 5G', 'xiaomi-redmi-note-13-pro-5g', 'Smartphone tầm trung camera 200MP, pin lớn, sạc nhanh.', 'https://images.unsplash.com/photo-1556656793-08538906a9f8', '["https://images.unsplash.com/photo-1556656793-08538906a9f8"]', 'active', FALSE, 2340, 86000, 4.76, 522),
(4, 2, 2, 'OPPO Reno11 F 5G', 'oppo-reno11-f-5g', 'Thiết kế mỏng nhẹ, màn hình đẹp, pin bền, hỗ trợ AI.', 'https://images.unsplash.com/photo-1512499617640-c2f999018b72', '["https://images.unsplash.com/photo-1512499617640-c2f999018b72"]', 'active', FALSE, 1680, 74000, 4.71, 301),
(5, 3, 3, 'MacBook Air M3 13 inch', 'macbook-air-m3-13-inch', 'Laptop siêu mỏng nhẹ, hiệu năng mạnh cho công việc sáng tạo.', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', '["https://images.unsplash.com/photo-1496181133206-80ce9b88a853","https://images.unsplash.com/photo-1517336714731-489689fd1ca8"]', 'active', TRUE, 820, 68000, 4.96, 210),
(6, 3, 3, 'Dell XPS 13 Plus', 'dell-xps-13-plus', 'Laptop cao cấp, màn hình sắc nét, thiết kế tối giản.', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', '["https://images.unsplash.com/photo-1498050108023-c5249f4df085"]', 'active', FALSE, 540, 42000, 4.84, 176),
(7, 3, 4, 'Tai nghe Sony WH-1000XM5', 'tai-nghe-sony-wh-1000xm5', 'Chống ồn chủ động, âm thanh cao cấp, pin lâu.', 'https://images.unsplash.com/photo-1518441902111-8aa2f6d8f4c9', '["https://images.unsplash.com/photo-1518441902111-8aa2f6d8f4c9"]', 'active', TRUE, 2650, 78000, 4.91, 849),
(8, 3, 4, 'Sạc nhanh GaN 65W', 'sac-nhanh-gan-65w', 'Sạc đa cổng, nhỏ gọn, tương thích nhiều thiết bị.', 'https://images.unsplash.com/photo-1583863788434-e58a36330f52', '["https://images.unsplash.com/photo-1583863788434-e58a36330f52"]', 'active', FALSE, 4900, 92000, 4.79, 730),
(9, 1, 4, 'Ốp lưng MagSafe trong suốt', 'op-lung-magsafe-trong-suot', 'Chống sốc, tương thích MagSafe, bảo vệ toàn diện.', 'https://images.unsplash.com/photo-1625868076579-4d4824f0e67b', '["https://images.unsplash.com/photo-1625868076579-4d4824f0e67b"]', 'active', FALSE, 8600, 53000, 4.74, 960),
(10, 1, 4, 'Pin sạc dự phòng 20000mAh', 'pin-sac-du-phong-20000mah', 'Dung lượng lớn, sạc nhanh, phù hợp du lịch và công tác.', 'https://images.unsplash.com/photo-1609592424851-5ef5a8d7c4d8', '["https://images.unsplash.com/photo-1609592424851-5ef5a8d7c4d8"]', 'active', FALSE, 7320, 61000, 4.82, 702),
(11, 3, 6, 'Áo thun nam cotton basic', 'ao-thun-nam-cotton-basic', 'Áo thun chất cotton thoáng mát, form regular dễ phối đồ.', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f', '["https://images.unsplash.com/photo-1512436991641-6745cdb1723f"]', 'active', TRUE, 5400, 73000, 4.88, 980),
(12, 3, 6, 'Quần jean slim fit nam', 'quan-jean-slim-fit-nam', 'Quần jean nam co giãn nhẹ, ôm dáng hiện đại.', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a', '["https://images.unsplash.com/photo-1473966968600-fa801b869a1a"]', 'active', FALSE, 4100, 52000, 4.79, 621),
(13, 3, 6, 'Áo sơ mi công sở nam', 'ao-so-mi-cong-so-nam', 'Sơ mi thanh lịch, phù hợp đi làm và dự tiệc.', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf', '["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf"]', 'active', FALSE, 3800, 48000, 4.81, 450),
(14, 3, 7, 'Đầm suông nữ công sở', 'dam-suong-nu-cong-so', 'Thiết kế tinh tế, tôn dáng, phù hợp môi trường văn phòng.', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c', '["https://images.unsplash.com/photo-1496747611176-843222e1e57c"]', 'active', TRUE, 2900, 61000, 4.86, 540),
(15, 3, 7, 'Áo blouse nữ tay phồng', 'ao-blouse-nu-tay-phong', 'Chất liệu mềm, thoáng, dễ kết hợp quần/chân váy.', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f', '["https://images.unsplash.com/photo-1487412720507-e7ab37603c6f"]', 'active', FALSE, 2700, 45000, 4.77, 410),
(16, 3, 8, 'Giày sneaker trắng unisex', 'giay-sneaker-trang-unisex', 'Đế êm, dễ phối đồ, phù hợp đi học đi làm.', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', '["https://images.unsplash.com/photo-1542291026-7eec264c27ff"]', 'active', TRUE, 6200, 88000, 4.89, 1100),
(17, 3, 8, 'Sandal quai ngang nữ', 'sandal-quai-ngang-nu', 'Nhẹ, êm, phù hợp đi chơi và sử dụng hằng ngày.', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2', '["https://images.unsplash.com/photo-1543163521-1bf539c55dd2"]', 'active', FALSE, 3300, 37000, 4.72, 280),
(18, 3, 8, 'Giày thể thao nam chạy bộ', 'giay-the-thao-nam-chay-bo', 'Đệm êm, thoáng khí, độ bám tốt cho vận động.', 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2', '["https://images.unsplash.com/photo-1460353581641-37baddab0fa2"]', 'active', FALSE, 4500, 53000, 4.83, 390),
(19, 1, 7, 'Áo khoác gió nữ chống nắng', 'ao-khoac-gio-nu-chong-nang', 'Chống nắng, chống gió nhẹ, dễ gấp gọn.', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b', '["https://images.unsplash.com/photo-1529139574466-a303027c1d8b"]', 'active', FALSE, 2400, 34000, 4.68, 260),
(20, 1, 7, 'Chân váy chữ A basic', 'chan-vay-chu-a-basic', 'Kiểu dáng basic dễ phối với áo sơ mi hoặc áo thun.', 'https://images.unsplash.com/photo-1583496661160-fb5886a13d77', '["https://images.unsplash.com/photo-1583496661160-fb5886a13d77"]', 'active', FALSE, 2600, 29000, 4.75, 220),
(21, 2, 10, 'Nồi chiên không dầu 5L', 'noi-chien-khong-dau-5l', 'Nồi chiên dung tích lớn, tiết kiệm dầu, dễ vệ sinh.', 'https://images.unsplash.com/photo-1556911220-bff31c812dba', '["https://images.unsplash.com/photo-1556911220-bff31c812dba"]', 'active', TRUE, 3400, 56000, 4.85, 470),
(22, 2, 10, 'Bộ nồi inox 5 món', 'bo-noi-inox-5-mon', 'Bộ nồi bền đẹp, đáy từ, dùng cho mọi loại bếp.', 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f', '["https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f"]', 'active', FALSE, 1800, 32000, 4.73, 210),
(23, 2, 11, 'Máy lọc không khí mini', 'may-loc-khong-khi-mini', 'Lọc bụi mịn, hỗ trợ không gian phòng ngủ/phòng làm việc.', 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77', '["https://images.unsplash.com/photo-1556912173-3bb406ef7e77"]', 'active', TRUE, 1200, 25000, 4.80, 160),
(24, 2, 11, 'Robot hút bụi thông minh', 'robot-hut-bui-thong-minh', 'Tự động dọn dẹp, điều khiển qua app, cảm biến chống rơi.', 'https://images.unsplash.com/photo-1581579185169-4b6b4b5f9b5d', '["https://images.unsplash.com/photo-1581579185169-4b6b4b5f9b5d"]', 'active', TRUE, 2100, 39000, 4.88, 310),
(25, 2, 10, 'Bộ chén dĩa sứ cao cấp', 'bo-chen-dia-su-cao-cap', 'Sứ dày, men bóng, phù hợp gia đình trẻ.', 'https://images.unsplash.com/photo-1569058242252-623df46b5028', '["https://images.unsplash.com/photo-1569058242252-623df46b5028"]', 'active', FALSE, 2500, 31000, 4.76, 280),
(26, 2, 10, 'Chảo chống dính 28cm', 'chao-chong-dinh-28cm', 'Lớp chống dính bền, nấu ăn tiện lợi, phù hợp mọi bếp.', 'https://images.unsplash.com/photo-1585238342028-4d5f3e7aee1e', '["https://images.unsplash.com/photo-1585238342028-4d5f3e7aee1e"]', 'active', FALSE, 3200, 28000, 4.79, 240),
(27, 2, 11, 'Máy xay sinh tố đa năng', 'may-xay-sinh-to-da-nang', 'Công suất mạnh, xay đá và hoa quả nhanh chóng.', 'https://images.unsplash.com/photo-1570222094114-d054a817e56b', '["https://images.unsplash.com/photo-1570222094114-d054a817e56b"]', 'active', FALSE, 1700, 26000, 4.71, 190),
(28, 2, 11, 'Bàn là hơi nước cầm tay', 'ban-la-hoi-nuoc-cam-tay', 'Nhỏ gọn, tiện du lịch, làm phẳng nhanh.', 'https://images.unsplash.com/photo-1581467655419-3a4bda746a7d', '["https://images.unsplash.com/photo-1581467655419-3a4bda746a7d"]', 'active', FALSE, 1400, 22000, 4.69, 150),
(29, 2, 10, 'Hộp bảo quản thực phẩm thủy tinh', 'hop-bao-quan-thuc-pham-thuy-tinh', 'Kín hơi, an toàn, phù hợp bảo quản đồ ăn.', 'https://images.unsplash.com/photo-1606813902915-0f6a6df4f1f2', '["https://images.unsplash.com/photo-1606813902915-0f6a6df4f1f2"]', 'active', FALSE, 2900, 25000, 4.82, 230),
(30, 2, 10, 'Ấm siêu tốc inox 1.8L', 'am-sieu-toc-inox-18l', 'Đun nước nhanh, tự ngắt an toàn, bền bỉ.', 'https://images.unsplash.com/photo-1540574163026-643ea20ade25', '["https://images.unsplash.com/photo-1540574163026-643ea20ade25"]', 'active', FALSE, 3100, 27000, 4.74, 260),
(31, 3, 13, 'Kem dưỡng ẩm Ceramide 100ml', 'kem-duong-am-ceramide-100ml', 'Dưỡng ẩm sâu, phục hồi hàng rào da, phù hợp da nhạy cảm.', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883', '["https://images.unsplash.com/photo-1556228578-8c89e6adf883"]', 'active', TRUE, 4200, 52000, 4.90, 680),
(32, 3, 13, 'Sữa rửa mặt dịu nhẹ 150ml', 'sua-rua-mat-diu-nhe-150ml', 'Làm sạch nhẹ nhàng, không gây khô căng.', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883', '["https://images.unsplash.com/photo-1556228578-8c89e6adf883"]', 'active', FALSE, 5100, 47000, 4.83, 590),
(33, 3, 13, 'Serum Vitamin C 30ml', 'serum-vitamin-c-30ml', 'Hỗ trợ sáng da, đều màu, giảm xỉn màu.', 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b', '["https://images.unsplash.com/photo-1571781926291-c477ebfd024b"]', 'active', TRUE, 3100, 41000, 4.84, 430),
(34, 3, 13, 'Kem chống nắng SPF50+', 'kem-chong-nang-spf50-plus', 'Bảo vệ da khỏi tia UV, finish ráo mịn.', 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16', '["https://images.unsplash.com/photo-1601042879364-f3947d3f9c16"]', 'active', TRUE, 6800, 66000, 4.91, 820),
(35, 3, 14, 'Son lì lâu trôi màu đỏ cam', 'son-li-lau-troi-do-cam', 'Màu trendy, bám màu tốt, chất son mịn.', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa', '["https://images.unsplash.com/photo-1586495777744-4413f21062fa"]', 'active', TRUE, 7600, 70000, 4.87, 940),
(36, 3, 14, 'Phấn phủ kiềm dầu', 'phan-phu-kiem-dau', 'Lớp phấn mỏng nhẹ, kiểm soát dầu hiệu quả.', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9', '["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"]', 'active', FALSE, 2600, 33000, 4.76, 310),
(37, 3, 14, 'Mascara cong mi chống trôi', 'mascara-cong-mi-chong-troi', 'Cong mi rõ, lâu trôi, không vón cục.', 'https://images.unsplash.com/photo-1583241800698-9d60c5f5b9b6', '["https://images.unsplash.com/photo-1583241800698-9d60c5f5b9b6"]', 'active', FALSE, 2400, 29000, 4.78, 290),
(38, 3, 13, 'Mặt nạ giấy dưỡng da 10 miếng', 'mat-na-giay-duong-da-10-mieng', 'Bổ sung độ ẩm, làm dịu da sau một ngày dài.', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348', '["https://images.unsplash.com/photo-1596462502278-27bfdc403348"]', 'active', FALSE, 5400, 38000, 4.79, 410),
(39, 3, 13, 'Tẩy trang micellar water 400ml', 'tay-trang-micellar-water-400ml', 'Làm sạch lớp trang điểm, dịu nhẹ cho da.', 'https://images.unsplash.com/photo-1556228724-4d1eb2f2f0a8', '["https://images.unsplash.com/photo-1556228724-4d1eb2f2f0a8"]', 'active', FALSE, 4600, 44000, 4.81, 360),
(40, 3, 13, 'Toner cân bằng da 250ml', 'toner-can-bang-da-250ml', 'Cân bằng pH, hỗ trợ se khít lỗ chân lông.', 'https://images.unsplash.com/photo-1556228724-4d1eb2f2f0a8', '["https://images.unsplash.com/photo-1556228724-4d1eb2f2f0a8"]', 'active', FALSE, 3900, 35000, 4.74, 280),
(41, 3, 16, 'Bánh quy bơ Đan Mạch 454g', 'banh-quy-bo-dan-mach-454g', 'Bánh quy bơ giòn thơm, hộp lớn phù hợp gia đình.', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', '["https://images.unsplash.com/photo-1563805042-7684c019e1cb"]', 'active', TRUE, 8700, 54000, 4.86, 1000),
(42, 3, 16, 'Snack rong biển giòn 6 gói', 'snack-rong-bien-gion-6-goi', 'Ăn vặt tiện lợi, vị đậm đà, phù hợp mọi lứa tuổi.', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b', '["https://images.unsplash.com/photo-1566478989037-eec170784d0b"]', 'active', FALSE, 9300, 46000, 4.79, 780),
(43, 3, 16, 'Bim bim khoai tây vị phô mai', 'bim-bim-khoai-tay-vi-pho-mai', 'Giòn ngon, vị phô mai hấp dẫn, đóng gói tiện lợi.', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187', '["https://images.unsplash.com/photo-1565958011703-44f9829ba187"]', 'active', FALSE, 10200, 58000, 4.82, 870),
(44, 3, 17, 'Cà phê hòa tan 3in1', 'ca-phe-hoa-tan-3in1', 'Hương vị đậm đà, pha nhanh trong vài giây.', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93', '["https://images.unsplash.com/photo-1509042239860-f550ce710b93"]', 'active', TRUE, 15200, 73000, 4.91, 1320),
(45, 3, 17, 'Trà xanh túi lọc nguyên chất', 'tra-xanh-tui-loc-nguyen-chat', 'Thanh mát, dễ uống, phù hợp dùng hằng ngày.', 'https://images.unsplash.com/photo-1523906630133-f6934a1ab2b9', '["https://images.unsplash.com/photo-1523906630133-f6934a1ab2b9"]', 'active', FALSE, 7900, 39000, 4.73, 510),
(46, 3, 17, 'Nước yến sào 6 lon', 'nuoc-yen-sao-6-lon', 'Bồi bổ nhẹ nhàng, tiện lợi khi biếu tặng.', 'https://images.unsplash.com/photo-1470337458703-46ad1756a187', '["https://images.unsplash.com/photo-1470337458703-46ad1756a187"]', 'active', FALSE, 6800, 62000, 4.84, 430),
(47, 2, 16, 'Bắp rang bơ caramel', 'bap-rang-bo-caramel', 'Ngọt thơm, giòn xốp, đóng gói tiện mang đi.', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e', '["https://images.unsplash.com/photo-1485968579580-b6d095142e6e"]', 'active', FALSE, 5600, 41000, 4.75, 350),
(48, 2, 16, 'Bánh gạo Hàn Quốc cay ngọt', 'banh-gao-han-quoc-cay-ngot', 'Vị cay ngọt đặc trưng, món ăn vặt yêu thích.', 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e', '["https://images.unsplash.com/photo-1604977042946-1eecc30f269e"]', 'active', FALSE, 6100, 46000, 4.78, 380),
(49, 2, 17, 'Nước trái cây 100% tự nhiên', 'nuoc-trai-cay-100-tu-nhien', 'Đóng chai tiện lợi, hương vị trái cây tươi mát.', 'https://images.unsplash.com/photo-1547592180-85f173990554', '["https://images.unsplash.com/photo-1547592180-85f173990554"]', 'active', FALSE, 4200, 30000, 4.69, 220),
(50, 2, 17, 'Sữa hạt óc chó hạnh nhân', 'sua-hat-oc-cho-hanh-nhan', 'Giàu dinh dưỡng, vị béo nhẹ, phù hợp gia đình.', 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1', '["https://images.unsplash.com/photo-1517093157656-b9eccef91cb1"]', 'active', FALSE, 5300, 35000, 4.83, 260);

INSERT INTO product_attributes (product_id, attribute_name, attribute_values) VALUES
(1, 'Color/Capacity', '["Titan Đen", "Titan Trắng", "Titan Tự Nhiên"]'),
(2, 'Color/Capacity', '["Đen", "Tím", "Xanh"]'),
(3, 'Color/Capacity', '["Đen", "Xanh dương", "Bạc"]'),
(4, 'Color/Capacity', '["Xanh mint", "Đen", "Hồng"]'),
(5, 'Color/Capacity', '["Xám", "Bạc"]'),
(6, 'Color/Capacity', '["Xám", "Đen"]'),
(7, 'Color/Capacity', '["Đen", "Bạc"]'),
(8, 'Color/Capacity', '["Trắng", "Đen"]'),
(9, 'Color/Capacity', '["Trong suốt", "Khói"]'),
(10, 'Color/Capacity', '["Đen", "Xanh"]'),
(11, 'Color/Size', '["Trắng", "Đen", "Xanh navy"]'),
(12, 'Color/Size', '["Xanh đậm", "Đen"]'),
(13, 'Color/Size', '["Trắng", "Xanh nhạt", "Be"]'),
(14, 'Color/Size', '["Đen", "Be", "Xanh pastel"]'),
(15, 'Color/Size', '["Trắng", "Hồng", "Xanh mint"]'),
(16, 'Color/Size', '["Trắng", "Đen"]'),
(17, 'Color/Size', '["Đen", "Nâu"]'),
(18, 'Color/Size', '["Trắng", "Xanh"]'),
(19, 'Color/Size', '["Xám", "Hồng"]'),
(20, 'Color/Size', '["Đen", "Trắng"]'),
(21, 'Color/Size', '["Trắng", "Đen"]'),
(22, 'Color/Size', '["Bạc", "Đen"]'),
(23, 'Color/Size', '["Trắng", "Xám"]'),
(24, 'Color/Size', '["Trắng", "Đen"]'),
(25, 'Color/Size', '["Trắng", "Xanh"]'),
(26, 'Color/Size', '["Đen", "Xanh"]'),
(27, 'Color/Size', '["Đỏ", "Đen"]'),
(28, 'Color/Size', '["Trắng", "Hồng"]'),
(29, 'Color/Size', '["Trong suốt", "Xanh"]'),
(30, 'Color/Size', '["Bạc", "Đen"]'),
(31, 'Color/Size', '["Không mùi", "Hoa hồng"]'),
(32, 'Color/Size', '["Da thường", "Da dầu"]'),
(33, 'Color/Size', '["30ml", "50ml"]'),
(34, 'Color/Size', '["50ml", "100ml"]'),
(35, 'Color/Size', '["Đỏ cam", "Đỏ đất"]'),
(36, 'Color/Size', '["01 Light", "02 Natural"]'),
(37, 'Color/Size', '["Đen", "Nâu"]'),
(38, 'Color/Size', '["Dưỡng ẩm", "Làm dịu"]'),
(39, 'Color/Size', '["400ml", "500ml"]'),
(40, 'Color/Size', '["250ml", "300ml"]'),
(41, 'Color/Size', '["454g", "908g"]'),
(42, 'Color/Size', '["Màng", "Wasabi"]'),
(43, 'Color/Size', '["Phô mai", "Cay"]'),
(44, 'Color/Size', '["Hộp 20 gói", "Hộp 30 gói"]'),
(45, 'Color/Size', '["25 túi", "50 túi"]'),
(46, 'Color/Size', '["6 lon", "12 lon"]'),
(47, 'Color/Size', '["Caramel", "Bơ sữa"]'),
(48, 'Color/Size', '["Cay ngọt", "Phô mai"]'),
(49, 'Color/Size', '["Cam", "Táo"]'),
(50, 'Color/Size', '["Óc chó", "Hạnh nhân"]');

INSERT INTO product_variants (product_id, sku, attributes, price, original_price, stock, images) VALUES
(1, 'IP15PM-256-TITAN-DEN', '{"color":"Titan Đen","capacity":"256GB"}', 33990000, 36990000, 28, '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"]'),
(1, 'IP15PM-256-TITAN-NATURAL', '{"color":"Titan Tự Nhiên","capacity":"256GB"}', 34490000, 36990000, 18, '["https://images.unsplash.com/photo-1592750475338-74b7b21085ab"]'),
(2, 'S24U-256-BLACK', '{"color":"Đen","capacity":"256GB"}', 27990000, 30990000, 32, '["https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5"]'),
(2, 'S24U-256-VIOLET', '{"color":"Tím","capacity":"256GB"}', 27990000, 30990000, 24, '["https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5"]'),
(3, 'RN13P-8-256-BLACK', '{"color":"Đen","ram":"8GB","storage":"256GB"}', 7990000, 8990000, 54, '["https://images.unsplash.com/photo-1556656793-08538906a9f8"]'),
(3, 'RN13P-8-256-BLUE', '{"color":"Xanh dương","ram":"8GB","storage":"256GB"}', 8090000, 8990000, 41, '["https://images.unsplash.com/photo-1556656793-08538906a9f8"]'),
(4, 'OPPO-R11F-8-256-MINT', '{"color":"Xanh mint","ram":"8GB","storage":"256GB"}', 8990000, 9990000, 36, '["https://images.unsplash.com/photo-1512499617640-c2f999018b72"]'),
(4, 'OPPO-R11F-8-256-BLACK', '{"color":"Đen","ram":"8GB","storage":"256GB"}', 8990000, 9990000, 29, '["https://images.unsplash.com/photo-1512499617640-c2f999018b72"]'),
(5, 'MBA-M3-13-GRAY', '{"color":"Xám","storage":"256GB"}', 28990000, 30990000, 19, '["https://images.unsplash.com/photo-1496181133206-80ce9b88a853"]'),
(5, 'MBA-M3-13-SILVER', '{"color":"Bạc","storage":"512GB"}', 34990000, 36990000, 12, '["https://images.unsplash.com/photo-1496181133206-80ce9b88a853"]'),
(6, 'XPS13P-GRAY-512', '{"color":"Xám","storage":"512GB"}', 30990000, 32990000, 14, '["https://images.unsplash.com/photo-1498050108023-c5249f4df085"]'),
(6, 'XPS13P-BLACK-512', '{"color":"Đen","storage":"512GB"}', 30990000, 32990000, 10, '["https://images.unsplash.com/photo-1498050108023-c5249f4df085"]'),
(7, 'WH1000XM5-BLACK', '{"color":"Đen"}', 6990000, 7990000, 44, '["https://images.unsplash.com/photo-1518441902111-8aa2f6d8f4c9"]'),
(7, 'WH1000XM5-SILVER', '{"color":"Bạc"}', 6990000, 7990000, 38, '["https://images.unsplash.com/photo-1518441902111-8aa2f6d8f4c9"]'),
(8, 'GAN65W-BLACK', '{"color":"Đen","plug":"VN"}', 490000, 690000, 260, '["https://images.unsplash.com/photo-1583863788434-e58a36330f52"]'),
(8, 'GAN65W-WHITE', '{"color":"Trắng","plug":"VN"}', 490000, 690000, 240, '["https://images.unsplash.com/photo-1583863788434-e58a36330f52"]'),
(9, 'MAGSAFE-CASE-TRANSPARENT', '{"color":"Trong suốt","size":"iPhone 15 Pro Max"}', 290000, 390000, 420, '["https://images.unsplash.com/photo-1625868076579-4d4824f0e67b"]'),
(9, 'MAGSAFE-CASE-SMOKE', '{"color":"Khói","size":"iPhone 15 Pro Max"}', 290000, 390000, 380, '["https://images.unsplash.com/photo-1625868076579-4d4824f0e67b"]'),
(10, 'POWERBANK-20K-BLACK', '{"color":"Đen","capacity":"20000mAh"}', 690000, 890000, 150, '["https://images.unsplash.com/photo-1609592424851-5ef5a8d7c4d8"]'),
(10, 'POWERBANK-20K-BLUE', '{"color":"Xanh","capacity":"20000mAh"}', 690000, 890000, 135, '["https://images.unsplash.com/photo-1609592424851-5ef5a8d7c4d8"]'),
(11, 'TSHIRT-M-BLACK', '{"color":"Đen","size":"M"}', 159000, 229000, 300, '["https://images.unsplash.com/photo-1512436991641-6745cdb1723f"]'),
(11, 'TSHIRT-L-WHITE', '{"color":"Trắng","size":"L"}', 159000, 229000, 280, '["https://images.unsplash.com/photo-1512436991641-6745cdb1723f"]'),
(12, 'JEAN-SLIM-32-DARK', '{"color":"Xanh đậm","size":"32"}', 399000, 499000, 180, '["https://images.unsplash.com/photo-1473966968600-fa801b869a1a"]'),
(12, 'JEAN-SLIM-34-DARK', '{"color":"Xanh đậm","size":"34"}', 399000, 499000, 165, '["https://images.unsplash.com/photo-1473966968600-fa801b869a1a"]'),
(13, 'SHIRT-M-WHITE', '{"color":"Trắng","size":"M"}', 289000, 399000, 210, '["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf"]'),
(13, 'SHIRT-L-BEIGE', '{"color":"Be","size":"L"}', 289000, 399000, 190, '["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf"]'),
(14, 'DRESS-S-BLACK', '{"color":"Đen","size":"S"}', 449000, 579000, 140, '["https://images.unsplash.com/photo-1496747611176-843222e1e57c"]'),
(14, 'DRESS-M-BEIGE', '{"color":"Be","size":"M"}', 449000, 579000, 128, '["https://images.unsplash.com/photo-1496747611176-843222e1e57c"]'),
(15, 'BLOUSE-S-WHITE', '{"color":"Trắng","size":"S"}', 259000, 349000, 160, '["https://images.unsplash.com/photo-1487412720507-e7ab37603c6f"]'),
(15, 'BLOUSE-M-MINT', '{"color":"Xanh mint","size":"M"}', 259000, 349000, 150, '["https://images.unsplash.com/photo-1487412720507-e7ab37603c6f"]'),
(16, 'SNEAKER-42-WHITE', '{"color":"Trắng","size":"42"}', 599000, 799000, 240, '["https://images.unsplash.com/photo-1542291026-7eec264c27ff"]'),
(16, 'SNEAKER-43-WHITE', '{"color":"Trắng","size":"43"}', 599000, 799000, 220, '["https://images.unsplash.com/photo-1542291026-7eec264c27ff"]'),
(17, 'SANDAL-37-BROWN', '{"color":"Nâu","size":"37"}', 349000, 459000, 120, '["https://images.unsplash.com/photo-1543163521-1bf539c55dd2"]'),
(17, 'SANDAL-38-BLACK', '{"color":"Đen","size":"38"}', 349000, 459000, 115, '["https://images.unsplash.com/photo-1543163521-1bf539c55dd2"]'),
(18, 'RUN-SHOE-42-WHITE', '{"color":"Trắng","size":"42"}', 699000, 899000, 180, '["https://images.unsplash.com/photo-1460353581641-37baddab0fa2"]'),
(18, 'RUN-SHOE-43-BLUE', '{"color":"Xanh","size":"43"}', 699000, 899000, 170, '["https://images.unsplash.com/photo-1460353581641-37baddab0fa2"]'),
(19, 'JACKET-S-GRAY', '{"color":"Xám","size":"S"}', 459000, 599000, 130, '["https://images.unsplash.com/photo-1529139574466-a303027c1d8b"]'),
(19, 'JACKET-M-PINK', '{"color":"Hồng","size":"M"}', 459000, 599000, 118, '["https://images.unsplash.com/photo-1529139574466-a303027c1d8b"]'),
(20, 'SKIRT-S-BLACK', '{"color":"Đen","size":"S"}', 299000, 399000, 145, '["https://images.unsplash.com/photo-1583496661160-fb5886a13d77"]'),
(20, 'SKIRT-M-WHITE', '{"color":"Trắng","size":"M"}', 299000, 399000, 138, '["https://images.unsplash.com/photo-1583496661160-fb5886a13d77"]'),
(21, 'AIRFRYER-5L-BLACK', '{"color":"Đen","capacity":"5L"}', 1590000, 1990000, 40, '["https://images.unsplash.com/photo-1556911220-bff31c812dba"]'),
(21, 'AIRFRYER-5L-WHITE', '{"color":"Trắng","capacity":"5L"}', 1590000, 1990000, 36, '["https://images.unsplash.com/photo-1556911220-bff31c812dba"]'),
(22, 'POT-5PCS-SILVER', '{"color":"Bạc","set":"5 món"}', 990000, 1290000, 58, '["https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f"]'),
(22, 'POT-5PCS-BLACK', '{"color":"Đen","set":"5 món"}', 990000, 1290000, 52, '["https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f"]'),
(23, 'AIRPURIFIER-MINI-WHITE', '{"color":"Trắng","room":"20m2"}', 1290000, 1690000, 24, '["https://images.unsplash.com/photo-1556912173-3bb406ef7e77"]'),
(23, 'AIRPURIFIER-MINI-GRAY', '{"color":"Xám","room":"20m2"}', 1290000, 1690000, 20, '["https://images.unsplash.com/photo-1556912173-3bb406ef7e77"]'),
(24, 'ROBOT-VAC-BLACK', '{"color":"Đen","mode":"Smart"}', 4990000, 5990000, 15, '["https://images.unsplash.com/photo-1581579185169-4b6b4b5f9b5d"]'),
(24, 'ROBOT-VAC-WHITE', '{"color":"Trắng","mode":"Smart"}', 4990000, 5990000, 14, '["https://images.unsplash.com/photo-1581579185169-4b6b4b5f9b5d"]'),
(25, 'DINNERSET-4P-WHITE', '{"color":"Trắng","set":"4 người"}', 690000, 890000, 70, '["https://images.unsplash.com/photo-1569058242252-623df46b5028"]'),
(25, 'DINNERSET-6P-BLUE', '{"color":"Xanh","set":"6 người"}', 690000, 890000, 64, '["https://images.unsplash.com/photo-1569058242252-623df46b5028"]'),
(26, 'FRYPAN-28-BLACK', '{"color":"Đen","size":"28cm"}', 390000, 520000, 90, '["https://images.unsplash.com/photo-1585238342028-4d5f3e7aee1e"]'),
(26, 'FRYPAN-28-GREEN', '{"color":"Xanh","size":"28cm"}', 390000, 520000, 84, '["https://images.unsplash.com/photo-1585238342028-4d5f3e7aee1e"]'),
(27, 'BLENDER-RED-1L', '{"color":"Đỏ","capacity":"1L"}', 790000, 990000, 44, '["https://images.unsplash.com/photo-1570222094114-d054a817e56b"]'),
(27, 'BLENDER-BLACK-1L', '{"color":"Đen","capacity":"1L"}', 790000, 990000, 40, '["https://images.unsplash.com/photo-1570222094114-d054a817e56b"]'),
(28, 'STEAMIRON-WHITE', '{"color":"Trắng","mode":"Cầm tay"}', 590000, 790000, 55, '["https://images.unsplash.com/photo-1581467655419-3a4bda746a7d"]'),
(28, 'STEAMIRON-PINK', '{"color":"Hồng","mode":"Cầm tay"}', 590000, 790000, 50, '["https://images.unsplash.com/photo-1581467655419-3a4bda746a7d"]'),
(29, 'GLASSBOX-RECT-800ML', '{"color":"Trong suốt","size":"800ml"}', 190000, 260000, 120, '["https://images.unsplash.com/photo-1606813902915-0f6a6df4f1f2"]'),
(29, 'GLASSBOX-RECT-1200ML', '{"color":"Trong suốt","size":"1200ml"}', 220000, 290000, 110, '["https://images.unsplash.com/photo-1606813902915-0f6a6df4f1f2"]'),
(30, 'KETTLE-18L-SILVER', '{"color":"Bạc","capacity":"1.8L"}', 290000, 390000, 140, '["https://images.unsplash.com/photo-1540574163026-643ea20ade25"]'),
(30, 'KETTLE-18L-BLACK', '{"color":"Đen","capacity":"1.8L"}', 290000, 390000, 132, '["https://images.unsplash.com/photo-1540574163026-643ea20ade25"]'),
(31, 'CERAMIDE-100-CREAM', '{"type":"Không mùi","size":"100ml"}', 320000, 420000, 90, '["https://images.unsplash.com/photo-1556228578-8c89e6adf883"]'),
(31, 'CERAMIDE-100-ROSE', '{"type":"Hoa hồng","size":"100ml"}', 320000, 420000, 82, '["https://images.unsplash.com/photo-1556228578-8c89e6adf883"]'),
(32, 'CLEANSER-150-NORMAL', '{"type":"Da thường","size":"150ml"}', 190000, 250000, 160, '["https://images.unsplash.com/photo-1556228578-8c89e6adf883"]'),
(32, 'CLEANSER-150-OILY', '{"type":"Da dầu","size":"150ml"}', 190000, 250000, 150, '["https://images.unsplash.com/photo-1556228578-8c89e6adf883"]'),
(33, 'SERUM-C-30', '{"size":"30ml"}', 390000, 490000, 74, '["https://images.unsplash.com/photo-1571781926291-c477ebfd024b"]'),
(33, 'SERUM-C-50', '{"size":"50ml"}', 590000, 690000, 60, '["https://images.unsplash.com/photo-1571781926291-c477ebfd024b"]'),
(34, 'SUNSCREEN-50ML', '{"spf":"SPF50+","size":"50ml"}', 250000, 320000, 180, '["https://images.unsplash.com/photo-1601042879364-f3947d3f9c16"]'),
(34, 'SUNSCREEN-100ML', '{"spf":"SPF50+","size":"100ml"}', 390000, 490000, 160, '["https://images.unsplash.com/photo-1601042879364-f3947d3f9c16"]'),
(35, 'LIPSTICK-ORANGE-RED', '{"shade":"Đỏ cam","size":"3.5g"}', 180000, 240000, 140, '["https://images.unsplash.com/photo-1586495777744-4413f21062fa"]'),
(35, 'LIPSTICK-BROWN-RED', '{"shade":"Đỏ đất","size":"3.5g"}', 180000, 240000, 130, '["https://images.unsplash.com/photo-1586495777744-4413f21062fa"]'),
(36, 'POWDER-01-LIGHT', '{"shade":"01 Light","size":"8g"}', 210000, 280000, 90, '["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"]'),
(36, 'POWDER-02-NATURAL', '{"shade":"02 Natural","size":"8g"}', 210000, 280000, 86, '["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"]'),
(37, 'MASCARA-BLACK', '{"color":"Đen","size":"10ml"}', 160000, 220000, 110, '["https://images.unsplash.com/photo-1583241800698-9d60c5f5b9b6"]'),
(37, 'MASCARA-BROWN', '{"color":"Nâu","size":"10ml"}', 160000, 220000, 100, '["https://images.unsplash.com/photo-1583241800698-9d60c5f5b9b6"]'),
(38, 'MASK-10-HYDRATE', '{"type":"Dưỡng ẩm","quantity":"10 miếng"}', 120000, 180000, 220, '["https://images.unsplash.com/photo-1596462502278-27bfdc403348"]'),
(38, 'MASK-10-SOOTHE', '{"type":"Làm dịu","quantity":"10 miếng"}', 120000, 180000, 210, '["https://images.unsplash.com/photo-1596462502278-27bfdc403348"]'),
(39, 'MICELLAR-400ML', '{"size":"400ml"}', 175000, 240000, 180, '["https://images.unsplash.com/photo-1556228724-4d1eb2f2f0a8"]'),
(39, 'MICELLAR-500ML', '{"size":"500ml"}', 210000, 280000, 170, '["https://images.unsplash.com/photo-1556228724-4d1eb2f2f0a8"]'),
(40, 'TONER-250ML', '{"size":"250ml"}', 190000, 250000, 160, '["https://images.unsplash.com/photo-1556228724-4d1eb2f2f0a8"]'),
(40, 'TONER-300ML', '{"size":"300ml"}', 230000, 290000, 150, '["https://images.unsplash.com/photo-1556228724-4d1eb2f2f0a8"]'),
(41, 'COOKIE-454G', '{"size":"454g"}', 149000, 199000, 260, '["https://images.unsplash.com/photo-1563805042-7684c019e1cb"]'),
(41, 'COOKIE-908G', '{"size":"908g"}', 269000, 329000, 180, '["https://images.unsplash.com/photo-1563805042-7684c019e1cb"]'),
(42, 'SEAWEED-ORIGINAL', '{"flavor":"Màng"}', 69000, 99000, 380, '["https://images.unsplash.com/photo-1566478989037-eec170784d0b"]'),
(42, 'SEAWEED-WASABI', '{"flavor":"Wasabi"}', 69000, 99000, 360, '["https://images.unsplash.com/photo-1566478989037-eec170784d0b"]'),
(43, 'CHIPS-CHEESE', '{"flavor":"Phô mai"}', 39000, 59000, 420, '["https://images.unsplash.com/photo-1565958011703-44f9829ba187"]'),
(43, 'CHIPS-SPICY', '{"flavor":"Cay"}', 39000, 59000, 400, '["https://images.unsplash.com/photo-1565958011703-44f9829ba187"]'),
(44, 'COFFEE-20SACHETS', '{"pack":"Hộp 20 gói"}', 129000, 169000, 500, '["https://images.unsplash.com/photo-1509042239860-f550ce710b93"]'),
(44, 'COFFEE-30SACHETS', '{"pack":"Hộp 30 gói"}', 179000, 229000, 420, '["https://images.unsplash.com/photo-1509042239860-f550ce710b93"]'),
(45, 'GREENTEA-25BAGS', '{"pack":"25 túi"}', 85000, 120000, 320, '["https://images.unsplash.com/photo-1523906630133-f6934a1ab2b9"]'),
(45, 'GREENTEA-50BAGS', '{"pack":"50 túi"}', 145000, 190000, 260, '["https://images.unsplash.com/photo-1523906630133-f6934a1ab2b9"]'),
(46, 'BIRD-NEST-6CANS', '{"pack":"6 lon"}', 179000, 229000, 210, '["https://images.unsplash.com/photo-1470337458703-46ad1756a187"]'),
(46, 'BIRD-NEST-12CANS', '{"pack":"12 lon"}', 329000, 399000, 180, '["https://images.unsplash.com/photo-1470337458703-46ad1756a187"]'),
(47, 'POPCORN-CARAMEL', '{"flavor":"Caramel"}', 59000, 85000, 280, '["https://images.unsplash.com/photo-1485968579580-b6d095142e6e"]'),
(47, 'POPCORN-BUTTER', '{"flavor":"Bơ sữa"}', 59000, 85000, 260, '["https://images.unsplash.com/photo-1485968579580-b6d095142e6e"]'),
(48, 'RICECAKE-SPICY', '{"flavor":"Cay ngọt"}', 65000, 89000, 300, '["https://images.unsplash.com/photo-1604977042946-1eecc30f269e"]'),
(48, 'RICECAKE-CHEESE', '{"flavor":"Phô mai"}', 65000, 89000, 280, '["https://images.unsplash.com/photo-1604977042946-1eecc30f269e"]'),
(49, 'JUICE-ORANGE', '{"flavor":"Cam"}', 49000, 69000, 250, '["https://images.unsplash.com/photo-1547592180-85f173990554"]'),
(49, 'JUICE-APPLE', '{"flavor":"Táo"}', 49000, 69000, 240, '["https://images.unsplash.com/photo-1547592180-85f173990554"]'),
(50, 'NUTMILK-WALNUT', '{"flavor":"Óc chó"}', 69000, 99000, 220, '["https://images.unsplash.com/photo-1517093157656-b9eccef91cb1"]'),
(50, 'NUTMILK-ALMOND', '{"flavor":"Hạnh nhân"}', 69000, 99000, 210, '["https://images.unsplash.com/photo-1517093157656-b9eccef91cb1"]');

INSERT INTO flash_sales (product_variant_id, flash_price, original_price, stock, sold, start_time, end_time, is_active) VALUES
(1, 32990000, 36990000, 10, 18, NOW() - INTERVAL '1 hour', NOW() + INTERVAL '5 hours', TRUE),
(7, 8490000, 9990000, 15, 22, NOW() - INTERVAL '30 minutes', NOW() + INTERVAL '4 hours', TRUE),
(21, 1490000, 1990000, 12, 8, NOW() - INTERVAL '15 minutes', NOW() + INTERVAL '3 hours', TRUE),
(31, 299000, 420000, 25, 30, NOW() - INTERVAL '10 minutes', NOW() + INTERVAL '6 hours', TRUE),
(85, 149000, 229000, 60, 40, NOW() - INTERVAL '5 minutes', NOW() + INTERVAL '2 hours', TRUE);

INSERT INTO vouchers (shop_id, code, type, value, min_order_value, max_discount, usage_limit, used_count, start_date, end_date) VALUES
(NULL, 'SHOPEE50K', 'fixed', 50000, 300000, 50000, 1000, 120, NOW() - INTERVAL '1 day', NOW() + INTERVAL '30 days'),
(NULL, 'FREESHIPVN', 'free_ship', 30000, 0, 30000, 2000, 340, NOW() - INTERVAL '1 day', NOW() + INTERVAL '30 days'),
(NULL, 'SALE10', 'percentage', 10, 200000, 50000, 1500, 210, NOW() - INTERVAL '1 day', NOW() + INTERVAL '14 days'),
(NULL, 'APPONLY20', 'percentage', 20, 500000, 80000, 800, 90, NOW() - INTERVAL '2 days', NOW() + INTERVAL '10 days'),
(1, 'MALL100K', 'fixed', 100000, 1000000, 100000, 300, 35, NOW() - INTERVAL '1 day', NOW() + INTERVAL '15 days'),
(1, 'MALL5', 'percentage', 5, 500000, 70000, 500, 60, NOW() - INTERVAL '1 day', NOW() + INTERVAL '20 days'),
(2, 'TECH30K', 'fixed', 30000, 250000, 30000, 900, 110, NOW() - INTERVAL '1 day', NOW() + INTERVAL '20 days'),
(2, 'TECHFREE', 'free_ship', 25000, 0, 25000, 700, 55, NOW() - INTERVAL '1 day', NOW() + INTERVAL '20 days'),
(3, 'FASHION15', 'percentage', 15, 150000, 50000, 1000, 130, NOW() - INTERVAL '1 day', NOW() + INTERVAL '20 days'),
(3, 'LIFE20K', 'fixed', 20000, 100000, 20000, 1200, 75, NOW() - INTERVAL '1 day', NOW() + INTERVAL '20 days');

INSERT INTO shipping_providers (name, code, api_endpoint, is_active, supported_services) VALUES
('GHN', 'ghn', 'https://api.ghn.vn', TRUE, '["express","standard","economy"]'),
('GHTK', 'ghtk', 'https://services.giaohangtietkiem.vn', TRUE, '["express","standard"]'),
('Viettel Post', 'viettelpost', 'https://partner.viettelpost.vn', TRUE, '["express","economy"]'),
('J&T Express', 'jtexpress', 'https://api.jtexpress.vn', TRUE, '["express","standard"]');

INSERT INTO carts (user_id) VALUES
(5),
(6);

INSERT INTO cart_items (cart_id, product_variant_id, quantity, is_selected) VALUES
(1, 1, 1, TRUE),
(1, 21, 2, TRUE),
(1, 71, 1, TRUE),
(2, 11, 1, TRUE),
(2, 41, 1, FALSE);

INSERT INTO addresses (user_id, full_name, phone, province, district, ward, address_detail, is_default) VALUES
(5, 'Nguyễn Minh Anh', '0900000005', 'TP. Hồ Chí Minh', 'Quận 1', 'Phường Bến Nghé', '12 Nguyễn Huệ, Tầng 5', TRUE),
(5, 'Nguyễn Minh Anh', '0900000005', 'TP. Hồ Chí Minh', 'Quận 7', 'Phường Tân Phong', '88 Nguyễn Văn Linh', FALSE),
(6, 'Trần Quốc Huy', '0900000006', 'Hà Nội', 'Cầu Giấy', 'Phường Dịch Vọng', '25 Duy Tân', TRUE);

INSERT INTO notifications (user_id, type, title, message, data, is_read) VALUES
(5, 'order', 'Đơn hàng đã xác nhận', 'Đơn hàng #OD0001 của bạn đã được xác nhận và đang chờ đóng gói.', '{"order_code":"OD0001"}', FALSE),
(5, 'voucher', 'Voucher mới khả dụng', 'Bạn có voucher FREESHIPVN cho đơn hàng hôm nay.', '{"code":"FREESHIPVN"}', FALSE),
(6, 'promotion', 'Flash sale sắp bắt đầu', '5 sản phẩm giảm giá mạnh sẽ mở bán trong ít phút nữa.', '{"flash_sale_count":5}', TRUE);

INSERT INTO wishlists (user_id, product_id) VALUES
(5, 1),
(5, 7),
(5, 21),
(6, 11),
(6, 34);

INSERT INTO chat_sessions (user_id, session_data) VALUES
(5, '{"messages":[{"role":"user","content":"Tư vấn điện thoại dưới 10 triệu cho nữ"},{"role":"assistant","content":"Xiaomi Redmi Note 13 Pro 5G là lựa chọn tốt với camera mạnh và pin lớn."}]}'),
(6, '{"messages":[{"role":"user","content":"Nên mua sạc nhanh nào cho iPhone 15 Pro Max?"},{"role":"assistant","content":"Sạc GaN 65W là lựa chọn gọn nhẹ, an toàn và phù hợp."}]}');

UPDATE users SET created_at = NOW() - INTERVAL '30 days' WHERE id IN (1,2,3,4);
UPDATE users SET created_at = NOW() - INTERVAL '2 days' WHERE id IN (5,6);

SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users));
SELECT setval(pg_get_serial_sequence('shops', 'id'), (SELECT MAX(id) FROM shops));
SELECT setval(pg_get_serial_sequence('categories', 'id'), (SELECT MAX(id) FROM categories));
SELECT setval(pg_get_serial_sequence('products', 'id'), (SELECT MAX(id) FROM products));
SELECT setval(pg_get_serial_sequence('product_variants', 'id'), (SELECT MAX(id) FROM product_variants));
SELECT setval(pg_get_serial_sequence('product_attributes', 'id'), (SELECT MAX(id) FROM product_attributes));
SELECT setval(pg_get_serial_sequence('flash_sales', 'id'), (SELECT MAX(id) FROM flash_sales));
SELECT setval(pg_get_serial_sequence('carts', 'id'), (SELECT MAX(id) FROM carts));
SELECT setval(pg_get_serial_sequence('cart_items', 'id'), (SELECT MAX(id) FROM cart_items));
SELECT setval(pg_get_serial_sequence('orders', 'id'), 1, FALSE);
SELECT setval(pg_get_serial_sequence('order_items', 'id'), 1, FALSE);
SELECT setval(pg_get_serial_sequence('reviews', 'id'), 1, FALSE);
SELECT setval(pg_get_serial_sequence('addresses', 'id'), (SELECT MAX(id) FROM addresses));
SELECT setval(pg_get_serial_sequence('vouchers', 'id'), (SELECT MAX(id) FROM vouchers));
SELECT setval(pg_get_serial_sequence('notifications', 'id'), (SELECT MAX(id) FROM notifications));
SELECT setval(pg_get_serial_sequence('wishlists', 'id'), (SELECT MAX(id) FROM wishlists));
SELECT setval(pg_get_serial_sequence('chat_sessions', 'id'), (SELECT MAX(id) FROM chat_sessions));
SELECT setval(pg_get_serial_sequence('shipping_providers', 'id'), (SELECT MAX(id) FROM shipping_providers));

COMMIT;
