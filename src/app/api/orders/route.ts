import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    data: [
      {
        id: "OD0001",
        status: "processing",
        total: 34990000,
        createdAt: new Date().toISOString(),
      },
    ],
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  return NextResponse.json(
    {
      message: "Order created successfully",
      data: {
        orderCode: `OD${Date.now()}`,
        payload: body,
      },
    },
    { status: 201 },
  );
}
