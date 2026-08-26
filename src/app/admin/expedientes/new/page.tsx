'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function New() {
  const [f, setF] = useState({ code: '', title: '', slug: '', description: '' });
  const [m, setM] = useState('');
  const r = useRouter();

  async function go(e: React.FormEvent) {
    e.preventDefault(); setM('');
    const x = await fetch('/api/admin/expedientes', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(f),
    });
    const j = await x.json();
    if (x.ok) r.push(`/admin/expedientes/${j.expediente.id}`);
    else setM(j.error || 'Error');
  }

  return (
    <main className="wrap">
      <h1>Nuevo Expediente</h1>
      <form className="stack" onSubmit={go}>
        {Object.keys(f).map((k) => (
          <input className="input" key={k} required placeholder={k} value={(f as Record<string, string>)[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
        ))}
        <button className="btn">Crear expediente</button>
        {m && <p className="error">{m}</p>}
      </form>
    </main>
  );
}
