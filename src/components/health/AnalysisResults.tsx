import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, Shield, Pill, Stethoscope, Activity, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface KeyFinding { finding: string; significance: "normal" | "attention" | "critical"; explanation: string; }
interface RiskFactor { factor: string; level: "low" | "moderate" | "high"; }
interface MedicalEntity { entity: string; type: "condition" | "medication" | "procedure" | "measurement" | "anatomy"; value?: string; }
interface AnalysisResult { summary: string; key_findings: KeyFinding[]; risk_factors: RiskFactor[]; recommendations: string[]; medical_entities: MedicalEntity[]; }
interface AnalysisResultsProps { result: AnalysisResult; documentType: string; onReset: () => void; }

const significanceConfig = {
  normal: { color: "text-teal-accent", bg: "bg-[hsl(var(--teal-accent)/0.08)]", border: "border-[hsl(var(--teal-accent)/0.2)]", icon: CheckCircle2 },
  attention: { color: "text-warm-amber", bg: "bg-[hsl(var(--warm-amber)/0.08)]", border: "border-[hsl(var(--warm-amber)/0.2)]", icon: Info },
  critical: { color: "text-destructive", bg: "bg-destructive/5", border: "border-destructive/15", icon: AlertTriangle },
};

const riskConfig = {
  low: { color: "text-teal-accent", bg: "bg-[hsl(var(--teal-accent)/0.1)]" },
  moderate: { color: "text-warm-amber", bg: "bg-[hsl(var(--warm-amber)/0.1)]" },
  high: { color: "text-destructive", bg: "bg-destructive/10" },
};

const entityIcons: Record<string, typeof Pill> = {
  condition: Activity, medication: Pill, procedure: Stethoscope, measurement: Activity, anatomy: Stethoscope,
};

const AnalysisResults = ({ result, documentType, onReset }: AnalysisResultsProps) => {
  return (
    <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Summary */}
      <div className="warm-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-accent" />
            <h3 className="text-lg font-serif font-semibold text-foreground">Analysis Complete</h3>
            <Badge className="bg-accent/15 text-accent border-accent/25 text-xs">{documentType}</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={onReset} className="gap-1 text-muted-foreground">
            <ArrowLeft className="w-3 h-3" /> New
          </Button>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Key Findings */}
        <div className="warm-card p-6">
          <h4 className="text-sm font-serif font-semibold text-foreground mb-4 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-accent" /> Key Findings
          </h4>
          <div className="space-y-2.5">
            {result.key_findings.map((f, i) => {
              const cfg = significanceConfig[f.significance];
              const Icon = cfg.icon;
              return (
                <motion.div key={i} className={`p-3 rounded-lg ${cfg.bg} border ${cfg.border}`}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className="flex items-start gap-2">
                    <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.color}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{f.finding}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{f.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Risk Factors */}
        <div className="warm-card p-6">
          <h4 className="text-sm font-serif font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent" /> Risk Factors
          </h4>
          <div className="space-y-2.5">
            {result.risk_factors.map((r, i) => {
              const cfg = riskConfig[r.level];
              return (
                <motion.div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/60"
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <span className="text-sm text-foreground">{r.factor}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color} font-medium capitalize`}>{r.level}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="warm-card p-6">
          <h4 className="text-sm font-serif font-semibold text-foreground mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-accent" /> Recommendations
          </h4>
          <ul className="space-y-2">
            {result.recommendations.map((rec, i) => (
              <motion.li key={i} className="text-sm text-muted-foreground flex items-start gap-2.5"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
                <CheckCircle2 className="w-4 h-4 text-teal-accent mt-0.5 flex-shrink-0" />
                {rec}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Entities */}
        <div className="warm-card p-6">
          <h4 className="text-sm font-serif font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent" /> Detected Entities
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.medical_entities.map((e, i) => {
              const Icon = entityIcons[e.type] || Activity;
              return (
                <motion.div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border text-xs"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                  <Icon className="w-3 h-3 text-accent" />
                  <span className="text-foreground">{e.entity}</span>
                  {e.value && <span className="text-muted-foreground">({e.value})</span>}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="warm-card p-4 border-warm-amber/20">
        <p className="text-xs text-muted-foreground flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-warm-amber flex-shrink-0 mt-0.5" />
          <span><strong className="text-warm-amber">Disclaimer:</strong> This analysis is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult with a qualified healthcare professional.</span>
        </p>
      </div>
    </motion.div>
  );
};

export default AnalysisResults;
