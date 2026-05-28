import apiFetch from "./api";

export const listarNotas = () => {
  return apiFetch("/notas/todas");
};

export const crearNota = (nota) => {
  return apiFetch("/notas/registrar", {
    method: 'POST',
    body: JSON.stringify(nota)
  });
};
