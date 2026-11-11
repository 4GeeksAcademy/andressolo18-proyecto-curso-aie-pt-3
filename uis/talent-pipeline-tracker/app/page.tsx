import Link from "next/link";
import { Suspense } from "react";
import CandidateList from "@/components/candidates/candidate-list";
import type { Candidate, CandidateListResponse } from "@/types/candidate";

async function getCandidates(): Promise<Candidate[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("Falta NEXT_PUBLIC_API_URL");

  const endpoint = `${apiUrl.replace(/\/$/, "")}/records`;
  const loadPage = async (page: number, limit = 100) => {
    const url = new URL(endpoint);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));

    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudieron cargar las candidaturas");
    return (await response.json()) as CandidateListResponse;
  };

  const firstPage = await loadPage(1);
  const pageCount = Math.ceil(firstPage.total / firstPage.limit);
  const otherPages = await Promise.all(
    Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) =>
      loadPage(index + 2, firstPage.limit),
    ),
  );

  return [firstPage, ...otherPages].flatMap((page) => page.data);
}

export default async function Home() {
  let candidates: Candidate[];

  try {
    candidates = await getCandidates();
    candidates.sort(
      (first, second) =>
        Date.parse(second.applied_at) - Date.parse(first.applied_at),
    );
  } catch {
    return (
      <main className="page-shell">
        <section className="error-state" aria-live="polite">
          <span className="eyebrow">TrackFlow</span>
          <h1>No se pudieron cargar los perfiles</h1>
          <p>Comprueba la conexión e inténtalo de nuevo.</p>
          <Link className="retry-link" href="/">
            Volver a intentar
          </Link>
        </section>
      </main>
    );
  }

  const inProgressCount = candidates.filter(
    (candidate) => candidate.status === "in_progress",
  ).length;
  const receivedCount = candidates.filter(
    (candidate) => candidate.status === "received",
  ).length;
  const discardedCount = candidates.filter(
    (candidate) => candidate.status === "discarded",
  ).length;

  return (
    <main className="page-shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="TrackFlow, Gestión de talento">
          <span className="brand-mark">T</span>
          <span>track<span className="brand-light">/</span>flow</span>
        </Link>
        <span className="workspace-label">Gestión de Talento</span>
      </header>

      <section className="content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Equipo TrackFlow</p>
            <h1>Perfiles de Talento</h1>
            <p className="page-description">
              Revisa y gestiona el progreso de cada candidato en el pipeline.
            </p>
          </div>
          <div className="updated-indicator" role="status">
            <span className="live-dot" />
            {candidates.length} candidaturas cargadas
          </div>
        </div>

        <section className="overview" aria-label="Resumen de perfiles">
          <div className="metric metric-total">
            <span className="metric-label">Total de perfiles</span>
            <strong>{candidates.length}</strong>
            <span className="metric-note">en la base de talento</span>
          </div>
          <div className="metric">
            <span className="metric-label">En evaluación</span>
            <strong>{inProgressCount}</strong>
            <span className="metric-note">en proceso de selección</span>
          </div>
          <div className="metric">
            <span className="metric-label">Por revisar</span>
            <strong>{receivedCount}</strong>
            <span className="metric-note">nuevos candidatos</span>
          </div>
          <div className="metric">
            <span className="metric-label">No seleccionados</span>
            <strong>{discardedCount}</strong>
            <span className="metric-note">descartados</span>
          </div>
        </section>

        <Suspense fallback={<div className="list-loading" role="status">Preparando filtros...</div>}>
          <CandidateList candidates={candidates} />
        </Suspense>
      </section>
    </main>
  );
}
