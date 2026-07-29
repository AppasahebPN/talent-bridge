import { useEffect, useState, type ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function ClientChart({ height = 280, children }: { height?: number; children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div style={{ height }} className="animate-pulse rounded-lg bg-muted/60" />;
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children as never}
      </ResponsiveContainer>
    </div>
  );
}

const axisProps = {
  tick: { fill: "var(--muted-foreground)", fontSize: 12 },
  axisLine: { stroke: "var(--border)" },
  tickLine: false,
} as const;

const tooltipStyle = {
  contentStyle: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    fontSize: "12px",
    color: "var(--foreground)",
    boxShadow: "var(--shadow-card)",
  },
} as const;

export function BarChartCard({
  data,
  xKey,
  bars,
  height = 280,
  colorful,
}: {
  data: Record<string, string | number>[];
  xKey: string;
  bars: { key: string; name: string; color: string }[];
  height?: number;
  colorful?: string[];
}) {
  return (
    <ClientChart height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis dataKey={xKey} {...axisProps} interval={0} angle={data.length > 5 ? -18 : 0} height={data.length > 5 ? 52 : 30} textAnchor={data.length > 5 ? "end" : "middle"} />
        <YAxis {...axisProps} />
        <Tooltip cursor={{ fill: "var(--muted)" }} {...tooltipStyle} />
        {bars.length > 1 ? <Legend wrapperStyle={{ fontSize: 12 }} /> : null}
        {bars.map((b) => (
          <Bar key={b.key} dataKey={b.key} name={b.name} fill={b.color} radius={[6, 6, 0, 0]} maxBarSize={46}>
            {colorful ? data.map((_, i) => <Cell key={i} fill={colorful[i % colorful.length]} />) : null}
          </Bar>
        ))}
      </BarChart>
    </ClientChart>
  );
}

export function LineChartCard({
  data,
  xKey,
  lines,
  height = 280,
}: {
  data: Record<string, string | number>[];
  xKey: string;
  lines: { key: string; name: string; color: string }[];
  height?: number;
}) {
  return (
    <ClientChart height={height}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip {...tooltipStyle} />
        {lines.length > 1 ? <Legend wrapperStyle={{ fontSize: 12 }} /> : null}
        {lines.map((l) => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            name={l.name}
            stroke={l.color}
            strokeWidth={2.5}
            dot={{ r: 3, strokeWidth: 2 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ClientChart>
  );
}

export function RadarChartCard({
  data,
  series,
  height = 320,
}: {
  data: { subject: string; [k: string]: string | number }[];
  series: { key: string; name: string; color: string }[];
  height?: number;
}) {
  return (
    <ClientChart height={height}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} stroke="var(--border)" />
        {series.map((s) => (
          <Radar key={s.key} name={s.name} dataKey={s.key} stroke={s.color} fill={s.color} fillOpacity={0.22} strokeWidth={2} />
        ))}
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Tooltip {...tooltipStyle} />
      </RadarChart>
    </ClientChart>
  );
}

export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];
