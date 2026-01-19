import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  
  // Formulario nuevo usuario
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [nuevoPass, setNuevoPass] = useState('');
  const [nuevoRol, setNuevoRol] = useState('estudiante');

  const navigate = useNavigate();

  // Cargar usuarios al iniciar
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await fetch('https://api-uleam.onrender.com/api/usuarios');
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error cargando usuarios");
    }
  };

  // Función: CREAR
  const handleCrear = async (e) => {
    e.preventDefault();
    if(!nuevoEmail || !nuevoPass) return alert("Completa los datos");

    await fetch('https://api-uleam.onrender.com/api/usuarios', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email: nuevoEmail, password: nuevoPass, rol: nuevoRol })
    });
    
    setNuevoEmail(''); setNuevoPass(''); // Limpiar form
    cargarUsuarios(); // Recargar tabla
    alert("Usuario creado correctamente");
  };

  // Función: ELIMINAR
  const handleEliminar = async (id) => {
    if(!window.confirm("¿Seguro de eliminar este usuario?")) return;
    
    await fetch(`https://api-uleam.onrender.com/api/usuarios/${id}`, { method: 'DELETE' });
    cargarUsuarios();
  };

  // Función: CAMBIAR ROL (Ciclo: Estudiante -> Profesor -> Admin -> Estudiante)
  const toggleRol = async (id, rolActual) => {
    let rolNuevo = 'estudiante';
    
    if (rolActual === 'estudiante') rolNuevo = 'profesor';
    else if (rolActual === 'profesor') rolNuevo = 'admin';
    else if (rolActual === 'admin') rolNuevo = 'estudiante';
    
    await fetch(`https://api-uleam.onrender.com/api/usuarios/${id}/rol`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ nuevoRol: rolNuevo })
    });
    cargarUsuarios();
  };

  // Función auxiliar para color de badge
  const getBadgeColor = (rol) => {
    if (rol === 'admin') return { bg: '#f1c40f', color: '#000' }; // Amarillo
    if (rol === 'profesor') return { bg: '#9b59b6', color: '#fff' }; // Morado
    return { bg: '#eef2ff', color: '#4f46e5' }; // Azul (Estudiante)
  };

  return (
    <div>
      <header className="main-header" style={{background: '#2c3e50', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div className="logo" style={{fontSize: '1.5rem', color: 'white'}}>Uleam <strong>Encuestas</strong></div>
        <Link to="/admin" style={{color:'white', textDecoration: 'none'}}>← Volver</Link>
      </header>

      <main className="container" style={{padding: '30px'}}>
        <h1 style={{color: '#2c3e50'}}>👥 Gestión de Usuarios</h1>
        
        {/* --- FORMULARIO DE CREACIÓN --- */}
        <section className="card" style={{marginBottom: '30px', background: '#f8f9fa', padding: '20px', borderRadius: '8px'}}>
            <h3>Agregar Nuevo Usuario</h3>
            <form onSubmit={handleCrear} style={{display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap'}}>
                <div style={{flex: 1, minWidth: '200px'}}>
                    <label style={{display:'block', marginBottom:'5px'}}>Correo:</label>
                    <input type="email" value={nuevoEmail} onChange={e=>setNuevoEmail(e.target.value)} required style={{width:'100%', padding:'8px'}} placeholder="ej: docente@uleam.edu.ec" />
                </div>
                <div style={{flex: 1, minWidth: '200px'}}>
                    <label style={{display:'block', marginBottom:'5px'}}>Contraseña:</label>
                    <input type="text" value={nuevoPass} onChange={e=>setNuevoPass(e.target.value)} required style={{width:'100%', padding:'8px'}} placeholder="clave123" />
                </div>
                <div style={{minWidth: '150px'}}>
                    <label style={{display:'block', marginBottom:'5px'}}>Rol:</label>
                    <select value={nuevoRol} onChange={e=>setNuevoRol(e.target.value)} style={{padding: '8px', width: '100%'}}>
                        <option value="estudiante">Estudiante</option>
                        <option value="profesor">Profesor</option> {/* Opción Nueva */}
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                <button type="submit" className="btn-primary" style={{height: '38px', padding: '0 20px'}}>+ Crear</button>
            </form>
        </section>

        {/* --- TABLA DE USUARIOS --- */}
        <section className="card" style={{padding: '20px'}}>
            <h3>Lista de Usuarios ({usuarios.length})</h3>
            <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '15px'}}>
                <thead>
                    <tr style={{background: '#eee', textAlign: 'left'}}>
                        <th style={{padding: '10px'}}>ID</th>
                        <th style={{padding: '10px'}}>Correo</th>
                        <th style={{padding: '10px'}}>Rol</th>
                        <th style={{padding: '10px'}}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(u => {
                        const estilo = getBadgeColor(u.rol);
                        return (
                            <tr key={u.id} style={{borderBottom: '1px solid #ddd'}}>
                                <td style={{padding: '10px'}}>#{u.id}</td>
                                <td style={{padding: '10px', fontWeight: 'bold'}}>{u.email}</td>
                                <td style={{padding: '10px'}}>
                                    <span style={{
                                        padding: '4px 8px', 
                                        borderRadius: '4px',
                                        background: estilo.bg,
                                        color: estilo.color,
                                        fontWeight: 'bold', fontSize: '0.8rem',
                                        textTransform: 'uppercase'
                                    }}>
                                        {u.rol}
                                    </span>
                                </td>
                                <td style={{padding: '10px', display:'flex', gap:'10px'}}>
                                    <button 
                                        onClick={() => toggleRol(u.id, u.rol)}
                                        style={{padding:'5px 10px', cursor:'pointer', border:'1px solid #ccc', background:'white', borderRadius:'4px'}}
                                        title="Cambiar Rol (Estudiante -> Profesor -> Admin)"
                                    >
                                        🔄 Rol
                                    </button>
                                    <button 
                                        onClick={() => handleEliminar(u.id)}
                                        style={{padding:'5px 10px', cursor:'pointer', background:'#e74c3c', color:'white', border:'none', borderRadius:'4px'}}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </section>

      </main>
    </div>
  );
}

export default GestionUsuarios;