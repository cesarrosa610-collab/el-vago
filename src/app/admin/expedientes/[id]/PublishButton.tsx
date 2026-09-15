'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Status = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | '';

export default function PublishButton({
  expedienteId,
}: {
  expedienteId: string;
}) {
  const router = useRouter();

  const [status, setStatus] = useState<Status>('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      try {
        const response = await fetch(
          `/api/admin/expedientes/${expedienteId}/publish`,
          {
            cache: 'no-store',
          }
        );

        const data = await response.json();

        if (!cancelled && response.ok) {
          setStatus(data.status || '');
        }
      } catch {
        if (!cancelled) {
          setMessage(
            'No se pudo comprobar el estado del expediente.'
          );
        }
      }
    }

    loadStatus();

    return () => {
      cancelled = true;
    };
  }, [expedienteId]);

  async function execute() {
    setBusy(true);
    setMessage('');

    try {
      const response = await fetch(
        `/api/admin/expedientes/${expedienteId}/publish`,
        {
          method: 'POST',
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        if (data.action === 'RESTORED') {
          setMessage(
            'Expediente restaurado para edición.'
          );
        } else {
          setMessage('Expediente publicado.');
        }

        router.refresh();
      } else {
        setMessage(
          data.error || 'No se pudo completar la acción.'
        );
      }
    } catch {
      setMessage(
        'No se pudo completar la acción.'
      );
    } finally {
      setBusy(false);
    }
  }

  const isArchived = status === 'ARCHIVED';

  return (
    <>
      <button
        className="btn"
        onClick={execute}
        disabled={busy}
      >
        {busy
          ? isArchived
            ? 'Restaurando…'
            : 'Publicando…'
          : isArchived
            ? 'Restaurar para editar'
            : 'Publicar expediente'}
      </button>

      {message && (
        <p className="muted">
          {message}
        </p>
      )}
    </>
  );
}
