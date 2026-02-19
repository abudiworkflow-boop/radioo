"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { ImageUpload } from "@/components/image-upload";
import { MedicalReport } from "@/components/medical-report";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { analyzeImage } from "@/lib/api";
import type { AnalysisResponse } from "@/types";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze(data: {
    imageBase64: string;
    imageName: string;
    modality: string;
    bodyPart: string;
    clinicalContext: string;
  }) {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const result = await analyzeImage(data);
      setReport(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Analysis failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Upload Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm sticky top-8">
              <h2 className="text-base font-bold text-gray-900 mb-4">
                Upload Radiology Scan
              </h2>
              <ImageUpload onAnalyze={handleAnalyze} loading={loading} />
            </div>
          </div>

          {/* Right: Report */}
          <div className="lg:col-span-3">
            {loading && <LoadingSkeleton />}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
                <p className="text-sm text-red-700 font-medium">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-3 text-sm text-red-600 underline hover:text-red-800"
                >
                  Dismiss
                </button>
              </div>
            )}

            {report && <MedicalReport data={report} />}

            {!loading && !error && !report && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No Report Yet
                </h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Upload a radiology image and click &quot;Analyze Scan&quot; to
                  receive a detailed AI-assisted medical report.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
