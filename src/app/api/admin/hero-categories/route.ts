import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import HeroCategory from "@/models/HeroCategory";

const DEFAULTS = [
  { key: "outerwear", label: "Outerwear", sub: "Tailored coats, cut close", href: "/shop?category=Outerwear", sortOrder: 0 },
  { key: "evening", label: "Evening", sub: "Pieces for low light", href: "/shop?category=Evening", sortOrder: 1 },
  { key: "accessories", label: "Accessories", sub: "Gold, leather, glass", href: "/shop?category=Accessories", sortOrder: 2 },
  { key: "archive", label: "Archive", sub: "Limited, rarely repeated", href: "/shop?category=Archive", sortOrder: 3 },
];

async function seedDefaults() {
  const count = await HeroCategory.countDocuments();
  if (count === 0) {
    await HeroCategory.insertMany(DEFAULTS);
  }
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  await seedDefaults();

  const categories = await HeroCategory.find({}).sort({ sortOrder: 1 }).lean();
  return NextResponse.json(categories);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as Array<{
    key: string;
    label: string;
    sub: string;
    href: string;
    image?: string;
  }>;

  await connectDB();

  const ops = body.map((item) => ({
    updateOne: {
      filter: { key: item.key },
      update: { $set: { label: item.label, sub: item.sub, href: item.href, image: item.image || "" } },
      upsert: true,
    },
  }));

  await HeroCategory.bulkWrite(ops);

  const categories = await HeroCategory.find({}).sort({ sortOrder: 1 }).lean();
  return NextResponse.json(categories);
}
