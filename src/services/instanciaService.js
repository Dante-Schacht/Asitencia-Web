import axios from "axios";

const API_URL = "http://localhost:8080/api/asistencias";

export const listarAsistencias = () => {
  return axios.get(API_URL);
};