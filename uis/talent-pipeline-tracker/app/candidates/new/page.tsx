import Link from "next/link";
import CandidateForm from "@/components/candidates/candidate-form";

export default function NewCandidatePage() {
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
        <Link className="detail-back" href="/">Volver a candidaturas</Link>
        <div className="form-page-heading">
          <p className="eyebrow">Equipo de talento</p>
          <h1>Nueva candidatura</h1>
          <p>Registra los datos del perfil para incorporarlo al proceso.</p>
        </div>
        <CandidateForm mode="create" />
      </section>
    </main>
  );
}