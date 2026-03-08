import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string" || text.trim().length < 10) {
      return new Response(JSON.stringify({ error: "Please provide at least 10 characters of medical text." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a medical document classifier. Given text from a medical document, classify it into exactly one of these categories:

Laboratory Reports:
- CBC Blood Test (complete blood count, WBC, RBC, hemoglobin, hematocrit, platelets)
- Blood Glucose Test (fasting glucose, HbA1c, oral glucose tolerance)
- Lipid Profile (total cholesterol, LDL, HDL, triglycerides)
- Liver Function Test (ALT, AST, ALP, bilirubin, albumin, GGT)
- Kidney Function Test (creatinine, BUN, eGFR, uric acid)
- Thyroid Function Test (TSH, T3, T4, free T4)
- General Lab Results (any other lab test not fitting above)

Radiology / Imaging:
- Chest X-Ray
- CT Scan
- MRI
- Ultrasound
- General Radiology Report (other imaging)

Clinical Documents:
- Prescription
- Medical Visit Report (clinical notes, visit transcript)
- Discharge Summary
- Other Medical Document

Also provide:
- A confidence score (0-100)
- Detected keywords that helped classification
- Recommended analysis method (lab_analysis, radiology_analysis, clinical_analysis)`,
          },
          { role: "user", content: `Classify this medical document:\n\n${text.slice(0, 3000)}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "classify_document",
              description: "Classify a medical document into a category with detected keywords",
              parameters: {
                type: "object",
                properties: {
                  category: {
                    type: "string",
                    enum: [
                      "CBC Blood Test",
                      "Blood Glucose Test",
                      "Lipid Profile",
                      "Liver Function Test",
                      "Kidney Function Test",
                      "Thyroid Function Test",
                      "General Lab Results",
                      "Chest X-Ray",
                      "CT Scan",
                      "MRI",
                      "Ultrasound",
                      "General Radiology Report",
                      "Prescription",
                      "Medical Visit Report",
                      "Discharge Summary",
                      "Other Medical Document",
                    ],
                  },
                  confidence: { type: "number", minimum: 0, maximum: 100 },
                  reasoning: { type: "string" },
                  detected_keywords: {
                    type: "array",
                    items: { type: "string" },
                    description: "Medical keywords detected in the document that helped classification",
                  },
                  analysis_method: {
                    type: "string",
                    enum: ["lab_analysis", "radiology_analysis", "clinical_analysis"],
                    description: "Recommended analysis method based on document type",
                  },
                },
                required: ["category", "confidence", "reasoning", "detected_keywords", "analysis_method"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "classify_document" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI classification failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No classification result returned");

    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("classify error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
