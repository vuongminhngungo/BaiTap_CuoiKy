"use client";

import { useState } from "react";

import type { VariantNode } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function VariantSelector({
  variants,
  onChange,
}: {
  variants: VariantNode[];
  onChange?: (variant: VariantNode) => void;
}) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id);
  const selected =
    variants.find((variant) => variant.id === selectedId) ?? variants[0];

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-semibold text-text-primary">Biến thể</p>
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => (
            <button
              key={variant.id}
              type="button"
              disabled={variant.stock === 0}
              onClick={() => {
                setSelectedId(variant.id);
                onChange?.(variant);
              }}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                selected?.id === variant.id
                  ? "border-primary bg-primary text-white"
                  : "border-black/10 bg-white text-text-primary hover:border-primary/40",
                variant.stock === 0 && "cursor-not-allowed opacity-40",
              )}
            >
              {Object.values(variant.attributes).join(" • ")}
            </button>
          ))}
        </div>
      </div>
      {selected && (
        <p className="text-sm text-text-secondary">
          SKU: {selected.sku} · Còn {selected.stock} sản phẩm
        </p>
      )}
    </div>
  );
}
