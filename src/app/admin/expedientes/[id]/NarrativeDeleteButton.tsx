'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type NarrativeType =
  | 'CLUE'
  | 'QUESTION'
  | 'THEORY'
  | 'HYPOTHESIS'
  | 'TIMELINE';

export default function NarrativeDeleteButton({
  expedienteId,
  itemId,
  type,
  code,
}: {
  expedienteId: string;
  itemId: string;
  type: NarrativeType;
  code: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    const confirmed = window.confirm(
      `¿Eliminar la pieza ${code}? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    setBusy(true);

    const response = await fetch(
      `/api/admin/expedientes/${expedienteId}/narrative`,
      {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          type,
          itemId,
        }),
      }
    );

    if (response.ok) {
      router.refresh();
    } else {
      const data = await response.json().catch(() => ({}));
      window.alert(
        data.error || 'No se pudo eliminar la pieza.'
      );
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      className="btn secondary"
      onClick={remove}
      disabled={busy}
      style={{ marginTop: 10 }}
    >
      {busy ? 'Eliminando…' : 'Eliminar pieza'}
    </button>
  );
}
