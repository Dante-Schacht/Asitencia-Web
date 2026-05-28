import React, { useState } from 'react';

const NotaList = ({ notas, estudiantes, onAgregar }) => {
  const [nuevaNota, setNuevaNota] = useState({
    nombre: '',
    materia: '',
    calificacion: '',
    estudianteId: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevaNota.nombre || !nuevaNota.materia || !nuevaNota.calificacion || !nuevaNota.estudianteId) return;
    onAgregar({
      ...nuevaNota,
      calificacion: parseFloat(nuevaNota.calificacion),
      estudianteId: parseInt(nuevaNota.estudianteId)
    });
    setNuevaNota({ nombre: '', materia: '', calificacion: '', estudianteId: '' });
  };

  return (
    <div className="section">
      <h2>Gestión de Notas</h2>

      <div className="form-container">
        <h3>Agregar Nota</h3>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Nombre de la evaluación" 
            value={nuevaNota.nombre}
            onChange={(e) => setNuevaNota({...nuevaNota, nombre: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Materia" 
            value={nuevaNota.materia}
            onChange={(e) => setNuevaNota({...nuevaNota, materia: e.target.value})}
          />
          <input 
            type="number" 
            step="0.1"
            placeholder="Calificación" 
            value={nuevaNota.calificacion}
            onChange={(e) => setNuevaNota({...nuevaNota, calificacion: e.target.value})}
          />
          <select 
            value={nuevaNota.estudianteId}
            onChange={(e) => setNuevaNota({...nuevaNota, estudianteId: e.target.value})}
          >
            <option value="">Seleccionar Estudiante</option>
            {estudiantes.map(e => (
              <option key={e.idAlumno} value={e.idAlumno}>{e.nombre} {e.apellido}</option>
            ))}
          </select>
          <button type="submit" className="btn-success">Guardar Nota</button>
        </form>
      </div>

      {notas.length === 0 ? <p>No hay registros disponibles</p> : (
        <table>
          <thead>
            <tr>
              <th>ID Nota</th>
              <th>Nombre Evaluación</th>
              <th>Materia</th>
              <th>Calificación</th>
              <th>Estudiante</th>
            </tr>
          </thead>
          <tbody>
            {notas.map(n => {
              const est = estudiantes.find(e => e.idAlumno === n.estudianteId);
              return (
                <tr key={n.idNota}>
                  <td>{n.idNota}</td>
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
  );
};

export default NotaList;
