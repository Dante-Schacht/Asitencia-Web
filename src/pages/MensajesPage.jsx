import { useEffect, useMemo, useState } from 'react';
import ApiFeedback from '../components/ApiFeedback';
import LoadingSpinner from '../components/LoadingSpinner';
import useApiState from '../hooks/useApiState';
import {
  crearMensaje,
  listarMensajes,
  listarMensajesNoLeidos,
  listarMensajesPorDestinatario,
  listarMensajesPorRemitente,
  listarMensajesPorTipoDestinatario,
  marcarMensajeLeido,
} from '../services/mensajeService';
import { getApiErrorMessage } from '../services/httpClient';

const EMPTY_FORM = {
  asunto: '',
  contenido: '',
  remitente: '',
  destinatario: '',
  tipoDestinatario: 'APODERADO',
  prioridad: 'MEDIA',
  fechaEnvio: '',
};

const TIPOS = ['APODERADO', 'ESTUDIANTE', 'DOCENTE', 'ADMINISTRATIVO'];
const PRIORIDADES = ['BAJA', 'MEDIA', 'ALTA'];

const getMensajeId = (msg) => msg.id ?? msg.idMensaje ?? msg.mensajeId;
const isNoLeido = (msg) =>
  !(msg.leido ?? msg.leida ?? msg.visto ?? msg.estaLeido ?? false);

const normalizeList = (data) => {
  if (Array.isArray(data)) {
    return data;
  }
  return data ? [data] : [];
};

