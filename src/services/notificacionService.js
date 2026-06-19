import { comunicacionesClient } from './httpClient';

export const listarNotificaciones = async () => {
  const response = await comunicacionesClient.get('/api/notificaciones');
  return response.data;
};

export const obtenerNotificacionPorId = async (id) => {
  const response = await comunicacionesClient.get(`/api/notificaciones/${id}`);
  return response.data;
};

export const listarNotificacionesPorDestinatario = async (destinatario) => {
  const response = await comunicacionesClient.get(
    `/api/notificaciones/destinatario/${encodeURIComponent(destinatario)}`
  );
  return response.data;
};

export const listarNotificacionesNoLeidas = async () => {
  const response = await comunicacionesClient.get('/api/notificaciones/no-leidas');
  return response.data;
};

export const crearNotificacion = async (payload) => {
  const response = await comunicacionesClient.post('/api/notificaciones', payload);
  return response.data;
};

export const actualizarNotificacion = async (id, payload) => {
  const response = await comunicacionesClient.put(`/api/notificaciones/${id}`, payload);
  return response.data;
};

export const marcarNotificacionLeida = async (id) => {
  const response = await comunicacionesClient.put(`/api/notificaciones/${id}/leer`);
  return response.data;
};

export const eliminarNotificacion = async (id) => {
  const response = await comunicacionesClient.delete(`/api/notificaciones/${id}`);
  return response.data;
};
