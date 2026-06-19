# Frontend Libro de Clases Digital

Frontend del sistema de libro de clases digital del Colegio Bernardo O'Higgins.

## Stack

- React 18
- Bootstrap 5
- React Router v6
- Axios
- Vite

## Estructura

```text
src/
	components/
		ApiFeedback.jsx
		AppNavbar.jsx
		LoadingSpinner.jsx
	hooks/
		useApiState.js
	models/
		comunicacionesModels.js
	pages/
		ApoderadosPage.jsx
		MensajesPage.jsx
		NotificacionesPage.jsx
	services/
		apoderadoService.js
		mensajeService.js
		notificacionService.js
		httpClient.js
```

## Variables de entorno

Copiar `.env.example` a `.env`.

```env
REACT_APP_API_COMUNICACIONES=http://localhost:8083
```

## Instalacion y ejecucion

```bash
npm install
npm start
```

Alternativa equivalente en Vite:

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Funcionalidades implementadas

- `/apoderados`
	- CRUD completo (crear, listar, editar, eliminar)
	- Validaciones: rut, nombre, apellido, telefono, parentesco, correo valido, estudianteId numerico
	- Filtros por correo y estudianteId
- `/mensajes`
	- Bandeja con filtros por remitente y destinatario
	- Formulario con asunto, contenido, remitente, destinatario, tipoDestinatario, prioridad, fechaEnvio opcional
	- Indicador visual de no leidos y accion de marcar como leido
- `/notificaciones`
	- Listado de notificaciones
	- Formulario con titulo, descripcion, destinatario, tipo, fechaCreacion opcional
	- Indicador visual de no leidas y accion de marcar como leida

## Manejo de errores API

El cliente HTTP interpreta y muestra mensajes claros para:

- 400 (validaciones)
- 404 (recurso no encontrado)
- errores de conectividad
