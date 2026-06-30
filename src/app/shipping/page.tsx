export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 md:px-10">
      <p className="text-xs uppercase tracking-[0.15em] text-gold">Customer care</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-bone">
        Shipping & Returns
      </h1>

      <div className="mt-12 space-y-12">
        <section>
          <h2 className="font-display text-xl font-semibold text-bone">Shipping</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-bone-muted">
            <p>
              All orders are dispatched within two working days of placement.
              Shipping times below are estimates from dispatch — not from order date.
            </p>
            <div className="border border-gold/20 bg-panel divide-y divide-gold/10">
              {[
                { region: "United Kingdom", standard: "2 – 3 days", express: "Next day" },
                { region: "Europe", standard: "4 – 6 days", express: "2 – 3 days" },
                { region: "United States & Canada", standard: "7 – 10 days", express: "3 – 5 days" },
                { region: "Rest of world", standard: "10 – 14 days", express: "5 – 7 days" },
              ].map((row) => (
                <div key={row.region} className="grid grid-cols-3 gap-4 px-5 py-4 text-xs">
                  <span className="text-bone">{row.region}</span>
                  <span>Standard: {row.standard}</span>
                  <span>Express: {row.express}</span>
                </div>
              ))}
            </div>
            <p>
              All international orders may be subject to import duties and taxes
              levied by the destination country. These are the responsibility of
              the recipient.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-bone">Returns</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-bone-muted">
            <p>
              We accept returns within 14 days of delivery for unworn, unaltered items
              in their original condition with all tags attached.
            </p>
            <p>
              To initiate a return, write to{" "}
              <span className="text-bone">returns@luxeatelier.com</span> with your
              order number. We will respond within two working days with return
              instructions. Return postage is at the customer&rsquo;s expense unless the
              item is faulty.
            </p>
            <p>
              Archive pieces and items marked final sale are not eligible for return.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-bone">Faulty items</h2>
          <p className="mt-4 text-sm leading-relaxed text-bone-muted">
            If your item arrives damaged or with a manufacturing fault, contact us
            within 7 days of delivery at{" "}
            <span className="text-bone">studio@luxeatelier.com</span>. Include your
            order number and photographs of the fault. We will arrange a replacement
            or full refund, including return postage.
          </p>
        </section>
      </div>
    </div>
  );
}
