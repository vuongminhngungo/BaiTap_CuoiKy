"use client";

import { useState } from "react";

import { ProductPurchaseActions } from "@/components/product/ProductPurchaseActions";
import { VariantSelector } from "@/components/product/VariantSelector";
import type { ProductNode, VariantNode } from "@/lib/mock-data";

export function ProductDetailPurchasePanel({
  product,
}: {
  product: ProductNode;
}) {
  const [selectedVariant, setSelectedVariant] = useState<VariantNode>(
    product.variants[0],
  );

  return (
    <div className="space-y-4">
      <VariantSelector
        variants={product.variants}
        onChange={setSelectedVariant}
      />
      <ProductPurchaseActions
        product={product}
        selectedVariant={selectedVariant}
      />
    </div>
  );
}
