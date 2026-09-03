'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  expediente: {
    id: string;
    code: string;
    slug: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    conclusionTitle: string | null;
    conclusion: string | null;
  };
};

export default function EditExpedienteForm({
  expediente,
}: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(expediente.title);
  const [description, setDescription] = useState(
    expediente.description
  );
  const [category, setCategory] = useState(
    expediente.category
  );
  const [difficulty, setDifficulty] = useState(
    expediente.difficulty
  );
  const [conclusionTitle, setConclusionTitle] = useState(
    expediente.conclusionTitle ?? ''
  );
  const [conclusion, setConclusion] = useState(
    expediente.conclusion ?? ''
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function save() {
    setBusy(true);
    setMessage('');

    const response = await fetch(
      `/api/admin/expedientes/${expediente.id}/update`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          category,
          difficulty,
          conclusionTitle,
          conclusion,
        }),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setMessage(
        data.error || 'No se pudieron guardar los cambios.'
      );
      setBusy(false);
      return;
    }

    setMessage('Cambios guardados correctamente.');
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="card">
      <h2>Datos del expediente</h2>

      <p className="muted">
        Edita la información principal del expediente.
      </p>

      <div className="stack">
        <label>
          <span className="muted">Código</span>
          <input
            value={expediente.code}
            disabled
          />
        </label>

        <label>
          <span className="muted">Slug</span>
          <input
            value={expediente.slug}
            disabled
          />
        </label>

        <label>
          <span className="muted">Título</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label>
          <span className="muted">Descripción</span>
          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows={4}
          />
        </label>

        <label>
          <span className="muted">Categoría</span>
          <input
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          />
        </label>

        <label>
          <span className="muted">Dificultad</span>
          <input
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value)
            }
          />
        </label>

        <label>
          <span className="muted">
            Título de la conclusión
          </span>
          <input
            value={conclusionTitle}
            onChange={(e) =>
              setConclusionTitle(e.target.value)
            }
          />
        </label>

        <label>
          <span className="muted">
            Conclusión
          </span>
          <textarea
            value={conclusion}
            onChange={(e) =>
              setConclusion(e.target.value)
            }
            rows={6}
          />
        </label>

        <button
          type="button"
          className="btn"
          onClick={save}
          disabled={busy}
        >
          {busy ? 'Guardando…' : 'Guardar cambios'}
        </button>

        {message && (
          <p className="muted">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
