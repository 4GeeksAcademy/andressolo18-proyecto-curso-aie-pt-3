"use client";

import { useEffect, useState, type FormEvent } from "react";
import { apiErrorMessage, recordsApiUrl } from "./api";
import type { CandidateNote } from "./types";

const statusOptions = [
  ["received", "Recibida"],
  ["in_progress", "En proceso"],
  ["discarded", "Descartada"],
];

const stageOptions = [
  ["pending", "Pendiente"],
  ["review", "Revisión"],
  ["personal_interview", "Entrevista personal"],
  ["technical_interview", "Entrevista técnica"],
];

async function getNotes(recordId: string, signal?: AbortSignal) {
  const response = await fetch(recordsApiUrl(`records/${recordId}/notes`), {
    cache: "no-store",
    signal,
  });
  if (!response.ok) throw new Error("No se pudieron cargar las notas.");
  const result = (await response.json()) as { data: CandidateNote[] };
  return result.data;
}

function formatNoteDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function CandidateNotes({ recordId }: { recordId: string }) {
  const [notes, setNotes] = useState<CandidateNote[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadNotes() {
      try {
        const loadedNotes = await getNotes(recordId, controller.signal);
        setNotes(loadedNotes);
      } catch {
        if (!controller.signal.aborted) setError("No se pudieron cargar las notas.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadNotes();

    return () => controller.abort();
  }, [recordId]);

  async function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const noteContent = content.trim();
    if (!noteContent) return;

    setSaving(true);
    setError(null);
    try {
      const response = await fetch(recordsApiUrl(`records/${recordId}/notes`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: noteContent }),
      });
      if (!response.ok) throw new Error(await apiErrorMessage(response));

      setContent("");
      setNotes(await getNotes(recordId));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo añadir la nota.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteNote(noteId: string) {
    setDeletingId(noteId);
    setError(null);
    try {
      const response = await fetch(
        recordsApiUrl(`records/${recordId}/notes/${noteId}`),
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error(await apiErrorMessage(response));
      setNotes((current) => current.filter((note) => note.id !== noteId));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo eliminar la nota.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="detail-section notes-section" aria-labelledby="notes-title">
      <div className="notes-heading">
        <h2 id="notes-title">Notas</h2>
        {!loading && !error && <span className="fetch-success" role="status">Notas cargadas</span>}
        {!loading && <span className="notes-count">{notes.length}</span>}
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}
      {loading ? (
        <p className="notes-message" role="status">Cargando notas...</p>
      ) : notes.length ? (
        <ul className="notes-list">
          {notes.map((note) => (
            <li className="note-item" key={note.id}>
              <div className="note-copy">
                <p>{note.content}</p>
                <time dateTime={note.created_at}>{formatNoteDate(note.created_at)}</time>
              </div>
              <button
                className="note-delete"
                type="button"
                onClick={() => deleteNote(note.id)}
                disabled={deletingId === note.id}
                aria-label={`Eliminar nota del ${formatNoteDate(note.created_at)}`}
              >
                {deletingId === note.id ? "Eliminando..." : "Eliminar"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="notes-message">Todavía no hay notas para esta candidatura.</p>
      )}

      <form className="note-form" onSubmit={addNote}>
        <label htmlFor="new-note">Añadir una nota</label>
        <textarea
          id="new-note"
          value={content}
          onChange={(event) => setContent(event.currentTarget.value)}
          rows={3}
          maxLength={2000}
          placeholder="Escribe una nota para el equipo..."
        />
        <div className="note-form-footer">
          <span>{content.length}/2000</span>
          <button type="submit" disabled={saving || !content.trim()}>
            {saving ? "Guardando..." : "Añadir nota"}
          </button>
        </div>
      </form>
    </section>
  );
}

export function CandidateStatusControls({
  recordId,
  initialStatus,
  initialStage,
  cvUrl,
}: {
  recordId: string;
  initialStatus: string;
  initialStage: string;
  cvUrl: string | null;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [stage, setStage] = useState(initialStage);
  const [updating, setUpdating] = useState<"status" | "stage" | null>(null);
  const [updateFeedback, setUpdateFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateRecord(field: "status" | "stage", value: string) {
    const currentValue = field === "status" ? status : stage;
    if (value === currentValue) return;

    setUpdating(field);
    setUpdateFeedback(null);
    setError(null);
    try {
      const response = await fetch(recordsApiUrl(`records/${recordId}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!response.ok) throw new Error(await apiErrorMessage(response));
      if (field === "status") setStatus(value);
      else setStage(value);
      setUpdateFeedback(field === "status" ? "Estado actualizado." : "Etapa actualizada.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo actualizar el perfil.");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <aside className="detail-aside" aria-labelledby="tracking-title">
      <h2 id="tracking-title">Seguimiento</h2>
      <label className="detail-control">
        <span>Estado actual</span>
        <select
          value={status}
          disabled={updating !== null}
          onChange={(event) => updateRecord("status", event.currentTarget.value)}
        >
          {statusOptions.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
      <label className="detail-control">
        <span>Etapa actual</span>
        <select
          value={stage}
          disabled={updating !== null}
          onChange={(event) => updateRecord("stage", event.currentTarget.value)}
        >
          {stageOptions.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
      {updating && <p className="update-message" role="status">Guardando cambios...</p>}
      {updateFeedback && <p className="update-message" role="status">{updateFeedback}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      {cvUrl && (
        <a className="detail-document" href={cvUrl} target="_blank" rel="noreferrer">
          Abrir currículum
        </a>
      )}
    </aside>
  );
}