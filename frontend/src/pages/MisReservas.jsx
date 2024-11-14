import React, { useEffect, useState } from 'react'
import AdminHotel from '../components/AdminHotel'
import NoLogin from '../components/NoLogin'
import MisReservas from '@/components/MisReservas'
import ControlReservas from '@/components/ControlReservas'

export default function VerReservas({
    usuarioEnSesion,
    token,
    setToken,
    setUsuarioEnSesion,
    setEstaEnSesion
}) {
    const [activeTab, setActiveTab] = useState("nueva-reserva")

    useEffect(() => {
        const logueado = window.localStorage.getItem("medres")
        if (logueado) {
            const logueadoJSON = JSON.parse(logueado)
            setToken(logueadoJSON.token)
            setUsuarioEnSesion(logueadoJSON)
            setEstaEnSesion(true)
        }
    }, [])

    useEffect(() => {
        console.log("usuario en la pantalla de Mis Reservas actuales: ", usuarioEnSesion)
    }, [])

    return (
        <>
            {usuarioEnSesion ? (
                <>
                    {usuarioEnSesion?.idRol === 2 ? (
                        <div className="flex justify-center items-center w-full mt-8">
                                <div className="w-[1000px]">
        
                                <MisReservas 
                                    usuarioEnSesion={usuarioEnSesion}
                                    token={token}
                                    setToken={setToken}
                                    setUsuarioEnSesion={setUsuarioEnSesion}
                                    setEstaEnSesion={setEstaEnSesion} 
                                />
                            </div>
                        </div>

                    ) : (
                        <ControlReservas />
                    )}
                </>
            ) : (
                <NoLogin className="bg-red-500" />
            )}
        </>
    )
}