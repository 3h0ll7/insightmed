import { useApp } from "@/i18n/LanguageContext";
import { Sun, Moon, Languages } from "lucide-react";
import { motion } from "framer-motion";

const SettingsBar = () => {
  const { lang, theme, setLang, setTheme } = useApp();

  return (
    <motion.div
      className="fixed top-4 left-4 z-50 flex items-center gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Language Toggle */}
      <button
        onClick={() => setLang(lang === "ar" ? "en" : "ar")}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-all text-xs font-medium text-foreground hover:border-accent/40"
        aria-label="Toggle language"
      >
        <Languages className="w-3.5 h-3.5 text-accent" />
        <span className="font-sans">{lang === "ar" ? "EN" : "عربي"}</span>
      </button>

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-all hover:border-accent/40"
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Moon className="w-4 h-4 text-foreground" />
        ) : (
          <Sun className="w-4 h-4 text-accent" />
        )}
      </button>
    </motion.div>
  );
};

export default SettingsBar;
