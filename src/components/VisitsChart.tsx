"use client";

import { useEffect, useState } from "react";
import {
  startOfWeek,
  endOfWeek,
  format,
  addDays,
  isWithinInterval,
} from "date-fns";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export interface VisitsChartProps {
  confirmedVisits: Date[];
}

export default function VisitsChart({ confirmedVisits }: VisitsChartProps) {
  const [data, setData] = useState<{ date: string; visits: number }[]>([]);
  const [yKey, setYKey] = useState(0);

  useEffect(() => {
    const today = new Date();
    const sixMonthsAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 6,
      today.getDate()
    );

    const weeklyCounts: Record<string, number> = {};
    let cursor = sixMonthsAgo;

    while (cursor <= today) {
      const weekStart = startOfWeek(cursor);
      const weekEnd = endOfWeek(cursor);
      const key = format(weekStart, "yyyy-MM-dd");

      weeklyCounts[key] = confirmedVisits.filter((d) =>
        isWithinInterval(d, { start: weekStart, end: weekEnd })
      ).length;

      cursor = addDays(cursor, 7);
    }

    setData(
      Object.entries(weeklyCounts).map(([week, visits]) => ({
        date: week,
        visits,
      }))
    );
    setYKey((k) => k + 1);
  }, [confirmedVisits]);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis key={yKey} />
          <Tooltip />
          <Bar dataKey="visits" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
