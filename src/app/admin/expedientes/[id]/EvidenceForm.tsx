'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EvidenceForm({ expedienteId }: { expedienteId: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ code: '', title: '', description: '', unlockAfter: '0' });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMessage('');
    const response = await fetch(`/api/admin/expedientes/${expedienteId}/evidence`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...form, unlockAfter: Number(form.unlockAfter) }),
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setForm({ code: '', title: '', description: '', unlockAfter: '0' });
      setMessage('Evidencia agregada.'); router.refresh();
    } else setMessage(data.error || 'No se pudo agregar la evidencia.');
    setBusy(false);
  }

  return (
    <form className="stack" onSubmit={submit} style={{ marginTop: 24 }}>
      <h3>Agregar evidencia</h3>
      <input className="input" required placeholder="Código (ej. E-301)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
      <input className="input" required placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <textarea className="input" required placeholder="Descripción" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input className="input" required min={0} type="number" placeholder="unlockAfter" value={form.unlockAfter} onChange={(e) => setForm({ ...form, unlockAfter: e.target.value })} />
      <button className="btn" disabled={busy}>{busy ? 'Guardando…' : 'Agregar evidencia'}</button>
      {message && <p className="muted">{message}</p>}
    </form>
  );
}
