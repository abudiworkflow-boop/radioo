export interface Finding {
  id: number;
  observation: string;
  anatomicalLocation: string;
  severity: "critical" | "significant" | "incidental";
  confidence: "high" | "moderate" | "low";
  differentialDiagnosis: string[];
  evidenceFromKnowledgeBase: string;
  pineconeSources: string[];
}

export interface Recommendation {
  action: string;
  urgency: "immediate" | "urgent" | "routine";
  guideline: string;
  fleischnerCategory?: string;
}

export interface TechnicalQuality {
  overall: "adequate" | "suboptimal" | "poor";
  details: string;
}

export interface ReportHeader {
  exam: string;
  date: string;
  clinicalIndication: string;
  technique: string;
}

export interface MedicalReport {
  header: ReportHeader;
  findings: Finding[];
  impression: string;
  recommendations: Recommendation[];
  technicalQuality: TechnicalQuality;
  patientSummary: string;
  references: string[];
}

export interface AnalysisResponse {
  success: boolean;
  report: MedicalReport;
  disclaimer: string;
}

export interface AnalysisRequest {
  imageBase64: string;
  imageName: string;
  modality: string;
  bodyPart: string;
  clinicalContext: string;
}

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
