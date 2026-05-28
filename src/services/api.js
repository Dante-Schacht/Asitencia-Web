const BASE_URL = "/api";

const apiFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  console.log(`Realizando petición fetch a: ${url}`, config);
  
  try {
    const response = await fetch(url, config);
    console.log(`Respuesta recibida de ${url}. Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error en la respuesta de ${url}:`, {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }
      
      throw { response: { data: errorData, status: response.status } };
    }

    // Si la respuesta es exitosa pero vacía (como un DELETE o 204)
    if (response.status === 204) {
      console.log(`Petición a ${url} completada con éxito (sin contenido)`);
      return { data: null };
    }

    const data = await response.json();
    console.log(`Datos obtenidos con éxito de ${url}:`, data);
    return { data };
  } catch (error) {
    if (error.response) {
      throw error;
    }
    console.error(`Error de red o conexión al intentar acceder a ${url}:`, error);
    throw error;
  }
};

export default apiFetch;
