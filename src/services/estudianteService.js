import apiFetch from "./api";

export const listarEstudiantes = () => {
  return apiFetch("/estudiantes/todos");
};

export const crearEstudiante = (estudiante) => {
  return apiFetch("/estudiantes/crear", {
    method: 'POST',
    body: JSON.stringify(estudiante)
  });
};
