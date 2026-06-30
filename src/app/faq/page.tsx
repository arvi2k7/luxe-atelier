const FAQS = [
  {
    q: "How do I know which size to order?",
    a: "Each product page lists available sizes. Our pieces run true to a standard European cut — if you are between sizes, we recommend sizing up for outerwear and true-to-size for eveningwear. If you are unsure, write to us before ordering.",
  },
  {
    q: "Can I change or cancel my order?",
    a: "Orders can be amended or cancelled within one hour of placement by writing to studio@luxeatelier.com with your order number. After dispatch, we are unable to make changes — you will need to follow the returns process.",
  },
  {
    q: "Do you restock sold-out pieces?",
    a: "Rarely, and never on a fixed schedule. Some cuts are revisited in a later run under a new name. If a piece matters to you, the safest approach is to buy it when it is available. We do not operate a waitlist.",
  },
  {
    q: "Are the colours accurate in the photographs?",
    a: "We shoot in controlled light and calibrate to sRGB. Screens vary, so there may be a slight difference between what you see and what arrives — particularly with deep greens and near-blacks, which are difficult to reproduce on most displays.",
  },
  {
    q: "How should I care for my pieces?",
    a: "Care instructions are attached to every garment. As a general rule: dry clean outerwear, hand-wash or cold-machine-wash eveningwear on a delicate cycle, and store knitwear folded rather than hung. Leather accessories should be kept away from direct sunlight and treated periodically with a suitable conditioner.",
  },
  {
    q: "Do you offer gift wrapping?",
    a: "All orders are packed in our standard black tissue and ribbon regardless — there is no separate gift-wrap option because we do not believe in a lesser standard for non-gift orders.",
  },
  {
    q: "Is my payment information secure?",
    a: "Checkout is handled over HTTPS. We do not store card details. All payment processing is handled by a PCI-DSS-compliant provider.",
  },
  {
    q: "I have a question not answered here.",
    a: "Write to studio@luxeatelier.com. We aim to reply within three working days.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 md:px-10">
      <p className="text-xs uppercase tracking-[0.15em] text-gold">Customer care</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-bone">
        Frequently asked questions
      </h1>

      <div className="mt-12 divide-y divide-gold/10">
        {FAQS.map((item) => (
          <div key={item.q} className="py-7">
            <p className="font-display text-lg font-semibold text-bone">{item.q}</p>
            <p className="mt-3 text-sm leading-relaxed text-bone-muted">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
