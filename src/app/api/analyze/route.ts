import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL!;

function normalizeResponse(raw: Record<string, unknown>): Record<string, unknown> {
  const data = raw as Record<string, unknown>;
  const report = (data.report || {}) as Record<string, unknown>;

  // Normalize findings
  const findings = Array.isArray(report.findings)
    ? report.findings.map((f: Record<string, unknown>, i: number) => ({
        id: f.id ?? i + 1,
        observation: f.observation || f.finding || "",
        anatomicalLocation: f.anatomicalLocation || f.location || "Not specified",
        severity: String(f.severity || "incidental").toLowerCase(),
        confidence: String(f.confidence || "moderate").toLowerCase(),
        differentialDiagnosis: Array.isArray(f.differentialDiagnosis)
          ? f.differentialDiagnosis
          : [],
        evidenceFromKnowledgeBase: f.evidenceFromKnowledgeBase || f.evidence || "",
        pineconeSources: Array.isArray(f.pineconeSources) ? f.pineconeSources : [],
      }))
    : [];

  // Normalize recommendations
  const recommendations = Array.isArray(report.recommendations)
    ? report.recommendations.map((r: Record<string, unknown>) => ({
        action: r.action || "",
        urgency: String(r.urgency || "routine").toLowerCase(),
        guideline: r.guideline || r.rationale || r.reference || "",
        fleischnerCategory: r.fleischnerCategory || undefined,
      }))
    : [];

  // Normalize technical quality
  const tq = (report.technicalQuality || {}) as Record<string, unknown>;
  const overallRaw = String(tq.overall || "adequate").toLowerCase();
  const overallMap: Record<string, string> = {
    adequate: "adequate",
    good: "adequate",
    excellent: "adequate",
    suboptimal: "suboptimal",
    limited: "suboptimal",
    poor: "poor",
  };
  const overall = overallMap[overallRaw] || "suboptimal";

  return {
    success: true,
    report: {
      header: report.header || {
        exam: "Radiology Study",
        date: new Date().toISOString().split("T")[0],
        clinicalIndication: "Not provided",
        technique: "Standard imaging",
      },
      findings,
      impression: report.impression || "Analysis complete.",
      recommendations,
      technicalQuality: { overall, details: String(tq.details || "") },
      patientSummary: report.patientSummary || "",
      references: Array.isArray(report.references) ? report.references : [],
    },
    disclaimer:
      data.disclaimer ||
      "This AI-assisted analysis is for educational and clinical decision support only. It does not constitute a definitive diagnosis.",
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
      return NextResponse.json(
        { error: `Analysis failed: ${text}` },
        { status: n8nRes.status }
      );
    }

    const raw = await n8nRes.json();
    // n8n returns array from Respond to Webhook — unwrap
    const data = Array.isArray(raw) ? raw[0] : raw;
    const normalized = normalizeResponse(data);

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("Analysis API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
