import { useMemo } from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { t } from "@/i18n/useTranslation";

const defaultLabData = [
  { month: "يناير", glucose: 95, cholesterol: 210, hba1c: 5.6 },
  { month: "فبراير", glucose: 102, cholesterol: 205, hba1c: 5.7 },
  { month: "مارس", glucose: 98, cholesterol: 198, hba1c: 5.5 },
  { month: "أبريل", glucose: 110, cholesterol: 195, hba1c: 5.8 },
  { month: "مايو", glucose: 105, cholesterol: 188, hba1c: 5.6 },
  { month: "يونيو", glucose: 92, cholesterol: 182, hba1c: 5.4 },
  { month: "يوليو", glucose: 88, cholesterol: 178, hba1c: 5.3 },
  { month: "أغسطس", glucose: 90, cholesterol: 175, hba1c: 5.2 },
];

interface ExtractedEntity {
  entity: string;
  type: string;
  value?: string;
}

interface LabTrendChartProps {
  extractedEntities?: ExtractedEntity[] | null;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="warm-card px-3 py-2 text-xs shadow-md">
      <p className="text-foreground font-medium mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }}>{entry.name}: {entry.value}</p>
      ))}
    </div>
  );
};

const parseNumericValue = (val: string): number | null => {
  const match = val.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : null;
};

const LabTrendChart = ({ extractedEntities }: LabTrendChartProps) => {
  const entityData = useMemo(() => {
    if (!extractedEntities || extractedEntities.length === 0) return null;

    const measurements = extractedEntities
      .filter((e) => e.value)
      .map((e) => {
        const num = parseNumericValue(e.value!);
        return num !== null ? { name: e.entity, value: num, unit: e.value!.replace(/[\d.]+\s*/, "") } : null;
      })
      .filter(Boolean) as Array<{ name: string; value: number; unit: string }>;

    return measurements.length > 0 ? measurements : null;
  }, [extractedEntities]);

  if (entityData) {
    return (
      <motion.div className="warm-card p-5"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        key="entity-chart">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-serif font-semibold text-foreground">{t("extractedMeasurements")}</h3>
          <span className="text-[10px] text-accent font-medium px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">{t("liveData")}</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={entityData} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(37 15% 88%)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "hsl(220 15% 45%)", fontSize: 10 }} axisLine={{ stroke: "hsl(37 15% 85%)" }} />
            <YAxis type="category" dataKey="name" tick={{ fill: "hsl(220 15% 45%)", fontSize: 10 }} axisLine={{ stroke: "hsl(37 15% 85%)" }} width={100} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="hsl(38 85% 55%)" radius={[0, 4, 4, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {entityData.map((d, i) => (
            <span key={i} className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              {d.name}: <strong className="text-foreground">{d.value}</strong> {d.unit}
            </span>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="warm-card p-5"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.5 }}>
      <h3 className="text-sm font-serif font-semibold text-foreground mb-4">{t("labValueTrends")}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={defaultLabData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(37 15% 88%)" />
          <XAxis dataKey="month" tick={{ fill: "hsl(220 15% 45%)", fontSize: 11 }} axisLine={{ stroke: "hsl(37 15% 85%)" }} />
          <YAxis tick={{ fill: "hsl(220 15% 45%)", fontSize: 11 }} axisLine={{ stroke: "hsl(37 15% 85%)" }} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="glucose" stroke="hsl(38 85% 55%)" strokeWidth={2}
            dot={{ fill: "hsl(38 85% 55%)", r: 3 }} activeDot={{ r: 5, fill: "hsl(38 85% 55%)" }} name="جلوكوز" />
          <Line type="monotone" dataKey="cholesterol" stroke="hsl(170 55% 42%)" strokeWidth={2}
            dot={{ fill: "hsl(170 55% 42%)", r: 3 }} activeDot={{ r: 5, fill: "hsl(170 55% 42%)" }} name="كوليسترول" />
          <Line type="monotone" dataKey="hba1c" stroke="hsl(220 35% 22%)" strokeWidth={2}
            dot={{ fill: "hsl(220 35% 22%)", r: 3 }} activeDot={{ r: 5, fill: "hsl(220 35% 22%)" }} name="HbA1c" />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default LabTrendChart;
