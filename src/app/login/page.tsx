'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const r = useRouter();

  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr('');
    const x = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (x.ok) r.push('/');
    else setErr((await x.json()).error || 'No fue posible iniciar sesión.');
  }

  return (
    <main className="authPage">
      <div className="authBackdrop" aria-hidden="true"><img src="/hero-puerta-317.svg" alt="" /></div>
      <div className="authShell">
        <Link className="brand authBrand" href="/">EL VAGO</Link>
        <section className="authCard">
          <p className="eyebrow">FICCIÓN INTERACTIVA</p>
          <h1>Entrar</h1>
          <p className="muted">Entra para continuar tus investigaciones y retomar tu progreso.</p>
          <form className="stack authForm" onSubmit={go}>
            <label>Email<input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" type="email" autoComplete="email" required /></label>
            <label>Contraseña<input className="input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" required /></label>
            <button className="btn" type="submit">Entrar al archivo</button>
            {err && <div className="error">{err}</div>}
          </form>
          <p className="authFoot">¿No tienes cuenta? <Link href="/register">Crear cuenta</Link></p>
        </section>
      </div>
    </main>
  );
}