import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Nosotros from './pages/Nosotros';
import Habitaciones from './pages/Habitaciones';
import Servicios from './pages/Servicios';
import Bienvenida from "./pages/Bienvenida";
import WhatsAppButton from "./components/Redes/Whatsapp";
import PasswordRecovery from "./pages/RecoveryPassword";
import VerReservas from "./pages/MisReservas";
import ConfiguracionUsuario from "./pages/ConfiguracionUsuario";

//Cambiar el boton iniciar session por un boton de bienvenida con el nombre del usuario que inicio sesion.
function App() {

  // declarar estados que indican que usuario esta en sesion y si lo esta o no, además de su token de sesión
  //globales.
  const [estaEnSesion, setEstaEnSesion] = useState(false);
  const [usuarioEnSesion, setUsuarioEnSesion] = useState(null);
  const [token, setToken] = useState(null)


  return (
    <div>
      <BrowserRouter>
      <header><Navbar usuarioEnSesion={usuarioEnSesion} setEstaEnSesion={setEstaEnSesion} setUsuarioEnSesion={setUsuarioEnSesion} setToken={setToken}/></header>
        <Routes> 
          <Route path="/" element={<Inicio usuarioEnSesion={usuarioEnSesion} setToken={setToken}  setUsuarioEnSesion={setUsuarioEnSesion} setEstaEnSesion={setEstaEnSesion} />} />
          <Route path="/habitaciones" element={<Habitaciones token={token} usuarioEnSesion={usuarioEnSesion} setToken={setToken}  setUsuarioEnSesion={setUsuarioEnSesion} setEstaEnSesion={setEstaEnSesion} />} />
          <Route path="/servicios" element={<Servicios token={token} usuarioEnSesion={usuarioEnSesion} setToken={setToken}  setUsuarioEnSesion={setUsuarioEnSesion} setEstaEnSesion={setEstaEnSesion} />} />
          <Route path="/nosotros" element={<Nosotros token={token} usuarioEnSesion={usuarioEnSesion} setToken={setToken}  setUsuarioEnSesion={setUsuarioEnSesion} setEstaEnSesion={setEstaEnSesion} />} />
          <Route path="/login" element={<Login setEstaEnSesion={setEstaEnSesion}setToken={setToken} setUsuarioEnSesion={setUsuarioEnSesion} />} />
          <Route path="/bienvenida" element={<Bienvenida token={token} usuarioEnSesion={usuarioEnSesion} setToken={setToken}  setUsuarioEnSesion={setUsuarioEnSesion} setEstaEnSesion={setEstaEnSesion} />} />
          <Route path="/misReservas" element={<VerReservas token={token} usuarioEnSesion={usuarioEnSesion} setToken={setToken}  setUsuarioEnSesion={setUsuarioEnSesion} setEstaEnSesion={setEstaEnSesion} />} />
          <Route path="/modificarCuenta" element={<ConfiguracionUsuario token={token} usuarioEnSesion={usuarioEnSesion} setToken={setToken}  setUsuarioEnSesion={setUsuarioEnSesion} setEstaEnSesion={setEstaEnSesion} />} />
          <Route path="/recuperar-contrasena" element={<PasswordRecovery />} />
        </Routes>
      </BrowserRouter>
      <WhatsAppButton />

      
    </div>
  );
}

export default App;
