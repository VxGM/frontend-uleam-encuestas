import { useState, useEffect } from 'react'; // <--- Importamos useEffect
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recordarme, setRecordarme] = useState(false); // <--- Nuevo estado para el Checkbox
  const navigate = useNavigate();

  // 1. GET: Al iniciar, comprobamos si hay un usuario guardado
  useEffect(() => {
    const emailGuardado = localStorage.getItem('recuerdame_email');
    if (emailGuardado) {
      setEmail(emailGuardado);
      setRecordarme(true); // Marcamos la casilla visualmente
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      alert("Correo inválido");
      return;
    }

    try {
      const respuesta = await fetch('https://api-uleam.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await respuesta.json();

      if (respuesta.ok && data.status === 'success') {
        // Guardamos sesión activa
        localStorage.setItem('usuario_activo', data.email);
        localStorage.setItem('usuario_rol', data.rol);

        // --- LÓGICA DE RECORDAR (SET / REMOVE) ---
        if (recordarme) {
            // Si marcó la casilla, guardamos el correo para el futuro
            localStorage.setItem('recuerdame_email', email);
        } else {
            // Si NO marcó la casilla, borramos cualquier rastro previo
            localStorage.removeItem('recuerdame_email');
        }
        // -----------------------------------------

        navigate('/dashboard');
      } else {
        alert("⚠️ Acceso denegado: " + (data.error || "Datos incorrectos"));
      }

    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  };

  return (
    <div style={{
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundImage: "url('/fondo.jpg')", 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
    }}>
      
      <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          zIndex: 1
      }}></div>

      <div className="login-card" style={{
          position: 'relative', zIndex: 2, 
          background: 'rgba(255, 255, 255, 0.95)', 
          padding: '40px', borderRadius: '15px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          maxWidth: '400px', width: '90%'
      }}>
        <div className="login-header" style={{textAlign: 'center', marginBottom: '20px'}}>
          <div className="logo-large" style={{fontSize: '2rem', color: '#2c3e50', marginBottom: '5px'}}>
              Uleam <strong>Encuestas</strong>
          </div>
          <p style={{color: '#7f8c8d', margin: 0}}>Acceso Institucional</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group" style={{marginBottom: '15px'}}>
            <label style={{display:'block', marginBottom:'5px', fontWeight:'bold', color:'#333'}}>Correo</label>
            <input 
              type="email" placeholder="usuario@live.uleam.edu.ec"
              value={email} onChange={(e) => setEmail(e.target.value)} required
              style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc'}}
            />
          </div>

          <div className="input-group" style={{marginBottom: '15px'}}>
            <label style={{display:'block', marginBottom:'5px', fontWeight:'bold', color:'#333'}}>Contraseña</label>
            <input 
                type="password" placeholder="••••••••" 
                value={password} onChange={(e) => setPassword(e.target.value)} required 
                style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc'}}
            />
          </div>

          {/* --- CHECKBOX RECORDARME --- */}
          <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '8px'}}>
              <input 
                type="checkbox" 
                id="checkRecordar"
                checked={recordarme}
                onChange={(e) => setRecordarme(e.target.checked)}
                style={{width: '18px', height: '18px', cursor: 'pointer'}}
              />
              <label htmlFor="checkRecordar" style={{cursor: 'pointer', color: '#555', fontSize: '0.9rem'}}>
                  Recordar mi correo
              </label>
          </div>
          {/* --------------------------- */}

          <button type="submit" className="btn-primary btn-block" style={{
              width: '100%', padding: '12px', background: '#2c3e50', color: 'white', 
              border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold'
          }}>
              Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;