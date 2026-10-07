"use client";

import { useState } from "react";

export type AudiovisualScene = {
  id: string;
  title: string;
  description?: string;
  type: "INTRO" | "EVIDENCE" | "CLUE" | "RECONSTRUCTION" | "OUTRO";
  src: string;
  poster?: string;
  unlockAtProgress?: number;
};

type AudiovisualScenePlayerProps = {
  scene: AudiovisualScene;
  progress?: number;
};

export default function AudiovisualScenePlayer({
  scene,
  progress = 0,
}: AudiovisualScenePlayerProps) {
  const [failed, setFailed] = useState(false);
  const locked =
    typeof scene.unlockAtProgress === "number" &&
    progress < scene.unlockAtProgress;

  if (locked) {
    return (
      <section className="audiovisual-scene audiovisual-scene--locked" aria-label="Contenido audiovisual bloqueado">
        <div className="audiovisual-scene__poster">
          {scene.poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={scene.poster} alt="" loading="lazy" />
          ) : null}
          <div className="audiovisual-scene__overlay">
            <span className="audiovisual-scene__eyebrow">EVIDENCIA AUDIOVISUAL</span>
            <strong>Contenido bloqueado</strong>
            <span>Continúa la investigación para desbloquear esta pieza.</span>
          </div>
        </div>
      </section>
    );
  }

  if (!scene.src) {
    return (
      <section className="audiovisual-scene audiovisual-scene--fallback" aria-label={scene.title}>
        {scene.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={scene.poster} alt="" loading="lazy" />
        ) : null}
        <div>
          <span className="audiovisual-scene__eyebrow">EVIDENCIA AUDIOVISUAL · V2.1</span>
          <strong>{scene.title}</strong>
          <p>La estructura está lista. La pieza audiovisual original se cargará aquí antes de publicar esta escena.</p>
        </div>
      </section>
    );
  }

  if (failed) {
    return (
      <section className="audiovisual-scene audiovisual-scene--fallback" aria-label={scene.title}>
        {scene.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={scene.poster} alt="" loading="lazy" />
        ) : null}
        <div>
          <span className="audiovisual-scene__eyebrow">EVIDENCIA AUDIOVISUAL</span>
          <strong>{scene.title}</strong>
          <p>Esta pieza no pudo reproducirse. La investigación puede continuar.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="audiovisual-scene" aria-labelledby={`scene-${scene.id}`}>
      <div className="audiovisual-scene__player">
        <video
          controls
          playsInline
          preload="metadata"
          poster={scene.poster}
          onError={() => setFailed(true)}
        >
          <source src={scene.src} />
          Tu navegador no puede reproducir este video.
        </video>
      </div>
      <div className="audiovisual-scene__meta">
        <span className="audiovisual-scene__eyebrow">EVIDENCIA AUDIOVISUAL</span>
        <h3 id={`scene-${scene.id}`}>{scene.title}</h3>
        {scene.description ? <p>{scene.description}</p> : null}
      </div>
    </section>
  );
}
