"use client";

import { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

type DataPoint = { _id: string; revenue: number };

export function RevenueChart() {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    fetch("/api/admin/charts/revenue")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (data.length === 0) {
    return (
      <div className="border border-gold/20 bg-panel p-6">
        <p className="text-xs uppercase tracking-[0.12em] text-gold mb-4">Revenue (6 months)</p>
        <p className="text-sm text-bone-muted">No data yet.</p>
      </div>
    );
  }

  return (
    <div className="border border-gold/20 bg-panel p-6">
      <p className="text-xs uppercase tracking-[0.12em] text-gold mb-4">Revenue (6 months)</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4C28F" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#D4C28F" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#B8A887" strokeOpacity={0.08} vertical={false} />
          <XAxis dataKey="_id" tick={{ fill: "#A39C8C", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#A39C8C", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#161D18", border: "1px solid rgba(184,168,135,0.3)", borderRadius: 0, color: "#ECE6D8" }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#D4C28F" fill="url(#revGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
