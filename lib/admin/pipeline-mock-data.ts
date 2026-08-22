/* ============ pipeline-mock-data v3 ============ */
import type {
  CarrierPipelineDetail, Paged, PipelineBadgeTone, PipelineCardData, PipelineCardIcon,
  PipelineSnapshot, PipelineStageId, ProgressStep,
} from './pipeline-types';

export const STAGE_META: Record<PipelineStageId, { num: number; label: string; badge: string; tone: PipelineBadgeTone; icon: PipelineCardIcon; fill: string }> = {
  submitted:    { num: 1, label: 'Application Submitted',    badge: 'New',       tone: 'amber-outline', icon: 'none',      fill: '#ffad18' },
  documents:    { num: 2, label: 'Documents Uploaded',       badge: 'Review',    tone: 'amber',         icon: 'none',      fill: '#e09612' },
  verification: { num: 3, label: 'Verification In Progress', badge: 'Verifying', tone: 'amber',         icon: 'spin',      fill: '#b97f10' },
  agreement:    { num: 4, label: 'Agreement Pending',        badge: 'Pending',   tone: 'amber-outline', icon: 'hourglass', fill: '#565f66' },
  ready:        { num: 5, label: 'Ready for Approval',       badge: 'Ready',     tone: 'green',         icon: 'check',     fill: '#3a4147' },
  approved:     { num: 6, label: 'Approved / Activate',      badge: 'Approved',  tone: 'green-outline', icon: 'none',      fill: '#22c55e' },
};

export const STAGE_ORDER: PipelineStageId[] = ['submitted', 'documents', 'verification', 'agreement', 'ready', 'approved'];

const card = (id: string, carrierName: string, mcNumber: string, submittedAt: string): PipelineCardData =>
  ({ id, carrierName, mcNumber, submittedAt, badge: STAGE_META[id.split('-')[1] as PipelineStageId]?.badge ?? '' });

const C = {
  submitted: [
    card('submitted-1', 'Titan Freight Systems', 'MC# 2345678', 'May 20, 2025 • 2:14 PM'),
    card('submitted-2', 'Road King Logistics', 'MC# 3456789', 'May 20, 2025 • 1:48 PM'),
    card('submitted-3', 'Summit Transport LLC', 'MC# 4567891', 'May 20, 2025 • 1:21 PM'),
    card('submitted-4', 'Velocity Carriers Inc.', 'MC# 5678912', 'May 20, 2025 • 12:57 PM'),
  ],
  submittedExtra: [
    card('submitted-5', 'Lone Star Hauling', 'MC# 7788123', 'May 20, 2025 • 11:12 AM'),
    card('submitted-6', 'Pacific Crest Freight', 'MC# 8899234', 'May 20, 2025 • 10:26 AM'),
    card('submitted-7', 'Ironline Logistics', 'MC# 9900345', 'May 20, 2025 • 9:44 AM'),
    card('submitted-8', 'Keystone Freight Co.', 'MC# 1011456', 'May 20, 2025 • 9:02 AM'),
  ],
  documents: [
    card('documents-1', 'Northern Star Freight', 'MC# 6789123', 'May 20, 2025 • 11:32 AM'),
    card('documents-2', 'Blue Line Freight', 'MC# 11223345', 'May 20, 2025 • 10:58 AM'),
    card('documents-3', 'Prime Haulers Inc.', 'MC# 9876543', 'May 20, 2025 • 10:41 AM'),
  ],
  documentsExtra: [
    card('documents-4', 'Redhawk Carriers', 'MC# 2233446', 'May 20, 2025 • 9:57 AM'),
    card('documents-5', 'Bayou Transport', 'MC# 3344557', 'May 20, 2025 • 9:15 AM'),
    card('documents-6', 'Great Lakes Carriers', 'MC# 4455668', 'May 19, 2025 • 6:48 PM'),
    card('documents-7', 'Desert Sun Freight', 'MC# 5566779', 'May 19, 2025 • 5:31 PM'),
  ],
  verification: [
    card('verification-1', 'Swift Transport Group', 'MC# 4567890', 'May 19, 2025 • 4:22 PM'),
    card('verification-2', 'Eagle Logistics LLC', 'MC# 2233445', 'May 19, 2025 • 3:11 PM'),
    card('verification-3', 'Haul Right Inc.', 'MC# 3344556', 'May 19, 2025 • 2:08 PM'),
  ],
  verificationExtra: [
    card('verification-4', 'Timberline Haulers', 'MC# 6677880', 'May 19, 2025 • 1:26 PM'),
    card('verification-5', 'Copper State Freight', 'MC# 7788991', 'May 19, 2025 • 11:54 AM'),
    card('verification-6', 'Northwind Logistics', 'MC# 8899002', 'May 19, 2025 • 10:19 AM'),
  ],
  agreement: [
    card('agreement-1', 'Mountain Movers LLC', 'MC# 7788990', 'May 18, 2025 • 9:14 AM'),
    card('agreement-2', 'United Roadways', 'MC# 8887776', 'May 18, 2025 • 8:33 AM'),
    card('agreement-3', 'Atlas Freight Co.', 'MC# 6677889', 'May 18, 2025 • 7:52 AM'),
  ],
  agreementExtra: [
    card('agreement-4', 'Silver State Transport', 'MC# 5566770', 'May 18, 2025 • 7:16 AM'),
    card('agreement-5', 'Harbor Line Carriers', 'MC# 4455661', 'May 18, 2025 • 6:40 AM'),
  ],
  ready: [
    card('ready-1', 'Coastal Carriers LLC', 'MC# 5566778', 'May 17, 2025 • 6:40 PM'),
    card('ready-2', 'Liberty Transport', 'MC# 4455667', 'May 17, 2025 • 5:28 PM'),
  ],
  readyExtra: [card('ready-3', 'Pinnacle Freight Systems', 'MC# 3344558', 'May 17, 2025 • 4:47 PM')],
  approved: [
    card('approved-1', 'Sunrise Logistics', 'MC# 1234432', 'May 17, 2025 • 3:15 PM'),
    card('approved-2', 'On Track Transport', 'MC# 4455772', 'May 17, 2025 • 1:47 PM'),
  ],
  approvedExtra: [
    card('approved-3', 'Ridgeway Carriers', 'MC# 2233447', 'May 17, 2025 • 11:58 AM'),
    card('approved-4', 'Falcon Freight LLC', 'MC# 1122334', 'May 17, 2025 • 10:22 AM'),
  ],
};

