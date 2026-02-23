import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  FlaskConical,
  ScanLine,
  Brain,
  Database,
  ShieldAlert,
  Sparkles,
  Clock,
  type LucideIcon,
  X,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "Visit Transcript": FileText,
  "Lab Results": FlaskConical,
  "Radiology Reports": ScanLine,
  "AI Extraction Engine": Brain,
  "Structured Health Data": Database,
  "Risk Analysis Module": ShieldAlert,
  "Personalized Guidance Engine": Sparkles,
  "Health Timeline": Clock,
};

const descriptions: Record<string, { short: string; detail: string }> = {
  "Visit Transcript": {
    short: "Clinical notes from doctor visits",
    detail:
      "Raw transcripts from patient-provider conversations are parsed using NLP to extract diagnoses, prescriptions, follow-ups, and patient concerns.",
  },
  "Lab Results": {
    short: "Blood work and lab panel data",
    detail:
      "CBC, metabolic panels, lipid profiles, A1C, and specialized tests are ingested and normalized into structured data with reference ranges.",
  },
  "Radiology Reports": {
    short: "Imaging and scan findings",
    detail:
      "X-ray, MRI, CT, and ultrasound reports are analyzed for key findings, measurements, and follow-up recommendations.",
  },
  "AI Extraction Engine": {
    short: "Intelligent data parsing pipeline",
    detail:
      "Multi-modal AI models process unstructured medical documents, extracting entities, relationships, and temporal patterns with 98.5% accuracy.",
  },
  "Structured Health Data": {
    short: "Normalized patient health records",
    detail:
      "All extracted data is mapped to standardized medical ontologies (SNOMED, ICD-10, LOINC) for interoperability and analysis.",
  },
  "Risk Analysis Module": {
    short: "Predictive health risk scoring",
    detail:
      "Machine learning models analyze longitudinal data to calculate risk scores for cardiovascular, metabolic, oncological, and other health domains.",
  },
  "Personalized Guidance Engine": {
    short: "AI-powered health recommendations",
    detail:
      "Context-aware algorithms generate personalized lifestyle, dietary, and preventive care recommendations based on individual risk profiles.",
  },
  "Health Timeline": {
    short: "Longitudinal health journey map",
    detail:
      "An interactive chronological view of all health events, trends, and milestones enabling patients and providers to track progress over time.",
  },
};

interface HealthNodeProps {
  label: string;
  index: number;
  isActive?: boolean;
}

const HealthNode = ({ label, index, isActive = false }: HealthNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const Icon = iconMap[label] || Brain;
  const info = descriptions[label];

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
          className={`glass-card-hover p-4 sm:p-5 flex flex-col items-center gap-3 w-28 sm:w-32 relative z-10 transition-colors ${
            isActive ? "border-primary/50" : ""
          }`}
          animate={{
            y: isHovered ? -4 : 0,
            scale: isActive ? [1, 1.04, 1] : 1,
            boxShadow: isActive
              ? "0 0 50px hsl(185 80% 55% / 0.35), 0 0 100px hsl(185 80% 55% / 0.12)"
              : isHovered
              ? "0 0 40px hsl(185 80% 55% / 0.25), 0 0 80px hsl(185 80% 55% / 0.08)"
              : "0 0 20px hsl(185 80% 55% / 0.08)",
          }}
          transition={{
            scale: isActive ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 },
          }}
          style={{ animation: isActive ? undefined : `float ${4 + index * 0.3}s ease-in-out infinite` }}
        >
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center border transition-colors ${
            isActive ? "bg-primary/20 border-primary/40" : "bg-primary/10 border-primary/20"
          }`}>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 text-primary ${isActive ? "animate-pulse" : ""}`} />
          </div>
          <span className="text-xs sm:text-sm text-foreground font-medium text-center leading-tight">
            {label}
          </span>
        </motion.div>

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute -bottom-12 glass-card px-3 py-1.5 text-xs text-muted-foreground whitespace-nowrap z-20"
            >
              {info?.short}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Expanded detail panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
              onClick={() => setIsExpanded(false)}
            />
            <motion.div
              className="glass-card p-6 sm:p-8 max-w-md w-full relative z-10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                boxShadow:
                  "0 0 60px hsl(185 80% 55% / 0.15), 0 0 120px hsl(185 80% 55% / 0.05)",
              }}
            >
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground glow-text">
                  {label}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {info?.detail}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HealthNode;
