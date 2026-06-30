export const metadata = {
  title: "About",
  description: "A quiet shopfront for considered pieces. Crafted in small runs, seen best after dark.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 md:px-10">
      <p className="text-xs uppercase tracking-[0.15em] text-gold">The atelier</p>
      <h1 className="mt-3 font-display text-5xl font-semibold leading-tight tracking-tight text-bone">
        Seen best after dark.
      </h1>

      <div className="mt-12 space-y-8 font-body text-sm leading-relaxed text-bone-muted">
        <p>
          Luxe Atelier began as a single room and a belief that clothing made carefully
          and in small quantities outlasts anything made quickly and in thousands.
          Each piece passes through fewer hands than most — the pattern cutter, the
          machinist, the finisher — and is better for it.
        </p>
        <p>
          The collections are built around four lines: outerwear for the long walk
          home, eveningwear that catches light rather than commands attention,
          accessories finished in brass and kid leather, and an archive of cuts
          that proved too good to retire permanently. None of them are seasonal in
          the conventional sense. We release when the work is ready.
        </p>
        <p>
          Stock is limited by design. When a run is gone, it is gone. We do not
          restock to meet demand — we revisit a cut when the time is right, and
          call it something new.
        </p>
      </div>

      <div className="mt-16 border-t border-gold/20 pt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
        {[
          { label: "Founded", value: "2019" },
          { label: "Run size", value: "12 – 40 pieces" },
          { label: "Based in", value: "London" },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-xs uppercase tracking-[0.15em] text-gold">{item.label}</p>
            <p className="mt-2 font-display text-2xl text-bone">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 border border-gold/20 bg-panel p-8">
        <p className="text-xs uppercase tracking-[0.15em] text-gold">Contact</p>
        <p className="mt-3 font-body text-sm text-bone-muted">
          For press, wholesale, or bespoke enquiries — write to us at{" "}
          <span className="text-bone">studio@luxeatelier.com</span>. We reply within
          three working days.
        </p>
      </div>
    </div>
  );
}
