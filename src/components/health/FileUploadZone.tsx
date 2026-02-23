import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, FlaskConical, ScanLine, X, CheckCircle2 } from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  type: "transcript" | "lab" | "radiology";
  size: string;
}

const typeConfig = {
  transcript: { label: "Visit Transcript", icon: FileText, accept: ".pdf,.doc,.docx,.txt" },
  lab: { label: "Lab Results", icon: FlaskConical, accept: ".pdf,.csv,.xlsx" },
  radiology: { label: "Radiology Report", icon: ScanLine, accept: ".pdf,.dcm,.jpg,.png" },
};

const FileUploadZone = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const detectType = (name: string): UploadedFile["type"] => {
    const lower = name.toLowerCase();
    if (lower.includes("lab") || lower.includes("blood") || lower.includes("cbc") || lower.includes("panel"))
      return "lab";
    if (lower.includes("xray") || lower.includes("mri") || lower.includes("ct") || lower.includes("radio") || lower.includes("scan"))
      return "radiology";
    return "transcript";
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: UploadedFile[] = Array.from(fileList).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      type: detectType(f.name),
      size: formatSize(f.size),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <motion.div
      className="glass-card p-5 sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-sm font-semibold text-foreground mb-4 glow-text">
        Upload Medical Records
      </h3>

      {/* Drop zone */}
      <motion.div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/40 hover:bg-primary/[0.02]"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
        animate={isDragging ? { scale: 1.01 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <input
          id="file-input"
          type="file"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <motion.div
          animate={isDragging ? { y: -4 } : { y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-foreground font-medium">
              {isDragging ? "Drop files here" : "Drag & drop your medical records"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Visit transcripts, lab results, radiology reports — PDF, DOC, CSV, DICOM
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Category quick-upload buttons */}
      <div className="flex flex-wrap gap-2 mt-4">
        {(Object.entries(typeConfig) as [keyof typeof typeConfig, typeof typeConfig[keyof typeof typeConfig]][]).map(
          ([key, cfg]) => (
            <label
              key={key}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/40 hover:bg-secondary/60 text-xs text-secondary-foreground cursor-pointer transition-colors border border-transparent hover:border-primary/20"
            >
              <cfg.icon className="w-3.5 h-3.5 text-primary" />
              <span>{cfg.label}</span>
              <input
                type="file"
                multiple
                accept={cfg.accept}
                className="hidden"
                onChange={(e) => {
                  if (!e.target.files) return;
                  const newFiles: UploadedFile[] = Array.from(e.target.files).map((f) => ({
                    id: crypto.randomUUID(),
                    name: f.name,
                    type: key,
                    size: formatSize(f.size),
                  }));
                  setFiles((prev) => [...prev, ...newFiles]);
                }}
              />
            </label>
          )
        )}
      </div>

      {/* Uploaded files list */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            className="mt-4 space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {files.map((file) => {
              const cfg = typeConfig[file.type];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={file.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-secondary/30 group"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10, height: 0 }}
                  layout
                >
                  <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground truncate">{file.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {cfg.label} · {file.size}
                    </p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                  <button
                    onClick={() => removeFile(file.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground flex-shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FileUploadZone;
