"use client";

import { useMemo, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import type { ProductNode, VariantNode } from "@/lib/mock-data";
import { useCartStore } from "@/store/useCartStore";
import { useUiStore } from "@/store/useUiStore";

type ProductPurchaseActionsProps = {
  product: ProductNode;
  selectedVariant: VariantNode;
};

export function ProductPurchaseActions({
  product,
  selectedVariant,
}: ProductPurchaseActionsProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useUiStore((state) => state.showToast);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const cartVariant = useMemo(
    () => ({
      id: selectedVariant.id.toString(),
      productId: product.id.toString(),
      name: product.name,
      thumbnail: product.thumbnail,
      sku: selectedVariant.sku,
      price: selectedVariant.price,
      originalPrice: selectedVariant.originalPrice,
      stock: selectedVariant.stock,
      attributes: selectedVariant.attributes,
    }),
    [product.id, product.name, product.thumbnail, selectedVariant],
  );

  const handleAddToCart = () => {
    addItem(cartVariant, 1);
    showToast({
      title: "Đã thêm sản phẩm vào giỏ hàng",
      description: `${product.name} đã được lưu trong giỏ của bạn.`,
    });
  };

  const handleBuyNow = () => {
    setIsBuyingNow(true);
    addItem(cartVariant, 1);
    showToast({
      title: "Đang chuyển đến giỏ hàng",
      description: "Sản phẩm đã được thêm vào giỏ để bạn thanh toán ngay.",
    });
    router.push("/cart");
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        className="min-w-[180px] flex-1"
        onClick={handleAddToCart}
      >
        <ShoppingCart className="mr-2 h-4 w-4" /> Thêm vào giỏ
      </Button>
      <Button
        className="min-w-[180px] flex-1"
        onClick={handleBuyNow}
        disabled={isBuyingNow}
      >
        <Heart className="mr-2 h-4 w-4" /> Mua ngay
      </Button>
    </div>
  );
}
