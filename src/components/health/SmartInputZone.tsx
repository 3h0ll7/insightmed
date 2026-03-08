import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, ClipboardPaste, Sparkles, AlertTriangle, CheckCircle2, ChevronDown, ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import AnalysisResults from "./AnalysisResults";
import { useApp } from "@/i18n/LanguageContext";

const DOCUMENT_TYPES = [
  "CBC Blood Test", "Blood Glucose Test", "Lipid Profile", "Liver Function Test",
  "Kidney Function Test", "Thyroid Function Test", "General Lab Results",
  "Chest X-Ray", "CT Scan", "MRI", "Ultrasound", "General Radiology Report",
  "Prescription", "Medical Visit Report", "Discharge Summary", "Other Medical Document",
] as const;

type DocumentType = (typeof DOCUMENT_TYPES)[number];
type AnalysisStage = "idle" | "classifying" | "classified" | "extracting" | "structuring" | "risk_mapping" | "generating" | "complete";

interface SmartInputZoneProps {
  onProcessingChange?: (isProcessing: boolean) => void;
  onAnalysisComplete?: (data: any | null) => void;
}

const SmartInputZone = ({ onProcessingChange, onAnalysisComplete }: SmartInputZoneProps) => {
  const { t, lang } = useApp();

  const stageLabels: Record<AnalysisStage, string> = {
    idle: "", classifying: t("stageClassifying"), classified: t("stageClassified"),
    extracting: t("stageExtracting"), structuring: t("stageStructuring"),
    risk_mapping: t("stageRiskMapping"), generating: t("stageGenerating"), complete: t("stageComplete"),
  };

  const stagePercent: Record<AnalysisStage, number> = {
    idle: 0, classifying: 10, classified: 20, extracting: 40, structuring: 60, risk_mapping: 80, generating: 90, complete: 100,
  };

  const getConfidenceConfig = (score: number) => {
    if (score >= 80) return {
      color: "hsl(170 55% 42%)",
      bgClass: "bg-[hsl(var(--teal-accent)/0.1)]",
      borderClass: "border-[hsl(var(--teal-accent)/0.3)]",
      glowClass: "shadow-[0_0_20px_hsl(170_55%_42%/0.3)]",
      textClass: "text-teal-accent",
      icon: ShieldCheck,
      label: t("highConfidence"),
    };
    if (score >= 60) return {
      color: "hsl(38 85% 55%)",
      bgClass: "bg-[hsl(var(--warm-amber)/0.1)]",
      borderClass: "border-[hsl(var(--warm-amber)/0.3)]",
      glowClass: "shadow-[0_0_20px_hsl(38_85%_55%/0.3)]",
      textClass: "text-warm-amber",
      icon: ShieldAlert,
      label: t("mediumConfidence"),
    };
    return {
      color: "hsl(0 72% 51%)",
      bgClass: "bg-destructive/5",
      borderClass: "border-destructive/20",
      glowClass: "shadow-[0_0_20px_hsl(0_72%_51%/0.25)]",
      textClass: "text-destructive",
      icon: ShieldQuestion,
      label: t("lowConfidence"),
    };
  };

  const [isDragging, setIsDragging] = useState(false);
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [stage, setStage] = useState<AnalysisStage>("idle");
  const [classifiedType, setClassifiedType] = useState<DocumentType | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [reasoning, setReasoning] = useState("");
  const [showOverride, setShowOverride] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [analysisMethod, setAnalysisMethod] = useState("clinical_analysis");
  const [detectedKeywords, setDetectedKeywords] = useState<string[]>([]);

  useEffect(() => {
    if (stage === "classified" && confidence > 0) {
      setShowOverride(true);
      if (confidence < 60) {
        setConfirmed(false);
      } else if (confidence >= 80) {
        setConfirmed(true);
      } else {
        setConfirmed(false);
      }
    }
  }, [stage, confidence]);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const readFileAsText = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });

  const handleFile = async (file: File) => {
    setError(""); setAnalysisResult(null); setClassifiedType(null); setStage("idle"); setConfirmed(false);
    if (file.size > 20 * 1024 * 1024) { setError(t("fileTooLarge")); return; }
    const supported = [".pdf", ".docx", ".doc", ".txt", ".csv", ".jpg", ".jpeg", ".png"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!supported.includes(ext)) { setError(`${t("unsupportedFormat")} (${ext}).`); return; }
    setFileName(file.name);
    try {
      const content = await readFileAsText(file);
      setText(content.slice(0, 5000));
      classifyDocument(content.slice(0, 3000));
    } catch { setText(`[${file.name}]`); }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, []);

  const classifyDocument = async (content: string) => {
    setStage("classifying"); onProcessingChange?.(true); setReasoning("");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("classify-document", { body: { text: content } });
      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);
      setClassifiedType(data.category as DocumentType);
      setConfidence(data.confidence || 0);
      setReasoning(data.reasoning || "");
      setAnalysisMethod(data.analysis_method || "clinical_analysis");
      setDetectedKeywords(data.detected_keywords || []);
      setStage("classified"); onProcessingChange?.(false);
    } catch (err: any) {
      setStage("classified"); setClassifiedType("Other Medical Document"); setConfidence(0); onProcessingChange?.(false);
      toast({ title: t("classificationNotice"), description: t("couldNotClassify"), variant: "destructive" });
    }
  };

  const startAnalysis = async () => {
    if (!text.trim()) return;
    setError(""); setAnalysisResult(null); onProcessingChange?.(true);
    const stages: AnalysisStage[] = ["extracting", "structuring", "risk_mapping", "generating"];
    let stageIdx = 0; setStage(stages[0]);
    const interval = setInterval(() => { stageIdx++; if (stageIdx < stages.length) setStage(stages[stageIdx]); }, 2000);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-document", { body: { text: text.slice(0, 5000), documentType: classifiedType || "Medical Document", language: lang, analysisMethod } });
      clearInterval(interval);
      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);
      setAnalysisResult(data);
      setStage("complete");
      onAnalysisComplete?.(data);
    } catch (err: any) {
      clearInterval(interval); setStage("classified"); setError(err.message || t("analysisFailed"));
      toast({ title: t("analysisFailed"), description: err.message, variant: "destructive" });
    } finally { onProcessingChange?.(false); }
  };

  const handleTextSubmit = () => { if (text.trim().length >= 10) classifyDocument(text); };
  const reset = () => {
    setText(""); setFileName(""); setStage("idle"); setClassifiedType(null);
    setAnalysisResult(null); setError(""); setShowOverride(false); setConfirmed(false); setReasoning("");
    setAnalysisMethod("clinical_analysis"); setDetectedKeywords([]);
    onAnalysisComplete?.(null);
  };
  const isAnalyzing = ["extracting", "structuring", "risk_mapping", "generating"].includes(stage);
  const getDocTypeLabel = (type: string) => t(type) || type;
  const canStartAnalysis = stage === "classified" && (confirmed || confidence >= 80);

  const confidenceConfig = confidence > 0 ? getConfidenceConfig(confidence) : null;

  return (
    <div className="space-y-6">
      <motion.div className="warm-card p-6 sm:p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h3 className="text-lg font-serif font-semibold text-foreground mb-5 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" /> {t("uploadTitle")}
        </h3>

        {stage === "idle" || (stage === "classified" && !analysisResult) ? (
          <>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="w-full bg-secondary border border-border">
                <TabsTrigger value="upload" className="flex-1 gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  <Upload className="w-3.5 h-3.5" /> {t("uploadFile")}
                </TabsTrigger>
                <TabsTrigger value="paste" className="flex-1 gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  <ClipboardPaste className="w-3.5 h-3.5" /> {t("pasteText")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <motion.div
                  className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
                    isDragging ? "border-accent bg-accent/5" : "border-border hover:border-accent/40 hover:bg-accent/5"
                  }`}
                  onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                  onClick={() => document.getElementById("smart-file-input")?.click()}
                  animate={isDragging ? { scale: 1.01 } : { scale: 1 }}
                >
                  <input id="smart-file-input" type="file" className="hidden" accept=".pdf,.docx,.doc,.txt,.csv,.jpg,.jpeg,.png"
                    onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); }} />
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
                      <Upload className="w-7 h-7 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground font-medium">{isDragging ? t("dropHere") : t("dragDrop")}</p>
                      <p className="text-xs text-muted-foreground mt-1.5">{t("fileFormats")}</p>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="paste">
                <div className="space-y-3">
                  <Textarea placeholder={t("pastePlaceholder")} value={text} onChange={(e) => setText(e.target.value)}
                    className="min-h-[160px] bg-card border-border focus:border-accent/50 resize-none text-sm" />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">{text.length > 0 ? `${text.length} ${t("characters")}` : t("minChars")}</p>
                    <Button size="sm" onClick={handleTextSubmit}
                      disabled={text.trim().length < 10 || (stage as AnalysisStage) === "classifying"}
                      className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium">
                      <Sparkles className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1" /> {t("classify")}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="mt-3 flex items-center gap-2 text-destructive text-xs p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : null}

        <AnimatePresence>
          {stage === "classifying" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground">{t("classifying")}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(stage === "classified" || isAnalyzing || stage === "complete") && classifiedType && !analysisResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-accent" />
                  <span className="text-sm text-muted-foreground">{t("detected")}</span>
                  <Badge className="bg-accent/15 text-accent border-accent/25 hover:bg-accent/20">{getDocTypeLabel(classifiedType)}</Badge>
                </div>
                <button onClick={() => setShowOverride(!showOverride)}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                  {t("override")} <ChevronDown className={`w-3 h-3 transition-transform ${showOverride ? "rotate-180" : ""}`} />
                </button>
              </div>

              {confidenceConfig && confidence > 0 && (
                <motion.div
                  className={`p-4 rounded-xl border ${confidenceConfig.bgClass} ${confidenceConfig.borderClass} ${confidenceConfig.glowClass} transition-shadow`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <confidenceConfig.icon className={`w-4.5 h-4.5 ${confidenceConfig.textClass}`} />
                      <span className="text-xs font-semibold text-foreground">{t("confidenceScore")}</span>
                    </div>
                    <motion.span
                      className={`text-lg font-bold font-sans ${confidenceConfig.textClass}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      {confidence}%
                    </motion.span>
                  </div>

                  <div className="h-2.5 bg-secondary/80 rounded-full overflow-hidden relative">
                    <motion.div
                      className="h-full rounded-full relative"
                      style={{ backgroundColor: confidenceConfig.color }}
                      initial={{ width: "0%" }}
                      animate={{ width: `${confidence}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ background: `linear-gradient(90deg, transparent 0%, ${confidenceConfig.color} 50%, transparent 100%)`, opacity: 0.4 }}
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                      />
                    </motion.div>
                  </div>

                  <p className={`text-xs mt-2.5 ${confidenceConfig.textClass} font-medium`}>
                    {confidenceConfig.label}
                  </p>

                  {reasoning && (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      <span className="font-medium text-foreground/70">{t("reasoning")}</span> {reasoning}
                    </p>
                  )}

                  {detectedKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-xs font-medium text-foreground/70">{t("detectedKeywords")}</span>
                      {detectedKeywords.map((kw, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">{kw}</span>
                      ))}
                    </div>
                  )}

                  {confidence >= 60 && confidence < 80 && !confirmed && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-3">
                      <Button size="sm" onClick={() => setConfirmed(true)}
                        className="bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25 text-xs font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1" /> {t("confirmClassification")}
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              )}

              <AnimatePresence>
                {showOverride && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex flex-wrap gap-2">
                    {DOCUMENT_TYPES.map((type) => (
                      <button key={type} onClick={() => { setClassifiedType(type); setShowOverride(false); setConfirmed(true); setConfidence(100); }}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          classifiedType === type ? "bg-accent/15 border-accent/40 text-accent" : "border-border text-muted-foreground hover:border-accent/30 hover:text-foreground"
                        }`}>{getDocTypeLabel(type)}</button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {fileName && <p className="text-xs text-muted-foreground flex items-center gap-1.5"><FileText className="w-3 h-3" /> {fileName}</p>}

              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-accent font-medium animate-pulse">{stageLabels[stage]}</span>
                    <span className="text-xs text-muted-foreground">{stagePercent[stage]}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full bg-accent"
                      initial={{ width: "0%" }} animate={{ width: `${stagePercent[stage]}%` }} transition={{ duration: 0.6, ease: "easeOut" }} />
                  </div>
                </div>
              )}

              {stage === "classified" && (
                <div className="flex gap-3">
                  <Button onClick={startAnalysis} disabled={!canStartAnalysis}
                    className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-sm py-3 h-auto disabled:opacity-50">
                    <Sparkles className="w-4 h-4 ltr:mr-2 rtl:ml-2" /> {t("startAnalysis")}
                  </Button>
                  <Button variant="outline" onClick={reset} className="border-border text-muted-foreground hover:text-foreground">{t("clear")}</Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {analysisResult && stage === "complete" && (
          <AnalysisResults result={analysisResult} documentType={classifiedType || t("Medical Document")} onReset={reset} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartInputZone;
