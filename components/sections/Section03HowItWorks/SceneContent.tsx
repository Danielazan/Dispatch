import type { ProcessScene } from "./sceneData";

/* Active-scene narration: masked chapter number + title + description. */
export default function SceneContent({ scene, index }: { scene: ProcessScene; index: number }) {
  return (
    <div
      data-scene-text={index}
      className="absolute inset-x-6 bottom-28 z-40 md:inset-x-auto md:bottom-auto md:right-[6%] md:top-1/2 md:w-[400px] md:-translate-y-1/2"
      style={{ opacity: 0 }}
    >
      <span className="block overflow-hidden">
        <span
          data-scene-num={index}
          className="block font-display text-[44px] font-semibold leading-none text-[var(--s3-brass-2)] md:text-[56px]"
        >
          {scene.number}
        </span>
      </span>

      <h3
        data-scene-title={index}
        className="mt-3 font-display text-[22px] font-semibold uppercase leading-[1.05] tracking-[0.01em] text-[var(--s3-ivory)] md:text-[26px]"
      >
        {scene.titleLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h3>

      <p
        data-scene-desc={index}
        className="mt-3 max-w-[36ch] text-[13px] leading-relaxed text-[var(--s3-text-2)] md:text-[14px]"
      >
        {scene.description}
      </p>
    </div>
  );
}