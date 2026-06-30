"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const STATUS_COLORS: Record<string, string> = {
  pending: "#B8A887",
  processing: "#60A5FA",
  shipped: "#A78BFA",
  delivered: "#4ADE80",
  cancelled: "#F87171",
};

type DataPoint = { _id: string; count: number };

export function OrdersByStatusChart() {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    fetch("/api/admin/charts/orders-by-status")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (data.length === 0) {
    return (
      <div className="border border-gold/20 bg-panel p-6">
        <p className="text-xs uppercase tracking-[0.12em] text-gold mb-4">Orders by Status</p>
        <p className="text-sm text-bone-muted">No data yet.</p>
      </div>
    );
  }

  return (
    <div className="border border-gold/20 bg-panel p-6">
      <p className="text-xs uppercase tracking-[0.12em] text-gold mb-4">Orders by Status</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid stroke="#B8A887" strokeOpacity={0.08} vertical={false} />
          <XAxis dataKey="_id" tick={{ fill: "#A39C8C", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#A39C8C", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#161D18", border: "1px solid rgba(184,168,135,0.3)", borderRadius: 0, color: "#ECE6D8" }}
          />
          <Bar dataKey="count" radius={[2, 2, 0, 0]}>
            {data.map((entry) => (
              <rect key={entry._id} fill={STATUS_COLORS[entry._id] ?? "#A39C8C"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
