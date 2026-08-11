import { processScenes } from "./sceneData";

/* Completed-state timeline for the reduced-motion fallback. */
export default function SceneTimelineStatic() {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute left-0 right-0 top-[30px] h-px bg-[var(--s3-brass)]" />
      <ol className="relative flex justify-between" aria-label="Process steps">
        {processScenes.map((scene) => (
          <li key={scene.id} className="flex flex-col items-center gap-2.5">
            <span className="font-tech text-[11px] tracking-[0.18em] text-[var(--s3-ivory)]">{scene.number}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--s3-brass)]" />
          </li>
        ))}
      </ol>
    </div>
  );
}