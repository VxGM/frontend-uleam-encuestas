import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function AdminPanel() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // PROTECCIÓN: Si intenta entrar alguien que no es admin, lo sacamos
    const rol = localStorage.getItem('usuario_rol');
    if (rol !== 'admin') {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div>
      <header className="main-header" style={{background: '#ffffff'}}>
        <div className="logo">Uleam Encuestas <strong>Admin</strong></div>
        <nav>
            <Link to="/dashboard" style={{color:'blue', textDecoration:'none'}}>← Volver al Dashboard</Link>
        </nav>
      </header>

      <main className="container">
        <h1>Panel de Control</h1>
        <p>Bienvenido al área restringida.</p>

        <div className="surveys-grid">
            <article className="card">
                <h2>📊 Resultados</h2>
                <p>Ver gráficas de votaciones y opiniones.</p>
                <Link to="/admin/resultados" className="btn-primary">Ver Estadísticas</Link>
            </article>

            {/* Opción 2: Gestión de Usuarios */}
            <article className="card">
                <h2>👥 Usuarios</h2>
                <p>Agregar, eliminar o cambiar roles.</p>
                <Link to="/admin/usuarios" className="btn-secondary" style={{width: '100%', textAlign: 'center'}}>
                    Gestionar Cuentas
                </Link>
            </article>
        </div>
      </main>
    </div>
  );
}

export default AdminPanel;