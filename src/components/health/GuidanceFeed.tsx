import { motion } from "framer-motion";
import { Sparkles, Heart, Apple, Activity, Moon } from "lucide-react";

const insights = [
  {
    icon: Heart,
    title: "Cardiovascular Health",
    text: "Your cholesterol has dropped 16% over 8 months. Maintain current dietary patterns and exercise routine.",
    time: "2 hours ago",
  },
  {
    icon: Apple,
    title: "Dietary Recommendation",
    text: "Consider increasing omega-3 intake. Your EPA/DHA ratio suggests room for improvement.",
    time: "5 hours ago",
  },
  {
    icon: Activity,
    title: "Exercise Adjustment",
    text: "Based on your recent glucose trend, adding 15 min of post-meal walking could optimize levels further.",
    time: "1 day ago",
  },
  {
    icon: Moon,
    title: "Sleep Optimization",
    text: "Cortisol patterns suggest disrupted sleep. Consider consistent sleep/wake times for metabolic benefit.",
    time: "2 days ago",
  },
  {
    icon: Sparkles,
    title: "Preventive Screening",
    text: "Based on age and history, schedule a baseline colonoscopy within the next 6 months.",
    time: "3 days ago",
  },
];

const GuidanceFeed = () => {
  return (
    <motion.div
      className="glass-card p-5 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.5 }}
    >
      <h3 className="text-sm font-semibold text-foreground mb-4 glow-text">
        AI Health Insights
      </h3>
      <div className="space-y-3 overflow-y-auto max-h-[280px] pr-1 scrollbar-thin">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            className="flex gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8 + i * 0.1, duration: 0.3 }}
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center">
              <insight.icon className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-medium text-foreground">
                  {insight.title}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {insight.time}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {insight.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default GuidanceFeed;
