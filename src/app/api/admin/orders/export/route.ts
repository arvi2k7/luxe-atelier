import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import type { IOrder, IOrderItem } from "@/models/Order";

function escapeCSV(val: unknown): string {
  const str = String(val ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  await connectDB();

  const orders = await Order.find({}).sort({ createdAt: -1 }).lean();

  const headers = [
    "Order Number",
    "Date",
    "Status",
    "Customer Name",
    "Customer Email",
    "Items",
    "Subtotal",
    "Discount",
    "Coupon Code",
    "Total",
    "Shipping Address",
  ];

  const rows = orders.map((o: IOrder & { _id: string }) => {
    const items = o.items
      .map((i: IOrderItem) => `${i.name} (${i.size}) x${i.quantity}`)
      .join("; ");
    const addr = [
      o.shipping.fullName,
      o.shipping.addressLine1,
      o.shipping.addressLine2,
      o.shipping.city,
      o.shipping.state,
      o.shipping.postalCode,
      o.shipping.country,
    ]
      .filter(Boolean)
      .join(", ");

    return [
      escapeCSV(o.orderNumber),
      escapeCSV(new Date(o.createdAt).toISOString()),
      escapeCSV(o.status),
      escapeCSV(o.shipping.fullName),
      escapeCSV(o.shipping.email),
      escapeCSV(items),
      o.subtotal,
      o.discount ?? "",
      escapeCSV(o.couponCode ?? ""),
      o.total,
      escapeCSV(addr),
    ].join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="orders-export-${Date.now()}.csv"`,
    },
  });
}
