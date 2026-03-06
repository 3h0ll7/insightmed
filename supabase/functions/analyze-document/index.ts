import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text, documentType } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
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
            content: `You are a medical document analysis assistant. Analyze the provided ${documentType || "medical document"} and extract structured information. 

IMPORTANT: Include a disclaimer that this is for informational purposes only and not a medical diagnosis. Always recommend consulting a healthcare professional.`,
          },
          { role: "user", content: `Analyze this ${documentType || "medical document"}:\n\n${text.slice(0, 5000)}` },
        ],
        tools: [
          {
            type: "function",
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
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_medical_document" } },
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
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No analysis result returned");

    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
