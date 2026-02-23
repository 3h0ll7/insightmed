import { motion } from "framer-motion";

interface RiskMeterProps {
  value?: number; // 0-100
  label?: string;
}

const RiskMeter = ({ value = 32, label = "Overall Risk" }: RiskMeterProps) => {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (value / 100) * circumference * 0.75; // 270deg arc
  const rotation = -225; // start at bottom-left

  const getColor = (v: number) => {
    if (v < 30) return "hsl(170 60% 45%)";
    if (v < 60) return "hsl(45 80% 55%)";
    return "hsl(0 70% 55%)";
  };

  const getRiskLabel = (v: number) => {
    if (v < 30) return "Low";
    if (v < 60) return "Moderate";
    return "High";
  };

  return (
    <motion.div
      className="glass-card p-5 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.5 }}
    >
      <h3 className="text-sm font-semibold text-foreground mb-4 glow-text">
        {label}
      </h3>
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full">
          {/* Background arc */}
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="hsl(220 25% 20%)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            transform={`rotate(${rotation} 60 60)`}
          />
          {/* Value arc */}
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={getColor(value)}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ delay: 1.6, duration: 1.2, ease: "easeOut" }}
            transform={`rotate(${rotation} 60 60)`}
            style={{
              filter: `drop-shadow(0 0 8px ${getColor(value)})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-2xl font-bold text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            {value}%
          </motion.span>
          <span
            className="text-xs font-medium mt-0.5"
            style={{ color: getColor(value) }}
          >
            {getRiskLabel(value)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default RiskMeter;
