import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Laboratorios() {
  const [software, setSoftware] = useState('');
  const [mensaje, setMensaje] = useState('');
  
  const navigate = useNavigate();
  const usuario = localStorage.getItem('usuario_activo');

  useEffect(() => {
    if (!usuario) navigate('/');
  }, [usuario, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mensaje) {
      alert("⚠️ Por favor describe tu solicitud.");
      return;
    }

    // Combinamos el software y el mensaje para guardarlo en la BD
    const comentarioCompleto = software 
        ? `[Solicitud: ${software}] - ${mensaje}` 
        : mensaje;

    try {
      const respuesta = await fetch('https://api-uleam.onrender.com/api/opinion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: usuario,
          categoria: 'laboratorios',
          calificacion: 0, // No aplica estrellas aquí
          comentario: comentarioCompleto
        })
      });

      if (respuesta.ok) {
        // --- CAMBIO: REDIRECCIÓN INMEDIATA ---
        alert("✅ Solicitud enviada al departamento de TI.");
        navigate('/dashboard');
        // ------------------------------------
      } else {
        alert("Error al enviar.");
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
            <h1 style={{color: '#2c3e50'}}>💻 Soporte de Laboratorios</h1>
            <p style={{color: '#7f8c8d'}}>Reporta fallos o solicita nuevo software para tus clases.</p>
        </div>

        <form onSubmit={handleSubmit} className="card" style={{maxWidth: '600px', margin: '0 auto'}}>
            
            <div className="input-group" style={{marginBottom: '20px'}}>
                <label style={{display:'block', marginBottom:'5px', fontWeight:'bold', color:'#2c3e50'}}>Tipo de Solicitud</label>
                <select 
                    value={software} 
                    onChange={(e) => setSoftware(e.target.value)}
                    style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc'}}
                >
                    <option value="">Selecciona una opción...</option>
                    <option value="Instalación Software">Instalar Nuevo Software</option>
                    <option value="Reparación PC">Reportar PC Dañada</option>
                    <option value="Internet/Red">Problemas de Internet</option>
                    <option value="Otro">Otro</option>
                </select>
            </div>

            <div className="input-group">
                <label style={{display:'block', marginBottom:'5px', fontWeight:'bold', color:'#2c3e50'}}>Detalle</label>
                <textarea 
                    rows="5" 
                    placeholder="Ej: Necesito instalar Python en el Lab 2 para la clase de las 10am..."
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    style={{
                        width: '100%', 
                        padding: '10px', 
                        borderRadius: '6px', 
                        border: '1px solid #ccc',
                        fontFamily: 'inherit'
                    }}
                    required
                ></textarea>
            </div>

            <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '20px', padding: '12px'}}>
                Enviar Solicitud
            </button>
        </form>
      </main>
    </div>
  );
}

export default Laboratorios;