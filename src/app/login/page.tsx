'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const r = useRouter();

  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const x = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (x.ok) {
      r.push('/');
    } else {
      setErr((await x.json()).error || 'Error');
    }
  }

  return (
    <main className="wrap">
      <h1>Entrar</h1>

      <form className="stack" onSubmit={go}>
        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          type="email"
          required
        />

        <input
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="contraseña"
          required
        />

        <button className="btn" type="submit">
          Entrar
        </button>

        {err && <div className="error">{err}</div>}
      </form>
    </main>
  );
}
