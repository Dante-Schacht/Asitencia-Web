import { comunicacionesClient } from './httpClient';

export const listarMensajes = async () => {
  const response = await comunicacionesClient.get('/api/mensajes');
  return response.data;
};

export const obtenerMensajePorId = async (id) => {
  const response = await comunicacionesClient.get(`/api/mensajes/${id}`);
  return response.data;
};

export const listarMensajesPorDestinatario = async (destinatario) => {
  const response = await comunicacionesClient.get(
    `/api/mensajes/destinatario/${encodeURIComponent(destinatario)}`
  );
  return response.data;
};

export const listarMensajesPorRemitente = async (remitente) => {
  const response = await comunicacionesClient.get(
    `/api/mensajes/remitente/${encodeURIComponent(remitente)}`
  );
  return response.data;
};

export const listarMensajesPorTipoDestinatario = async (tipoDestinatario) => {
  const response = await comunicacionesClient.get(
    `/api/mensajes/tipo-destinatario/${encodeURIComponent(tipoDestinatario)}`
  );
  return response.data;
};

export const listarMensajesNoLeidos = async () => {
  const response = await comunicacionesClient.get('/api/mensajes/no-leidos');
  return response.data;
};

export const crearMensaje = async (payload) => {
  const response = await comunicacionesClient.post('/api/mensajes', payload);
  return response.data;
};

export const actualizarMensaje = async (id, payload) => {
  const response = await comunicacionesClient.put(`/api/mensajes/${id}`, payload);
  return response.data;
};

export const marcarMensajeLeido = async (id) => {
  const response = await comunicacionesClient.put(`/api/mensajes/${id}/leer`);
  return response.data;
};

export const eliminarMensaje = async (id) => {
  const response = await comunicacionesClient.delete(`/api/mensajes/${id}`);
  return response.data;
};
