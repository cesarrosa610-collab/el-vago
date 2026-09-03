'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  expedienteId: string;
  evidence: {
    id: string;
    code: string;
    title: string;
    description: string;
    unlockAfter: number;
  };
};

export default function EditEvidenceForm({
  expedienteId,
  evidence,
}: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(evidence.code);
  const [title, setTitle] = useState(evidence.title);
  const [description, setDescription] = useState(
    evidence.description
  );
  const [unlockAfter, setUnlockAfter] = useState(
    String(evidence.unlockAfter)
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function save() {
    setBusy(true);
    setMessage('');

    const response = await fetch(
      `/api/admin/expedientes/${expedienteId}/evidence/${evidence.id}`,
      {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          code,
          title,
          description,
          unlockAfter: Number(unlockAfter),
        }),
      }
    );

    const data = await response
      .json()
      .catch(() => ({}));

    if (!response.ok) {
      setMessage(
        data.error ||
          'No se pudo guardar la evidencia.'
      );
      setBusy(false);
      return;
    }

    setMessage(
      'Evidencia actualizada correctamente.'
    );
    setBusy(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <div style={{ marginTop: 12 }}>
      <button
        type="button"
        className="btn secondary"
        onClick={() => setOpen(!open)}
      >
        {open
          ? 'Cerrar edición'
          : 'Editar evidencia'}
      </button>

      {open && (
        <div
          className="stack"
          style={{ marginTop: 12 }}
        >
          <input
            className="input"
            value={code}
            onChange={(e) =>
              setCode(e.target.value)
            }
          />

          <input
            className="input"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <textarea
            className="input"
            rows={4}
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <input
            className="input"
            type="number"
            min={0}
            value={unlockAfter}
            onChange={(e) =>
              setUnlockAfter(e.target.value)
            }
          />

          <button
            type="button"
            className="btn"
            onClick={save}
            disabled={busy}
          >
            {busy
              ? 'Guardando…'
              : 'Guardar evidencia'}
          </button>

          {message && (
            <p className="muted">
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
