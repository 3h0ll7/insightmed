const en = {
  // Index page
  appName: "InsightMed",
  trustedBy: "Trusted by Healthcare Professionals",
  heroTitle1: "Health Intelligence",
  heroTitle2: "Powered by AI",
  heroSubtitle: "Upload your medical documents and receive structured, evidence-based analysis powered by advanced AI.",

  // SmartInputZone
  uploadTitle: "Upload Your Medical Document",
  uploadFile: "Upload File",
  pasteText: "Paste Text",
  dropHere: "Drop file here",
  dragDrop: "Drag & drop your medical record",
  fileFormats: "PDF, DOCX, TXT, CSV, JPG, PNG — Max 20MB",
  pastePlaceholder: "Paste medical document text here…",
  minChars: "Minimum 10 characters",
  characters: "characters",
  classify: "Classify",
  classifying: "AI is classifying your document…",
  detected: "Detected:",
  override: "Change",
  startAnalysis: "Start Analysis",
  clear: "Clear",
  fileTooLarge: "File too large. Maximum 20MB.",
  unsupportedFormat: "Unsupported format",
  classificationNotice: "Classification Notice",
  couldNotClassify: "Auto-classification failed. Please select manually.",
  analysisFailed: "Analysis Failed",

  // Confidence
  confidenceScore: "Confidence Score",
  highConfidence: "High confidence — Classification auto-accepted",
  mediumConfidence: "Medium confidence — Please confirm classification",
  lowConfidence: "Low confidence — Please select document type manually",
  confirmClassification: "Confirm Classification",
  reasoning: "Reason:",

  // Stage labels
  stageClassifying: "Classifying document…",
  stageClassified: "Document classified",
  stageModel1: "Gemini Pro is analyzing…",
  stageModel2: "Gemini Flash is analyzing…",
  stageModel3: "GPT-5 Mini is analyzing…",
  stageSynthesizing: "Chief AI Officer is synthesizing results…",
  stageComplete: "Analysis complete",

  // Multi-model
  analyzing: "Analyzing…",
  waiting: "Waiting…",
  ceoSynthesizing: "Chief AI Officer — Final Synthesis",
  ceoDescription: "GPT-5 reviews all models' findings to deliver the best result",
  councilVerdict: "AI Council Verdict",
  modelsContributed: "models contributed",
  synthesizedBy: "Synthesized by",

  // AnalysisResults
  analysisComplete: "Analysis Complete",
  exportPdf: "Export PDF",
  newAnalysis: "New",
  keyFindings: "Key Findings",
  riskFactors: "Risk Factors",
  recommendations: "Recommendations",
  detectedEntities: "Detected Medical Entities",
  disclaimer: "Disclaimer:",
  disclaimerText: "This analysis is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.",
  pdfExported: "PDF Exported",
  pdfDownloaded: "Report downloaded successfully.",
  exportFailed: "Export Failed",
  couldNotGeneratePdf: "Could not generate PDF file.",

  // HealthFlowDiagram
  pipeline: "Health Intelligence Pipeline",

  // HealthNode labels
  "Visit Transcript": "Visit Transcript",
  "Lab Results": "Lab Results",
  "Radiology Reports": "Radiology Reports",
  "AI Extraction Engine": "AI Extraction Engine",
  "Structured Health Data": "Structured Health Data",
  "Risk Analysis Module": "Risk Analysis Module",
  "Personalized Guidance Engine": "Personalized Guidance",
  "Health Timeline": "Health Timeline",

  // HealthNode descriptions
  "Visit Transcript_short": "Clinical notes from doctor visits",
  "Visit Transcript_detail": "Raw text from patient-doctor conversations is analyzed using NLP to extract diagnoses, prescriptions, and follow-ups.",
  "Lab Results_short": "Blood tests and lab data",
  "Lab Results_detail": "Comprehensive blood panels, metabolic, and lipid tests are ingested and converted to structured data with reference ranges.",
  "Radiology Reports_short": "Imaging and scan results",
  "Radiology Reports_detail": "X-ray, MRI, and CT scan reports are analyzed to extract key findings and measurements.",
  "AI Extraction Engine_short": "Intelligent data analysis pipeline",
  "AI Extraction Engine_detail": "AI models process unstructured medical documents to extract entities, relationships, and temporal patterns.",
  "Structured Health Data_short": "Unified patient health records",
  "Structured Health Data_detail": "All extracted data is mapped to unified medical standards for interoperability.",
  "Risk Analysis Module_short": "Predictive health risk assessment",
  "Risk Analysis Module_detail": "Machine learning models analyze longitudinal data to calculate risk scores for cardiovascular, metabolic, and other conditions.",
  "Personalized Guidance Engine_short": "AI-powered health recommendations",
  "Personalized Guidance Engine_detail": "Context-aware algorithms generate personalized recommendations for lifestyle, diet, and preventive care.",
  "Health Timeline_short": "Health journey timeline map",
  "Health Timeline_detail": "Interactive timeline display of all health events, trends, and milestones.",

  // Document types
  "CBC Blood Test": "CBC Blood Test",
  "Blood Glucose Test": "Blood Glucose Test",
  "Lipid Profile": "Lipid Profile",
  "Liver Function Test": "Liver Function Test",
  "Kidney Function Test": "Kidney Function Test",
  "Thyroid Function Test": "Thyroid Function Test",
  "General Lab Results": "General Lab Results",
  "Chest X-Ray": "Chest X-Ray",
  "CT Scan": "CT Scan",
  MRI: "MRI",
  Ultrasound: "Ultrasound",
  "General Radiology Report": "General Radiology Report",
  "Radiology Report": "Radiology Report",
  Prescription: "Prescription",
  "Medical Visit Report": "Medical Visit Report",
  "Visit Transcript_type": "Visit Transcript",
  "Discharge Summary": "Discharge Summary",
  "Other Medical Document": "Other Medical Document",
  "Medical Document": "Medical Document",
  detectedKeywords: "Keywords:",

  // LabTrendChart
  extractedMeasurements: "Extracted Measurements",
  liveData: "Live Data",
  labValueTrends: "Lab Value Trends",

  // RiskMeter
  overallRisk: "Overall Risk",
  metabolicRisk: "Metabolic Risk",
  low: "Low",
  moderate: "Moderate",
  high: "High",
  live: "Live",

  // GuidanceFeed
  aiRecommendations: "AI Recommendations",
  aiHealthInsights: "AI Health Insights",

  // Default insights
  cardiovascularHealth: "Cardiovascular Health",
  cardiovascularText: "Your cholesterol dropped 16% over 8 months. Maintain current diet and exercise patterns.",
  dietaryRecommendation: "Dietary Recommendation",
  dietaryText: "Consider increasing omega-3 intake. Your EPA/DHA ratio suggests room for improvement.",
  exerciseAdjustment: "Exercise Adjustment",
  exerciseText: "Based on recent glucose trends, adding 15 minutes of post-meal walking may improve levels.",
  sleepOptimization: "Sleep Optimization",
  sleepText: "Cortisol patterns indicate sleep disruption. Consider consistent sleep and wake times.",
  preventiveScreening: "Preventive Screening",
  preventiveText: "Based on age and medical history, schedule a baseline colonoscopy within the next six months.",

  hoursAgo: "2 hours ago",
  fiveHoursAgo: "5 hours ago",
  oneDayAgo: "1 day ago",
  twoDaysAgo: "2 days ago",
  threeDaysAgo: "3 days ago",

  // NotFound
  pageNotFound: "Oops! Page not found",
  returnHome: "Return Home",

  // Significance / Risk levels
  normal: "Normal",
  attention: "Needs Attention",
  critical: "Critical",
} as const;

export type TranslationKey = keyof typeof en;
export default en;
