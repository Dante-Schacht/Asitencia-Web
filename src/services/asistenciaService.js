import apiFetch from "./api";

export const listarAsistencias = () => {
  return apiFetch("/asistencia/todas");
};

export const crearAsistencia = (asistencia) => {
  return apiFetch("/asistencia/registrar", {
    method: 'POST',
    body: JSON.stringify(asistencia)
  });
};
