import { motion } from "framer-motion";

interface FlowConnectionsProps { nodeCount: number; }

const FlowConnections = ({ nodeCount }: FlowConnectionsProps) => {
  const connections: Array<{ from: number; to: number }> = [];
  for (let i = 0; i < nodeCount - 1; i++) connections.push({ from: i, to: i + 1 });

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(37 15% 80% / 0.2)" />
          <stop offset="50%" stopColor="hsl(38 85% 55% / 0.5)" />
          <stop offset="100%" stopColor="hsl(37 15% 80% / 0.2)" />
        </linearGradient>
      </defs>
      {connections.map(({ from, to }) => {
        const gap = 100 / nodeCount;
        const x1 = gap * from + gap / 2;
        const x2 = gap * to + gap / 2;
        return (
          <motion.line key={`${from}-${to}`} x1={`${x1}%`} y1="50%" x2={`${x2}%`} y2="50%"
            stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="6 4"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: from * 0.12 + 0.3, duration: 0.6 }} />
        );
      })}
    </svg>
  );
};

export default FlowConnections;
