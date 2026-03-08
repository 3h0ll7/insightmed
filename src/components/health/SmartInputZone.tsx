import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, ClipboardPaste, Sparkles, AlertTriangle, CheckCircle2, ChevronDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import AnalysisResults from "./AnalysisResults";

const DOCUMENT_TYPES = [
  "Radiology Report",
  "Lab Results",
  "Prescription",
  "Visit Transcript",
  "Discharge Summary",
  "Other Medical Document",
] as const;

type DocumentType = (typeof DOCUMENT_TYPES)[number];
type AnalysisStage = "idle" | "classifying" | "classified" | "extracting" | "structuring" | "risk_mapping" | "generating" | "complete";

const stageLabels: Record<AnalysisStage, string> = {
  idle: "",
  classifying: "Classifying document…",
  classified: "Document classified",
  extracting: "Extracting medical entities…",
  structuring: "Structuring data…",
  risk_mapping: "Mapping risk factors…",
  generating: "Generating guidance…",
  complete: "Analysis complete",
};

const stagePercent: Record<AnalysisStage, number> = {
  idle: 0, classifying: 10, classified: 20, extracting: 40, structuring: 60, risk_mapping: 80, generating: 90, complete: 100,
};

interface SmartInputZoneProps {
  onProcessingChange?: (isProcessing: boolean) => void;
}

const SmartInputZone = ({ onProcessingChange }: SmartInputZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [stage, setStage] = useState<AnalysisStage>("idle");
  const [classifiedType, setClassifiedType] = useState<DocumentType | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [showOverride, setShowOverride] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState("");

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
    setError(""); setAnalysisResult(null); setClassifiedType(null); setStage("idle");
    if (file.size > 20 * 1024 * 1024) { setError("File too large. Maximum 20MB."); return; }
    const supported = [".pdf", ".docx", ".doc", ".txt", ".csv", ".jpg", ".jpeg", ".png"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!supported.includes(ext)) { setError(`Unsupported format (${ext}).`); return; }
    setFileName(file.name);
    try {
      const content = await readFileAsText(file);
      setText(content.slice(0, 5000));
      classifyDocument(content.slice(0, 3000));
    } catch { setText(`[File: ${file.name}] — Content could not be read as text.`); }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, []);

  const classifyDocument = async (content: string) => {
    setStage("classifying"); onProcessingChange?.(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("classify-document", { body: { text: content } });
      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);
      setClassifiedType(data.category as DocumentType);
      setConfidence(data.confidence || 0);
      setStage("classified"); onProcessingChange?.(false);
    } catch (err: any) {
      setStage("classified"); setClassifiedType("Other Medical Document"); setConfidence(0); onProcessingChange?.(false);
      toast({ title: "Classification notice", description: "Could not auto-classify. Select manually.", variant: "destructive" });
    }
  };

  const startAnalysis = async () => {
    if (!text.trim()) return;
    setError(""); setAnalysisResult(null); onProcessingChange?.(true);
    const stages: AnalysisStage[] = ["extracting", "structuring", "risk_mapping", "generating"];
    let stageIdx = 0; setStage(stages[0]);
    const interval = setInterval(() => { stageIdx++; if (stageIdx < stages.length) setStage(stages[stageIdx]); }, 2000);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-document", { body: { text: text.slice(0, 5000), documentType: classifiedType || "Medical Document" } });
      clearInterval(interval);
      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);
      setAnalysisResult(data); setStage("complete");
    } catch (err: any) {
      clearInterval(interval); setStage("classified"); setError(err.message || "Analysis failed.");
      toast({ title: "Analysis failed", description: err.message, variant: "destructive" });
    } finally { onProcessingChange?.(false); }
  };

  const handleTextSubmit = () => { if (text.trim().length >= 10) classifyDocument(text); };
  const reset = () => { setText(""); setFileName(""); setStage("idle"); setClassifiedType(null); setAnalysisResult(null); setError(""); setShowOverride(false); };
  const isAnalyzing = ["extracting", "structuring", "risk_mapping", "generating"].includes(stage);

  return (
    <div className="space-y-6">
      <motion.div
        className="warm-card p-6 sm:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-serif font-semibold text-foreground mb-5 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          Upload Your Medical Document
        </h3>

        {stage === "idle" || (stage === "classified" && !analysisResult) ? (
          <>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="w-full bg-secondary border border-border">
                <TabsTrigger value="upload" className="flex-1 gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  <Upload className="w-3.5 h-3.5" /> Upload File
                </TabsTrigger>
                <TabsTrigger value="paste" className="flex-1 gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  <ClipboardPaste className="w-3.5 h-3.5" /> Paste Text
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <motion.div
                  className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
                    isDragging ? "border-accent bg-accent/5" : "border-border hover:border-accent/40 hover:bg-accent/5"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
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
                      <p className="text-sm text-foreground font-medium">{isDragging ? "Drop file here" : "Drag & drop your medical record"}</p>
                      <p className="text-xs text-muted-foreground mt-1.5">PDF, DOCX, TXT, CSV, JPG, PNG — max 20MB</p>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="paste">
                <div className="space-y-3">
                  <Textarea
                    placeholder="Paste your medical document text here…"
                    value={text} onChange={(e) => setText(e.target.value)}
                    className="min-h-[160px] bg-card border-border focus:border-accent/50 resize-none text-sm"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">{text.length > 0 ? `${text.length} characters` : "Minimum 10 characters"}</p>
                    <Button size="sm" onClick={handleTextSubmit}
                      disabled={text.trim().length < 10 || (stage as AnalysisStage) === "classifying"}
                      className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1" /> Classify
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

        {/* Classification loading */}
        <AnimatePresence>
          {stage === "classifying" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground">AI is classifying your document…</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Classification result + Start Analysis */}
        <AnimatePresence>
          {(stage === "classified" || isAnalyzing || stage === "complete") && classifiedType && !analysisResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-accent" />
                  <span className="text-sm text-muted-foreground">Detected:</span>
                  <Badge className="bg-accent/15 text-accent border-accent/25 hover:bg-accent/20">{classifiedType}</Badge>
                  {confidence > 0 && <span className="text-xs text-muted-foreground">{confidence}%</span>}
                </div>
                <button onClick={() => setShowOverride(!showOverride)}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                  Override <ChevronDown className={`w-3 h-3 transition-transform ${showOverride ? "rotate-180" : ""}`} />
                </button>
              </div>

              <AnimatePresence>
                {showOverride && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex flex-wrap gap-2">
                    {DOCUMENT_TYPES.map((type) => (
                      <button key={type} onClick={() => { setClassifiedType(type); setShowOverride(false); }}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          classifiedType === type ? "bg-accent/15 border-accent/40 text-accent" : "border-border text-muted-foreground hover:border-accent/30 hover:text-foreground"
                        }`}>{type}</button>
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
                  <Button onClick={startAnalysis} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-sm py-3 h-auto">
                    <Sparkles className="w-4 h-4 mr-2" /> START ANALYSIS
                  </Button>
                  <Button variant="outline" onClick={reset} className="border-border text-muted-foreground hover:text-foreground">Clear</Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {analysisResult && stage === "complete" && (
          <AnalysisResults result={analysisResult} documentType={classifiedType || "Medical Document"} onReset={reset} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartInputZone;
