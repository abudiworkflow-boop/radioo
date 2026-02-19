import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL!;

function normalizeResponse(raw: Record<string, unknown>): Record<string, unknown> {
  const data = raw as Record<string, unknown>;
  const report = (data.report || {}) as Record<string, unknown>;

  // --- Technique ---
  const rawTechnique = (report.technique || {}) as Record<string, unknown>;
  const rawQuality = (rawTechnique.quality || {}) as Record<string, unknown>;
  const technique = {
    view: String(rawTechnique.view || "unknown"),
    position: String(rawTechnique.position || "unknown"),
    quality: {
      rotation: String(rawQuality.rotation || "unknown"),
      inspiration: String(rawQuality.inspiration || "unknown"),
      exposure: String(rawQuality.exposure || "unknown"),
    },
    limitations: Array.isArray(rawTechnique.limitations)
      ? rawTechnique.limitations.map(String)
      : [],
  };

  // --- Devices ---
  const devices = Array.isArray(report.devices)
    ? report.devices.map((d: Record<string, unknown>) => ({
        type: String(d.type || "other"),
        status: String(d.status || "uncertain"),
        details: String(d.details || ""),
        confidence: String(d.confidence || "moderate").toLowerCase(),
        urgency: String(d.urgency || "INFORMATIONAL").toUpperCase(),
      }))
    : [];

  // --- Findings (handle both old severity and new urgency format) ---
  const findings = Array.isArray(report.findings)
    ? report.findings.map((f: Record<string, unknown>) => {
        const isOldFormat = "observation" in f && !("system" in f);

        if (isOldFormat) {
          const severityToUrgency: Record<string, string> = {
            critical: "CRITICAL",
            significant: "URGENT",
            incidental: "INFORMATIONAL",
          };
          return {
            system: "other",
            finding: String(f.observation || ""),
            location: String(
              f.anatomicalLocation || f.location || "Not specified"
            ),
            description: String(f.evidenceFromKnowledgeBase || f.observation || ""),
            differential: Array.isArray(f.differentialDiagnosis)
              ? f.differentialDiagnosis.map(String)
              : [],
            confidence: String(f.confidence || "moderate").toLowerCase(),
            urgency:
              severityToUrgency[
                String(f.severity || "").toLowerCase()
              ] || "ROUTINE",
          };
        }

        return {
          system: String(f.system || "other"),
          finding: String(f.finding || ""),
          location: String(f.location || ""),
          description: String(f.description || ""),
          differential: Array.isArray(f.differential)
            ? f.differential.map(String)
            : [],
          confidence: String(f.confidence || "moderate").toLowerCase(),
          urgency: String(f.urgency || "ROUTINE").toUpperCase(),
        };
      })
    : [];

  // --- Impression (handle string or array) ---
  let impression: { text: string; urgency: string }[];
  if (Array.isArray(report.impression)) {
    impression = report.impression.map((item: unknown) => {
      if (typeof item === "string") {
        return { text: item, urgency: "ROUTINE" };
      }
      const obj = item as Record<string, unknown>;
      return {
        text: String(obj.text || ""),
        urgency: String(obj.urgency || "ROUTINE").toUpperCase(),
      };
    });
  } else if (typeof report.impression === "string") {
    const lines = (report.impression as string).split(/\n/).filter((l) => l.trim());
    impression = lines.map((line) => ({
      text: line.replace(/^\d+\.\s*/, "").trim(),
      urgency: "ROUTINE",
    }));
  } else {
    impression = [];
  }

  // --- Recommendations (handle old action/urgency/guideline and new priority/text/rationale) ---
  const recommendations = Array.isArray(report.recommendations)
    ? report.recommendations.map((r: Record<string, unknown>) => {
        const isOldFormat = "action" in r && !("priority" in r);

        if (isOldFormat) {
          const urgencyToPriority: Record<string, string> = {
            immediate: "IMMEDIATE",
            urgent: "URGENT",
            routine: "ROUTINE",
          };
          return {
            priority:
              urgencyToPriority[
                String(r.urgency || "").toLowerCase()
              ] || "ROUTINE",
            text: String(r.action || ""),
            rationale: String(r.guideline || r.rationale || ""),
          };
        }

        return {
          priority: String(r.priority || "ROUTINE").toUpperCase(),
          text: String(r.text || ""),
          rationale: String(r.rationale || ""),
        };
      })
    : [];

  // --- Safety (always force booleans to true) ---
  const rawSafety = (report.safety || {}) as Record<string, unknown>;
  const safety = {
    not_a_diagnosis: true,
    radiologist_review_required: true,
    confidence_summary: String(
      rawSafety.confidence_summary ||
        "AI analysis complete. Radiologist review required."
    ),
  };

  return {
    success: true,
    report: {
      technique,
      devices,
      findings,
      impression,
      recommendations,
      safety,
    },
    disclaimer:
      data.disclaimer ||
      "This AI-generated analysis is for clinical decision support only. It does not constitute a medical diagnosis. All findings must be reviewed and confirmed by a qualified radiologist.",
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.imageBase64) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    const n8nRes = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageBase64: body.imageBase64,
        imageName: body.imageName || "scan.png",
        modality: body.modality || "xray",
        bodyPart: body.bodyPart || "chest",
        clinicalContext: body.clinicalContext || "",
      }),
    });

    if (!n8nRes.ok) {
      const text = await n8nRes.text().catch(() => "Workflow failed");
      console.error("n8n error:", n8nRes.status, text);
      return NextResponse.json(
        {
          error: `Analysis failed (${n8nRes.status}). Please try again with a valid radiology image.`,
        },
        { status: 502 }
      );
    }

    const text = await n8nRes.text();
    if (!text || text.trim() === "") {
      return NextResponse.json(
        { error: "No response from analysis pipeline. Please try again." },
        { status: 502 }
      );
    }

    let raw;
    try {
      raw = JSON.parse(text);
    } catch {
      console.error("Invalid JSON from n8n:", text.slice(0, 500));
      return NextResponse.json(
        { error: "Invalid response from analysis pipeline." },
        { status: 502 }
      );
    }

    // n8n lastNode mode may return array or object
    const data = Array.isArray(raw) ? raw[0] : raw;

    // Check for n8n error responses
    if (data?.message && !data?.report) {
      return NextResponse.json(
        { error: `Analysis error: ${data.message}` },
        { status: 502 }
      );
    }

    const normalized = normalizeResponse(data);
    return NextResponse.json(normalized);
  } catch (error) {
    console.error("Analysis API error:", error);
    return NextResponse.json(
      { error: "Failed to connect to analysis service. Please try again." },
      { status: 500 }
    );
  }
}
