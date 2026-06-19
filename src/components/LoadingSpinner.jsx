function LoadingSpinner({ label = 'Cargando...' }) {
  return (
    <div className="d-flex align-items-center gap-2 py-2" role="status" aria-live="polite">
      <div className="spinner-border spinner-border-sm text-primary" />
      <span>{label}</span>
    </div>
  );
}

export default LoadingSpinner;
