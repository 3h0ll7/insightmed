import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import SmartInputZone from "@/components/health/SmartInputZone";
import HealthFlowDiagram from "@/components/health/HealthFlowDiagram";
import LabTrendChart from "@/components/health/LabTrendChart";
import RiskMeter from "@/components/health/RiskMeter";
import GuidanceFeed from "@/components/health/GuidanceFeed";
import { Heart } from "lucide-react";

export interface AnalysisData {
  summary: string;
  key_findings: Array<{ finding: string; significance: string; explanation: string }>;
  risk_factors: Array<{ factor: string; level: string }>;
  recommendations: string[];
  medical_entities: Array<{ entity: string; type: string; value?: string }>;
}

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const handleProcessingChange = useCallback((isActive: boolean) => {
    setIsProcessing(isActive);
  }, []);

  const handleAnalysisComplete = useCallback((data: AnalysisData | null) => {
    setAnalysisData(data);
  }, []);

  // Derive risk values from analysis
  const overallRisk = analysisData
    ? Math.round(
        analysisData.risk_factors.reduce((sum, r) => {
          const val = r.level === "high" ? 85 : r.level === "moderate" ? 55 : 20;
          return sum + val;
        }, 0) / Math.max(analysisData.risk_factors.length, 1)
      )
    : 32;

  const metabolicRisk = analysisData
    ? Math.round(
        analysisData.risk_factors
          .filter((r) =>
            /glucose|diabetes|cholesterol|lipid|metabol|glycemic|triglyceride|hba1c/i.test(r.factor)
          )
          .reduce((sum, r) => {
            const val = r.level === "high" ? 90 : r.level === "moderate" ? 55 : 20;
            return sum + val;
          }, 0) /
          Math.max(
            analysisData.risk_factors.filter((r) =>
              /glucose|diabetes|cholesterol|lipid|metabol|glycemic|triglyceride|hba1c/i.test(r.factor)
            ).length,
            1
          )
      )
    : 58;

  // Derive lab data points from entities
  const labEntities = analysisData
    ? analysisData.medical_entities.filter((e) => e.type === "measurement" && e.value)
    : null;

  return (
    <div className="min-h-screen editorial-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-6">
            <Heart className="w-3.5 h-3.5" />
            Trusted by Healthcare Professionals
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground leading-tight mb-4">
            AI-Powered Health<br />Intelligence Platform
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-sans">
            Upload your medical documents and get structured, evidence-based analysis powered by advanced AI.
          </p>
        </motion.div>

        {/* Smart Input */}
        <div className="mb-10 max-w-3xl mx-auto">
          <SmartInputZone
            onProcessingChange={handleProcessingChange}
            onAnalysisComplete={handleAnalysisComplete}
          />
        </div>

        {/* Flow Diagram */}
        <div className="mb-10">
          <HealthFlowDiagram isProcessing={isProcessing} />
        </div>

        {/* Bottom panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <LabTrendChart extractedEntities={labEntities} />
          </div>
          <div className="md:col-span-1 flex flex-col gap-6">
            <RiskMeter value={overallRisk} label="Overall Risk" animated={!!analysisData} />
            <RiskMeter value={metabolicRisk} label="Metabolic Risk" animated={!!analysisData} />
          </div>
          <div className="md:col-span-1">
            <GuidanceFeed recommendations={analysisData?.recommendations} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
