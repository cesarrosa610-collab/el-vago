'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteDraftButton({
  expedienteId,
}: {
  expedienteId: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    const confirmed = window.confirm(
      '¿Seguro que quieres eliminar este expediente DRAFT? Esta acción no se puede deshacer.'
    );

    if (!confirmed) return;

    setBusy(true);

    const response = await fetch(
      `/api/admin/expedientes/${expedienteId}/delete`,
      {
        method: 'DELETE',
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      window.alert(
        data.error || 'No se pudo eliminar el expediente.'
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
      onClick={remove}
      disabled={busy}
    >
      {busy
        ? 'Eliminando…'
        : 'Eliminar expediente DRAFT'}
    </button>
  );
}
