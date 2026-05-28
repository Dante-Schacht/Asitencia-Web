import React, { useState } from 'react';

const EstudianteList = ({ estudiantes, cursos, onAgregar }) => {
  const [nuevoEstudiante, setNuevoEstudiante] = useState({ nombre: '', apellido: '', cursoId: '' });
  const [filtro, setFiltro] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevoEstudiante.nombre || !nuevoEstudiante.apellido || !nuevoEstudiante.cursoId) return;
    onAgregar({
      ...nuevoEstudiante,
      cursoId: parseInt(nuevoEstudiante.cursoId)
    });
    setNuevoEstudiante({ nombre: '', apellido: '', cursoId: '' });
  };

  const estudiantesFiltrados = estudiantes.filter(e => 
    e.nombre.toLowerCase().includes(filtro.toLowerCase()) || 
    e.apellido.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="section">
      <h2>Gestión de Estudiantes</h2>

      <div className="form-container">
        <h3>Agregar Estudiante</h3>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Nombre" 
            value={nuevoEstudiante.nombre}
            onChange={(e) => setNuevoEstudiante({...nuevoEstudiante, nombre: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Apellido" 
            value={nuevoEstudiante.apellido}
            onChange={(e) => setNuevoEstudiante({...nuevoEstudiante, apellido: e.target.value})}
          />
          <select 
            value={nuevoEstudiante.cursoId}
            onChange={(e) => setNuevoEstudiante({...nuevoEstudiante, cursoId: e.target.value})}
          >
            <option value="">Seleccionar Curso</option>
            {cursos.map(c => (
              <option key={c.idCurso} value={c.idCurso}>{c.nombre}</option>
            ))}
          </select>
          <button type="submit" className="btn-success">Guardar Estudiante</button>
        </form>
      </div>

      <div className="search-box">
        <input 
          type="text" 
          placeholder="Filtrar por nombre o apellido..." 
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {estudiantesFiltrados.length === 0 ? <p>No hay registros disponibles</p> : (
        <table>
          <thead>
            <tr>
              <th>ID Alumno</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Curso ID</th>
              <th>Nombre del Curso</th>
            </tr>
          </thead>
          <tbody>
            {estudiantesFiltrados.map(e => {
              const curso = cursos.find(c => c.idCurso === e.cursoId);
              return (
                <tr key={e.idAlumno}>
                  <td>{e.idAlumno}</td>
                  <td>{e.nombre}</td>
                  <td>{e.apellido}</td>
                  <td>{e.cursoId}</td>
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

export default EstudianteList;
