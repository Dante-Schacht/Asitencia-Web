import React from 'react';

const CursoDetalle = ({ curso, estudiantes, asistencias, notas, onVolver }) => {
  const cursoEstudiantes = estudiantes.filter(e => e.cursoId === curso.idCurso);
  const cursoAsistencias = asistencias.filter(a => a.cursoId === curso.idCurso);
  
  // Notas are linked to students. We find students of this course and then their grades.
  const estudianteIds = cursoEstudiantes.map(e => e.idAlumno);
  const cursoNotas = notas.filter(n => estudianteIds.includes(n.estudianteId));

  return (
    <div className="detail-view">
      <button className="btn-primary" onClick={onVolver}>← Volver a la lista</button>
      <h2 style={{marginTop: '20px'}}>Detalle del Curso: {curso.nombre}</h2>

      <div className="section">
        <h3>Estudiantes Pertenecientes</h3>
        {cursoEstudiantes.length === 0 ? <p>No hay estudiantes en este curso.</p> : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
              </tr>
            </thead>
            <tbody>
              {cursoEstudiantes.map(e => (
                <tr key={e.idAlumno}>
                  <td>{e.idAlumno}</td>
                  <td>{e.nombre}</td>
                  <td>{e.apellido}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="section">
        <h3>Asistencias Registradas</h3>
        {cursoAsistencias.length === 0 ? <p>No hay asistencias registradas para este curso.</p> : (
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Estudiante</th>
              </tr>
            </thead>
            <tbody>
              {cursoAsistencias.map(a => {
                const est = estudiantes.find(e => e.idAlumno === a.estudianteId);
                return (
                  <tr key={a.idAsistencia}>
                    <td>{a.fecha}</td>
                    <td>{a.estado}</td>
                    <td>{est ? `${est.nombre} ${est.apellido}` : 'Desconocido'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="section">
        <h3>Notas de los Estudiantes</h3>
        {cursoNotas.length === 0 ? <p>No hay notas registradas para este curso.</p> : (
          <table>
            <thead>
              <tr>
                <th>Evaluación</th>
                <th>Materia</th>
                <th>Calificación</th>
                <th>Estudiante</th>
              </tr>
            </thead>
            <tbody>
              {cursoNotas.map(n => {
                const est = estudiantes.find(e => e.idAlumno === n.estudianteId);
                return (
                  <tr key={n.idNota}>
                    <td>{n.nombre}</td>
                    <td>{n.materia}</td>
                    <td>{n.calificacion}</td>
                    <td>{est ? `${est.nombre} ${est.apellido}` : 'Desconocido'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CursoDetalle;
