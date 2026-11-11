import Link from "next/link";
import { notFound } from "next/navigation";
import CandidateForm from "@/components/candidates/candidate-form";
import type { CandidateResponse } from "@/types/candidate";

async function getCandidate(id: string): Promise<CandidateResponse | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("Falta configurar la URL de la API.");

  const response = await fetch(
    `${apiUrl.replace(/\/$/, "")}/records/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("No se pudo cargar la candidatura.");
  return (await response.json()) as CandidateResponse;
}

export default async function EditCandidatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let candidate: CandidateResponse | null;

  try {
    candidate = await getCandidate(id);
  } catch {
    return (
      <main className="page-shell">
        <header className="topbar">
          <Link className="brand" href="/" aria-label="Talent pipeline, inicio">
            <span className="brand-mark">T</span>
            <span>talent<span className="brand-light">/</span>pipeline</span>
          </Link>
          <span className="workspace-label">Panel de selección</span>
        </header>
        <section className="error-state detail-error" role="alert">
          <span className="eyebrow">Talent pipeline</span>
          <h1>No se pudo cargar la candidatura</h1>
          <p>Comprueba la conexión e inténtalo de nuevo.</p>
          <Link className="retry-link" href={`/candidates/${encodeURIComponent(id)}/edit`} prefetch={false}>
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
      <section className="content form-page">
        <Link className="detail-back" href={`/candidates/${candidate.id}`}>
          Volver al perfil
        </Link>
        <div className="form-page-heading">
          <p className="eyebrow">Equipo de talento</p>
          <h1>Editar candidatura</h1>
          <p>Actualiza los datos del perfil de {candidate.full_name}.</p>
          <span className="fetch-success" role="status">Datos cargados</span>
        </div>
        <CandidateForm mode="edit" candidate={candidate} />
      </section>
    </main>
  );
}