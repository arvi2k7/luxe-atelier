"use client";

interface AbandonedCartData {
  _id: string;
  recoveryToken?: string;
  email?: string;
  userId?: string;
  items: Array<{ name?: string; quantity?: number; price?: number }>;
  lastActive: string;
  recoveryEmailSentAt?: string;
  secondEmailSentAt?: string;
  recoveredAt?: string;
}

export function AdminAbandonedCartsTable({ carts }: { carts: AbandonedCartData[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gold/20 text-xs uppercase tracking-[0.1em] text-gold">
            <th className="pb-3 pr-4">Email</th>
            <th className="pb-3 pr-4">Items</th>
            <th className="pb-3 pr-4">Subtotal</th>
            <th className="pb-3 pr-4">Last Active</th>
            <th className="pb-3 pr-4">Recovery</th>
            <th className="pb-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {carts.length === 0 ? (
            <tr>
              <td colSpan={6} className="pt-8 text-center text-sm text-bone-muted">No abandoned carts yet.</td>
            </tr>
          ) : (
            carts.map((cart) => {
              const subtotal = (cart.items || []).reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
              const itemCount = (cart.items || []).reduce((s, i) => s + (i.quantity || 1), 0);
              const emailed = !!cart.recoveryEmailSentAt;
              const recovered = !!cart.recoveredAt;
              return (
                <tr key={cart._id} className="border-b border-gold/10 text-bone-muted">
                  <td className="py-3 pr-4">{cart.email || "—"}</td>
                  <td className="py-3 pr-4 font-mono text-xs">{itemCount}</td>
                  <td className="py-3 pr-4 font-mono">${subtotal.toFixed(2)}</td>
                  <td className="py-3 pr-4 text-xs">{new Date(cart.lastActive).toLocaleDateString()}</td>
                  <td className="py-3 pr-4 text-xs">
                    {recovered ? "Recovered" : emailed ? "Email sent" : "—"}
                  </td>
                  <td className="py-3">
                    <span className={`text-xs uppercase tracking-[0.1em] ${recovered ? "text-green-400" : emailed ? "text-gold-bright" : "text-bone-muted"}`}>
                      {recovered ? "done" : emailed ? "contacted" : "new"}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
