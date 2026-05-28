import React from 'react';

const Dashboard = ({ stats }) => {
  return (
    <div>
      <h2>Dashboard Principal</h2>
      <div className="dashboard-grid">
        <div className="card">
          <h3>Estudiantes</h3>
          <div className="value">{stats.estudiantes}</div>
        </div>
        <div className="card">
          <h3>Cursos</h3>
          <div className="value">{stats.cursos}</div>
        </div>
        <div className="card">
          <h3>Asistencias</h3>
          <div className="value">{stats.asistencias}</div>
        </div>
        <div className="card">
          <h3>Notas</h3>
          <div className="value">{stats.notas}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
