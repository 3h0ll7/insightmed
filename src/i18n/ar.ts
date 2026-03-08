const ar = {
  // Index page
  appName: "بصيرة الصحة",
  trustedBy: "موثوق من قبل المتخصصين في الرعاية الصحية",
  heroTitle1: "منصة الذكاء الصحي",
  heroTitle2: "المدعومة بالذكاء الاصطناعي",
  heroSubtitle: "ارفع مستنداتك الطبية واحصل على تحليل منظم قائم على الأدلة مدعوم بالذكاء الاصطناعي المتقدم.",

  // SmartInputZone
  uploadTitle: "ارفع مستندك الطبي",
  uploadFile: "رفع ملف",
  pasteText: "لصق نص",
  dropHere: "أفلت الملف هنا",
  dragDrop: "اسحب وأفلت سجلك الطبي",
  fileFormats: "PDF, DOCX, TXT, CSV, JPG, PNG — حد أقصى 20 ميجابايت",
  pastePlaceholder: "الصق نص المستند الطبي هنا…",
  minChars: "10 أحرف كحد أدنى",
  characters: "حرف",
  classify: "تصنيف",
  classifying: "الذكاء الاصطناعي يصنف مستندك…",
  detected: "تم الكشف:",
  override: "تغيير",
  startAnalysis: "بدء التحليل",
  clear: "مسح",
  fileTooLarge: "الملف كبير جداً. الحد الأقصى 20 ميجابايت.",
  unsupportedFormat: "تنسيق غير مدعوم",
  classificationNotice: "إشعار التصنيف",
  couldNotClassify: "تعذر التصنيف التلقائي. اختر يدوياً.",
  analysisFailed: "فشل التحليل",

  // Confidence
  confidenceScore: "درجة الثقة",
  highConfidence: "ثقة عالية — تم قبول التصنيف تلقائياً",
  mediumConfidence: "ثقة متوسطة — يرجى تأكيد التصنيف",
  lowConfidence: "ثقة منخفضة — يرجى اختيار نوع المستند يدوياً",
  confirmClassification: "تأكيد التصنيف",
  reasoning: "السبب:",

  // Stage labels
  stageClassifying: "جاري تصنيف المستند…",
  stageClassified: "تم تصنيف المستند",
  stageExtracting: "جاري استخراج الكيانات الطبية…",
  stageStructuring: "جاري هيكلة البيانات…",
  stageRiskMapping: "جاري تعيين عوامل الخطر…",
  stageGenerating: "جاري إنشاء التوجيهات…",
  stageComplete: "اكتمل التحليل",

  // AnalysisResults
  analysisComplete: "اكتمل التحليل",
  exportPdf: "تصدير PDF",
  newAnalysis: "جديد",
  keyFindings: "النتائج الرئيسية",
  riskFactors: "عوامل الخطر",
  recommendations: "التوصيات",
  detectedEntities: "الكيانات الطبية المكتشفة",
  disclaimer: "إخلاء مسؤولية:",
  disclaimerText: "هذا التحليل لأغراض إعلامية فقط ولا يشكل نصيحة طبية أو تشخيصاً أو علاجاً. استشر دائماً متخصصاً مؤهلاً في الرعاية الصحية.",
  pdfExported: "تم تصدير PDF",
  pdfDownloaded: "تم تنزيل التقرير بنجاح.",
  exportFailed: "فشل التصدير",
  couldNotGeneratePdf: "تعذر إنشاء ملف PDF.",

  // HealthFlowDiagram
  pipeline: "خط أنابيب الذكاء الصحي",

  // HealthNode labels
  "Visit Transcript": "نص الزيارة",
  "Lab Results": "نتائج المختبر",
  "Radiology Reports": "تقارير الأشعة",
  "AI Extraction Engine": "محرك الاستخراج بالذكاء الاصطناعي",
  "Structured Health Data": "بيانات صحية منظمة",
  "Risk Analysis Module": "وحدة تحليل المخاطر",
  "Personalized Guidance Engine": "محرك التوجيه الشخصي",
  "Health Timeline": "الجدول الزمني الصحي",

  // HealthNode descriptions
  "Visit Transcript_short": "ملاحظات سريرية من زيارات الطبيب",
  "Visit Transcript_detail": "يتم تحليل النصوص الخام من محادثات المريض والطبيب باستخدام معالجة اللغة الطبيعية لاستخراج التشخيصات والوصفات والمتابعات.",
  "Lab Results_short": "فحوصات الدم وبيانات المختبر",
  "Lab Results_detail": "يتم استيعاب فحوصات الدم الشاملة والأيض والدهون وتحويلها إلى بيانات منظمة مع نطاقات مرجعية.",
  "Radiology Reports_short": "نتائج التصوير والمسح",
  "Radiology Reports_detail": "يتم تحليل تقارير الأشعة السينية والرنين المغناطيسي والتصوير المقطعي لاستخراج النتائج الرئيسية والقياسات.",
  "AI Extraction Engine_short": "خط أنابيب تحليل البيانات الذكي",
  "AI Extraction Engine_detail": "تعالج نماذج الذكاء الاصطناعي المستندات الطبية غير المنظمة لاستخراج الكيانات والعلاقات والأنماط الزمنية.",
  "Structured Health Data_short": "سجلات صحية موحدة للمرضى",
  "Structured Health Data_detail": "يتم تعيين جميع البيانات المستخرجة إلى معايير طبية موحدة لضمان التوافقية.",
  "Risk Analysis Module_short": "تقييم المخاطر الصحية التنبؤي",
  "Risk Analysis Module_detail": "تحلل نماذج التعلم الآلي البيانات الطولية لحساب درجات المخاطر للأمراض القلبية والأيضية وغيرها.",
  "Personalized Guidance Engine_short": "توصيات صحية مدعومة بالذكاء الاصطناعي",
  "Personalized Guidance Engine_detail": "تولد خوارزميات واعية بالسياق توصيات شخصية لنمط الحياة والنظام الغذائي والرعاية الوقائية.",
  "Health Timeline_short": "خريطة الرحلة الصحية الزمنية",
  "Health Timeline_detail": "عرض تفاعلي زمني لجميع الأحداث الصحية والاتجاهات والمعالم.",

  // Document types
  "CBC Blood Test": "تحليل صورة الدم الكاملة",
  "Blood Glucose Test": "تحليل سكر الدم",
  "Lipid Profile": "تحليل الدهون",
  "Liver Function Test": "تحليل وظائف الكبد",
  "Kidney Function Test": "تحليل وظائف الكلى",
  "Thyroid Function Test": "تحليل الغدة الدرقية",
  "General Lab Results": "نتائج مختبرية عامة",
  "Chest X-Ray": "أشعة سينية للصدر",
  "CT Scan": "أشعة مقطعية",
  MRI: "رنين مغناطيسي",
  Ultrasound: "موجات فوق صوتية",
  "General Radiology Report": "تقرير أشعة عام",
  "Radiology Report": "تقرير أشعة",
  Prescription: "وصفة طبية",
  "Medical Visit Report": "تقرير زيارة طبية",
  "Visit Transcript_type": "نص زيارة",
  "Discharge Summary": "ملخص خروج",
  "Other Medical Document": "مستند طبي آخر",
  "Medical Document": "مستند طبي",
  detectedKeywords: "الكلمات المفتاحية:",

  // LabTrendChart
  extractedMeasurements: "القياسات المستخرجة",
  liveData: "بيانات مباشرة",
  labValueTrends: "اتجاهات القيم المخبرية",

  // RiskMeter
  overallRisk: "المخاطر الإجمالية",
  metabolicRisk: "مخاطر التمثيل الغذائي",
  low: "منخفض",
  moderate: "متوسط",
  high: "مرتفع",
  live: "مباشر",

  // GuidanceFeed
  aiRecommendations: "توصيات الذكاء الاصطناعي",
  aiHealthInsights: "رؤى صحية بالذكاء الاصطناعي",

  // Default insights
  cardiovascularHealth: "صحة القلب والأوعية الدموية",
  cardiovascularText: "انخفض الكوليسترول لديك بنسبة 16% خلال 8 أشهر. حافظ على أنماط النظام الغذائي والتمارين الحالية.",
  dietaryRecommendation: "توصية غذائية",
  dietaryText: "فكر في زيادة تناول أوميغا-3. تشير نسبة EPA/DHA لديك إلى وجود مجال للتحسين.",
  exerciseAdjustment: "تعديل التمارين",
  exerciseText: "بناءً على اتجاه الجلوكوز الأخير، إضافة 15 دقيقة من المشي بعد الوجبات قد يحسن المستويات.",
  sleepOptimization: "تحسين النوم",
  sleepText: "تشير أنماط الكورتيزول إلى اضطراب في النوم. فكر في مواعيد نوم واستيقاظ ثابتة.",
  preventiveScreening: "الفحص الوقائي",
  preventiveText: "بناءً على العمر والتاريخ المرضي، حدد موعداً لتنظير القولون الأساسي خلال الأشهر الستة القادمة.",

  hoursAgo: "قبل ساعتين",
  fiveHoursAgo: "قبل 5 ساعات",
  oneDayAgo: "قبل يوم",
  twoDaysAgo: "قبل يومين",
  threeDaysAgo: "قبل 3 أيام",

  // NotFound
  pageNotFound: "عذراً! الصفحة غير موجودة",
  returnHome: "العودة للرئيسية",

  // Significance / Risk levels
  normal: "طبيعي",
  attention: "يحتاج انتباه",
  critical: "حرج",
} as const;

export type TranslationKey = keyof typeof ar;
export default ar;
