import express from "express";
import path from "path";
import os from "os";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: "10mb" }));

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      serverTime: new Date().toISOString(),
      hasGeminiEnvKey: Boolean(process.env.GEMINI_API_KEY),
      hasGroqEnvKey: Boolean(process.env.GROQ_API_KEY),
    });
  });

  // Server-side Gemini analysis proxy endpoint
  app.post("/api/analyze-gemini", async (req, res) => {
    const startTime = Date.now();
    try {
      const { resumeText, jobDescription, clientApiKey, customModel } = req.body;

      if (!resumeText || !jobDescription) {
        return res.status(400).json({ error: "resumeText and jobDescription are required" });
      }

      const apiKey = clientApiKey || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: "No Gemini API key available. Provide a key in Settings or configure GEMINI_API_KEY.",
          isKeyMissing: true,
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const requestedModel = customModel || "gemini-2.5-flash";
      const modelCandidates = Array.from(new Set([
        requestedModel,
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
        "gemini-1.5-flash",
        "gemini-3.7-flash",
      ]));

      const systemPrompt = `You are RoleFit, an elite Principal Career Architect and ATS Gap Analysis Engine.
Your role is to perform an exhaustive, evidence-based, factual gap analysis between a Candidate Resume and a Target Job Description.

Rules:
1. STRICT TRUTHFULNESS & ZERO HALLUCINATIONS: Do not invent candidate experiences, degrees, or certifications that are not substantiated in the resume.
2. In rewrite suggestions, tailor existing candidate achievements to highlight relevant keywords from the job description while preserving verifiable facts.
3. Categorize readiness into Tiers 1-5:
   Tier 1: Major Skill Misalignment (<35% match)
   Tier 2: Developing Alignment (35-55% match, significant gaps)
   Tier 3: Moderate Fit (56-74% match, good core alignment)
   Tier 4: High Fit (75-89% match, minor gaps)
   Tier 5: Direct Alignment / Ready for Executive/Senior Interview (90%+)
4. Check for ATS formatting risks (tables, multi-column assumptions, missing quantitative metrics, buzzword stuffing).
5. Assess candidate seniority relative to the role.

Return pure JSON matching this exact structure:
{
  "matched_skills": ["Skill A", "Skill B"],
  "missing_skills": ["Skill X", "Skill Y"],
  "readiness_tier": 1 | 2 | 3 | 4 | 5,
  "readiness_rationale": "Detailed explanation of candidate fit score...",
  "qualitative_summary": "Executive summary outlining candidate's strongest alignments and strategic areas to highlight.",
  "rewrite_suggestions": [
    {
      "original_bullet": "Exact or summarized sentence from candidate resume",
      "suggested_bullet": "Strong action-driven STAR bullet incorporating relevant keywords without inventing new facts",
      "rationale": "Why this change improves ATS indexing and recruiter impact",
      "section": "Experience"
    }
  ],
  "ats_warnings": [
    "Actionable ATS advice or formatting warning"
  ],
  "seniority_assessment": "Junior" | "Mid-Level" | "Senior" | "Lead" | "Overqualified",
  "bias_flagged": false
}`;

      const userContent = `Candidate Resume:\n"""\n${resumeText}\n"""\n\nTarget Job Description:\n"""\n${jobDescription}\n"""\n\nPlease analyze the resume against this job description and return the structured JSON analysis.`;

      let responseText = "";
      let modelUsed = requestedModel;
      let lastError: any = null;

      // Try model candidates with retry backoff for 503 / 429 / high demand spikes
      for (const currentModel of modelCandidates) {
        let attempts = 0;
        const maxAttemptsForModel = 2;

        while (attempts < maxAttemptsForModel) {
          attempts++;
          try {
            const response = await ai.models.generateContent({
              model: currentModel,
              contents: userContent,
              config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                temperature: 0.0,
              },
            });

            if (response && response.text) {
              responseText = response.text;
              modelUsed = currentModel;
              lastError = null;
              break;
            }
          } catch (modelErr: any) {
            lastError = modelErr;
            const errMsg = String(modelErr?.message || modelErr?.status || modelErr);
            const isUnavailable = errMsg.includes("503") ||
              errMsg.includes("UNAVAILABLE") ||
              errMsg.includes("high demand") ||
              errMsg.includes("429") ||
              errMsg.includes("RESOURCE_EXHAUSTED");

            console.warn(`[Gemini Attempt] Model ${currentModel} attempt ${attempts} failed: ${errMsg}`);

            if (isUnavailable && attempts < maxAttemptsForModel) {
              // Wait briefly before retry on same model
              await new Promise((r) => setTimeout(r, attempts * 700));
            } else {
              // Break to next candidate model
              break;
            }
          }
        }

        if (responseText) {
          break; // Successfully generated response
        }
      }

      if (!responseText) {
        const isQuotaOrLimit = String(lastError?.message || "").includes("429") ||
          String(lastError?.message || "").includes("503") ||
          String(lastError?.message || "").includes("RESOURCE_EXHAUSTED");

        if (isQuotaOrLimit) {
          return res.status(429).json({
            error: "Our shared student server is experiencing high traffic. Please wait a minute, or optionally connect your own free Gemini / Groq key in Settings for instant dedicated bandwidth.",
            isRateLimited: true,
          });
        }
        throw lastError || new Error("All Gemini model candidates were temporarily unavailable.");
      }

      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch (parseErr) {
        // Attempt clean up of markdown code fences if present
        const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        parsedData = JSON.parse(cleaned);
      }

      const latencyMs = Date.now() - startTime;
      parsedData.provider_used = "Gemini";
      parsedData.provider_model = modelUsed;
      parsedData.latency_ms = latencyMs;

      return res.json(parsedData);
    } catch (err: any) {
      console.error("Gemini analysis error:", err);
      return res.status(500).json({
        error: err.message || "Failed to analyze resume with Gemini",
        details: String(err),
      });
    }
  });

  // Server-side Groq analysis proxy endpoint (Fallback / Alternative)
  app.post("/api/analyze-groq", async (req, res) => {
    const startTime = Date.now();
    try {
      const { resumeText, jobDescription, clientApiKey, customModel } = req.body;

      if (!resumeText || !jobDescription) {
        return res.status(400).json({ error: "resumeText and jobDescription are required" });
      }

      const apiKey = clientApiKey || process.env.GROQ_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: "No Groq API key configured on server or provided by client.",
          isKeyMissing: true,
        });
      }

      const requestedModel = customModel || "openai/gpt-oss-120b";
      const modelCandidates = Array.from(new Set([
        requestedModel,
        "openai/gpt-oss-120b",
        "openai/gpt-oss-20b",
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
      ]));

      const systemPrompt = `You are RoleFit, an elite Principal Career Architect and ATS Gap Analysis Engine.
Your role is to perform an exhaustive, evidence-based, factual gap analysis between a Candidate Resume and a Target Job Description.

Rules:
1. STRICT TRUTHFULNESS & ZERO HALLUCINATIONS: Do not invent candidate experiences, degrees, or certifications that are not substantiated in the resume.
2. In rewrite suggestions, tailor existing candidate achievements to highlight relevant keywords from the job description while preserving verifiable facts.
3. Categorize readiness into Tiers 1-5:
   Tier 1: Major Skill Misalignment (<35% match)
   Tier 2: Developing Alignment (35-55% match, significant gaps)
   Tier 3: Moderate Fit (56-74% match, good core alignment)
   Tier 4: High Fit (75-89% match, minor gaps)
   Tier 5: Direct Alignment / Ready for Executive/Senior Interview (90%+)
4. Check for ATS formatting risks (tables, multi-column assumptions, missing quantitative metrics, buzzword stuffing).
5. Assess candidate seniority relative to the role.

Return pure JSON matching this exact structure:
{
  "matched_skills": ["Skill A", "Skill B"],
  "missing_skills": ["Skill X", "Skill Y"],
  "readiness_tier": 1 | 2 | 3 | 4 | 5,
  "readiness_rationale": "Detailed explanation of candidate fit score...",
  "qualitative_summary": "Executive summary outlining candidate's strongest alignments and strategic areas to highlight.",
  "rewrite_suggestions": [
    {
      "original_bullet": "Exact or summarized sentence from candidate resume",
      "suggested_bullet": "Strong action-driven STAR bullet incorporating relevant keywords without inventing new facts",
      "rationale": "Why this change improves ATS indexing and recruiter impact",
      "section": "Experience"
    }
  ],
  "ats_warnings": [
    "Actionable ATS advice or formatting warning"
  ],
  "seniority_assessment": "Junior" | "Mid-Level" | "Senior" | "Lead" | "Overqualified",
  "bias_flagged": false
}`;

      const userContent = `Candidate Resume:\n"""\n${resumeText}\n"""\n\nTarget Job Description:\n"""\n${jobDescription}\n"""\n\nPlease analyze the resume against this job description and return the structured JSON analysis.`;

      let responseText = "";
      let modelUsed = requestedModel;
      let lastError: any = null;

      for (const currentModel of modelCandidates) {
        try {
          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey.trim()}`,
            },
            body: JSON.stringify({
              model: currentModel,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userContent },
              ],
              response_format: { type: "json_object" },
              temperature: 0.0,
              seed: 42,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;
            if (content) {
              responseText = content;
              modelUsed = currentModel;
              lastError = null;
              break;
            }
          } else {
            const errData = await response.json().catch(() => ({}));
            lastError = new Error(errData?.error?.message || `Groq HTTP ${response.status}`);
          }
        } catch (groqErr: any) {
          lastError = groqErr;
        }
      }

      if (!responseText) {
        throw lastError || new Error("All Groq model candidates were temporarily unavailable.");
      }

      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch (parseErr) {
        const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        parsedData = JSON.parse(cleaned);
      }

      const latencyMs = Date.now() - startTime;
      parsedData.provider_used = "Groq";
      parsedData.provider_model = modelUsed;
      parsedData.latency_ms = latencyMs;

      return res.json(parsedData);
    } catch (err: any) {
      console.error("Groq analysis error:", err);
      return res.status(500).json({
        error: err.message || "Failed to analyze resume with Groq",
        details: String(err),
      });
    }
  });

  // Server-side Cover Letter Generation endpoint
  app.post("/api/generate-cover-letter", async (req, res) => {
    try {
      const { resumeText, jobDescription, tone = "confident", clientApiKey, clientGroqKey, customModel } = req.body;

      if (!resumeText || !jobDescription) {
        return res.status(400).json({ error: "resumeText and jobDescription are required" });
      }

      const toneInstructions = {
        confident: "Direct, results-driven, crisp metrics, bold value proposition demonstrating immediate ROI.",
        enthusiastic: "Modern, collaborative, highly passionate about the company mission, technical velocity, and team culture.",
        executive: "Strategic, authoritative systems thinking, organizational leadership, and high-level architectural impact.",
      };

      const selectedToneGuidance = toneInstructions[tone as keyof typeof toneInstructions] || toneInstructions.confident;

      const prompt = `You are RoleFit, an elite Executive Career Architect.
Write a compelling, tailored, high-converting 3-paragraph cover letter for a candidate applying to the specified target job.

TONE: ${tone.toUpperCase()} — ${selectedToneGuidance}

STRICT EVIDENCE-BASED RULES:
1. Grounding: Reference ONLY real achievements, skills, and metrics substantiated in the Candidate Resume. NEVER invent fake companies, degrees, or unverifiable claims.
2. Structure:
   - Header & Salutation (e.g., Dear Hiring Team at [Company Name or Target Organization],)
   - Paragraph 1 (The Hook): State the target position immediately, articulate a clear value proposition, and show authentic alignment.
   - Paragraph 2 (Demonstrated Impact): Highlight 2-3 specific, quantified achievements from the resume that directly answer key requirements in the job description.
   - Paragraph 3 (Strategic Forward-Looking Fit): Explain how the candidate will solve the team's immediate challenges and contribute to technical velocity.
   - Professional Sign-off (Sincerely, [Candidate Name])
3. Length: ~250 - 350 words. Crisp, engaging, zero boilerplate fluff.

Candidate Resume:
"""
${resumeText}
"""

Target Job Description:
"""
${jobDescription}
"""

Output the pure, formatted cover letter text directly without markdown commentary or conversational preamble.`;

      const geminiKey = clientApiKey || process.env.GEMINI_API_KEY;
      const groqKey = clientGroqKey || process.env.GROQ_API_KEY;

      // 1. Try Gemini first
      if (geminiKey) {
        try {
          const ai = new GoogleGenAI({
            apiKey: geminiKey,
            httpOptions: { headers: { "User-Agent": "aistudio-build" } },
          });

          const modelCandidates = Array.from(new Set([
            customModel || "gemini-2.5-flash",
            "gemini-2.5-flash",
            "gemini-2.0-flash",
            "gemini-1.5-flash",
            "gemini-3.7-flash",
          ]));

          for (const modelName of modelCandidates) {
            try {
              const response = await ai.models.generateContent({
                model: modelName,
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                config: {
                  temperature: 0.3,
                  maxOutputTokens: 4096,
                },
              });

              if (response.text && response.text.trim().length > 80) {
                return res.json({ cover_letter: response.text.trim(), provider: "Gemini" });
              }
            } catch (err: any) {
              console.warn(`[Gemini Cover Letter ${modelName} Failed]:`, err.message);
            }
          }
        } catch (geminiErr: any) {
          console.warn("[Cover Letter Gemini Error]:", geminiErr.message);
        }
      }

      // 2. Try Groq fallback
      if (groqKey) {
        const groqCandidates = [
          "openai/gpt-oss-120b",
          "openai/gpt-oss-20b",
          "llama-3.3-70b-versatile",
          "llama-3.1-8b-instant",
        ];

        for (const currentGroqModel of groqCandidates) {
          try {
            const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${groqKey.trim()}`,
              },
              body: JSON.stringify({
                model: currentGroqModel,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.3,
                max_tokens: 2048,
              }),
            });

            if (groqRes.ok) {
              const data = await groqRes.json();
              const content = data.choices?.[0]?.message?.content;
              if (content && content.trim().length > 80) {
                return res.json({ cover_letter: content.trim(), provider: "Groq" });
              }
            }
          } catch (groqErr: any) {
            console.warn(`[Cover Letter Groq ${currentGroqModel} Error]:`, groqErr.message);
          }
        }
      }

      // 3. If both external APIs failed or unconfigured, return error to trigger client mock
      return res.status(503).json({ error: "External AI providers unavailable for cover letter generation." });
    } catch (e: any) {
      console.error("[Cover Letter Route Error]:", e);
      return res.status(500).json({ error: e.message });
    }
  });

  // Vite middleware in dev, static files in prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    const interfaces = os.networkInterfaces();
    const networkIps: string[] = [];
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name] || []) {
        if (iface.family === "IPv4" && !iface.internal) {
          networkIps.push(iface.address);
        }
      }
    }

    console.log(`\n  ➜  Local (PC):        http://localhost:${PORT}/`);
    if (networkIps.length > 0) {
      networkIps.forEach((ip) => {
        console.log(`  ➜  Network (Mobile):   http://${ip}:${PORT}/`);
      });
    } else {
      console.log(`  ➜  Network (Mobile):   http://<YOUR-PC-IP>:${PORT}/`);
    }
    console.log(`\n  💡 Tip for Mobile: Make sure your phone is connected to the same Wi-Fi as your PC, then open the Network URL above!\n`);
  });
}

startServer();
