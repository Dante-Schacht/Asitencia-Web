import axios from 'axios';

const API_COMUNICACIONES_URL =
  import.meta.env.REACT_APP_API_COMUNICACIONES ||
  import.meta.env.VITE_API_COMUNICACIONES ||
  'http://localhost:8083';

export const comunicacionesClient = axios.create({
  baseURL: API_COMUNICACIONES_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const parseFieldErrors = (data) => {
  if (!data || typeof data !== 'object') {
    return [];
  }

  if (Array.isArray(data.errors)) {
    return data.errors.map((item) => String(item));
  }

  if (Array.isArray(data.errores)) {
    return data.errores.map((item) => String(item));
  }

  if (typeof data.errors === 'object') {
    return Object.entries(data.errors).map(([field, message]) => `${field}: ${message}`);
  }

  return [];
};

export const getApiErrorMessage = (error, fallbackMessage = 'Error inesperado') => {
  if (!error?.response) {
    return 'No se pudo conectar con el servidor de comunicaciones.';
  }

  const { status, data } = error.response;
  const backendMessage = data?.message || data?.error || data?.detalle || '';
  const fieldErrors = parseFieldErrors(data);

  if (status === 400) {
    if (fieldErrors.length > 0) {
      return `Validacion fallida (400): ${fieldErrors.join(' | ')}`;
    }
    return `Solicitud invalida (400): ${backendMessage || fallbackMessage}`;
  }

  if (status === 404) {
    return `Recurso no encontrado (404): ${backendMessage || fallbackMessage}`;
  }

  return backendMessage || fallbackMessage;
};