const STEP_LABELS = ['Application', 'Documents', 'Verification', 'Agreement', 'Approval', 'Activation'];

function stepsFor(stageIndex: number, docsNote: string): ProgressStep[] {
  return STEP_LABELS.map((label, i) => ({
    label,
    state: i < stageIndex ? 'completed' : i === stageIndex ? 'active' : 'pending',
    note: i === 1 && docsNote ? docsNote : i < stageIndex ? 'Completed' : 'Pending',
  }));
}

const TITAN_DETAIL: CarrierPipelineDetail = {
  id: 'submitted-1',
  carrierName: 'Titan Freight Systems',
  leadId: 'LD-2025-05120',
  mcNumber: 'MC# 2345678',
  submittedAt: 'May 20, 2025 • 2:14 PM',
  stageIndex: 0,
  stageLabel: 'Application Submitted',
  company: {
    legalName: 'Titan Freight Systems', dbaName: 'Titan Freight Systems',
    mcNumber: '2345678', dotNumber: '1234567', contactPerson: 'James Peterson',
    email: 'james@titanfreight.com', phone: '(312) 555-0142',
    addressLines: ['123 Industrial Pkwy', 'Chicago, IL 60601'],
  },
  progressPercent: 20,
  steps: [
    { label: 'Application', state: 'completed', note: 'Completed' },
    { label: 'Documents', state: 'active', note: '0/7' },
    { label: 'Verification', state: 'pending', note: 'Pending' },
    { label: 'Agreement', state: 'pending', note: 'Pending' },
    { label: 'Approval', state: 'pending', note: 'Pending' },
    { label: 'Activation', state: 'pending', note: 'Pending' },
  ],
};

const CONTACT_POOL = ['Dana Whitfield', 'Marcus Reed', 'Alicia Gomez', 'Sam Okafor', 'Priya Natarajan', 'Leo Kowalski'];
const CITY_POOL = ['Dallas, TX 75201', 'Atlanta, GA 30303', 'Phoenix, AZ 85004', 'Columbus, OH 43215', 'Denver, CO 80202'];

