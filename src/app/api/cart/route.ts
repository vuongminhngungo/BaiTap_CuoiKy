import { NextResponse } from "next/server";

import { useCartStore } from "@/store/useCartStore";

type AddItemPayload = Parameters<
  ReturnType<typeof useCartStore.getState>["addItem"]
>[0];

type CartActionBody = {
  action?: "add" | "remove" | "update" | "toggle" | "clear";
  variantId?: string;
  quantity?: number;
  item?: AddItemPayload;
};

export async function GET() {
  const state = useCartStore.getState();
  return NextResponse.json({
    data: {
      items: state.items,
      subtotal: state.subtotal(),
      voucherCode: state.voucherCode,
    },
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as CartActionBody;
  const cart = useCartStore.getState();

  switch (body.action) {
    case "add":
      if (body.item) cart.addItem(body.item, body.quantity ?? 1);
      break;
    case "remove":
      if (body.variantId) cart.removeItem(body.variantId);
      break;
    case "update":
      if (body.variantId && typeof body.quantity === "number")
        cart.updateQuantity(body.variantId, body.quantity);
      break;
    case "toggle":
      if (body.variantId) cart.toggleItem(body.variantId);
      break;
    case "clear":
      cart.clearCart();
      break;
  }

  const state = useCartStore.getState();
  return NextResponse.json({
    data: {
      items: state.items,
      subtotal: state.subtotal(),
      voucherCode: state.voucherCode,
    },
  });
}
