import apiFetch from "./api";

export const listarCursos = () => {
  return apiFetch("/cursos");
};

export const crearCurso = (curso) => {
  return apiFetch("/cursos", {
    method: 'POST',
    body: JSON.stringify(curso)
  });
};
