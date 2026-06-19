import { comunicacionesClient } from './httpClient';

export const listarApoderados = async () => {
  const response = await comunicacionesClient.get('/api/apoderados');
  return response.data;
};

export const obtenerApoderadoPorId = async (id) => {
  const response = await comunicacionesClient.get(`/api/apoderados/${id}`);
  return response.data;
};

export const obtenerApoderadosPorEstudiante = async (estudianteId) => {
  const response = await comunicacionesClient.get(`/api/apoderados/estudiante/${estudianteId}`);
  return response.data;
};

export const obtenerApoderadoPorCorreo = async (correo) => {
  const response = await comunicacionesClient.get(
    `/api/apoderados/correo/${encodeURIComponent(correo)}`
  );
  return response.data;
};

export const crearApoderado = async (payload) => {
  const response = await comunicacionesClient.post('/api/apoderados', payload);
  return response.data;
};

export const actualizarApoderado = async (id, payload) => {
  const response = await comunicacionesClient.put(`/api/apoderados/${id}`, payload);
  return response.data;
};

export const eliminarApoderado = async (id) => {
  const response = await comunicacionesClient.delete(`/api/apoderados/${id}`);
  return response.data;
};
