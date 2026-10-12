'use client';

import { useState } from 'react';

type Props = {
  progress?: number;
  status: string;
};

export default function AudiovisualScenePlayer({ progress = 0, status }: Props) {
  const [failed, setFailed] = useState(false);

  if (status === 'NOT_STARTED' || progress < 1) return null;

  return (
    <section
      aria-labelledby="ev001-video-title"
      style={{
        margin: '0 0 30px',
        border: '1px solid #292d30',
        borderRadius: 12,
        overflow: 'hidden',
        background: '#080a0b',
        boxShadow: '0 20px 60px rgba(0,0,0,.3)',
      }}
    >
      <div style={{
        padding: '13px 16px',
        borderBottom: '1px solid #292d30',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        <span style={{ color: '#929a9f', fontSize: 10, fontWeight: 800, letterSpacing: '.16em' }}>
          EVIDENCIA AUDIOVISUAL · EV-001
        </span>
        <span style={{ color: '#e50914', fontSize: 9, fontWeight: 800, letterSpacing: '.12em' }}>
          {failed ? 'VIDEO NO DISPONIBLE' : 'ARCHIVO AUTORIZADO'}
        </span>
      </div>

      {!failed ? (
        <video
          controls
          playsInline
          preload="metadata"
          poster="/door-317.jpg"
          onError={() => setFailed(true)}
          aria-label="Secuencia cinematográfica La Habitación 317"
          style={{ display: 'block', width: '100%', height: 'auto', maxHeight: '72vh', background: '#030405' }}
        >
          <source src="/ev001-habitacion-317-v10.mp4" type="video/mp4" />
          Tu navegador no puede reproducir este video.
        </video>
      ) : (
        <div style={{ padding: 22, color: '#b5bbbf', fontSize: 13, lineHeight: 1.6 }}>
          <strong style={{ display: 'block', color: '#fff', marginBottom: 6 }}>La secuencia audiovisual no está disponible todavía.</strong>
          La investigación puede continuar. El archivo MP4 final debe estar publicado en el servidor para habilitar la reproducción.
        </div>
      )}

      <div style={{ padding: '14px 16px 16px' }}>
        <h3 id="ev001-video-title" style={{ margin: '0 0 6px', color: '#f1f2f3', fontSize: 18, letterSpacing: '-.02em' }}>
          La Habitación 317
        </h3>
        <p style={{ margin: 0, color: '#929a9f', fontSize: 12, lineHeight: 1.6 }}>
          Secuencia de apertura · Melodía oscura, graves controlados y eco final.
        </p>
      </div>
    </section>
  );
}
