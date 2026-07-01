export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 md:px-10">
      <p className="text-xs uppercase tracking-[0.15em] text-gold">Get in touch</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-bone">
        Contact
      </h1>

      <p className="mt-6 max-w-lg text-sm leading-relaxed text-bone-muted">
        We are a small team. We read every message and respond within three working
        days. For urgent order matters, include your order number in the subject line.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {[
          {
            label: "General & orders",
            email: "studio@luxeatelier.com",
            note: "Order queries, sizing, care instructions.",
          },
          {
            label: "Returns",
            email: "returns@luxeatelier.com",
            note: "Include your order number and reason for return.",
          },
          {
            label: "Press & wholesale",
            email: "press@luxeatelier.com",
            note: "Editorial requests, stockist enquiries, lookbook access.",
          },
          {
            label: "Bespoke",
            email: "bespoke@luxeatelier.com",
            note: "Commissions and alterations by appointment.",
          },
        ].map((item) => (
          <div key={item.label}
            className="border border-gold/20 bg-panel p-6">
            <p className="text-xs uppercase tracking-[0.12em] text-gold">{item.label}</p>
            <p className="mt-3 font-display text-lg text-bone">{item.email}</p>
            <p className="mt-2 text-xs leading-relaxed text-bone-muted">{item.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-gold/20 pt-10">
        <p className="text-xs uppercase tracking-[0.12em] text-gold">Studio</p>
        <p className="mt-3 text-sm leading-relaxed text-bone-muted">
          Luxe Atelier is based in London. The studio is not open to the public —
          we work by appointment only for bespoke clients. All other enquiries
          are handled by email.
        </p>
      </div>
    </div>
  );
}
