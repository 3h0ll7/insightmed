import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, Shield, Pill, Stethoscope, Activity, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface KeyFinding {
  finding: string;
  significance: "normal" | "attention" | "critical";
  explanation: string;
}

interface RiskFactor {
  factor: string;
  level: "low" | "moderate" | "high";
}

interface MedicalEntity {
  entity: string;
  type: "condition" | "medication" | "procedure" | "measurement" | "anatomy";
  value?: string;
}

interface AnalysisResult {
  summary: string;
  key_findings: KeyFinding[];
  risk_factors: RiskFactor[];
  recommendations: string[];
  medical_entities: MedicalEntity[];
}

interface AnalysisResultsProps {
  result: AnalysisResult;
  documentType: string;
  onReset: () => void;
}

const significanceConfig = {
  normal: { color: "text-glow-teal", bg: "bg-glow-teal/10", border: "border-glow-teal/20", icon: CheckCircle2 },
  attention: { color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", icon: Info },
  critical: { color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", icon: AlertTriangle },
};

const riskConfig = {
  low: { color: "text-glow-teal", bg: "bg-glow-teal/15" },
  moderate: { color: "text-yellow-400", bg: "bg-yellow-400/15" },
  high: { color: "text-destructive", bg: "bg-destructive/15" },
};

const entityIcons: Record<string, typeof Pill> = {
  condition: Activity,
  medication: Pill,
  procedure: Stethoscope,
  measurement: Activity,
  anatomy: Stethoscope,
};

const AnalysisResults = ({ result, documentType, onReset }: AnalysisResultsProps) => {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Summary Card */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-glow-cyan" />
            <h3 className="text-sm font-semibold text-foreground glow-text">Analysis Complete</h3>
            <Badge className="bg-glow-cyan/20 text-glow-cyan border-glow-cyan/30 text-[10px]">{documentType}</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground hover:text-foreground gap-1">
            <ArrowLeft className="w-3 h-3" /> New
          </Button>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{result.summary}</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Key Findings */}
        <div className="glass-card p-5">
          <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-glow-cyan" /> Key Findings
          </h4>
          <div className="space-y-2">
            {result.key_findings.map((f, i) => {
              const cfg = significanceConfig[f.significance];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={i}
                  className={`p-2.5 rounded-lg ${cfg.bg} border ${cfg.border}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-start gap-2">
                    <Icon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${cfg.color}`} />
                    <div>
                      <p className="text-xs font-medium text-foreground">{f.finding}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{f.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Risk Factors */}
        <div className="glass-card p-5">
          <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-glow-cyan" /> Risk Factors
          </h4>
          <div className="space-y-2">
            {result.risk_factors.map((r, i) => {
              const cfg = riskConfig[r.level];
              return (
                <motion.div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="text-xs text-foreground">{r.factor}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} font-medium`}>
                    {r.level}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="glass-card p-5">
          <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-glow-cyan" /> Recommendations
          </h4>
          <ul className="space-y-1.5">
            {result.recommendations.map((rec, i) => (
              <motion.li
                key={i}
                className="text-xs text-muted-foreground flex items-start gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.08 }}
              >
                <span className="text-glow-cyan mt-1 text-[8px]">●</span>
                {rec}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Medical Entities */}
        <div className="glass-card p-5">
          <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-glow-cyan" /> Detected Entities
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {result.medical_entities.map((e, i) => {
              const Icon = entityIcons[e.type] || Activity;
              return (
                <motion.div
                  key={i}
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/40 border border-[hsl(var(--glow-cyan)/0.1)] text-[10px]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Icon className="w-2.5 h-2.5 text-glow-cyan" />
                  <span className="text-foreground">{e.entity}</span>
                  {e.value && <span className="text-muted-foreground">({e.value})</span>}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="glass-card p-4 border-yellow-400/20">
        <p className="text-[10px] text-muted-foreground flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong className="text-yellow-400">Disclaimer:</strong> This analysis is for informational purposes only
            and does not constitute medical advice, diagnosis, or treatment. Always consult with a qualified healthcare
            professional for medical decisions.
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default AnalysisResults;
