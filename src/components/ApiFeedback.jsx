function ApiFeedback({ error, success, errorDetails }) {
  return (
    <>
      {error && (
        <div className="alert alert-danger">
          <div>{error}</div>
          {errorDetails && (
            <details className="mt-2">
              <summary>Ver console.log desplegable</summary>
              <pre className="mt-2 mb-0 p-2 bg-light border rounded small">{errorDetails}</pre>
            </details>
          )}
        </div>
      )}
      {success && <div className="alert alert-success">{success}</div>}
    </>
  );
}

export default ApiFeedback;
