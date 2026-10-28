'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type NarrativeType = 'CLUE' | 'QUESTION' | 'THEORY' | 'HYPOTHESIS' | 'TIMELINE';
type Item = { id: string; code: string; title: string; body: string; unlockAfter: number; sortOrder: number; isCorrect?: boolean };

export default function NarrativeEditForm({ expedienteId, item, type }: { expedienteId: string; item: Item; type: NarrativeType }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [code, setCode] = useState(item.code);
  const [title, setTitle] = useState(item.title);
  const [body, setBody] = useState(item.body);
  const [unlockAfter, setUnlockAfter] = useState(String(item.unlockAfter));
  const [sortOrder, setSortOrder] = useState(String(item.sortOrder));
  const [isCorrect, setIsCorrect] = useState(Boolean(item.isCorrect));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMessage('');
    try {
      const response = await fetch(`/api/admin/expedientes/${expedienteId}/narrative`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ type, itemId: item.id, code, title, body, unlockAfter: Number(unlockAfter), sortOrder: Number(sortOrder), isCorrect }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) { setMessage(data.error || 'No se pudo guardar.'); return; }
      setMessage('Cambios guardados.'); setEditing(false); router.refresh();
    } catch { setMessage('Error de conexión. Intenta nuevamente.'); }
    finally { setBusy(false); }
  }

  return <div style={{ marginTop: 10 }}>
    <button type="button" className="btn secondary" onClick={() => setEditing(!editing)}>{editing ? 'Cancelar edición' : 'Editar pieza'}</button>
    {editing && <form className="stack" onSubmit={save} style={{ marginTop: 12 }}>
      <input className="input" required value={code} onChange={e => setCode(e.target.value)} placeholder="Código" />
      {type !== 'QUESTION' && <input className="input" required value={title} onChange={e => setTitle(e.target.value)} placeholder={type === 'TIMELINE' ? 'Etiqueta / fecha' : 'Título'} />}
      <textarea className="input" required rows={4} value={body} onChange={e => setBody(e.target.value)} placeholder={type === 'QUESTION' ? 'Pregunta' : 'Descripción'} />
      <label className="muted">Desbloqueo después de evidencias<input className="input" required min={0} type="number" value={unlockAfter} onChange={e => setUnlockAfter(e.target.value)} /></label>
      <label className="muted">Orden<input className="input" required min={0} type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} /></label>
      {type === 'HYPOTHESIS' && <label className="muted"><input type="checkbox" checked={isCorrect} onChange={e => setIsCorrect(e.target.checked)} /> Marcar como hipótesis correcta</label>}
      <button className="btn" disabled={busy}>{busy ? 'Guardando…' : 'Guardar cambios'}</button>
    </form>}
    {message && <p className="muted" role="status">{message}</p>}
  </div>;
}
