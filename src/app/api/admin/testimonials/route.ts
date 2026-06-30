import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

const DEFAULTS = [
  { name: "E.M.", location: "London", text: "The Wintermere coat arrived impeccably packaged. The weight of it — you know immediately it's made properly.", rating: 5, sortOrder: 0 },
  { name: "J.K.", location: "Paris", text: "I've had the Noctis Gown for a year and it still looks like new. The cut is extraordinary.", rating: 5, sortOrder: 1 },
  { name: "A.R.", location: "New York", text: "Customer service was exceptional when I needed to exchange a size. Responded same day.", rating: 5, sortOrder: 2 },
];

async function seedDefaults() {
  const count = await Testimonial.countDocuments();
  if (count === 0) {
    await Testimonial.insertMany(DEFAULTS);
  }
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  await seedDefaults();

  const testimonials = await Testimonial.find({}).sort({ sortOrder: 1 }).lean();
  return NextResponse.json(testimonials);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as Array<{
    _id?: string;
    name: string;
    location: string;
    text: string;
    rating: number;
  }>;

  await connectDB();

  const ids: string[] = [];
  const ops = body.map((item, i) => {
    const update = { $set: { name: item.name, location: item.location, text: item.text, rating: item.rating, sortOrder: i } };
    if (item._id) {
      ids.push(item._id);
      return { updateOne: { filter: { _id: item._id }, update } };
    }
    return { insertOne: { document: { ...item, sortOrder: i } } };
  });

  await Testimonial.bulkWrite(ops);

  if (ids.length > 0) {
    await Testimonial.deleteMany({ _id: { $nin: ids } });
  }

  const testimonials = await Testimonial.find({}).sort({ sortOrder: 1 }).lean();
  return NextResponse.json(testimonials);
}
