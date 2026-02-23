import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const labData = [
  { month: "Jan", glucose: 95, cholesterol: 210, hba1c: 5.6 },
  { month: "Feb", glucose: 102, cholesterol: 205, hba1c: 5.7 },
  { month: "Mar", glucose: 98, cholesterol: 198, hba1c: 5.5 },
  { month: "Apr", glucose: 110, cholesterol: 195, hba1c: 5.8 },
  { month: "May", glucose: 105, cholesterol: 188, hba1c: 5.6 },
  { month: "Jun", glucose: 92, cholesterol: 182, hba1c: 5.4 },
  { month: "Jul", glucose: 88, cholesterol: 178, hba1c: 5.3 },
  { month: "Aug", glucose: 90, cholesterol: 175, hba1c: 5.2 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <p className="text-foreground font-medium mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

const LabTrendChart = () => {
  return (
    <motion.div
      className="glass-card p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
    >
      <h3 className="text-sm font-semibold text-foreground mb-4 glow-text">
        Lab Value Trends
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={labData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(220 25% 20% / 0.5)"
          />
          <XAxis
            dataKey="month"
            tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }}
            axisLine={{ stroke: "hsl(220 25% 20%)" }}
          />
          <YAxis
            tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }}
            axisLine={{ stroke: "hsl(220 25% 20%)" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="glucose"
            stroke="hsl(185 80% 55%)"
            strokeWidth={2}
            dot={{ fill: "hsl(185 80% 55%)", r: 3 }}
            activeDot={{ r: 5, fill: "hsl(185 80% 55%)" }}
            name="Glucose"
          />
          <Line
            type="monotone"
            dataKey="cholesterol"
            stroke="hsl(170 60% 45%)"
            strokeWidth={2}
            dot={{ fill: "hsl(170 60% 45%)", r: 3 }}
            activeDot={{ r: 5, fill: "hsl(170 60% 45%)" }}
            name="Cholesterol"
          />
          <Line
            type="monotone"
            dataKey="hba1c"
            stroke="hsl(200 70% 60%)"
            strokeWidth={2}
            dot={{ fill: "hsl(200 70% 60%)", r: 3 }}
            activeDot={{ r: 5, fill: "hsl(200 70% 60%)" }}
            name="HbA1c"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default LabTrendChart;
