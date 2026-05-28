import React, { useState } from 'react';

const CursoList = ({ cursos, estudiantes, onVerDetalle, onAgregar }) => {
  const [nuevoCurso, setNuevoCurso] = useState({ nombre: '' });

  const getStudentCount = (cursoId) => {
    return estudiantes.filter(e => e.cursoId === cursoId).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevoCurso.nombre) return;
    onAgregar(nuevoCurso);
    setNuevoCurso({ nombre: '' });
  };

  return (
    <div className="section">
      <h2>Lista de Cursos</h2>

      <div className="form-container">
        <h3>Agregar Nuevo Curso</h3>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Nombre del curso (ej: 4° Básico)" 
            value={nuevoCurso.nombre}
            onChange={(e) => setNuevoCurso({ nombre: e.target.value })}
          />
          <button type="submit" className="btn-success">Crear Curso</button>
        </form>
      </div>

      {cursos.length === 0 ? (
        <p>No hay registros disponibles</p>
      ) : (
        <div className="dashboard-grid">
          {cursos.map(curso => (
            <div key={curso.idCurso} className="card">
              <h3>{curso.nombre}</h3>
              <p>ID: {curso.idCurso}</p>
              <p>Estudiantes: {getStudentCount(curso.idCurso)}</p>
              <button 
                className="btn-primary" 
                onClick={() => onVerDetalle(curso)}
                style={{marginTop: '10px'}}
              >
                Ver detalle
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CursoList;
