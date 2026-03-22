import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const analysisPrompts: Record<string, string> = {
  lab_analysis: `You are a laboratory report analysis specialist. Focus on:
- Extracting all test values with their reference ranges
- Flagging abnormal values (high/low) with clinical significance
- Identifying patterns across multiple tests (e.g., metabolic syndrome indicators)
- Providing specific dietary/lifestyle recommendations based on lab values`,

  radiology_analysis: `You are a radiology report analysis specialist. Focus on:
- Identifying the imaging modality and body part examined
- Extracting all findings, measurements, and abnormalities
- Noting comparison with prior studies if mentioned
- Highlighting clinically significant findings that need follow-up`,

  clinical_analysis: `You are a clinical document analysis specialist. Focus on:
- Extracting diagnoses, symptoms, and clinical assessments
- Identifying prescribed medications with dosages and instructions
- Noting follow-up recommendations and referrals
- Summarizing the clinical encounter and plan of care`,
};

const analysisToolSchema = {
  type: "function" as const,
  function: {
    name: "analyze_medical_document",
    description: "Return structured analysis of a medical document",
    parameters: {
      type: "object",
      properties: {
        summary: { type: "string", description: "Brief plain-language summary of the document" },
        key_findings: {
          type: "array",
          items: {
            type: "object",
            properties: {
              finding: { type: "string" },
              significance: { type: "string", enum: ["normal", "attention", "critical"] },
              explanation: { type: "string" },
            },
            required: ["finding", "significance", "explanation"],
            additionalProperties: false,
          },
        },
        risk_factors: {
          type: "array",
          items: {
            type: "object",
            properties: {
              factor: { type: "string" },
              level: { type: "string", enum: ["low", "moderate", "high"] },
            },
            required: ["factor", "level"],
            additionalProperties: false,
          },
        },
        recommendations: { type: "array", items: { type: "string" } },
        medical_entities: {
          type: "array",
          items: {
            type: "object",
            properties: {
              entity: { type: "string" },
              type: { type: "string", enum: ["condition", "medication", "procedure", "measurement", "anatomy"] },
              value: { type: "string" },
            },
            required: ["entity", "type"],
            additionalProperties: false,
          },
        },
      },
      required: ["summary", "key_findings", "risk_factors", "recommendations", "medical_entities"],
      additionalProperties: false,
    },
  },
};

const MODELS = [
  { id: "google/gemini-2.5-pro", name: "Gemini Pro" },
  { id: "google/gemini-3-flash-preview", name: "Gemini Flash" },
  { id: "openai/gpt-5-mini", name: "GPT-5 Mini" },
];

const CEO_MODEL = "openai/gpt-5";

async function callModel(
  apiKey: string,
  modelId: string,
  specialistPrompt: string,
  documentType: string,
  language: string,
  text: string
) {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        {
          role: "system",
          content: `${specialistPrompt}

Analyze the provided ${documentType} and extract structured information.

${language === "ar" ? "IMPORTANT: You MUST write ALL output fields (summary, finding, explanation, factor, recommendations, entity, value) in formal Arabic (الفصحى). Do NOT use English for any text content." : ""}

IMPORTANT: Include a disclaimer that this is for informational purposes only and not a medical diagnosis.`,
        },
        { role: "user", content: `Analyze this ${documentType}:\n\n${text.slice(0, 5000)}` },
      ],
      tools: [analysisToolSchema],
      tool_choice: { type: "function", function: { name: "analyze_medical_document" } },
    }),
  });

  if (!response.ok) {
    const t = await response.text();
    throw new Error(`Model ${modelId} failed (${response.status}): ${t}`);
  }

  const data = await response.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall) throw new Error(`Model ${modelId} returned no result`);

  return JSON.parse(toolCall.function.arguments);
}

async function ceoSynthesize(
  apiKey: string,
  modelResults: { model: string; result: any }[],
  documentType: string,
  language: string
) {
  const resultsText = modelResults
    .map((r, i) => `=== Analysis from ${r.model} ===\n${JSON.stringify(r.result, null, 2)}`)
    .join("\n\n");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: CEO_MODEL,
      messages: [
        {
          role: "system",
          content: `You are the Chief Medical AI Officer. You have received analyses of a ${documentType} from ${modelResults.length} different AI models. Your job is to:

1. Compare all analyses carefully
2. Identify the MOST ACCURATE findings from each model
3. Resolve any contradictions by choosing the most clinically sound interpretation
4. Merge the best findings, risk factors, recommendations, and entities into ONE comprehensive result
5. Write a unified summary that captures the most important insights from all models
6. Ensure no critical finding is missed — if ANY model flagged something as critical, include it
7. Prioritize specificity and clinical relevance

${language === "ar" ? "IMPORTANT: You MUST write ALL output fields in formal Arabic (الفصحى). Do NOT use English for any text content." : ""}

IMPORTANT: Include a disclaimer that this is for informational purposes only.`,
        },
        {
          role: "user",
          content: `Here are the analyses from ${modelResults.length} AI models. Synthesize the best result:\n\n${resultsText}`,
        },
      ],
      tools: [analysisToolSchema],
      tool_choice: { type: "function", function: { name: "analyze_medical_document" } },
    }),
  });

  if (!response.ok) {
    const t = await response.text();
    throw new Error(`CEO synthesis failed (${response.status}): ${t}`);
  }

  const data = await response.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall) throw new Error("CEO returned no synthesis");

  return JSON.parse(toolCall.function.arguments);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text, documentType, language, analysisMethod } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const method = analysisMethod || "clinical_analysis";
    const specialistPrompt = analysisPrompts[method] || analysisPrompts.clinical_analysis;

    // Step 1: Call all 3 models in parallel
    const modelPromises = MODELS.map(async (model) => {
      try {
        const result = await callModel(LOVABLE_API_KEY, model.id, specialistPrompt, documentType || "medical document", language || "en", text);
        return { model: model.name, modelId: model.id, result, status: "success" as const };
      } catch (err) {
        console.error(`Model ${model.name} failed:`, err);
        return { model: model.name, modelId: model.id, result: null, status: "failed" as const, error: err instanceof Error ? err.message : "Unknown error" };
      }
    });

    const modelResults = await Promise.all(modelPromises);
    const successfulResults = modelResults.filter((r) => r.status === "success" && r.result);

    if (successfulResults.length === 0) {
      throw new Error("All AI models failed to analyze the document");
    }

    // Step 2: If only 1 model succeeded, return its result directly
    if (successfulResults.length === 1) {
      return new Response(JSON.stringify({
        ...successfulResults[0].result,
        council: {
          models: modelResults.map((r) => ({ name: r.model, status: r.status })),
          synthesized_by: successfulResults[0].model,
          total_models: MODELS.length,
          successful_models: 1,
        },
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 3: CEO synthesizes the best result
    const ceoResult = await ceoSynthesize(
      LOVABLE_API_KEY,
      successfulResults.map((r) => ({ model: r.model, result: r.result })),
      documentType || "medical document",
      language || "en"
    );

    return new Response(JSON.stringify({
      ...ceoResult,
      council: {
        models: modelResults.map((r) => ({ name: r.model, status: r.status })),
        synthesized_by: "GPT-5 (Chief AI Officer)",
        total_models: MODELS.length,
        successful_models: successfulResults.length,
      },
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze error:", e);
    if (e instanceof Error && e.message.includes("429")) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (e instanceof Error && e.message.includes("402")) {
      return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
