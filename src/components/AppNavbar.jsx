import { NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }) =>
  `nav-link ${isActive ? 'active fw-semibold text-primary' : ''}`;

function AppNavbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm">
      <div className="container">
        <span className="navbar-brand fw-bold">Colegio Bernardo O'Higgins</span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto gap-2">
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/apoderados">
                Apoderados
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/mensajes">
                Mensajes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/notificaciones">
                Notificaciones
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default AppNavbar;
