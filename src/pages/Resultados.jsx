import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function Resultados() {
  const navigate = useNavigate();
  const [datosVotos, setDatosVotos] = useState(null);
  const [listaOpiniones, setListaOpiniones] = useState([]);
  const [promedioCafe, setPromedioCafe] = useState('0.0');

  // --- CARGA DE DATOS ---
  const cargarDatos = () => {
     // 1. VOTOS
     fetch('https://api-uleam.onrender.com/api/resultados')
     .then(res => res.json())
     .then(data => {
         const etiquetas = data.map(d => {
             if(d.candidato === 'candidato_a') return 'Ana García';
             if(d.candidato === 'candidato_b') return 'Carlos Méndez';
             return 'Blanco/Nulo';
         });
         const valores = data.map(d => d.total);
         
         setDatosVotos({
             labels: etiquetas,
             datasets: [{
                 label: '# Votos',
                 data: valores,
                 backgroundColor: ['#3498db', '#e74c3c', '#95a5a6'],
                 borderWidth: 1,
             }]
         });
     });

    // 2. OPINIONES
    fetch('https://api-uleam.onrender.com/api/opiniones')
     .then(res => res.json())
     .then(data => {
         setListaOpiniones(data);
         const cafes = data.filter(d => d.categoria === 'cafeteria');
         if (cafes.length > 0) {
             const suma = cafes.reduce((acc, curr) => acc + curr.calificacion, 0);
             setPromedioCafe((suma / cafes.length).toFixed(1));
         } else {
             setPromedioCafe('0.0');
         }
     });
  };

  useEffect(() => {
    const rol = localStorage.getItem('usuario_rol');
    if (rol !== 'admin') {
      navigate('/dashboard');
      return;
    }
    cargarDatos();
  }, [navigate]);

  const opinionesCafeteria = listaOpiniones.filter(o => o.categoria === 'cafeteria');
  const opinionesLabs = listaOpiniones.filter(o => o.categoria === 'laboratorios');

  // --- FUNCIONES DE BORRADO ---
  
  // 1. Borrar Votos (Reiniciar Elecciones)
  const handleBorrarVotos = async () => {
    if (!window.confirm("⚠️ ¿REINICIAR ELECCIONES?\nSe borrarán todos los votos.")) return;
    await fetch('https://api-uleam.onrender.com/api/votos', { method: 'DELETE' });
    alert("Elecciones reiniciadas.");
    cargarDatos(); // Recargar sin refrescar página
  };

  // 2. Borrar una OPINIÓN INDIVIDUAL
  const handleBorrarOpinion = async (id) => {
    if(!window.confirm("¿Borrar este comentario?")) return;
    
    await fetch(`https://api-uleam.onrender.com/api/opiniones/${id}`, { method: 'DELETE' });
    cargarDatos();
  };

  // 3. Reiniciar TODA una categoría (Cafetería o Labs)
  const handleReiniciarCategoria = async (categoria) => {
      const nombre = categoria === 'cafeteria' ? 'Cafetería' : 'Laboratorios';
      if(!window.confirm(`⚠️ ¿Estás seguro de BORRAR TODAS las opiniones de ${nombre}?`)) return;

      await fetch(`https://api-uleam.onrender.com/api/opiniones-reset?categoria=${categoria}`, { method: 'DELETE' });
      alert(`Se han eliminado las opiniones de ${nombre}.`);
      cargarDatos();
  };


  // --- FUNCIONES PDF (Iguales que antes) ---
  const descargarVotosPDF = () => {
    const input = document.getElementById('grafico-votos');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF();
      doc.text("Reporte Oficial de Votos", 10, 20);
      doc.addImage(imgData, 'PNG', 15, 30, 180, 100); 
      doc.save("reporte_votos.pdf");
    });
  };

  const descargarCafeteriaPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte Cafetería", 14, 20);
    const tablaData = opinionesCafeteria.map(op => [new Date(op.fecha).toLocaleDateString(), op.email, op.calificacion, op.comentario]);
    autoTable(doc, { startY: 30, head: [['Fecha', 'Usuario', 'Calif.', 'Comentario']], body: tablaData });
    doc.save("reporte_cafeteria.pdf");
  };

  const descargarLabsPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte Laboratorios", 14, 20);
    const tablaData = opinionesLabs.map(op => [new Date(op.fecha).toLocaleDateString(), op.email, op.comentario]);
    autoTable(doc, { startY: 30, head: [['Fecha', 'Solicitante', 'Detalle']], body: tablaData });
    doc.save("reporte_labs.pdf");
  };

  return (
    <div>
      <header className="main-header" style={{background: '#ffffff', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white'}}>
        <div className="logo" style={{fontSize: '1.5rem'}}>Uleam Encuestas <strong>Analytics</strong></div>
        <Link to="/admin" style={{color:'blue', textDecoration:'none', fontWeight:'bold'}}>← Volver al Panel</Link>
      </header>

      <main className="container" style={{maxWidth: '1000px', margin: '30px auto', padding: '20px'}}>
        <h1 style={{marginBottom: '30px', color: '#2c3e50'}}>📊 Gestión de Resultados</h1>

        <div className="surveys-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px'}}>
            
            {/* 1. GRÁFICO DE VOTOS */}
            <article className="card" style={{gridColumn: 'span 2', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                    <h2 style={{margin: 0}}>🏆 Elecciones</h2>
                    <div style={{display:'flex', gap:'10px'}}>
                        <button onClick={handleBorrarVotos} style={{background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>
                            🗑️ Reiniciar
                        </button>
                        <button onClick={descargarVotosPDF} style={{background: '#34495e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>
                            📥 PDF
                        </button>
                    </div>
                </div>
                <div id="grafico-votos" style={{height: '300px', display:'flex', justifyContent:'center'}}>
                    {datosVotos ? <Pie data={datosVotos} /> : <p>Cargando gráfico...</p>}
                </div>
            </article>

            {/* 2. CAFETERÍA */}
            <article className="card" style={{background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                    <h2 style={{margin:0}}>☕ Cafetería</h2>
                    <div style={{display:'flex', gap:'5px'}}>
                        <button onClick={() => handleReiniciarCategoria('cafeteria')} style={{background: '#e74c3c', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize:'0.8rem'}}>
                            🗑️ Limpiar Todo
                        </button>
                        <button onClick={descargarCafeteriaPDF} style={{background: '#34495e', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize:'0.8rem'}}>
                            📥
                        </button>
                    </div>
                </div>
                
                <div style={{textAlign:'right', marginBottom:'10px', color: '#f1c40f', fontWeight: 'bold', fontSize: '1.5rem'}}>
                    {promedioCafe} ★
                </div>

                <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                    {opinionesCafeteria.length === 0 && <p style={{color:'#ccc'}}>Sin opiniones.</p>}
                    
                    {opinionesCafeteria.map((op) => (
                        <div key={op.id} style={{borderBottom:'1px solid #eee', padding:'10px 0', display:'flex', justifyContent:'space-between', alignItems:'start'}}>
                            <div style={{width: '85%'}}>
                                <div style={{fontSize:'0.8rem', color:'#95a5a6'}}>
                                    <strong>{op.email.split('@')[0]}</strong> • {new Date(op.fecha).toLocaleDateString()}
                                </div>
                                <div style={{color:'#f1c40f', fontSize:'0.8rem'}}>{'★'.repeat(op.calificacion)}</div>
                                <p style={{margin:'4px 0', fontSize:'0.9rem', color:'#555'}}>"{op.comentario}"</p>
                            </div>
                            {/* BOTÓN BORRAR INDIVIDUAL */}
                            <button 
                                onClick={() => handleBorrarOpinion(op.id)}
                                style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem'}}
                                title="Borrar esta opinión"
                            >
                                ❌
                            </button>
                        </div>
                    ))}
                </div>
            </article>

            {/* 3. LABORATORIOS */}
            <article className="card" style={{background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}}>
                 <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                    <h2 style={{margin:0}}>💻 Labs</h2>
                    <div style={{display:'flex', gap:'5px'}}>
                        <button onClick={() => handleReiniciarCategoria('laboratorios')} style={{background: '#e74c3c', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize:'0.8rem'}}>
                            🗑️ Limpiar Todo
                        </button>
                        <button onClick={descargarLabsPDF} style={{background: '#34495e', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize:'0.8rem'}}>
                            📥
                        </button>
                    </div>
                </div>
                <p style={{fontSize:'0.8rem', color:'#7f8c8d'}}>{opinionesLabs.length} solicitudes</p>

                <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                    {opinionesLabs.length === 0 && <p style={{color:'#ccc'}}>Sin solicitudes.</p>}

                    {opinionesLabs.map((op) => (
                        <div key={op.id} style={{borderBottom:'1px solid #eee', padding:'10px 0', display:'flex', justifyContent:'space-between', alignItems:'start'}}>
                            <div style={{width: '85%'}}>
                                <div style={{fontWeight:'bold', color:'#2980b9', fontSize:'0.9rem'}}>
                                    {op.email.split('@')[0]}
                                </div>
                                <div style={{color:'#333', fontSize:'0.9rem'}}>{op.comentario}</div>
                                <div style={{fontSize:'0.75rem', color:'#ccc'}}>
                                    {new Date(op.fecha).toLocaleDateString()}
                                </div>
                            </div>
                            {/* BOTÓN BORRAR INDIVIDUAL */}
                            <button 
                                onClick={() => handleBorrarOpinion(op.id)}
                                style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem'}}
                                title="Borrar solicitud"
                            >
                                ❌
                            </button>
                        </div>
                    ))}
                </div>
            </article>

        </div>
      </main>
    </div>
  );
}

export default Resultados;