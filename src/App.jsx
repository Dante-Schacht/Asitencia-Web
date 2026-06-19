import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import AppNavbar from './components/AppNavbar';
import ApoderadosPage from './pages/ApoderadosPage';
import MensajesPage from './pages/MensajesPage';
import NotificacionesPage from './pages/NotificacionesPage';

function App() {
  return (
    <div className="bg-light min-vh-100">
      <AppNavbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Navigate to="/apoderados" replace />} />
          <Route path="/apoderados" element={<ApoderadosPage />} />
          <Route path="/mensajes" element={<MensajesPage />} />
          <Route path="/notificaciones" element={<NotificacionesPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
