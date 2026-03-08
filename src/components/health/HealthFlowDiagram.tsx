import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import HealthNode from "./HealthNode";
import FlowConnections from "./FlowConnections";
import { useApp } from "@/i18n/LanguageContext";

const nodeKeys = [
  "Visit Transcript", "Lab Results", "Radiology Reports", "AI Extraction Engine",
  "Structured Health Data", "Risk Analysis Module", "Personalized Guidance Engine", "Health Timeline",
];

interface HealthFlowDiagramProps { isProcessing?: boolean; }

const HealthFlowDiagram = ({ isProcessing = false }: HealthFlowDiagramProps) => {
  const { t } = useApp();
  const [activeNodeIndex, setActiveNodeIndex] = useState(-1);

  useEffect(() => {
    if (!isProcessing) { setActiveNodeIndex(-1); return; }
    let idx = 0; setActiveNodeIndex(0);
    const interval = setInterval(() => { idx = (idx + 1) % nodeKeys.length; setActiveNodeIndex(idx); }, 900);
    return () => clearInterval(interval);
  }, [isProcessing]);

  const topRow = nodeKeys.slice(0, 4);
  const bottomRow = nodeKeys.slice(4);

  return (
    <motion.div className="warm-card p-6 sm:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <h3 className="text-base font-serif font-semibold text-foreground mb-6">{t("pipeline")}</h3>

      <div className="hidden lg:block relative">
        <div className="relative">
          <FlowConnections nodeCount={nodeKeys.length} />
          <div className="flex justify-between items-center gap-2 relative z-10">
            {nodeKeys.map((key, i) => <HealthNode key={key} nodeKey={key} label={t(key)} index={i} isActive={activeNodeIndex === i} />)}
          </div>
        </div>
      </div>

      <div className="lg:hidden space-y-8">
        <div className="relative">
          <FlowConnections nodeCount={topRow.length} />
          <div className="flex justify-between items-center gap-2 relative z-10">
            {topRow.map((key, i) => <HealthNode key={key} nodeKey={key} label={t(key)} index={i} isActive={activeNodeIndex === i} />)}
          </div>
        </div>
        <div className="flex justify-center">
          <motion.div className="w-0.5 h-6 bg-border" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.6 }} />
        </div>
        <div className="relative">
          <FlowConnections nodeCount={bottomRow.length} />
          <div className="flex justify-between items-center gap-2 relative z-10">
            {bottomRow.map((key, i) => <HealthNode key={key} nodeKey={key} label={t(key)} index={i + 4} isActive={activeNodeIndex === i + 4} />)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HealthFlowDiagram;
