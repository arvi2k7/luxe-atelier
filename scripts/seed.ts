import connectDB from "../src/lib/mongodb";
import Product from "../src/models/Product";

const products = [
  {
    name: "The Wintermere Coat",
    slug: "wintermere-coat",
    description:
      "A close-cut wool coat in deep charcoal, finished with horn buttons and a hand-stitched collar.",
    price: 1450,
    images: [],
    category: "Outerwear",
    sizes: ["S", "M", "L"],
    stock: 8,
    lowStockThreshold: 5,
    featured: true,
  },
  {
    name: "Obsidian Trench",
    slug: "obsidian-trench",
    description:
      "A long silhouette in waxed cotton, built for cold streets and longer evenings.",
    price: 1680,
    images: [],
    category: "Outerwear",
    sizes: ["S", "M", "L", "XL"],
    stock: 3,
    lowStockThreshold: 5,
    featured: false,
  },
  {
    name: "Noctis Gown",
    slug: "noctis-gown",
    description:
      "Floor-length silk in near-black green, cut to move with low light rather than against it.",
    price: 2200,
    images: [],
    category: "Evening",
    sizes: ["XS", "S", "M"],
    stock: 6,
    lowStockThreshold: 5,
    featured: true,
  },
  {
    name: "Velour Slip Dress",
    slug: "velour-slip-dress",
    description:
      "A bias-cut slip in crushed velour, finished with a hand-rolled hem.",
    price: 980,
    compareAtPrice: 1200,
    images: [],
    category: "Evening",
    sizes: ["XS", "S", "M", "L"],
    stock: 12,
    lowStockThreshold: 5,
    featured: false,
  },
  {
    name: "Gilt Cuff Bracelet",
    slug: "gilt-cuff-bracelet",
    description:
      "Brushed brass with a soft gold wash, sized to sit close to the wrist.",
    price: 420,
    images: [],
    category: "Accessories",
    sizes: ["One Size"],
    stock: 20,
    lowStockThreshold: 5,
    featured: false,
  },
  {
    name: "Glass Pendant Necklace",
    slug: "glass-pendant-necklace",
    description: "A single hand-blown glass pendant on a fine brass chain.",
    price: 310,
    compareAtPrice: 380,
    images: [],
    category: "Accessories",
    sizes: ["One Size"],
    stock: 2,
    lowStockThreshold: 5,
    featured: false,
  },
  {
    name: "1997 Reissue Blazer",
    slug: "1997-reissue-blazer",
    description:
      "A reissued cut from the archive, structured shoulder, satin lapel.",
    price: 1890,
    images: [],
    category: "Archive",
    sizes: ["M", "L"],
    stock: 4,
    lowStockThreshold: 5,
    featured: true,
  },
  {
    name: "Limited Edition Opera Gloves",
    slug: "limited-edition-opera-gloves",
    description: "Elbow-length kid leather, a small run rarely repeated.",
    price: 560,
    images: [],
    category: "Archive",
    sizes: ["S", "M"],
    stock: 9,
    lowStockThreshold: 5,
    featured: false,
  },
];

async function seed() {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
