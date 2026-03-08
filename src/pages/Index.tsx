import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import SmartInputZone from "@/components/health/SmartInputZone";
import HealthFlowDiagram from "@/components/health/HealthFlowDiagram";
import LabTrendChart from "@/components/health/LabTrendChart";
import RiskMeter from "@/components/health/RiskMeter";
import GuidanceFeed from "@/components/health/GuidanceFeed";
import { Heart } from "lucide-react";

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessingChange = useCallback((isActive: boolean) => {
    setIsProcessing(isActive);
  }, []);

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
          <SmartInputZone onProcessingChange={handleProcessingChange} />
        </div>

        {/* Flow Diagram */}
        <div className="mb-10">
          <HealthFlowDiagram isProcessing={isProcessing} />
        </div>

        {/* Bottom panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <LabTrendChart />
          </div>
          <div className="md:col-span-1 flex flex-col gap-6">
            <RiskMeter value={32} label="Overall Risk" />
            <RiskMeter value={58} label="Metabolic Risk" />
          </div>
          <div className="md:col-span-1">
            <GuidanceFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
