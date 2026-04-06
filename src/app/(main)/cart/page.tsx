"use client";

import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCartStore } from "@/store/useCartStore";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const toggleItem = useCartStore((state) => state.toggleItem);

  return (
    <main className="bg-bg">
      <div className="container-page py-6 md:py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="space-y-4">
            <div className="rounded-3xl bg-white p-5 shadow-shopee">
              <h1 className="text-2xl font-bold text-text-primary">Giỏ hàng</h1>
            </div>
            <div className="space-y-4">
              {items.length > 0 ? (
                items.map((item) => (
                  <CartItem
                    key={item.variant.id}
                    item={item}
                    onRemove={() => removeItem(item.variant.id)}
                    onQuantityChange={(qty) =>
                      updateQuantity(item.variant.id, qty)
                    }
                    onToggle={() => toggleItem(item.variant.id)}
                  />
                ))
              ) : (
                <div className="rounded-3xl bg-white p-8 text-center shadow-shopee">
                  <p className="text-sm text-text-secondary">
                    Giỏ hàng hiện chưa có sản phẩm.
                  </p>
                </div>
              )}
            </div>
          </section>
          <CartSummary subtotal={subtotal} />
        </div>
      </div>
    </main>
  );
}
