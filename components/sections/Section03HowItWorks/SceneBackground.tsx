import type { CSSProperties } from "react";
import Image from "next/image";
import type { ProcessScene } from "./sceneData";

/* Controlled cinematic fallback when no photography is connected yet. */
export function sceneFallbackStyle(scene: ProcessScene): CSSProperties {
  const f = scene.fallback;
  return {
    background: [
      `radial-gradient(72% 56% at ${f.glowX} ${f.glowY}, rgba(185,138,78,${f.glowAlpha}), transparent 70%)`,
      `radial-gradient(90% 70% at 20% 12%, rgba(27,34,38,0.85), transparent 60%)`,
      `linear-gradient(0deg, rgba(5,7,10,0.6) 0%, transparent 34%)`,
      `linear-gradient(180deg, ${scene.grade} 0%, #0b0f12 100%)`,
    ].join(", "),
  };
}

export default function SceneBackground({ scene, index }: { scene: ProcessScene; index: number }) {
  return (
    <div
      data-scene-layer={index}
      className="s3-will absolute inset-0 z-10"
      style={{ opacity: 0 }}
      aria-hidden="true"
    >
      {/* camera wrapper — GSAP transforms this, never the raw <img> */}
      <div data-scene-cam={index} className="s3-will absolute inset-0">
        {scene.desktopImage ? (
          <>
            <div className="absolute inset-0 hidden md:block">
              <Image
                src={scene.desktopImage}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: scene.desktopPosition }}
              />
            </div>
            <div className="absolute inset-0 md:hidden">
              <Image
                src={scene.mobileImage ?? scene.desktopImage}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: scene.mobilePosition }}
              />
            </div>
          </>
        ) : (
          <div className="absolute inset-0" style={sceneFallbackStyle(scene)} />
        )}
      </div>
    </div>
  );
}