/**
 * Modelo Apoderado esperado por frontend
 * {
 *   id?: number,
 *   rut: string,
 *   nombre: string,
 *   apellido: string,
 *   telefono: string,
 *   parentesco: string,
 *   correo: string,
 *   estudianteId: number
 * }
 */

/**
 * Modelo Mensaje esperado por frontend
 * {
 *   id?: number,
 *   asunto: string,
 *   contenido: string,
 *   remitente: string,
 *   destinatario: string,
 *   tipoDestinatario: 'APODERADO' | 'ESTUDIANTE' | 'DOCENTE' | 'ADMINISTRATIVO',
 *   prioridad: 'BAJA' | 'MEDIA' | 'ALTA',
 *   fechaEnvio?: string,
 *   leido?: boolean
 * }
 */

/**
 * Modelo Notificacion esperado por frontend
 * {
 *   id?: number,
 *   titulo: string,
 *   descripcion: string,
 *   destinatario: string,
 *   tipo: 'INFORMATIVA' | 'URGENTE' | 'ACADEMICA' | 'CONDUCTUAL',
 *   fechaCreacion?: string,
 *   leida?: boolean
 * }
 */

export {};