/** Deterministic believable fallback detail for any visible card (demo mode). */
export function buildCarrierDetail(c: PipelineCardData, stageIndex: number): CarrierPipelineDetail {
  const n = Number(c.id.split('-')[1] ?? 1);
  const slug = c.carrierName.toLowerCase().replace(/[^a-z]+/g, '');
  return {
    id: c.id,
    carrierName: c.carrierName,
    leadId: `LD-2025-051${20 + n}`,
    mcNumber: c.mcNumber,
    submittedAt: c.submittedAt,
    stageIndex,
    stageLabel: STAGE_META[STAGE_ORDER[stageIndex]].label,
    company: {
      legalName: c.carrierName, dbaName: c.carrierName,
      mcNumber: c.mcNumber.replace('MC# ', ''), dotNumber: `1${c.mcNumber.replace(/\D/g, '').slice(0, 6)}`,
      contactPerson: CONTACT_POOL[n % CONTACT_POOL.length],
      email: `dispatch@${slug.slice(0, 14)}.com`, phone: `(312) 555-01${String(10 + n).slice(-2)}`,
      addressLines: ['400 Freight Way', CITY_POOL[n % CITY_POOL.length]],
    },
    progressPercent: Math.round(((stageIndex + 1) / 6) * 100),
    steps: stepsFor(stageIndex, stageIndex >= 1 ? '7/7' : '0/7'),
  };
}

const SNAPSHOT: PipelineSnapshot = {
  pipelineTotal: 312,
  summaries: [
    { stage: 'submitted', num: 1, label: 'Application Submitted', count: 118, percentage: 37.8, trend: [30, 34, 32, 38, 41, 44, 48] },
    { stage: 'documents', num: 2, label: 'Documents Uploaded', count: 96, percentage: 30.8, trend: [22, 25, 24, 28, 30, 33, 36] },
    { stage: 'verification', num: 3, label: 'Verification In Progress', count: 54, percentage: 17.3, trend: [12, 15, 14, 18, 17, 21, 24] },
    { stage: 'agreement', num: 4, label: 'Agreement Pending', count: 28, percentage: 9.0, trend: [6, 8, 7, 9, 10, 12, 13] },
    { stage: 'ready', num: 5, label: 'Ready for Approval', count: 12, percentage: 3.8, trend: [3, 4, 4, 5, 6, 7, 8] },
    { stage: 'approved', num: 6, label: 'Approved / Activate', count: 4, percentage: 1.3, trend: [1, 2, 2, 3, 3, 4, 4] },
  ],
  columns: [
    { stage: 'submitted', total: 118, cards: C.submitted, extraCards: C.submittedExtra },
    { stage: 'documents', total: 96, cards: C.documents, extraCards: C.documentsExtra },
    { stage: 'verification', total: 54, cards: C.verification, extraCards: C.verificationExtra },
    { stage: 'agreement', total: 28, cards: C.agreement, extraCards: C.agreementExtra },
    { stage: 'ready', total: 12, cards: C.ready, extraCards: C.readyExtra },
    { stage: 'approved', total: 4, cards: C.approved, extraCards: C.approvedExtra },
  ],
  analytics: {
    ranges: ['Last 7 Days', 'Last 30 Days', 'Last 90 Days'],
    stats: [
      { id: 'conversion', label: 'Conversion Rate', value: '3.4%', delta: '↑ 1.2% vs Apr 20 – May 19', tone: 'up-good' },
      { id: 'avg-time', label: 'Average Time in Pipeline', value: '12.6 Days', delta: '↓ 2.4 Days vs Apr 20 – May 19', tone: 'down-good' },
      { id: 'completed', label: 'Completed Onboardings', value: '28', delta: '↑ 7 vs Apr 20 – May 19', tone: 'up-good' },
    ],
    seriesByRange: {
      'Last 7 Days': [44, 47, 45, 50, 52, 51, 55],
      'Last 30 Days': [26, 28, 27, 30, 32, 31, 34, 38, 40, 42, 41, 44, 47, 50, 55],
      'Last 90 Days': [18, 22, 20, 26, 24, 30, 28, 34, 38, 36, 42, 46, 50, 55],
    },
    xLabelsByRange: {
      'Last 7 Days': ['May 14', 'May 16', 'May 18', 'May 20'],
      'Last 30 Days': ['Apr 21', 'Apr 28', 'May 5', 'May 12', 'May 19'],
      'Last 90 Days': ['Feb 20', 'Mar 20', 'Apr 20', 'May 19'],
    },
  },
  distribution: [
    { stage: 'submitted', label: 'Application Submitted', count: 118, percentage: 37.8 },
    { stage: 'documents', label: 'Documents Uploaded', count: 96, percentage: 30.8 },
    { stage: 'verification', label: 'Verification In Progress', count: 54, percentage: 17.3 },
    { stage: 'agreement', label: 'Agreement Pending', count: 28, percentage: 9.0 },
    { stage: 'ready', label: 'Ready for Approval', count: 12, percentage: 3.8 },
    { stage: 'approved', label: 'Approved / Activate', count: 4, percentage: 1.3 },
  ],
  bottlenecks: [
    { id: 'documents', label: 'Documents Uploaded', carriers: 96, sharePct: 30.8 },
    { id: 'verification', label: 'Verification In Progress', carriers: 54, sharePct: 17.3 },
    { id: 'agreement', label: 'Agreement Pending', carriers: 28, sharePct: 9.0 },
  ],
  details: { 'submitted-1': TITAN_DETAIL },
};

