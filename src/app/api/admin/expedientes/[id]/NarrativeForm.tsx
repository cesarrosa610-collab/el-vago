'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type NarrativeType =
  | 'CLUE'
  | 'QUESTION'
  | 'THEORY'
  | 'HYPOTHESIS'
  | 'TIMELINE';

const labels: Record<NarrativeType, string> = {
  CLUE: 'Pista',
  QUESTION: 'Pregunta',
  THEORY: 'Teoría',
  HYPOTHESIS: 'Hipótesis',
  TIMELINE: 'Línea de tiempo',
};

export default function NarrativeForm({
  expedienteId,
}: {
  expedienteId: string;
}) {
  const router = useRouter();

  const [type, setType] = useState<NarrativeType>('CLUE');
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [unlockAfter, setUnlockAfter] = useState('0');
  const [sortOrder, setSortOrder] = useState('0');
  const [isCorrect, setIsCorrect] = useState(false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  function reset() {
    setCode('');
    setTitle('');
    setBody('');
    setUnlockAfter('0');
    setSortOrder('0');
    setIsCorrect(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setBusy(true);
    setMessage('');

    const response = await fetch(
      `/api/admin/expedientes/${expedienteId}/narrative`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          type,
          code,
          title,
          body,
          unlockAfter: Number(unlockAfter),
          sortOrder: Number(sortOrder),
          isCorrect,
        }),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      reset();
      setMessage(`${labels[type]} agregada.`);
      router.refresh();
    } else {
      setMessage(data.error || 'No se pudo guardar.');
    }

    setBusy(false);
  }

  return (
    <form
      className="stack"
      onSubmit={submit}
      style={{ marginTop: 24 }}
    >
      <h3>Agregar contenido narrativo</h3>

      <select
        className="input"
        value={type}
        onChange={(e) =>
          setType(e.target.value as NarrativeType)
        }
      >
        {Object.entries(labels).map(
          ([value, label]) => (
            <option
              key={value}
              value={value}
            >
              {label}
            </option>
          )
        )}
      </select>

      <input
        className="input"
        required
        placeholder="Código (ej. C-301 / H-301)"
        value={code}
        onChange={(e) =>
          setCode(e.target.value)
        }
      />

      {type === 'QUESTION' ? (
        <textarea
          className="input"
          required
          rows={3}
          placeholder="Pregunta"
          value={body}
          onChange={(e) =>
            setBody(e.target.value)
          }
        />
      ) : (
        <>
          <input
            className="input"
            required
            placeholder={
              type === 'TIMELINE'
                ? 'Etiqueta / fecha'
                : 'Título'
            }
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <textarea
            className="input"
            required
            rows={4}
            placeholder="Descripción"
            value={body}
            onChange={(e) =>
              setBody(e.target.value)
            }
          />
        </>
      )}

      <input
        className="input"
        required
        min={0}
        type="number"
        placeholder="unlockAfter"
        value={unlockAfter}
        onChange={(e) =>
          setUnlockAfter(e.target.value)
        }
      />

      {type === 'TIMELINE' && (
        <input
          className="input"
          required
          min={0}
          type="number"
          placeholder="Orden"
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(e.target.value)
          }
        />
      )}

      {type === 'HYPOTHESIS' && (
        <label className="muted">
          <input
            type="checkbox"
            checked={isCorrect}
            onChange={(e) =>
              setIsCorrect(e.target.checked)
            }
          />{' '}
          Marcar como hipótesis correcta
        </label>
      )}

      <button
        className="btn"
        disabled={busy}
      >
        {busy
          ? 'Guardando…'
          : 'Agregar contenido'}
      </button>

      {message && (
        <p className="muted">
          {message}
        </p>
      )}
    </form>
  );
}
