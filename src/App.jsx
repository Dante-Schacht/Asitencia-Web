import React, { useState, useEffect } from 'react';
import './App.css';

// Services
import { listarCursos, crearCurso } from './services/cursoService';
import { listarEstudiantes, crearEstudiante } from './services/estudianteService';
import { listarAsistencias, crearAsistencia } from './services/asistenciaService';
import { listarNotas, crearNota } from './services/notaService';

// Components
import Dashboard from './components/Dashboard';
import CursoList from './components/CursoList';
import CursoDetalle from './components/CursoDetalle';
import EstudianteList from './components/EstudianteList';
import AsistenciaList from './components/AsistenciaList';
import NotaList from './components/NotaList';
import BuscadorGeneral from './components/BuscadorGeneral';

function App() {
  const [view, setView] = useState('dashboard');
  const [cursos, setCursos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [notas, setNotas] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [debugLog, setDebugLog] = useState([]);

  useEffect(() => {
    cargarTodosLosDatos();
  }, []);

  const addDebugLog = (msg, data) => {
    const entry = {
      time: new Date().toLocaleTimeString(),
      msg,
      data: data ? JSON.stringify(data, null, 2) : null
    };
    setDebugLog(prev => [entry, ...prev].slice(0, 20));
  };

  const cargarTodosLosDatos = async () => {
    try {
      addDebugLog("Iniciando carga de datos...");
      const [resCursos, resEst, resAsist, resNotas] = await Promise.all([
        listarCursos(),
        listarEstudiantes(),
        listarAsistencias(),
        listarNotas()
      ]);
      
      addDebugLog("Datos recibidos del backend", {
        cursos: resCursos.data,
        estudiantes: resEst.data,
        asistencias: resAsist.data,
        notas: resNotas.data
      });

      setCursos(resCursos.data || []);
      setEstudiantes(resEst.data || []);
      setAsistencias(resAsist.data || []);
      setNotas(resNotas.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      const backendError = err.response?.data?.message || 
                           (typeof err.response?.data === 'string' ? err.response.data : JSON.stringify(err.response?.data)) || 
                           err.message || "Error desconocido";
      
      addDebugLog("ERROR en carga de datos", err.response || err);
      
      if (!err.response) {
        setError("No se pudo conectar con el backend. Asegúrate de que Spring Boot esté corriendo en el puerto 8080.");
      } else if (err.response.status === 404) {
        setError("No se encontraron los endpoints en el backend (Error 404). Verifica los mapeos en tus controladores.");
      } else {
        setError(`Error del servidor: ${backendError}. Verifica la conexión a la base de datos MySQL.`);
      }
    }
  };

  const mostrarMensajeExito = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleAgregarEstudiante = async (estudiante) => {
    try {
      await crearEstudiante(estudiante);
      mostrarMensajeExito("Registro guardado correctamente");
      cargarTodosLosDatos();
    } catch (err) {
      setError("Error al guardar el registro");
    }
  };

  const handleAgregarCurso = async (curso) => {
    try {
      await crearCurso(curso);
      mostrarMensajeExito("Registro guardado correctamente");
      cargarTodosLosDatos();
    } catch (err) {
      setError("Error al guardar el registro");
    }
  };

  const handleAgregarAsistencia = async (asistencia) => {
    try {
      await crearAsistencia(asistencia);
      mostrarMensajeExito("Registro guardado correctamente");
      cargarTodosLosDatos();
    } catch (err) {
      setError("Error al guardar el registro");
    }
  };

  const handleAgregarNota = async (nota) => {
    try {
      await crearNota(nota);
      mostrarMensajeExito("Registro guardado correctamente");
      cargarTodosLosDatos();
    } catch (err) {
      setError("Error al guardar el registro");
    }
  };

  const handleVerDetalleCurso = (curso) => {
    setSelectedCurso(curso);
    setView('curso-detalle');
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredData(null);
      return;
    }
    
    const q = query.toLowerCase();
    const results = {
      estudiantes: estudiantes.filter(e => e.nombre.toLowerCase().includes(q) || e.apellido.toLowerCase().includes(q)),
      cursos: cursos.filter(c => c.nombre.toLowerCase().includes(q)),
      notas: notas.filter(n => n.materia.toLowerCase().includes(q) || n.nombre.toLowerCase().includes(q)),
      asistencias: asistencias.filter(a => a.estado.toLowerCase().includes(q) || a.fecha.toLowerCase().includes(q))
    };
    setFilteredData(results);
  };

  const renderContent = () => {
    if (filteredData) {
      return (
        <div className="section">
          <h2>Resultados de Búsqueda</h2>
          {Object.values(filteredData).every(arr => arr.length === 0) ? (
            <p>No se encontraron resultados para su búsqueda.</p>
          ) : (
            <>
              {filteredData.estudiantes.length > 0 && (
                <div>
                  <h3>Estudiantes</h3>
                  <ul>{filteredData.estudiantes.map(e => <li key={e.idAlumno}>{e.nombre} {e.apellido} (Curso: {cursos.find(c => c.idCurso === e.cursoId)?.nombre})</li>)}</ul>
                </div>
              )}
              {filteredData.cursos.length > 0 && (
                <div>
                  <h3>Cursos</h3>
                  <ul>{filteredData.cursos.map(c => <li key={c.idCurso}>{c.nombre}</li>)}</ul>
                </div>
              )}
              {filteredData.notas.length > 0 && (
                <div>
                  <h3>Notas</h3>
                  <ul>{filteredData.notas.map(n => <li key={n.idNota}>{n.nombre} - {n.materia} ({n.calificacion})</li>)}</ul>
                </div>
              )}
              {filteredData.asistencias.length > 0 && (
                <div>
                  <h3>Asistencias</h3>
                  <ul>{filteredData.asistencias.map(a => <li key={a.idAsistencia}>{a.fecha} - {a.estado}</li>)}</ul>
                </div>
              )}
            </>
          )}
          <button className="btn-primary" onClick={() => setFilteredData(null)} style={{marginTop: '20px'}}>Limpiar Búsqueda</button>
        </div>
      );
    }

    switch (view) {
      case 'dashboard':
        return <Dashboard stats={{
          estudiantes: estudiantes.length,
          cursos: cursos.length,
          asistencias: asistencias.length,
          notas: notas.length
        }} />;
      case 'cursos':
        return <CursoList 
          cursos={cursos} 
          estudiantes={estudiantes} 
          onVerDetalle={handleVerDetalleCurso} 
          onAgregar={handleAgregarCurso}
        />;
      case 'curso-detalle':
        return <CursoDetalle 
          curso={selectedCurso} 
          estudiantes={estudiantes} 
          asistencias={asistencias} 
          notas={notas} 
          onVolver={() => setView('cursos')} 
        />;
      case 'estudiantes':
        return <EstudianteList 
          estudiantes={estudiantes} 
          cursos={cursos} 
          onAgregar={handleAgregarEstudiante} 
        />;
      case 'asistencias':
        return <AsistenciaList 
          asistencias={asistencias} 
          estudiantes={estudiantes} 
          cursos={cursos} 
          onAgregar={handleAgregarAsistencia} 
        />;
      case 'notas':
        return <NotaList 
          notas={notas} 
          estudiantes={estudiantes} 
          onAgregar={handleAgregarNota} 
        />;
      default:
        return <Dashboard stats={{
          estudiantes: estudiantes.length,
          cursos: cursos.length,
          asistencias: asistencias.length,
          notas: notas.length
        }} />;
    }
  };

  return (
    <div className="App">
      <nav>
        <button className={view === 'dashboard' ? 'active' : ''} onClick={() => {setView('dashboard'); setFilteredData(null);}}>Dashboard</button>
        <button className={view === 'cursos' || view === 'curso-detalle' ? 'active' : ''} onClick={() => {setView('cursos'); setFilteredData(null);}}>Cursos</button>
        <button className={view === 'estudiantes' ? 'active' : ''} onClick={() => {setView('estudiantes'); setFilteredData(null);}}>Estudiantes</button>
        <button className={view === 'asistencias' ? 'active' : ''} onClick={() => {setView('asistencias'); setFilteredData(null);}}>Asistencias</button>
        <button className={view === 'notas' ? 'active' : ''} onClick={() => {setView('notas'); setFilteredData(null);}}>Notas</button>
      </nav>

      <div className="container">
        <h1>Plataforma de Asistencia Escolar</h1>
        
        <BuscadorGeneral onSearch={handleSearch} />

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div style={{ marginBottom: '20px' }}>
          <button 
            className="btn-primary" 
            onClick={() => setShowDebug(!showDebug)}
            style={{ backgroundColor: '#666', fontSize: '12px' }}
          >
            {showDebug ? 'Ocultar Consola de Errores' : 'Ver Consola de Errores (Debug)'}
          </button>
          
          {showDebug && (
            <div style={{ 
              marginTop: '10px', 
              padding: '15px', 
              backgroundColor: '#1e1e1e', 
              color: '#d4d4d4', 
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '13px',
              maxHeight: '400px',
              overflowY: 'auto',
              border: '2px solid #333'
            }}>
              <h3 style={{ color: '#569cd6', marginBottom: '10px', borderBottom: '1px solid #333' }}>Log de Conexión (Backend)</h3>
              {debugLog.length === 0 ? <p>No hay logs registrados todavía.</p> : (
                debugLog.map((log, i) => (
                  <div key={i} style={{ marginBottom: '10px', borderLeft: '3px solid #4ec9b0', paddingLeft: '10px' }}>
                    <span style={{ color: '#858585' }}>[{log.time}]</span> <strong style={{ color: '#ce9178' }}>{log.msg}</strong>
                    {log.data && (
                      <pre style={{ 
                        marginTop: '5px', 
                        backgroundColor: '#252526', 
                        padding: '10px', 
                        borderRadius: '4px',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all'
                      }}>
                        {log.data}
                      </pre>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {renderContent()}
      </div>
    </div>
  );
}

export default App;
