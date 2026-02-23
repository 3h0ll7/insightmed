import { motion } from "framer-motion";
import HealthNode from "./HealthNode";
import FlowConnections from "./FlowConnections";

const nodes = [
  "Visit Transcript",
  "Lab Results",
  "Radiology Reports",
  "AI Extraction Engine",
  "Structured Health Data",
  "Risk Analysis Module",
  "Personalized Guidance Engine",
  "Health Timeline",
];

const HealthFlowDiagram = () => {
  // Split into 2 rows on mobile, single row on desktop
  const topRow = nodes.slice(0, 4);
  const bottomRow = nodes.slice(4);

  return (
    <motion.div
      className="glass-card p-6 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-sm font-semibold text-foreground mb-6 glow-text">
        Health Intelligence Pipeline
      </h3>

      {/* Desktop: single row with connections */}
      <div className="hidden lg:block relative">
        <div className="relative">
          <FlowConnections nodeCount={nodes.length} />
          <div className="flex justify-between items-center gap-2 relative z-10">
            {nodes.map((node, i) => (
              <HealthNode key={node} label={node} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet: two rows */}
      <div className="lg:hidden space-y-8">
        <div className="relative">
          <FlowConnections nodeCount={topRow.length} />
          <div className="flex justify-between items-center gap-2 relative z-10">
            {topRow.map((node, i) => (
              <HealthNode key={node} label={node} index={i} />
            ))}
          </div>
        </div>
        {/* Arrow between rows */}
        <div className="flex justify-center">
          <motion.div
            className="w-0.5 h-6 bg-primary/30"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.6 }}
          />
        </div>
        <div className="relative">
          <FlowConnections nodeCount={bottomRow.length} />
          <div className="flex justify-between items-center gap-2 relative z-10">
            {bottomRow.map((node, i) => (
              <HealthNode key={node} label={node} index={i + 4} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HealthFlowDiagram;
