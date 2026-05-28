import React, { useState } from 'react';

const AsistenciaList = ({ asistencias, estudiantes, cursos, onAgregar }) => {
  const [nuevaAsistencia, setNuevaAsistencia] = useState({
    fecha: '',
    estado: 'Presente',
    estudianteId: '',
    cursoId: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevaAsistencia.fecha || !nuevaAsistencia.estudianteId || !nuevaAsistencia.cursoId) return;
    
    // Format date if needed, but user says "25-03-2026"
    onAgregar({
      ...nuevaAsistencia,
      estudianteId: parseInt(nuevaAsistencia.estudianteId),
      cursoId: parseInt(nuevaAsistencia.cursoId)
    });
    setNuevaAsistencia({ fecha: '', estado: 'Presente', estudianteId: '', cursoId: '' });
  };

  return (
    <div className="section">
      <h2>Registro de Asistencias</h2>

      <div className="form-container">
        <h3>Nueva Asistencia</h3>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Fecha (dd-MM-yyyy)" 
            value={nuevaAsistencia.fecha}
            onChange={(e) => setNuevaAsistencia({...nuevaAsistencia, fecha: e.target.value})}
          />
          <select 
            value={nuevaAsistencia.estado}
            onChange={(e) => setNuevaAsistencia({...nuevaAsistencia, estado: e.target.value})}
          >
            <option value="Presente">Presente</option>
            <option value="Ausente">Ausente</option>
            <option value="Atrasado">Atrasado</option>
            <option value="Justificado">Justificado</option>
          </select>
          <select 
            value={nuevaAsistencia.estudianteId}
            onChange={(e) => setNuevaAsistencia({...nuevaAsistencia, estudianteId: e.target.value})}
          >
            <option value="">Seleccionar Estudiante</option>
            {estudiantes.map(e => (
              <option key={e.idAlumno} value={e.idAlumno}>{e.nombre} {e.apellido}</option>
            ))}
          </select>
          <select 
            value={nuevaAsistencia.cursoId}
            onChange={(e) => setNuevaAsistencia({...nuevaAsistencia, cursoId: e.target.value})}
          >
            <option value="">Seleccionar Curso</option>
            {cursos.map(c => (
              <option key={c.idCurso} value={c.idCurso}>{c.nombre}</option>
            ))}
          </select>
          <button type="submit" className="btn-success">Registrar Asistencia</button>
        </form>
      </div>

      {asistencias.length === 0 ? <p>No hay registros disponibles</p> : (
        <table>
          <thead>
            <tr>
              <th>ID Asistencia</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Estudiante</th>
              <th>Curso</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.map(a => {
              const est = estudiantes.find(e => e.idAlumno === a.estudianteId);
              const curso = cursos.find(c => c.idCurso === a.cursoId);
              return (
                <tr key={a.idAsistencia}>
                  <td>{a.idAsistencia}</td>
                  <td>{a.fecha}</td>
                  <td>{a.estado}</td>
                  <td>{est ? `${est.nombre} ${est.apellido}` : 'Desconocido'}</td>
                  <td>{curso ? curso.nombre : 'No asignado'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AsistenciaList;
