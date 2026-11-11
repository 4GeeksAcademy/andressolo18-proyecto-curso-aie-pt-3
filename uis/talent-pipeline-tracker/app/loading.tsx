export default function Loading() {
  return (
    <main className="page-shell" aria-busy="true">
      <header className="topbar">
        <span className="brand">
          <span className="brand-mark">T</span>
          <span>talent<span className="brand-light">/</span>pipeline</span>
        </span>
        <span className="workspace-label">Panel de selección</span>
      </header>
      <section className="content route-loading" role="status" aria-live="polite">
        <p className="eyebrow">Equipo de talento</p>
        <h1>Cargando datos...</h1>
        <div className="loading-bar" />
      </section>
    </main>
  );
}