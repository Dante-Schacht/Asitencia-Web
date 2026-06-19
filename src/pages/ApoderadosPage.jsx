import { useEffect, useMemo, useState } from 'react';
import ApiFeedback from '../components/ApiFeedback';
import LoadingSpinner from '../components/LoadingSpinner';
import useApiState from '../hooks/useApiState';
import {
  actualizarApoderado,
  crearApoderado,
  eliminarApoderado,
  listarApoderados,
  obtenerApoderadoPorCorreo,
  obtenerApoderadoPorId,
  obtenerApoderadosPorEstudiante,
} from '../services/apoderadoService';
import { getApiErrorMessage } from '../services/httpClient';

const EMPTY_FORM = {
  rut: '',
  nombre: '',
  apellido: '',
  telefono: '',
  parentesco: '',
  correo: '',
  estudianteId: '',
};

const getApoderadoId = (item) => item.id ?? item.idApoderado ?? item.apoderadoId;

const normalizeList = (data) => {
  if (Array.isArray(data)) {
    return data;
  }
  return data ? [data] : [];
};

function ApoderadosPage() {
  const [apoderados, setApoderados] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [searchId, setSearchId] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchEstudianteId, setSearchEstudianteId] = useState('');
  const [formError, setFormError] = useState('');
  const api = useApiState();

  const titleText = useMemo(
    () => (editingId ? 'Editar apoderado' : 'Registrar apoderado'),
    [editingId]
  );

  const cargarApoderados = async () => {
    api.setLoading(true);
    api.clearMessages();
    try {
      const data = await listarApoderados();
      setApoderados(normalizeList(data));
    } catch (error) {
      api.showError(getApiErrorMessage(error, 'No se pudo cargar apoderados'), error);
    } finally {
      api.setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarApoderados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormError('');
  };

  const validateForm = () => {
    if (!formData.rut.trim() || !formData.nombre.trim() || !formData.apellido.trim()) {
      return 'rut, nombre y apellido son requeridos.';
    }
    if (!formData.telefono.trim() || !formData.parentesco.trim()) {
      return 'telefono y parentesco son requeridos.';
    }
    if (!formData.correo.trim()) {
      return 'correo es requerido.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      return 'El correo debe tener formato valido.';
    }
    if (!formData.estudianteId.trim() || Number.isNaN(Number(formData.estudianteId))) {
      return 'estudianteId es requerido y debe ser numerico.';
    }
    return '';
  };

  const handleSubmit = async (event) => {
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
      estudianteId: Number(formData.estudianteId),
    };

    api.setSubmitting(true);
    try {
      if (editingId) {
        await actualizarApoderado(editingId, payload);
        api.showSuccess('Apoderado actualizado correctamente.');
      } else {
        await crearApoderado(payload);
        api.showSuccess('Apoderado creado correctamente.');
      }
      resetForm();
      await cargarApoderados();
    } catch (error) {
      api.showError(getApiErrorMessage(error, 'No se pudo guardar el apoderado'), error);
    } finally {
      api.setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(getApoderadoId(item));
    setFormData({
      rut: item.rut || '',
      nombre: item.nombre || '',
      apellido: item.apellido || '',
      telefono: item.telefono || '',
      parentesco: item.parentesco || '',
      correo: item.correo || '',
      estudianteId: String(item.estudianteId ?? ''),
    });
    setFormError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Se eliminara el apoderado. Deseas continuar?')) {
      return;
    }

    api.setSubmitting(true);
    api.clearMessages();
    try {
      await eliminarApoderado(id);
      api.showSuccess('Apoderado eliminado correctamente.');
      await cargarApoderados();
    } catch (error) {
      api.showError(getApiErrorMessage(error, 'No se pudo eliminar el apoderado'), error);
    } finally {
      api.setSubmitting(false);
    }
  };

  const handleSearchById = async () => {
    if (!searchId.trim()) {
      api.showError('Ingresa un id para buscar.');
      return;
    }
    api.setLoading(true);
    api.clearMessages();
    try {
      const data = await obtenerApoderadoPorId(searchId.trim());
      setApoderados(normalizeList(data));
    } catch (error) {
      api.showError(getApiErrorMessage(error, 'No se encontro el apoderado'), error);
    } finally {
      api.setLoading(false);
    }
  };

  const handleSearchByEmail = async () => {
    if (!searchEmail.trim()) {
      api.showError('Ingresa un correo para buscar.');
      return;
    }
    api.setLoading(true);
    api.clearMessages();
    try {
      const data = await obtenerApoderadoPorCorreo(searchEmail.trim());
      setApoderados(normalizeList(data));
    } catch (error) {
      api.showError(getApiErrorMessage(error, 'No se encontro apoderado para ese correo'), error);
    } finally {
      api.setLoading(false);
    }
  };

  const handleSearchByEstudiante = async () => {
    if (!searchEstudianteId.trim()) {
      api.showError('Ingresa un estudianteId para buscar.');
      return;
    }
    api.setLoading(true);
    api.clearMessages();
    try {
      const data = await obtenerApoderadosPorEstudiante(searchEstudianteId.trim());
      setApoderados(normalizeList(data));
    } catch (error) {
      api.showError(getApiErrorMessage(error, 'No se encontro apoderado para ese estudianteId'), error);
    } finally {
      api.setLoading(false);
    }
  };

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h2 className="h4 mb-0">Gestion de Apoderados</h2>
        <button className="btn btn-outline-secondary" onClick={cargarApoderados}>
          Refrescar
        </button>
      </div>

      <ApiFeedback
        error={api.error || formError}
        success={api.success}
        errorDetails={api.errorDetails}
      />

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h3 className="h6 mb-3">{titleText}</h3>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-4">
              <label className="form-label">RUT</label>
              <input
                className="form-control"
                value={formData.rut}
                onChange={(e) => setFormData((prev) => ({ ...prev, rut: e.target.value }))}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Nombre</label>
              <input
                className="form-control"
                value={formData.nombre}
                onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Apellido</label>
              <input
                className="form-control"
                value={formData.apellido}
                onChange={(e) => setFormData((prev) => ({ ...prev, apellido: e.target.value }))}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Telefono</label>
              <input
                className="form-control"
                value={formData.telefono}
                onChange={(e) => setFormData((prev) => ({ ...prev, telefono: e.target.value }))}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Parentesco</label>
              <input
                className="form-control"
                value={formData.parentesco}
                onChange={(e) => setFormData((prev) => ({ ...prev, parentesco: e.target.value }))}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Correo</label>
              <input
                type="email"
                className="form-control"
                value={formData.correo}
                onChange={(e) => setFormData((prev) => ({ ...prev, correo: e.target.value }))}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Estudiante ID</label>
              <input
                className="form-control"
                value={formData.estudianteId}
                onChange={(e) => setFormData((prev) => ({ ...prev, estudianteId: e.target.value }))}
              />
            </div>
            <div className="col-12 d-flex gap-2 flex-wrap">
              <button className="btn btn-primary" type="submit" disabled={api.submitting}>
                {api.submitting ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h3 className="h6 mb-3">Filtros</h3>
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label">Buscar por ID</label>
              <input
                className="form-control"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-primary w-100" onClick={handleSearchById}>
                Buscar
              </button>
            </div>
            <div className="col-md-4">
              <label className="form-label">Buscar por correo</label>
              <input
                className="form-control"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-primary w-100" onClick={handleSearchByEmail}>
                Buscar
              </button>
            </div>
            <div className="col-md-4">
              <label className="form-label">Buscar por estudiante</label>
              <input
                className="form-control"
                value={searchEstudianteId}
                onChange={(e) => setSearchEstudianteId(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-primary w-100" onClick={handleSearchByEstudiante}>
                Buscar
              </button>
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-secondary w-100" onClick={cargarApoderados}>
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {api.loading ? (
        <LoadingSpinner label="Cargando apoderados..." />
      ) : (
        <div className="table-responsive bg-white rounded shadow-sm p-2">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>RUT</th>
                <th>Nombre</th>
                <th>Telefono</th>
                <th>Correo</th>
                <th>Parentesco</th>
                <th>Estudiante ID</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {apoderados.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    Sin registros.
                  </td>
                </tr>
              )}
              {apoderados.map((item) => {
                const id = getApoderadoId(item);
                return (
                  <tr key={id || `${item.correo}-${item.estudianteId}`}>
                    <td>{id || '-'}</td>
                    <td>{item.rut}</td>
                    <td>{item.nombre} {item.apellido}</td>
                    <td>{item.telefono}</td>
                    <td>{item.correo}</td>
                    <td>{item.parentesco}</td>
                    <td>{item.estudiante}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => handleEdit(item)}>
                          Editar
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => id && handleDelete(id)}
                          disabled={!id || api.submitting}
                        >
                          Eliminar
                        </button>
                      </div>
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

export default ApoderadosPage;
