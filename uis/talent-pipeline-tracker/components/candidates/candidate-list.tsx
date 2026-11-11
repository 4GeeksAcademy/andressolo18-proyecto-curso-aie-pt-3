"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Candidate } from "./types";

const statusLabels: Record<string, string> = {
  received: "Recibida",
  in_progress: "En proceso",
  discarded: "Descartada",
};

const stageLabels: Record<string, string> = {
  pending: "Pendiente",
  review: "Revisión",
  personal_interview: "Entrevista personal",
  technical_interview: "Entrevista técnica",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function CandidateStatus({ status }: { status: string }) {
  return (
    <span className={`status status-${status}`}>
      <span className="status-dot" />
      {statusLabels[status] ?? status}
    </span>
  );
}

export default function CandidateList({ candidates }: { candidates: Candidate[] }) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const created = searchParams.get("created") === "1";
  const statusFilter = searchParams.get("status") ?? "all";
  const stageFilter = searchParams.get("stage") ?? "all";
  const normalizedSearch = search.trim().toLocaleLowerCase("es");

  function updateFilter(key: "status" | "stage", value: string) {
    const params = new URLSearchParams(window.location.search);
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}`,
    );
  }

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
    const matchesStage = stageFilter === "all" || candidate.stage === stageFilter;
    const matchesSearch =
      !normalizedSearch ||
      candidate.full_name.toLocaleLowerCase("es").includes(normalizedSearch) ||
      candidate.email.toLocaleLowerCase("es").includes(normalizedSearch);

    return matchesStatus && matchesStage && matchesSearch;
  });

  return (
    <section className="list-section" aria-labelledby="list-title">
      <div className="list-heading">
        <div>
          <h2 id="list-title">Todas las candidaturas</h2>
          <p>{filteredCandidates.length} de {candidates.length} perfiles</p>
        </div>
        <div className="list-heading-actions">
          <span className="list-count">{filteredCandidates.length} registros</span>
          <Link className="new-candidate-link" href="/candidates/new">Nueva candidatura</Link>
        </div>
      </div>

        {created && (
          <p className="mutation-feedback" role="status">
            Candidatura registrada. El listado se actualizó.
          </p>
        )}

      <div className="filters" aria-label="Filtros de candidaturas">
        <label className="search-control">
          <span>Buscar</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="Nombre o correo electrónico"
          />
        </label>
        <label className="filter-control">
          <span>Estado</span>
          <select value={statusFilter} onChange={(event) => updateFilter("status", event.currentTarget.value)}>
            <option value="all">Todos</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <label className="filter-control">
          <span>Etapa</span>
          <select value={stageFilter} onChange={(event) => updateFilter("stage", event.currentTarget.value)}>
            <option value="all">Todas</option>
            {Object.entries(stageLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
      </div>

      {filteredCandidates.length === 0 ? (
        <div className="empty-state">No hay candidaturas que coincidan con los filtros.</div>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Candidato</th>
                <th scope="col">Vacante</th>
                <th className="hide-mobile" scope="col">Experiencia</th>
                <th className="hide-mobile" scope="col">Fecha de ingreso</th>
                <th scope="col">Etapa</th>
                <th scope="col">Estado</th>
                <th scope="col"><span className="visually-hidden">Enlaces</span></th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>
                    <div className="candidate-cell">
                      <span className="avatar" aria-hidden="true">
                        {candidate.full_name
                          .split(/\s+/)
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")}
                      </span>
                      <div className="candidate-info">
                        <Link className="candidate-name" href={`/candidates/${candidate.id}`}>
                          {candidate.full_name}
                        </Link>
                        <a className="candidate-email" href={`mailto:${candidate.email}`}>
                          {candidate.email}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="position-cell">{candidate.position}</td>
                  <td className="hide-mobile">
                    {candidate.experience_years} {candidate.experience_years === 1 ? "año" : "años"}
                  </td>
                  <td className="hide-mobile date-cell">{formatDate(candidate.applied_at)}</td>
                  <td><span className="stage-label">{stageLabels[candidate.stage] ?? candidate.stage}</span></td>
                  <td><CandidateStatus status={candidate.status} /></td>
                  <td>
                    <div className="profile-links">
                      {candidate.cv_url && (
                        <a href={candidate.cv_url} target="_blank" rel="noreferrer" aria-label={`Ver CV de ${candidate.full_name}`}>
                          CV
                        </a>
                      )}
                      {candidate.linkedin_url && (
                        <a href={candidate.linkedin_url} target="_blank" rel="noreferrer" aria-label={`Ver LinkedIn de ${candidate.full_name}`}>
                          in
                        </a>
                      )}
                      {!candidate.cv_url && !candidate.linkedin_url && <span>—</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <footer className="table-footer">
        <span>Mostrando {filteredCandidates.length} de {candidates.length} candidaturas</span>
        <span>Ordenadas por fecha de ingreso</span>
      </footer>
    </section>
  );
}