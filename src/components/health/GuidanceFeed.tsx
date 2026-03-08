import { motion } from "framer-motion";
import { Sparkles, Heart, Apple, Activity, Moon, CheckCircle2 } from "lucide-react";

const defaultInsights = [
  { icon: Heart, title: "Cardiovascular Health", text: "Your cholesterol has dropped 16% over 8 months. Maintain current dietary patterns and exercise routine.", time: "2 hours ago" },
  { icon: Apple, title: "Dietary Recommendation", text: "Consider increasing omega-3 intake. Your EPA/DHA ratio suggests room for improvement.", time: "5 hours ago" },
  { icon: Activity, title: "Exercise Adjustment", text: "Based on your recent glucose trend, adding 15 min of post-meal walking could optimize levels.", time: "1 day ago" },
  { icon: Moon, title: "Sleep Optimization", text: "Cortisol patterns suggest disrupted sleep. Consider consistent sleep/wake times.", time: "2 days ago" },
  { icon: Sparkles, title: "Preventive Screening", text: "Based on age and history, schedule a baseline colonoscopy within the next 6 months.", time: "3 days ago" },
];

interface GuidanceFeedProps {
  recommendations?: string[] | null;
}

const GuidanceFeed = ({ recommendations }: GuidanceFeedProps) => {
  const hasLiveData = recommendations && recommendations.length > 0;

  return (
    <motion.div className="warm-card p-5 flex flex-col"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: hasLiveData ? 0 : 1.6, duration: 0.5 }}>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-serif font-semibold text-foreground">
          {hasLiveData ? "AI Recommendations" : "AI Health Insights"}
        </h3>
        {hasLiveData && (
          <span className="text-[10px] text-accent font-medium px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">Live</span>
        )}
      </div>
      <div className="space-y-3 overflow-y-auto max-h-[280px] pr-1">
        {hasLiveData ? (
          recommendations.map((rec, i) => (
            <motion.div key={i} className="flex gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1, duration: 0.3 }}>
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex-shrink-0 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground leading-relaxed">{rec}</p>
              </div>
            </motion.div>
          ))
        ) : (
          defaultInsights.map((insight, i) => (
            <motion.div key={i} className="flex gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.8 + i * 0.1, duration: 0.3 }}>
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex-shrink-0 flex items-center justify-center">
                <insight.icon className="w-4 h-4 text-accent" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-medium text-foreground">{insight.title}</span>
                  <span className="text-[10px] text-muted-foreground">{insight.time}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{insight.text}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default GuidanceFeed;
