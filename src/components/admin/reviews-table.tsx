"use client";

import { useState } from "react";

interface ReviewData {
  _id: string;
  userId?: { name?: string; email?: string };
  productId?: { name?: string };
  rating: number;
  title?: string;
  body?: string;
  status: string;
  createdAt: string;
}

export function AdminReviewsTable({ reviews }: { reviews: ReviewData[] }) {
  const [list, setList] = useState(reviews);

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setList((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
      }
    } catch {
      //
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gold/20 text-xs uppercase tracking-[0.1em] text-gold">
            <th className="pb-3 pr-4">Product</th>
            <th className="pb-3 pr-4">User</th>
            <th className="pb-3 pr-4">Rating</th>
            <th className="pb-3 pr-4">Review</th>
            <th className="pb-3 pr-4">Status</th>
            <th className="pb-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan={6} className="pt-8 text-center text-sm text-bone-muted">No reviews yet.</td>
            </tr>
          ) : (
            list.map((review) => (
              <tr key={review._id} className="border-b border-gold/10 text-bone-muted">
                <td className="py-3 pr-4 text-xs">{review.productId?.name || "—"}</td>
                <td className="py-3 pr-4 text-xs">{review.userId?.name || review.userId?.email || "—"}</td>
                <td className="py-3 pr-4">{Array.from({ length: review.rating }).map((_, i) => <span key={i} className="text-gold text-xs">★</span>)}</td>
                <td className="py-3 pr-4">
                  <p className="text-xs">{review.title || "—"}</p>
                  {review.body && <p className="text-xs text-bone-muted/60 mt-1 line-clamp-2">{review.body}</p>}
                </td>
                <td className="py-3 pr-4">
                  <span className={`text-xs uppercase tracking-[0.1em] ${review.status === "approved" ? "text-green-400" : review.status === "rejected" ? "text-red-400" : "text-gold-bright"}`}>
                    {review.status}
                  </span>
                </td>
                <td className="py-3 flex gap-2">
                  {review.status === "pending" && (
                    <>
                      <button onClick={() => updateStatus(review._id, "approved")} className="text-xs text-green-400 hover:underline">Approve</button>
                      <button onClick={() => updateStatus(review._id, "rejected")} className="text-xs text-red-400 hover:underline">Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
