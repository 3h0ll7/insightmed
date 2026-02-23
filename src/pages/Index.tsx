import { motion } from "framer-motion";
import NeuralBackground from "@/components/health/NeuralBackground";
import HealthFlowDiagram from "@/components/health/HealthFlowDiagram";
import LabTrendChart from "@/components/health/LabTrendChart";
import RiskMeter from "@/components/health/RiskMeter";
import GuidanceFeed from "@/components/health/GuidanceFeed";
import { Brain } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen relative neural-gradient">
      <NeuralBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground glow-text">
              Health Intelligence
            </h1>
            <p className="text-xs text-muted-foreground">
              AI-powered health data analysis pipeline
            </p>
          </div>
        </motion.div>

        {/* Flow Diagram */}
        <div className="mb-6">
          <HealthFlowDiagram />
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
