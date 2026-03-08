import { motion } from "framer-motion";
import { useApp } from "@/i18n/LanguageContext";

interface RiskMeterProps {
  value?: number;
  label?: string;
  animated?: boolean;
}

const RiskMeter = ({ value = 32, label, animated = false }: RiskMeterProps) => {
  const { t } = useApp();
  const displayLabel = label || t("overallRisk");
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (value / 100) * circumference * 0.75;
  const rotation = -225;

  const getColor = (v: number) => {
    if (v < 30) return "hsl(170 55% 42%)";
    if (v < 60) return "hsl(38 85% 55%)";
    return "hsl(0 72% 51%)";
  };

  const getRiskLabel = (v: number) => {
    if (v < 30) return t("low");
    if (v < 60) return t("moderate");
    return t("high");
  };

  return (
    <motion.div className="warm-card p-5 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: animated ? 0 : 1.4, duration: 0.5 }}>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-serif font-semibold text-foreground">{displayLabel}</h3>
        {animated && (
          <span className="text-[10px] text-accent font-medium px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">{t("live")}</span>
        )}
      </div>
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(37 15% 88%)" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`} transform={`rotate(${rotation} 60 60)`} />
          <motion.circle cx="60" cy="60" r="54" fill="none" stroke={getColor(value)} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ delay: animated ? 0.2 : 1.6, duration: 1.2, ease: "easeOut" }}
            transform={`rotate(${rotation} 60 60)`}
            key={value} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span className="text-2xl font-bold text-foreground font-sans"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: animated ? 0.3 : 2 }}
            key={value}>
            {value}%
          </motion.span>
          <span className="text-xs font-medium mt-0.5 font-sans" style={{ color: getColor(value) }}>{getRiskLabel(value)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default RiskMeter;
