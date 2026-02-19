"use client";

import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MODALITIES, BODY_PARTS } from "@/types";
import type { Modality, BodyPart } from "@/types";

interface ImageUploadProps {
  onAnalyze: (data: {
    imageBase64: string;
    imageName: string;
    modality: string;
    bodyPart: string;
    clinicalContext: string;
  }) => void;
  loading: boolean;
}

const MAX_SIZE_MB = 20;

export function ImageUpload({ onAnalyze, loading }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [modality, setModality] = useState<Modality>("xray");
  const [bodyPart, setBodyPart] = useState<BodyPart>("chest");
  const [clinicalContext, setClinicalContext] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File must be under ${MAX_SIZE_MB}MB`);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPEG, DICOM)");
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImageBase64(base64);
      setPreview(base64);
    };
    reader.readAsDataURL(file);
  }, []);

  const clearImage = () => {
    setPreview(null);
    setFileName("");
    setImageBase64("");
    setError(null);
  };

  const handleSubmit = () => {
    if (!imageBase64) return;
    onAnalyze({
      imageBase64,
      imageName: fileName,
      modality,
      bodyPart,
      clinicalContext,
    });
  };

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      {!preview ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
          }}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all",
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files?.[0] && handleFile(e.target.files[0])
            }
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-700 font-medium">
            Drop radiology image here or click to browse
          </p>
          <p className="text-sm text-gray-400 mt-1">
            PNG, JPEG up to {MAX_SIZE_MB}MB
          </p>
        </div>
      ) : (
        <div className="relative border rounded-xl overflow-hidden bg-black">
          <button
            onClick={clearImage}
            className="absolute top-3 right-3 z-10 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <img
            src={preview}
            alt="Uploaded scan"
            className="w-full max-h-80 object-contain"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <div className="flex items-center gap-2 text-white text-sm">
              <ImageIcon className="w-4 h-4" />
              <span className="truncate">{fileName}</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Modality
          </label>
          <select
            value={modality}
            onChange={(e) => setModality(e.target.value as Modality)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {MODALITIES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Body Part
          </label>
          <select
            value={bodyPart}
            onChange={(e) => setBodyPart(e.target.value as BodyPart)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {BODY_PARTS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Clinical Context{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={clinicalContext}
          onChange={(e) => setClinicalContext(e.target.value)}
          placeholder="e.g., 55-year-old male, persistent cough for 3 weeks"
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!imageBase64 || loading}
        className={cn(
          "w-full py-3 px-4 rounded-lg font-medium text-sm transition-all",
          imageBase64 && !loading
            ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        )}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            AI Radiologist Analyzing...
          </span>
        ) : (
          "Analyze Scan"
        )}
      </button>
    </div>
  );
}
