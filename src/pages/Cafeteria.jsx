import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Cafeteria() {
  const [calificacion, setCalificacion] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState('');
  
  const navigate = useNavigate();
  const usuario = localStorage.getItem('usuario_activo');

  useEffect(() => {
    if (!usuario) navigate('/');
  }, [usuario, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (calificacion === 0) {
      alert("⚠️ Por favor selecciona al menos una estrella ⭐");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/opinion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: usuario,
          categoria: 'cafeteria',
          calificacion: calificacion,
          comentario: comentario
        })
      });

      if (respuesta.ok) {
        // --- CAMBIO: REDIRECCIÓN INMEDIATA ---
        alert("✅ ¡Gracias! Tu opinión sobre la cafetería se ha guardado.");
        navigate('/dashboard');
        // ------------------------------------
      } else {
        alert("Error al guardar.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión.");
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
            <h1 style={{color: '#2c3e50'}}>☕ Calidad de Cafetería</h1>
            <p style={{color: '#7f8c8d'}}>Ayúdanos a mejorar el servicio de alimentación.</p>
        </div>

        <form onSubmit={handleSubmit} className="card" style={{maxWidth: '600px', margin: '0 auto'}}>
            
            <div className="input-group" style={{textAlign:'center', margin:'20px 0'}}>
                <label style={{display:'block', marginBottom:'10px', fontWeight:'bold', color:'#2c3e50'}}>Calificación General</label>
                <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                            key={star}
                            style={{
                                fontSize: '3rem', 
                                cursor: 'pointer', 
                                color: star <= (hover || calificacion) ? '#f1c40f' : '#e0e0e0',
                                transition: 'color 0.2s',
                                padding: '0 5px'
                            }}
                            onClick={() => setCalificacion(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(calificacion)}
                        >
                            ★
                        </span>
                    ))}
                </div>
            </div>

            <div className="input-group" style={{marginTop: '20px'}}>
                <label style={{display:'block', marginBottom:'5px', fontWeight:'bold', color:'#2c3e50'}}>Comentario (Opcional)</label>
                <textarea 
                    rows="4" 
                    placeholder="¿Qué te pareció la comida hoy? ¿Alguna sugerencia?"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    style={{
                        width: '100%', 
                        padding: '10px', 
                        borderRadius: '6px', 
                        border: '1px solid #ccc',
                        fontFamily: 'inherit'
                    }}
                ></textarea>
            </div>

            <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '20px', padding: '12px'}}>
                Enviar Opinión
            </button>
        </form>
      </main>
    </div>
  );
}

export default Cafeteria;