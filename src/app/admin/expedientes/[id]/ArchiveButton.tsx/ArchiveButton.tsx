'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ArchiveButton({
  expedienteId,
}: {
  expedienteId: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function archive() {
    const confirmed = window.confirm(
      '¿Seguro que quieres archivar este expediente? Dejará de aparecer públicamente, pero no se eliminará.'
    );

    if (!confirmed) return;

    setBusy(true);

    const response = await fetch(
      `/api/admin/expedientes/${expedienteId}/archive`,
      {
        method: 'POST',
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      window.alert(
        data.error || 'No se pudo archivar el expediente.'
      );
      setBusy(false);
      return;
    }

    router.push('/admin/expedientes');
    router.refresh();
  }

  return (
    <button
      type="button"
      className="btn secondary"
      onClick={archive}
      disabled={busy}
    >
      {busy ? 'Archivando…' : 'Archivar expediente'}
    </button>
  );
}
