import Link from "next/link";

export default function NotFound() {
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
        <span className="eyebrow">Candidatura no disponible</span>
        <h1>No encontramos ese perfil</h1>
        <p>Puede que la candidatura ya no exista o que el enlace no sea válido.</p>
        <Link className="retry-link" href="/">Volver al listado</Link>
      </section>
    </main>
  );
}