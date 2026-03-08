import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import ar from "./ar";
import en from "./en";

type Lang = "ar" | "en";
type Theme = "light" | "dark";

interface AppContextValue {
  lang: Lang;
  theme: Theme;
  setLang: (l: Lang) => void;
  setTheme: (t: Theme) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const translations: Record<Lang, Record<string, string>> = { ar, en };

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem("app-lang") as Lang) || "ar");
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem("app-theme") as Theme) || "light");

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("app-lang", l);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("app-theme", t);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[lang][key] || key;
  }, [lang]);

  const dir = lang === "ar" ? "rtl" : "ltr";

  // Sync HTML attributes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.title = lang === "ar" ? "بصيرة الصحة | تحليل طبي بالذكاء الاصطناعي" : "InsightMed | AI-Powered Medical Analysis";
    if (lang === "ar") {
      document.body.style.fontFamily = "'Noto Sans Arabic', 'DM Sans', system-ui, sans-serif";
    } else {
      document.body.style.fontFamily = "'DM Sans', system-ui, sans-serif";
    }
  }, [lang, dir]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <AppContext.Provider value={{ lang, theme, setLang, setTheme, t, dir }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
