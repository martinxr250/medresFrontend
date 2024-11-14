'use client'

import React, { useEffect } from 'react';
import TipoHabitaciones from '../components/tipoHabitaciones';

const Habitaciones = ({ usuarioEnSesion, token, setToken, setUsuarioEnSesion, setEstaEnSesion }) => {
  useEffect(() => {
    const logueado = window.localStorage.getItem("medres")
    if (logueado) {
      const logueadoJSON = JSON.parse(logueado)
      if (typeof setToken === 'function') {
        setToken(logueadoJSON.token)
      }
      if (typeof setUsuarioEnSesion === 'function') {
        setUsuarioEnSesion(logueadoJSON)
      }
      if (typeof setEstaEnSesion === 'function') {
        setEstaEnSesion(true)
      }
    }
  }, [setToken, setUsuarioEnSesion, setEstaEnSesion])

  return (
    <div className='bg-gray-100'>
      <div>
        {/* Aquí puedes usar el componente TipoHabitaciones */}
        <TipoHabitaciones />
      </div>
    </div>
  );
};

export default Habitaciones;