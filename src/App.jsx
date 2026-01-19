import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Encuesta from './pages/Encuesta';
import Cafeteria from './pages/Cafeteria';
import Laboratorios from './pages/Laboratorios';
import AdminPanel from './pages/AdminPanel';
import Resultados from './pages/Resultados'; // <--- 1. ¡IMPORTANTE! Importar el archivo
import GestionUsuarios from './pages/GestionUsuarios';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas / Estudiante */}
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/encuesta" element={<Encuesta />} />
        <Route path="/cafeteria" element={<Cafeteria />} />
        <Route path="/laboratorios" element={<Laboratorios />} />

        {/* Rutas de Administrador */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/resultados" element={<Resultados />} />
        <Route path="/admin/usuarios" element={<GestionUsuarios />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;