import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const [usuario, setUsuario] = useState('');
  const [rol, setRol] = useState('');
  const [estado, setEstado] = useState(null); 
  const [numPendientes, setNumPendientes] = useState(0); 
  const navigate = useNavigate();

  useEffect(() => {
    const emailGuardado = localStorage.getItem('usuario_activo');
    const rolGuardado = localStorage.getItem('usuario_rol');

    if (!emailGuardado) {
      navigate('/');
    } else {
      setUsuario(emailGuardado);
      setRol(rolGuardado);
      cargarEstado(emailGuardado);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('usuario_activo');
    localStorage.removeItem('usuario_rol');
    navigate('/');
  };

  const cargarEstado = async (email) => {
    try {
      const res = await fetch(`http://localhost:3000/api/pendientes?email=${email}`);
      const data = await res.json();
      setEstado(data.estado);
      setNumPendientes(data.pendientes); 
    } catch (error) {
      console.error("Error cargando estado:", error);
    }
  };

  // Lógica para el saludo personalizado
  const getSaludo = () => {
      if (rol === 'profesor') return "Hola, Docente";
      return "Hola, Estudiante";
  };

  const getSubtitulo = () => {
      if (rol === 'profesor') return "Su opinión ayuda a mejorar el entorno académico.";
      return "Tu opinión construye nuestra universidad.";
  };

  return (
    <div>
      <header className="main-header" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          padding: '15px 40px', background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <div className="logo" style={{fontSize: '1.5rem', color: '#2c3e50'}}>
            Uleam <strong>Encuestas</strong>
        </div>
        
        <nav style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
            <span style={{color: '#7f8c8d', fontSize: '0.9rem'}}>{usuario}</span>
            <button onClick={handleLogout} style={{
                    background: '#e74c3c', color: 'white', border: 'none', 
                    padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem'
                }}>
                Cerrar Sesión
            </button>
        </nav>
      </header>

      <main className="container">
        <div className="card" style={{marginBottom: '30px', background: '#2c3e50', color: 'white', border: 'none'}}>
            {rol === 'admin' ? (
                <div>
                    <span style={{background:'#f1c40f', color:'black', padding:'2px 8px', borderRadius:'4px', fontSize:'0.7rem', fontWeight:'bold', textTransform:'uppercase'}}>
                        Modo Administrador
                    </span>
                    <h1 style={{margin: '10px 0', color: 'white'}}>Panel de Control</h1>
                    <p style={{opacity: 0.8}}>Gestiona resultados, usuarios y reportes desde aquí.</p>
                    <Link to="/admin" className="btn-primary" style={{background: 'white', color: '#2c3e50', marginTop: '10px', display:'inline-block'}}>
                        Ir al Panel Admin →
                    </Link>
                </div>
            ) : (
                <div>
                    {/* --- AQUÍ ESTÁ EL SALUDO DINÁMICO --- */}
                    <h1 style={{margin: '0 0 10px 0', color: 'white'}}>{getSaludo()}</h1>
                    <p style={{opacity: 0.8}}>{getSubtitulo()}</p>
                    {/* ------------------------------------ */}

                    <div style={{marginTop: '15px', background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', display: 'inline-block'}}>
                        {numPendientes > 0 ? (
                            <span style={{color: '#ff6b6b', fontWeight: 'bold'}}>
                                ⚠️ Tienes {numPendientes} {numPendientes === 1 ? 'actividad pendiente' : 'actividades pendientes'}.
                            </span>
                        ) : (
                            <span style={{color: '#2ecc71', fontWeight: 'bold'}}>
                                ✅ ¡Estás al día con todas tus encuestas!
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>

        <div className="surveys-grid">
            <article className="card">
                <span className="card-badge">Cierra hoy</span>
                <h3>🗳️ Elecciones Consejo</h3>
                <p>Elige a tus representantes.</p>
                <div style={{marginTop: '20px'}}>
                    {estado && estado.elecciones ? (
                        <button disabled style={{background: '#ccc', cursor: 'not-allowed', width: '100%', border: 'none', padding: '10px', borderRadius: '6px', color: '#666'}}>
                            🔒 Ya votaste
                        </button>
                    ) : (
                        <Link to="/encuesta" className="btn-primary" style={{width: '100%', textAlign: 'center'}}>
                            Votar Ahora
                        </Link>
                    )}
                </div>
            </article>

            <article className="card">
                <span className="card-badge blue">Servicio</span>
                <h3>☕ Cafetería</h3>
                <p>Evalúa la calidad de los alimentos.</p>
                <div style={{marginTop: '20px'}}>
                    <Link to="/cafeteria" className="btn-secondary" style={{width: '100%', textAlign: 'center'}}>
                        {estado && estado.cafeteria ? "✍️ Opinar otra vez" : "Participar"}
                    </Link>
                    {estado && estado.cafeteria && (
                        <p style={{fontSize: '0.75rem', color: '#27ae60', marginTop: '5px', textAlign: 'center'}}>
                            ✅ Ya participaste hoy
                        </p>
                    )}
                </div>
            </article>

            <article className="card">
                <span className="card-badge blue">Infraestructura</span>
                <h3>💻 Laboratorios</h3>
                <p>Solicita software o reporta fallos.</p>
                <div style={{marginTop: '20px'}}>
                    <Link to="/laboratorios" className="btn-secondary" style={{width: '100%', textAlign: 'center'}}>
                        {estado && estado.laboratorios ? "✍️ Nueva Solicitud" : "Participar"}
                    </Link>
                    {estado && estado.laboratorios && (
                        <p style={{fontSize: '0.75rem', color: '#27ae60', marginTop: '5px', textAlign: 'center'}}>
                            ✅ Solicitud enviada
                        </p>
                    )}
                </div>
            </article>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;