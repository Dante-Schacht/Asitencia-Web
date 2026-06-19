import { useEffect, useMemo, useState } from 'react';
import ApiFeedback from '../components/ApiFeedback';
import LoadingSpinner from '../components/LoadingSpinner';
import useApiState from '../hooks/useApiState';
import {
  crearNotificacion,
  listarNotificaciones,
  listarNotificacionesNoLeidas,
  listarNotificacionesPorDestinatario,
  marcarNotificacionLeida,
} from '../services/notificacionService';
import { getApiErrorMessage } from '../services/httpClient';

const EMPTY_FORM = {
  titulo: '',
  descripcion: '',
  destinatario: '',
  tipo: 'INFORMATIVA',
  fechaCreacion: '',
};

const TIPOS = ['INFORMATIVA', 'URGENTE', 'ACADEMICA', 'CONDUCTUAL'];

const getNotificacionId = (item) => item.id ?? item.idNotificacion ?? item.notificacionId;
const isNoLeida = (item) => !(item.leida ?? item.leido ?? item.vista ?? false);

const normalizeList = (data) => {
  if (Array.isArray(data)) {
    return data;
  }
  return data ? [data] : [];
};

function NotificacionesPage() {
  const api = useApiState();
  const [notificaciones, setNotificaciones] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [filtroDestinatario, setFiltroDestinatario] = useState('');
  const [formError, setFormError] = useState('');

  const noLeidas = useMemo(
    () => notificaciones.filter((item) => isNoLeida(item)).length,
    [notificaciones]
  );

  const cargarNotificaciones = async () => {
    api.setLoading(true);
    api.clearMessages();
    try {
      const data = await listarNotificaciones();
      setNotificaciones(normalizeList(data));
    } catch (error) {
      api.showError(getApiErrorMessage(error, 'No se pudo cargar notificaciones'), error);
    } finally {
      api.setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarNotificaciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateForm = () => {
    if (!formData.titulo.trim() || !formData.descripcion.trim()) {
      return 'titulo y descripcion son obligatorios.';
    }
    if (!formData.destinatario.trim()) {
      return 'destinatario es obligatorio.';
    }
    if (!TIPOS.includes(formData.tipo)) {
      return 'tipo invalido.';
    }
    return '';
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setFormError('');
    api.clearMessages();

    const validation = validateForm();
    if (validation) {
      setFormError(validation);
      return;
    }

    const payload = {
      ...formData,
      fechaCreacion: formData.fechaCreacion || null,
    };

    api.setSubmitting(true);
    try {
      await crearNotificacion(payload);
      api.showSuccess('Notificacion creada correctamente.');
      setFormData(EMPTY_FORM);
      await cargarNotificaciones();
    } catch (error) {
      api.showError(getApiErrorMessage(error, 'No se pudo crear la notificacion'), error);
    } finally {
      api.setSubmitting(false);
    }
  };

  const handleFiltroDestinatario = async () => {
    if (!filtroDestinatario.trim()) {
      api.showError('Ingresa un destinatario para filtrar.');
      return;
    }

    api.setLoading(true);
    api.clearMessages();
    try {
      const data = await listarNotificacionesPorDestinatario(filtroDestinatario.trim());
      setNotificaciones(normalizeList(data));
    } catch (error) {
      api.showError(getApiErrorMessage(error, 'No se pudo filtrar por destinatario'), error);
    } finally {
      api.setLoading(false);
    }
  };

  const handleNoLeidas = async () => {
    api.setLoading(true);
    api.clearMessages();
    try {
      const data = await listarNotificacionesNoLeidas();
      setNotificaciones(normalizeList(data));
    } catch (error) {
      api.showError(getApiErrorMessage(error, 'No se pudo cargar no leidas'), error);
    } finally {
      api.setLoading(false);
    }
  };

  const handleMarcarLeida = async (id) => {
    api.setSubmitting(true);
    api.clearMessages();
    try {
      await marcarNotificacionLeida(id);
      setNotificaciones((prev) =>
        prev.map((item) => (getNotificacionId(item) === id ? { ...item, leida: true, leido: true } : item))
      );
      api.showSuccess('Notificacion marcada como leida.');
    } catch (error) {
      api.showError(getApiErrorMessage(error, 'No se pudo marcar como leida'), error);
    } finally {
      api.setSubmitting(false);
    }
  };

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h2 className="h4 mb-0">Centro de Notificaciones</h2>
        <span className="badge text-bg-info">No leidas: {noLeidas}</span>
      </div>

      <ApiFeedback
        error={api.error || formError}
        success={api.success}
        errorDetails={api.errorDetails}
      />

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h3 className="h6 mb-3">Nueva notificacion</h3>
          <form className="row g-3" onSubmit={handleCreate}>
            <div className="col-md-6">
              <label className="form-label">Titulo</label>
              <input
                className="form-control"
                value={formData.titulo}
                onChange={(e) => setFormData((prev) => ({ ...prev, titulo: e.target.value }))}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Destinatario</label>
              <input
                className="form-control"
                value={formData.destinatario}
                onChange={(e) => setFormData((prev) => ({ ...prev, destinatario: e.target.value }))}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Tipo</label>
              <select
                className="form-select"
                value={formData.tipo}
                onChange={(e) => setFormData((prev) => ({ ...prev, tipo: e.target.value }))}
              >
                {TIPOS.map((tipo) => (
                  <option value={tipo} key={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Fecha creacion (opcional)</label>
              <input
                type="datetime-local"
                className="form-control"
                value={formData.fechaCreacion}
                onChange={(e) => setFormData((prev) => ({ ...prev, fechaCreacion: e.target.value }))}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Descripcion</label>
              <textarea
                className="form-control"
                rows="3"
                value={formData.descripcion}
                onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
              />
            </div>
            <div className="col-12">
              <button className="btn btn-primary" disabled={api.submitting}>
                {api.submitting ? 'Guardando...' : 'Crear notificacion'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h3 className="h6 mb-3">Filtros</h3>
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label">Destinatario</label>
              <input
                className="form-control"
                value={filtroDestinatario}
                onChange={(e) => setFiltroDestinatario(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-primary w-100" onClick={handleFiltroDestinatario}>
                Filtrar
              </button>
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-warning w-100" onClick={handleNoLeidas}>
                No leidas
              </button>
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-secondary w-100" onClick={cargarNotificaciones}>
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {api.loading ? (
        <LoadingSpinner label="Cargando notificaciones..." />
      ) : (
        <div className="table-responsive bg-white rounded shadow-sm p-2">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Titulo</th>
                <th>Descripcion</th>
                <th>Destinatario</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {notificaciones.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4">Sin notificaciones.</td>
                </tr>
              )}
              {notificaciones.map((item) => {
                const id = getNotificacionId(item);
                const noLeida = isNoLeida(item);
                return (
                  <tr key={id || `${item.destinatario}-${item.titulo}`}>
                    <td>{id || '-'}</td>
                    <td>{item.titulo}</td>
                    <td>{item.descripcion || item.mensaje}</td>
                    <td>{item.destinatario}</td>
                    <td>{item.tipo || '-'}</td>
                    <td>{item.fechaCreacion || '-'}</td>
                    <td>
                      <span className={`badge ${noLeida ? 'text-bg-danger' : 'text-bg-success'}`}>
                        {noLeida ? 'No leida' : 'Leida'}
                      </span>
                    </td>
                    <td>
                      {noLeida && id ? (
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleMarcarLeida(id)}
                          disabled={api.submitting}
                        >
                          Marcar como leida
                        </button>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default NotificacionesPage;
