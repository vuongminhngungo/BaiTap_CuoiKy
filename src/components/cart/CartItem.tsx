import { Minus, Plus, Trash2 } from "lucide-react";

import { formatCurrencyVND } from "@/lib/utils";
import type { CartItem as CartStateItem } from "@/store/useCartStore";

export function CartItem({
  item,
  onRemove,
  onQuantityChange,
  onToggle,
}: {
  item: CartStateItem;
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
  onToggle: () => void;
}) {
  return (
    <div className="grid gap-4 rounded-2xl bg-white p-4 shadow-shopee md:grid-cols-[auto_1fr_auto] md:items-center">
      <input
        type="checkbox"
        checked={item.selected}
        onChange={onToggle}
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
      />
      <div className="flex gap-4">
        <img
          src={item.variant.thumbnail}
          alt={item.variant.name}
          className="h-24 w-24 rounded-2xl object-cover"
        />
        <div>
          <h3 className="text-sm font-medium text-text-primary">
            {item.variant.name}
          </h3>
          <p className="mt-1 text-xs text-text-secondary">{item.variant.sku}</p>
          <p className="mt-1 text-xs text-text-secondary">
            {Object.values(item.variant.attributes).join(" • ")}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => onQuantityChange(item.quantity - 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 hover:border-primary"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-8 text-center text-sm font-semibold">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(item.quantity + 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 hover:border-primary"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-3">
        <p className="text-base font-bold text-primary">
          {formatCurrencyVND(item.variant.price)}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1 text-sm text-red-600"
        >
          <Trash2 className="h-4 w-4" /> Xóa
        </button>
      </div>
    </div>
  );
}
