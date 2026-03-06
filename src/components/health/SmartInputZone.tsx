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
  idle: 0,
  classifying: 10,
  classified: 20,
  extracting: 40,
  structuring: 60,
  risk_mapping: 80,
  generating: 90,
  complete: 100,
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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleFile = async (file: File) => {
    setError("");
    setAnalysisResult(null);
    setClassifiedType(null);
    setStage("idle");

    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File too large. Maximum 20MB.");
      return;
    }

    const supported = [".pdf", ".docx", ".doc", ".txt", ".csv", ".jpg", ".jpeg", ".png"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!supported.includes(ext)) {
      setError(`Unsupported format (${ext}). Please use PDF, DOCX, TXT, CSV, JPG, or PNG.`);
      return;
    }

    setFileName(file.name);

    try {
      const content = await readFileAsText(file);
      setText(content.slice(0, 5000));
      classifyDocument(content.slice(0, 3000));
    } catch {
      setText(`[File: ${file.name}] — Content could not be read as text. Paste the text manually for best results.`);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, []);

  const classifyDocument = async (content: string) => {
    setStage("classifying");
    onProcessingChange?.(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("classify-document", {
        body: { text: content },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      setClassifiedType(data.category as DocumentType);
      setConfidence(data.confidence || 0);
      setStage("classified");
      onProcessingChange?.(false);
    } catch (err: any) {
      console.error("Classification error:", err);
      setStage("classified");
      setClassifiedType("Other Medical Document");
      setConfidence(0);
      onProcessingChange?.(false);
      toast({
        title: "Classification notice",
        description: "Could not auto-classify. You can select the type manually.",
        variant: "destructive",
      });
    }
  };

  const startAnalysis = async () => {
    if (!text.trim()) return;

    setError("");
    setAnalysisResult(null);
    onProcessingChange?.(true);

    const stages: AnalysisStage[] = ["extracting", "structuring", "risk_mapping", "generating"];

    // Animate through stages while waiting for AI
    let stageIdx = 0;
    setStage(stages[0]);
    const interval = setInterval(() => {
      stageIdx++;
      if (stageIdx < stages.length) {
        setStage(stages[stageIdx]);
      }
    }, 2000);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-document", {
        body: { text: text.slice(0, 5000), documentType: classifiedType || "Medical Document" },
      });

      clearInterval(interval);

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      setAnalysisResult(data);
      setStage("complete");
    } catch (err: any) {
      clearInterval(interval);
      setStage("classified");
      setError(err.message || "Analysis failed. Please try again.");
      toast({
        title: "Analysis failed",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      onProcessingChange?.(false);
    }
  };

  const handleTextSubmit = () => {
    if (text.trim().length >= 10) {
      classifyDocument(text);
    }
  };

  const reset = () => {
    setText("");
    setFileName("");
    setStage("idle");
    setClassifiedType(null);
    setAnalysisResult(null);
    setError("");
    setShowOverride(false);
  };

  const isAnalyzing = ["extracting", "structuring", "risk_mapping", "generating"].includes(stage);

  return (
    <div className="space-y-4">
      <motion.div
        className="glass-card p-5 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-sm font-semibold text-foreground mb-4 glow-text flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-glow-cyan" />
          Smart Medical Input
        </h3>

        {stage === "idle" || (stage === "classified" && !analysisResult) ? (
          <>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="w-full bg-secondary/40 border border-[hsl(var(--glow-cyan)/0.1)]">
                <TabsTrigger value="upload" className="flex-1 gap-2 data-[state=active]:bg-[hsl(var(--glow-cyan)/0.1)] data-[state=active]:text-foreground">
                  <Upload className="w-3.5 h-3.5" />
                  Upload File
                </TabsTrigger>
                <TabsTrigger value="paste" className="flex-1 gap-2 data-[state=active]:bg-[hsl(var(--glow-cyan)/0.1)] data-[state=active]:text-foreground">
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  Paste Text
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <motion.div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                    isDragging
                      ? "border-glow-cyan bg-[hsl(var(--glow-cyan)/0.05)]"
                      : "border-border hover:border-glow-cyan/40 hover:bg-[hsl(var(--glow-cyan)/0.02)]"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("smart-file-input")?.click()}
                  animate={isDragging ? { scale: 1.01 } : { scale: 1 }}
                >
                  <input
                    id="smart-file-input"
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.doc,.txt,.csv,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(file);
                    }}
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[hsl(var(--glow-cyan)/0.1)] flex items-center justify-center border border-[hsl(var(--glow-cyan)/0.2)]">
                      <Upload className="w-6 h-6 text-glow-cyan" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground font-medium">
                        {isDragging ? "Drop file here" : "Drag & drop your medical record"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, DOCX, TXT, CSV, JPG, PNG — max 20MB
                      </p>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="paste">
                <div className="space-y-3">
                  <Textarea
                    placeholder="Paste your medical document text here (visit transcript, lab results, radiology report, etc.)..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[160px] bg-secondary/20 border-border focus:border-glow-cyan/40 resize-none text-sm"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-muted-foreground">
                      {text.length > 0 ? `${text.length} characters` : "Minimum 10 characters"}
                    </p>
                    <Button
                      size="sm"
                      onClick={handleTextSubmit}
                      disabled={text.trim().length < 10 || (stage as AnalysisStage) === "classifying"}
                      className="bg-glow-cyan/20 text-glow-cyan border border-glow-cyan/30 hover:bg-glow-cyan/30"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      Classify
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 flex items-center gap-2 text-destructive text-xs p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                >
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : null}

        {/* Classification loading */}
        <AnimatePresence>
          {stage === "classifying" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex items-center gap-3"
            >
              <div className="w-5 h-5 border-2 border-glow-cyan/30 border-t-glow-cyan rounded-full animate-spin" />
              <span className="text-xs text-muted-foreground">AI is classifying your document…</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Classification result + Start Analysis */}
        <AnimatePresence>
          {(stage === "classified" || isAnalyzing || stage === "complete") && classifiedType && !analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 space-y-4"
            >
              {/* Classified badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-glow-cyan" />
                  <span className="text-xs text-muted-foreground">Detected:</span>
                  <Badge className="bg-glow-cyan/20 text-glow-cyan border-glow-cyan/30 hover:bg-glow-cyan/30">
                    {classifiedType}
                  </Badge>
                  {confidence > 0 && (
                    <span className="text-[10px] text-muted-foreground">{confidence}% confidence</span>
                  )}
                </div>
                <button
                  onClick={() => setShowOverride(!showOverride)}
                  className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  Override <ChevronDown className={`w-3 h-3 transition-transform ${showOverride ? "rotate-180" : ""}`} />
                </button>
              </div>

              {/* Override dropdown */}
              <AnimatePresence>
                {showOverride && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="flex flex-wrap gap-1.5"
                  >
                    {DOCUMENT_TYPES.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setClassifiedType(type);
                          setShowOverride(false);
                        }}
                        className={`text-[10px] px-2.5 py-1 rounded-full border transition-colors ${
                          classifiedType === type
                            ? "bg-glow-cyan/20 border-glow-cyan/40 text-glow-cyan"
                            : "border-border text-muted-foreground hover:border-glow-cyan/30 hover:text-foreground"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {fileName && (
                <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                  <FileText className="w-3 h-3" /> {fileName}
                </p>
              )}

              {/* Progress bar during analysis */}
              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-glow-cyan animate-pulse">{stageLabels[stage]}</span>
                    <span className="text-[10px] text-muted-foreground">{stagePercent[stage]}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary/40 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, hsl(var(--glow-cyan)), hsl(var(--glow-teal)))" }}
                      initial={{ width: "0%" }}
                      animate={{ width: `${stagePercent[stage]}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}

              {/* Start Analysis button */}
              {stage === "classified" && (
                <div className="flex gap-2">
                  <Button
                    onClick={startAnalysis}
                    className="flex-1 bg-gradient-to-r from-[hsl(var(--glow-cyan))] to-[hsl(var(--glow-teal))] text-background font-semibold hover:opacity-90"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Analysis
                  </Button>
                  <Button variant="outline" onClick={reset} className="border-border text-muted-foreground hover:text-foreground">
                    Clear
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysisResult && stage === "complete" && (
          <AnalysisResults
            result={analysisResult}
            documentType={classifiedType || "Medical Document"}
            onReset={reset}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartInputZone;