function MensajesPage() {
  const api = useApiState();
  const [mensajes, setMensajes] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [filterDestinatario, setFilterDestinatario] = useState('');
  const [filterRemitente, setFilterRemitente] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [formError, setFormError] = useState('');

  const unreadCount = useMemo(
    () => mensajes.filter((item) => isNoLeido(item)).length,
    [mensajes]
  );

  const cargarMensajes = async () => {
    api.setLoading(true);
    api.clearMessages();
    try {
      const data = await listarMensajes();
      setMensajes(normalizeList(data));
    } catch (error) {
      api.showError(getApiErrorMessage(error, 'No se pudo cargar mensajes'), error);
    } finally {
      api.setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarMensajes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateForm = () => {
    if (!formData.asunto.trim() || !formData.contenido.trim()) {
      return 'asunto y contenido son obligatorios.';
    }
    if (!formData.remitente.trim() || !formData.destinatario.trim()) {
      return 'remitente y destinatario son obligatorios.';
    }
    if (!TIPOS.includes(formData.tipoDestinatario)) {
      return 'tipoDestinatario invalido.';
    }
    if (!PRIORIDADES.includes(formData.prioridad)) {
      return 'prioridad invalida.';
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
      fechaEnvio: formData.fechaEnvio || null,
    };

    api.setSubmitting(true);
    try {
      await crearMensaje(payload);
      api.showSuccess('Mensaje enviado correctamente.');
      setFormData(EMPTY_FORM);
      await cargarMensajes();
    } catch (error) {
      api.showError(getApiErrorMessage(error, 'No se pudo enviar el mensaje'), error);
    } finally {
      api.setSubmitting(false);
    }
  };

  const handleMarcarLeido = async (id) => {
    api.setSubmitting(true);
    api.clearMessages();
    try {
      await marcarMensajeLeido(id);
      setMensajes((prev) =>
        prev.map((msg) => (getMensajeId(msg) === id ? { ...msg, leido: true, leida: true } : msg))
      );
      api.showSuccess('Mensaje marcado como leido.');
    } catch (error) {
      api.showError(getApiErrorMessage(error, 'No se pudo marcar como leido'), error);
    } finally {
      api.setSubmitting(false);
    }
  };

  const handleFiltroDestinatario = async () => {
    if (!filterDestinatario.trim()) {
      api.showError('Ingresa un destinatario para filtrar.');
      return;
    }

    api.setLoading(true);
    api.clearMessages();
    try {
      const data = await listarMensajesPorDestinatario(filterDestinatario.trim());
      setMensajes(normalizeList(data));
    } catch (error) {
      api.showError(getApiErrorMessage(error, 'No se pudo filtrar por destinatario'), error);
    } finally {
      api.setLoading(false);
    }
  };

  const handleFiltroRemitente = async () => {
    if (!filterRemitente.trim()) {
      api.showError('Ingresa un remitente para filtrar.');
      return;
    }

    api.setLoading(true);
    api.clearMessages();
    try {
      const data = await listarMensajesPorRemitente(filterRemitente.trim());
      setMensajes(normalizeList(data));
    } catch (error) {
      api.showError(getApiErrorMessage(error, 'No se pudo filtrar por remitente'), error);
    } finally {
      api.setLoading(false);
    }
  };

  const handleFiltroTipo = async () => {
    if (!filterTipo) {
      api.showError('Selecciona un tipoDestinatario para filtrar.');
      return;
    }

    api.setLoading(true);
    api.clearMessages();
    try {
      const data = await listarMensajesPorTipoDestinatario(filterTipo);
      setMensajes(normalizeList(data));
    } catch (error) {
      api.showError(getApiErrorMessage(error, 'No se pudo filtrar por tipoDestinatario'), error);
    } finally {
      api.setLoading(false);
    }
  };

  const handleNoLeidos = async () => {
    api.setLoading(true);
    api.clearMessages();
    try {
      const data = await listarMensajesNoLeidos();
      setMensajes(normalizeList(data));
    } catch (error) {
      api.showError(getApiErrorMessage(error, 'No se pudo cargar mensajes no leidos'), error);
    } finally {
      api.setLoading(false);
    }
  };

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h2 className="h4 mb-0">Bandeja de Mensajes</h2>
        <span className="badge text-bg-warning">No leidos: {unreadCount}</span>
      </div>

      <ApiFeedback
        error={api.error || formError}
        success={api.success}
        errorDetails={api.errorDetails}
      />

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h3 className="h6 mb-3">Nuevo mensaje</h3>
          <form className="row g-3" onSubmit={handleCreate}>
            <div className="col-md-6">
              <label className="form-label">Asunto</label>
              <input
                className="form-control"
                value={formData.asunto}
                onChange={(e) => setFormData((prev) => ({ ...prev, asunto: e.target.value }))}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Remitente</label>
              <input
                className="form-control"
                value={formData.remitente}
                onChange={(e) => setFormData((prev) => ({ ...prev, remitente: e.target.value }))}
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
            <div className="col-md-3">
              <label className="form-label">Tipo destinatario</label>
              <select
                className="form-select"
                value={formData.tipoDestinatario}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tipoDestinatario: e.target.value }))
                }
              >
                {TIPOS.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Prioridad</label>
              <select
                className="form-select"
                value={formData.prioridad}
                onChange={(e) => setFormData((prev) => ({ ...prev, prioridad: e.target.value }))}
              >
                {PRIORIDADES.map((prioridad) => (
                  <option key={prioridad} value={prioridad}>
                    {prioridad}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Fecha envio (opcional)</label>
              <input
                type="datetime-local"
                className="form-control"
                value={formData.fechaEnvio}
                onChange={(e) => setFormData((prev) => ({ ...prev, fechaEnvio: e.target.value }))}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Contenido</label>
              <textarea
                className="form-control"
                rows="3"
                value={formData.contenido}
                onChange={(e) => setFormData((prev) => ({ ...prev, contenido: e.target.value }))}
              />
            </div>
            <div className="col-12">
              <button className="btn btn-primary" disabled={api.submitting}>
                {api.submitting ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h3 className="h6 mb-3">Filtros de bandeja</h3>
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label">Destinatario</label>
              <input
                className="form-control"
                value={filterDestinatario}
                onChange={(e) => setFilterDestinatario(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-primary w-100" onClick={handleFiltroDestinatario}>
                Filtrar
              </button>
            </div>
            <div className="col-md-3">
              <label className="form-label">Remitente</label>
              <input
                className="form-control"
                value={filterRemitente}
                onChange={(e) => setFilterRemitente(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-primary w-100" onClick={handleFiltroRemitente}>
                Filtrar
              </button>
            </div>
            <div className="col-md-2">
              <label className="form-label">Tipo</label>
              <select className="form-select" value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
                <option value="">Seleccionar</option>
                {TIPOS.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-primary w-100" onClick={handleFiltroTipo}>
                Filtrar tipo
              </button>
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-warning w-100" onClick={handleNoLeidos}>
                No leidos
              </button>
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-secondary w-100" onClick={cargarMensajes}>
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {api.loading ? (
        <LoadingSpinner label="Cargando mensajes..." />
      ) : (
        <div className="table-responsive bg-white rounded shadow-sm p-2">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Asunto</th>
                <th>Remitente</th>
                <th>Destinatario</th>
                <th>Tipo</th>
                <th>Prioridad</th>
                <th>Fecha envio</th>
                <th>Estado</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {mensajes.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-4">Sin mensajes.</td>
                </tr>
              )}
              {mensajes.map((msg) => {
                const id = getMensajeId(msg);
                const noLeido = isNoLeido(msg);
                return (
                  <tr key={id || `${msg.remitente}-${msg.destinatario}-${msg.asunto}`}>
                    <td>{id || '-'}</td>
                    <td>{msg.asunto}</td>
                    <td>{msg.remitente}</td>
                    <td>{msg.destinatario}</td>
                    <td>{msg.tipoDestinatario || '-'}</td>
                    <td>{msg.prioridad || '-'}</td>
                    <td>{msg.fechaEnvio || '-'}</td>
                    <td>
                      <span className={`badge ${noLeido ? 'text-bg-danger' : 'text-bg-success'}`}>
                        {noLeido ? 'No leido' : 'Leido'}
                      </span>
                    </td>
                    <td>
                      {noLeido && id ? (
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleMarcarLeido(id)}
                          disabled={api.submitting}
                        >
                          Marcar como leido
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

export default MensajesPage;
