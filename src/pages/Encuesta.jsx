import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Encuesta() {
  const [candidato, setCandidato] = useState('');
  const navigate = useNavigate();
  const usuario = localStorage.getItem('usuario_activo');

  useEffect(() => {
    if (!usuario) navigate('/');
  }, [usuario, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!candidato) {
      alert("⚠️ Debes seleccionar un candidato para poder votar.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/votar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: usuario,
          candidato: candidato,
          propuestas: 'General',
          comentarios: 'Voto digital'
        })
      });

      const data = await respuesta.json();

      if (data.status === 'success') {
        // --- AQUÍ ESTÁ EL CAMBIO ---
        alert("✅ ¡Tu voto ha sido registrado correctamente!");
        navigate('/dashboard'); // <--- Redirección automática al inicio
        // ---------------------------
      } else {
        alert(data.message || "Error al votar");
      }

    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div>
      <header className="main-header" style={{
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '15px 40px', 
          background: 'white', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <div className="logo" style={{fontSize: '1.5rem', color: '#2c3e50'}}>
            Uleam Encuestas
        </div>
        <Link to="/dashboard" style={{color:'#7f8c8d', textDecoration:'none'}}>Cancelar</Link>
      </header>

      <main className="container">
        <div style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{color: '#2c3e50'}}>🗳️ Elecciones Consejo Estudiantil</h1>
            <p style={{color: '#7f8c8d'}}>Tu voto es secreto y obligatorio. Elige sabiamente.</p>
        </div>

        <form onSubmit={handleSubmit} style={{marginTop: '20px'}}>
            <div className="surveys-grid">
                
                {/* OPCIÓN A */}
                <label className="card" style={{
                    cursor:'pointer', 
                    border: candidato === 'candidato_a' ? '2px solid #27ae60' : '1px solid #eee',
                    background: candidato === 'candidato_a' ? '#f9fff9' : 'white',
                    transition: 'all 0.2s'
                }}>
                    <input 
                        type="radio" 
                        name="voto" 
                        value="candidato_a" 
                        onChange={(e) => setCandidato(e.target.value)}
                        style={{display:'none'}}
                    />
                    <div style={{fontSize:'3rem', marginBottom:'10px'}}>👩‍💼</div>
                    <h3 style={{margin: '10px 0'}}>Ana García</h3>
                    <p style={{color: '#27ae60', fontWeight: 'bold'}}>Lista A - "Innovación"</p>
                    <ul style={{textAlign:'left', fontSize:'0.85rem', color:'#555', paddingLeft: '20px'}}>
                        <li>Wifi de alta velocidad en patios</li>
                        <li>Biblioteca digital 24/7</li>
                    </ul>
                </label>

                {/* OPCIÓN B */}
                <label className="card" style={{
                    cursor:'pointer', 
                    border: candidato === 'candidato_b' ? '2px solid #27ae60' : '1px solid #eee',
                    background: candidato === 'candidato_b' ? '#f9fff9' : 'white',
                    transition: 'all 0.2s'
                }}>
                    <input 
                        type="radio" 
                        name="voto" 
                        value="candidato_b" 
                        onChange={(e) => setCandidato(e.target.value)}
                        style={{display:'none'}}
                    />
                     <div style={{fontSize:'3rem', marginBottom:'10px'}}>👨‍💼</div>
                    <h3 style={{margin: '10px 0'}}>Carlos Méndez</h3>
                    <p style={{color: '#2980b9', fontWeight: 'bold'}}>Lista B - "Unión"</p>
                     <ul style={{textAlign:'left', fontSize:'0.85rem', color:'#555', paddingLeft: '20px'}}>
                        <li>Mejorar menú de cafetería</li>
                        <li>Torneos deportivos mensuales</li>
                    </ul>
                </label>

                {/* OPCIÓN NULO */}
                <label className="card" style={{
                    cursor:'pointer', 
                    border: candidato === 'blanco' ? '2px solid #95a5a6' : '1px solid #eee',
                    background: candidato === 'blanco' ? '#f4f4f4' : 'white',
                    transition: 'all 0.2s'
                }}>
                    <input 
                        type="radio" 
                        name="voto" 
                        value="blanco" 
                        onChange={(e) => setCandidato(e.target.value)}
                        style={{display:'none'}}
                    />
                     <div style={{fontSize:'3rem', marginBottom:'10px'}}>⚪</div>
                    <h3 style={{margin: '10px 0'}}>Voto en Blanco</h3>
                    <p style={{color: '#7f8c8d'}}>Ninguna de las anteriores</p>
                </label>

            </div>

            <div style={{marginTop: '40px', textAlign: 'center'}}>
                <button 
                    type="submit" 
                    className="btn-primary" 
                    style={{
                        fontSize: '1.1rem', 
                        padding: '15px 50px', 
                        background: '#2c3e50', 
                        border: 'none',
                        borderRadius: '8px'
                    }}
                >
                    Confirmar Voto
                </button>
            </div>
        </form>
      </main>
    </div>
  );
}

export default Encuesta;