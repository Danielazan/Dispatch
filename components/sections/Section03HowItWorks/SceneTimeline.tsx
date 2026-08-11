import { processScenes } from "./sceneData";

/* Industrial editorial annotation — thin lines, small nodes, no HUD. */
export default function SceneTimeline() {
  return (
    <div data-s3-ed="timeline" className="absolute inset-x-[clamp(24px,4vw,64px)] bottom-[6svh] z-[60]" style={{ opacity: 0 }}>
      <div className="relative">
        {/* base + continuous brass progress */}
        <div aria-hidden="true" className="absolute left-0 right-0 top-[30px] h-px bg-[var(--s3-border)]" />
        <div aria-hidden="true" data-s3="progress" className="absolute left-0 right-0 top-[30px] h-px origin-left bg-[var(--s3-brass)]" style={{ transform: "scaleX(0)" }} />

        <ol className="relative flex justify-between" aria-label="Process progress">
          {processScenes.map((scene, i) => (
            <li key={scene.id} className="flex flex-col items-center gap-2.5">
              <span data-s3-num={i} className="font-tech text-[11px] tracking-[0.18em] text-[var(--s3-text-4)]">
                {scene.number}
              </span>
              <span className="relative grid h-3 w-3 place-items-center">
                <span data-s3-ring={i} className="absolute inset-0 rounded-full border border-[var(--s3-border-2)]" style={{ opacity: 0 }} />
                <span data-s3-dot={i} className="h-1.5 w-1.5 rounded-full bg-[var(--s3-brass)]" style={{ transform: "scale(0)" }} />
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}