/** Typed mock adapter. Integration pass: replace with GET /api/leads?status=… aggregates + GET /api/carriers lists. */
export async function getPipelineSnapshot(): Promise<PipelineSnapshot> {
  await new Promise((r) => setTimeout(r, 420));
  return SNAPSHOT;
}

/* ------------------------------------------------------------------ */
/* v3 — FULL STAGE QUEUES (paginated, backend-envelope shaped)         */
/* Integration pass: swap body for GET /api/leads?status=…&page=&q=    */
/* ------------------------------------------------------------------ */

const NAME_A = ['Redhawk', 'Lone Star', 'Pacific Crest', 'Ironline', 'Keystone', 'Bayou', 'Great Lakes', 'Desert Sun', 'Timberline', 'Copper State', 'Northwind', 'Silver State', 'Harbor Line', 'Pinnacle', 'Ridgeway', 'Falcon', 'Granite', 'Blue Ridge', 'Prairie', 'Lakeshore', 'Crimson', 'Zenith', 'Vector', 'Horizon', 'Iron Gate', 'Stonebridge', 'Windrow', 'Summit Ridge', 'Cobalt', 'Atlas'];
const NAME_B = ['Carriers', 'Freight', 'Logistics', 'Hauling', 'Transport', 'Freight Systems', 'Carriers LLC', 'Transport LLC', 'Logistics Inc.', 'Lines'];
const NAME_C = ['', 'LLC', 'Inc.', 'Co.', 'Group'];

const QUEUE_CACHE: Partial<Record<PipelineStageId, PipelineCardData[]>> = {};

function fullQueue(stage: PipelineStageId): PipelineCardData[] {
  const cached = QUEUE_CACHE[stage];
  if (cached) return cached;
  const col = SNAPSHOT.columns.find((c) => c.stage === stage);
  if (!col) return [];
  const list = [...col.cards, ...col.extraCards];
  let i = list.length;
  while (list.length < col.total) {
    const name = `${NAME_A[(i * 7 + 3) % NAME_A.length]} ${NAME_B[(i * 11 + 5) % NAME_B.length]}${NAME_C[(i * 5 + 1) % NAME_C.length] ? ' ' + NAME_C[(i * 5 + 1) % NAME_C.length] : ''}`;
    const mc = `MC# ${String(2000000 + ((i * 137 + 41) % 7999999))}`;
    const day = 1 + ((i * 3) % 19);
    const hour24 = 7 + ((i * 5) % 11);
    const h12 = ((hour24 + 11) % 12) + 1;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    const min = String((i * 17) % 60).padStart(2, '0');
    list.push(card(`${stage}-${list.length + 1}`, name, mc, `May ${day}, 2025 • ${h12}:${min} ${ampm}`));
    i++;
  }
  QUEUE_CACHE[stage] = list;
  return list;
}

/** Paginated, searchable queue for one stage — mirrors the backend Paged<T> envelope exactly. */
export async function getStageQueue(stage: PipelineStageId, page: number, pageSize: number, query = ''): Promise<Paged<PipelineCardData>> {
  await new Promise((r) => setTimeout(r, 160));
  const all = fullQueue(stage);
  const q = query.trim().toLowerCase();
  const filtered = q ? all.filter((c) => c.carrierName.toLowerCase().includes(q) || c.mcNumber.toLowerCase().includes(q)) : all;
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const items = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  return { items, page: safePage, pageSize, totalItems, totalPages };
}