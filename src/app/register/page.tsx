'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const r = useRouter();

  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr('');
    const x = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (x.ok) r.push('/');
    else setErr((await x.json()).error || 'No fue posible crear la cuenta.');
  }

  return (
    <main className="authPage">
      <div className="authBackdrop" aria-hidden="true"><img src="/hero-puerta-317.svg" alt="" /></div>
      <div className="authShell">
        <Link className="brand authBrand" href="/">EL VAGO</Link>
        <section className="authCard">
          <p className="eyebrow">FORMATO DOCUMENTAL</p>
          <h1>Crear cuenta</h1>
          <p className="muted">Crea tu cuenta y comienza a investigar una nueva historia.</p>
          <form className="stack authForm" onSubmit={go}>
            <label>Email<input className="input" type="email" autoComplete="email" required placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} /></label>
            <label>Contraseña<input className="input" type="password" minLength={6} autoComplete="new-password" required placeholder="Mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} /></label>
            <button className="btn" type="submit">Comenzar investigación</button>
            {err && <div className="error">{err}</div>}
          </form>
          <p className="authFoot">¿Ya tienes cuenta? <Link href="/login">Entrar</Link></p>
        </section>
      </div>
    </main>
  );
}