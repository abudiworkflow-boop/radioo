// === Urgency & Confidence Types ===
export type Urgency = "CRITICAL" | "URGENT" | "ROUTINE" | "INFORMATIONAL";
export type Confidence = "high" | "moderate" | "low";
export type Priority = "IMMEDIATE" | "URGENT" | "ROUTINE";

// === Technique ===
export interface TechniqueQuality {
  rotation: string;
  inspiration: string;
  exposure: string;
}

export interface Technique {
  view: string;
  position: string;
  quality: TechniqueQuality;
  limitations: string[];
}

// === Devices ===
export interface Device {
  type: string;
  status: string;
  details: string;
  confidence: string;
  urgency: string;
}

// === Findings ===
export interface Finding {
  system: string;
  finding: string;
  location: string;
  description: string;
  differential: string[];
  confidence: string;
  urgency: string;
}

// === Impression ===
export interface ImpressionItem {
  text: string;
  urgency: string;
}

// === Recommendations ===
export interface Recommendation {
  priority: string;
  text: string;
  rationale: string;
}

// === Safety ===
export interface Safety {
  not_a_diagnosis: boolean;
  radiologist_review_required: boolean;
  confidence_summary: string;
}

// === Full Report ===
export interface MedicalReport {
  technique: Technique;
  devices: Device[];
  findings: Finding[];
  impression: ImpressionItem[];
  recommendations: Recommendation[];
  safety: Safety;
}

// === API Response Envelope ===
export interface AnalysisResponse {
  success: boolean;
  report: MedicalReport;
  disclaimer: string;
}

// === API Request (unchanged) ===
export interface AnalysisRequest {
  imageBase64: string;
  imageName: string;
  modality: string;
  bodyPart: string;
  clinicalContext: string;
}

// === UI Constants ===
export type Modality = "xray" | "ct" | "mri" | "ultrasound" | "mammography";
export type BodyPart =
  | "chest"
  | "abdomen"
  | "head"
  | "spine"
  | "pelvis"
  | "extremity"
  | "neck"
  | "cardiac";

export const MODALITIES: { value: Modality; label: string }[] = [
  { value: "xray", label: "X-Ray" },
  { value: "ct", label: "CT Scan" },
  { value: "mri", label: "MRI" },
  { value: "ultrasound", label: "Ultrasound" },
  { value: "mammography", label: "Mammography" },
];

export const BODY_PARTS: { value: BodyPart; label: string }[] = [
  { value: "chest", label: "Chest" },
  { value: "abdomen", label: "Abdomen" },
  { value: "head", label: "Head / Brain" },
  { value: "spine", label: "Spine" },
  { value: "pelvis", label: "Pelvis" },
  { value: "extremity", label: "Extremity" },
  { value: "neck", label: "Neck" },
  { value: "cardiac", label: "Cardiac" },
];
