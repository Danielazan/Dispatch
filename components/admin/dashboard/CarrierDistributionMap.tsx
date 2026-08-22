/* ============ CarrierDistributionMap v1 ============ */
'use client';
import { useMemo } from 'react';
import type { CarrierRegion } from '@/lib/admin/admin-types';

/** Set true + drop assets into /public/assets/admin/dashboard/ when the generated map lands. */
const HAS_MAP_ASSET = false;
const MAP_ASSET = {
  desktop: '/images/admin/dashboard/carrier-distribution-map.webp',
  mobile: '/assets/admin/dashboard/carrier-distribution-map-mobile.webp',
};

/* Simplified US silhouette (percentage viewBox 0..100 / 0..62) for the dot-matrix fallback substrate. */
const US_OUTLINE: [number, number][] = [
  [3, 14], [10, 10], [20, 8], [40, 7], [60, 8], [72, 10], [80, 12], [88, 10], [93, 14],
  [90, 20], [86, 24], [84, 30], [80, 36], [76, 42], [70, 50], [74, 56], [71, 60], [67, 52],
  [62, 50], [56, 52], [50, 54], [46, 58], [42, 60], [38, 54], [34, 50], [28, 48], [22, 46],
  [16, 44], [12, 40], [8, 34], [5, 26], [3, 20],
];

function inside(x: number, y: number, poly: [number, number][]) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}
const seeded = (x: number, y: number) => {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return h - Math.floor(h);
};

function DotMapSubstrate() {
  const dots = useMemo(() => {
    const out: { x: number; y: number; fill: string; r: number }[] = [];
    for (let x = 3; x <= 95; x += 1.8) {
      for (let y = 7; y <= 60; y += 1.8) {
        if (!inside(x, y, US_OUTLINE)) continue;
        const s = seeded(x, y);
        out.push({
          x, y,
          r: 0.32 + s * 0.2,
          fill: s > 0.86 ? `rgba(255,173,24,${0.22 + s * 0.2})` : `rgba(255,255,255,${0.05 + s * 0.06})`,
        });
      }
    }
    return out;
  }, []);
  return (
    <svg viewBox="0 0 100 62" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <polygon points={US_OUTLINE.map((p) => p.join(',')).join(' ')} fill="#0a0e12" stroke="rgba(255,255,255,0.07)" strokeWidth="0.3" />
      {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.fill} />)}
    </svg>
  );
}

const CORE = { high: 10, medium: 7, low: 5 } as const;

export function CarrierDistributionMap({ regions }: { regions: CarrierRegion[] }) {
  return (
    <section
      data-dash="panel"
      aria-label="Carrier distribution across the United States. Highest concentration in the Midwest."
      className="flex flex-col rounded-lg border border-[var(--adm-b1)] p-5"
      style={{ background: 'var(--adm-s1)' }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-semibold tracking-[0.14em] text-[var(--adm-t2)]">CARRIER DISTRIBUTION</h2>
        <select
          aria-label="Group distribution by"
          className="h-8 rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] px-2 text-[11.5px] text-[var(--adm-t2)] focus:border-[rgba(245,158,11,0.42)] focus:outline-none"
          defaultValue="state"
        >
          <option value="state">By State</option>
          <option value="region">By Region</option>
        </select>
      </div>

      <div className="relative mt-4 flex-1 overflow-hidden rounded-md" style={{ background: '#080c10', minHeight: 240 }}>
        {HAS_MAP_ASSET ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={MAP_ASSET.desktop} alt="" className="h-full w-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        ) : null}
        <div className={HAS_MAP_ASSET ? 'absolute inset-0' : 'absolute inset-0 p-2'}>
          {!HAS_MAP_ASSET && <DotMapSubstrate />}
        </div>

        <div data-dash="map-scan" className="adm-scan" />

        {regions.map((r, i) => (
          <button
            key={r.id}
            data-dash="hotspot"
            className="adm-hotspot group"
            style={{ left: `${r.x}%`, top: `${r.y}%` }}
            aria-label={`${r.label}: ${r.count} carriers`}
          >
            <span className="halo" style={{ animationDelay: `${i * 0.4}s` }} />
            <span className="ring" style={{ animationDelay: `${i * 0.35}s` }} />
            <span className="core block" style={{ width: CORE[r.intensity], height: CORE[r.intensity] }} />
            <span className="pointer-events-none absolute left-1/2 top-[-26px] -translate-x-1/2 whitespace-nowrap rounded border border-[var(--adm-b2)] bg-[var(--adm-s3)] px-1.5 py-0.5 text-[10px] text-[var(--adm-t1)] opacity-0 transition-opacity group-hover:opacity-100">
              {r.label} • {r.count}
            </span>
          </button>
        ))}
      </div>

      <ul className="mt-4 flex items-center gap-5 text-[11px] text-[var(--adm-t3)]">
        <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: '#ffad18' }} /> High (200+)</li>
        <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: '#b97f10' }} /> Medium (50–199)</li>
        <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: '#4a5157' }} /> Low (1–49)</li>
      </ul>
    </section>
  );
}