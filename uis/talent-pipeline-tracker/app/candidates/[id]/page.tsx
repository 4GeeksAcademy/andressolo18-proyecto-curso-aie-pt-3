import Link from "next/link";
import { notFound } from "next/navigation";
import { CandidateNotes, CandidateStatusControls } from "@/components/candidates/candidate-interactions";
import type { CandidateResponse } from "@/types/candidate";

const statusLabels: Record<string, string> = {
  received: "Recibida",
  in_progress: "En proceso",
  discarded: "Descartada",
};

async function getCandidate(id: string): Promise<CandidateResponse | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("Falta NEXT_PUBLIC_API_URL");

  const response = await fetch(
    `${apiUrl.replace(/\/$/, "")}/records/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );

  if (response.status === 404) return null;
  if (!response.ok) throw new Error("No se pudo cargar la candidatura");
  return (await response.json()) as CandidateResponse;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function CandidateDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ updated?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  let candidate: CandidateResponse | null;

  try {
    candidate = await getCandidate(id);
  } catch {
    return (
      <main className="page-shell">
        <header className="topbar">
          <Link className="brand" href="/" aria-label="TrackFlow, Gestión de talento">
            <span className="brand-mark">T</span>
            <span>track<span className="brand-light">/</span>flow</span>
          </Link>
          <span className="workspace-label">Gestión de Talento</span>
        </header>
        <section className="error-state detail-error" aria-live="polite">
          <span className="eyebrow">TrackFlow</span>
          <h1>No se pudo cargar el perfil</h1>
          <p>Comprueba la conexión e inténtalo de nuevo.</p>
          <Link className="retry-link" href={`/candidates/${encodeURIComponent(id)}`} prefetch={false}>
            Volver a intentar
          </Link>
        </section>
      </main>
    );
  }

  if (!candidate) notFound();

  return (
    <main className="page-shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Talent pipeline, inicio">
          <span className="brand-mark">T</span>
          <span>talent<span className="brand-light">/</span>pipeline</span>
        </Link>
        <span className="workspace-label">Panel de selección</span>
      </header>

      <section className="content">
        <Link className="detail-back" href="/">Volver a perfiles</Link>
        {query.updated === "1" && (
          <p className="mutation-feedback" role="status">
            El perfil se actualizó correctamente.
          </p>
        )}
        <div className="detail-hero">
          <div>
            <p className="eyebrow">Perfil de candidato</p>
            <h1>{candidate.full_name}</h1>
            <p className="detail-position">{candidate.position}</p>
            <code className="detail-id">ID {candidate.id}</code>
            <Link className="detail-edit-link" href={`/candidates/${candidate.id}/edit`}>
              Editar datos
            </Link>
          </div>
          <span className={`status status-${candidate.status}`}>
            <span className="status-dot" />
            {statusLabels[candidate.status] ?? candidate.status}
          </span>
          <span className="fetch-success" role="status">Perfil cargado</span>
        </div>

        <div className="detail-grid">
          <div className="detail-main">
            <section className="detail-section" aria-labelledby="contact-title">
              <h2 id="contact-title">Información de contacto</h2>
              <dl className="detail-fields">
                <div>
                  <dt>Correo electrónico</dt>
                  <dd><a href={`mailto:${candidate.email}`}>{candidate.email}</a></dd>
                </div>
                <div>
                  <dt>Teléfono</dt>
                  <dd>{candidate.phone ? <a href={`tel:${candidate.phone}`}>{candidate.phone}</a> : "No disponible"}</dd>
                </div>
                <div>
                  <dt>LinkedIn</dt>
                  <dd>
                    {candidate.linkedin_url ? (
                      <a href={candidate.linkedin_url} target="_blank" rel="noreferrer">Ver perfil</a>
                    ) : "No disponible"}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="detail-section" aria-labelledby="history-title">
              <h2 id="history-title">Experiencia y fechas</h2>
              <dl className="detail-fields">
                <div>
                  <dt>Experiencia</dt>
                  <dd>{candidate.experience_years} {candidate.experience_years === 1 ? "año" : "años"}</dd>
                </div>
                <div>
                  <dt>Fecha de ingreso</dt>
                  <dd>{formatDate(candidate.applied_at)}</dd>
                </div>
                <div>
                  <dt>Última actualización</dt>
                  <dd>{formatDate(candidate.updated_at)}</dd>
                </div>
                <div>
                  <dt>Notas registradas</dt>
                  <dd>{candidate.notes_count}</dd>
                </div>
              </dl>
            </section>
            <CandidateNotes recordId={candidate.id} />
          </div>

          <CandidateStatusControls
            recordId={candidate.id}
            initialStatus={candidate.status}
            initialStage={candidate.stage}
            cvUrl={candidate.cv_url}
          />
        </div>
      </section>
    </main>
  );
}