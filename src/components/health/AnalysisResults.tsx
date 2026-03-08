import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, Shield, Pill, Stethoscope, Activity, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

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

const exportToPdf = async (result: AnalysisResult, documentType: string) => {
  try {
    const jsPDFModule = await import("jspdf");
    const jsPDF = jsPDFModule.default;
    const autoTableModule = await import("jspdf-autotable");
    const autoTable = autoTableModule.default;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    // Header
    doc.setFillColor(43, 57, 73);
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Health Intelligence Report", margin, 18);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Document Type: ${documentType}  |  Generated: ${new Date().toLocaleDateString()}`, margin, 30);
    y = 50;

    // Summary
    doc.setTextColor(43, 57, 73);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", margin, y);
    y += 7;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    const summaryLines = doc.splitTextToSize(result.summary, contentWidth);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 5 + 10;

    // Key Findings table
    doc.setTextColor(43, 57, 73);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Key Findings", margin, y);
    y += 3;

    const findingsData = result.key_findings.map((f) => [
      f.finding,
      f.significance.charAt(0).toUpperCase() + f.significance.slice(1),
      f.explanation,
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Finding", "Significance", "Explanation"]],
      body: findingsData,
      margin: { left: margin, right: margin },
      headStyles: { fillColor: [43, 57, 73], fontSize: 9 },
      bodyStyles: { fontSize: 8, textColor: [60, 60, 60] },
      columnStyles: { 0: { cellWidth: 45 }, 1: { cellWidth: 25 }, 2: { cellWidth: "auto" } },
      theme: "grid",
      styles: { cellPadding: 3, lineColor: [200, 200, 200], lineWidth: 0.2 },
    });

    y = (doc as any).lastAutoTable.finalY + 12;

    // Risk Factors table
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setTextColor(43, 57, 73);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Risk Factors", margin, y);
    y += 3;

    const riskData = result.risk_factors.map((r) => [
      r.factor,
      r.level.charAt(0).toUpperCase() + r.level.slice(1),
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Factor", "Level"]],
      body: riskData,
      margin: { left: margin, right: margin },
      headStyles: { fillColor: [43, 57, 73], fontSize: 9 },
      bodyStyles: { fontSize: 8, textColor: [60, 60, 60] },
      theme: "grid",
      styles: { cellPadding: 3, lineColor: [200, 200, 200], lineWidth: 0.2 },
      didParseCell: (data: any) => {
        if (data.section === "body" && data.column.index === 1) {
          const val = data.cell.raw?.toString().toLowerCase();
          if (val === "high") data.cell.styles.textColor = [220, 38, 38];
          else if (val === "moderate") data.cell.styles.textColor = [204, 128, 0];
          else data.cell.styles.textColor = [34, 139, 115];
        }
      },
    });

    y = (doc as any).lastAutoTable.finalY + 12;

    // Recommendations
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setTextColor(43, 57, 73);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Recommendations", margin, y);
    y += 8;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);

    result.recommendations.forEach((rec, i) => {
      if (y > 270) { doc.addPage(); y = 20; }
      const lines = doc.splitTextToSize(`${i + 1}. ${rec}`, contentWidth);
      doc.text(lines, margin, y);
      y += lines.length * 4.5 + 3;
    });

    y += 5;

    // Entities
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setTextColor(43, 57, 73);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Detected Medical Entities", margin, y);
    y += 3;

    const entityData = result.medical_entities.map((e) => [
      e.entity,
      e.type.charAt(0).toUpperCase() + e.type.slice(1),
      e.value || "—",
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Entity", "Type", "Value"]],
      body: entityData,
      margin: { left: margin, right: margin },
      headStyles: { fillColor: [43, 57, 73], fontSize: 9 },
      bodyStyles: { fontSize: 8, textColor: [60, 60, 60] },
      theme: "grid",
      styles: { cellPadding: 3, lineColor: [200, 200, 200], lineWidth: 0.2 },
    });

    y = (doc as any).lastAutoTable.finalY + 15;

    // Disclaimer
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFillColor(255, 248, 230);
    doc.roundedRect(margin, y - 3, contentWidth, 20, 2, 2, "F");
    doc.setFontSize(7);
    doc.setTextColor(150, 120, 50);
    doc.setFont("helvetica", "bold");
    doc.text("DISCLAIMER", margin + 4, y + 3);
    doc.setFont("helvetica", "normal");
    const discLines = doc.splitTextToSize(
      "This analysis is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult with a qualified healthcare professional for medical decisions.",
      contentWidth - 8
    );
    doc.text(discLines, margin + 4, y + 8);

    doc.save(`health-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast({ title: "PDF exported", description: "Report downloaded successfully." });
  } catch (err) {
    console.error("PDF export error:", err);
    toast({ title: "Export failed", description: "Could not generate PDF.", variant: "destructive" });
  }
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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => exportToPdf(result, documentType)}
              className="gap-1.5 text-accent border-accent/25 hover:bg-accent/10">
              <Download className="w-3.5 h-3.5" /> Export PDF
            </Button>
            <Button variant="outline" size="sm" onClick={onReset} className="gap-1 text-muted-foreground">
              <ArrowLeft className="w-3 h-3" /> New
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
