import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, FlaskConical, ScanLine, Brain, Database, ShieldAlert, Sparkles, Clock,
  type LucideIcon, X,
} from "lucide-react";
import { t } from "@/i18n/useTranslation";

const iconMap: Record<string, LucideIcon> = {
  "Visit Transcript": FileText, "Lab Results": FlaskConical, "Radiology Reports": ScanLine,
  "AI Extraction Engine": Brain, "Structured Health Data": Database, "Risk Analysis Module": ShieldAlert,
  "Personalized Guidance Engine": Sparkles, "Health Timeline": Clock,
};

interface HealthNodeProps { nodeKey: string; label: string; index: number; isActive?: boolean; }

const HealthNode = ({ nodeKey, label, index, isActive = false }: HealthNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const Icon = iconMap[nodeKey] || Brain;
  const shortDesc = t(`${nodeKey}_short`);
  const detailDesc = t(`${nodeKey}_detail`);

  return (
    <>
      <motion.div
        className="relative flex flex-col items-center gap-2 cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.12, duration: 0.5, ease: "easeOut" }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setIsExpanded(true)}
      >
        <motion.div
          className={`warm-card-hover p-4 sm:p-5 flex flex-col items-center gap-3 w-28 sm:w-32 relative z-10 transition-all ${
            isActive ? "border-accent shadow-md" : ""
          }`}
          animate={{ y: isHovered ? -4 : 0, scale: isActive ? [1, 1.03, 1] : 1 }}
          transition={{ scale: isActive ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 } }}
        >
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border transition-colors ${
            isActive ? "bg-accent/15 border-accent/40" : "bg-accent/8 border-accent/15"
          }`}>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? "text-accent" : "text-foreground/60"}`} />
          </div>
          <span className="text-xs sm:text-sm text-foreground font-medium text-center leading-tight font-sans">{label}</span>
        </motion.div>

        <AnimatePresence>
          {isHovered && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
              className="absolute -bottom-10 warm-card px-3 py-1.5 text-xs text-muted-foreground whitespace-nowrap z-20 shadow-sm">
              {shortDesc}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setIsExpanded(false)} />
            <motion.div className="warm-card p-6 sm:p-8 max-w-md w-full relative z-10 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <button onClick={() => setIsExpanded(false)} className="absolute top-4 left-4 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
                  <Icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-foreground">{label}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{detailDesc}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HealthNode;
