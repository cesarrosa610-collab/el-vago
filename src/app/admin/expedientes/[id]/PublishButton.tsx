'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PublishButton({ expedienteId }: { expedienteId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function publish() {
    setBusy(true); setMessage('');
    const response = await fetch(`/api/admin/expedientes/${expedienteId}/publish`, { method: 'POST' });
    const data = await response.json().catch(() => ({}));
    if (response.ok) { setMessage('Expediente publicado.'); router.refresh(); }
    else setMessage(data.error || 'No se pudo publicar.');
    setBusy(false);
  }

  return <><button className="btn" onClick={publish} disabled={busy}>{busy ? 'Publicando…' : 'Publicar expediente'}</button>{message && <p className="muted">{message}</p>}</>;
}
