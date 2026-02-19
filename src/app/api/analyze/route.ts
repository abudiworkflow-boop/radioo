import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL!;

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

    const data = await n8nRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Analysis API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
