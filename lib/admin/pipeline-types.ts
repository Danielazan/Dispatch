/* ============ pipeline-types v1 ============ */

export type PipelineStageId = 'submitted' | 'documents' | 'verification' | 'agreement' | 'ready' | 'approved';
export type PipelineBadgeTone = 'amber-outline' | 'amber' | 'green' | 'green-outline';
export type PipelineCardIcon = 'none' | 'spin' | 'hourglass' | 'check';

export interface StageSummary {
  stage: PipelineStageId;
  num: number;
  label: string;
  count: number;
  percentage: number;
  trend: number[];
}

export interface PipelineCardData {
  id: string;
  carrierName: string;
  mcNumber: string;
  submittedAt: string; // demo display string; integration pass swaps for ISO + shared formatter
  badge: string;
}

export interface PipelineColumnData {
  stage: PipelineStageId;
  total: number;
  cards: PipelineCardData[];
  extraCards: PipelineCardData[];
}

export interface AnalyticsStat { id: string; label: string; value: string; delta: string; tone: 'up-good' | 'down-good'; }

export interface PipelineAnalyticsData {
  ranges: string[];
  stats: AnalyticsStat[];
  seriesByRange: Record<string, number[]>;
  xLabelsByRange: Record<string, string[]>;
}

export interface DistributionSlice { stage: PipelineStageId; label: string; count: number; percentage: number; }
export interface BottleneckRow { id: PipelineStageId; label: string; carriers: number; sharePct: number; }

export interface CompanyInfo {
  legalName: string; dbaName: string; mcNumber: string; dotNumber: string;
  contactPerson: string; email: string; phone: string; addressLines: string[];
}
export interface ProgressStep { label: string; state: 'completed' | 'active' | 'pending'; note: string; }

export interface CarrierPipelineDetail {
  id: string;
  carrierName: string;
  leadId: string;
  mcNumber: string;
  submittedAt: string;
  stageIndex: number;
  stageLabel: string;
  company: CompanyInfo;
  progressPercent: number;
  steps: ProgressStep[];
}

export interface PipelineSnapshot {
  pipelineTotal: number;
  summaries: StageSummary[];
  columns: PipelineColumnData[];
  analytics: PipelineAnalyticsData;
  distribution: DistributionSlice[];
  bottlenecks: BottleneckRow[];
  details: Record<string, CarrierPipelineDetail>;
}