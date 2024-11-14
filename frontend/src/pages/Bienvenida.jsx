import React, { useEffect, useState } from 'react'
import AdminHotel from '../components/AdminHotel'
import NoLogin from '../components/NoLogin'
import ReservaUsuario from '@/components/ReservaUsuario/ReservaUsuario'
import MisReservas from '@/components/MisReservas'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, User, Hotel } from "lucide-react"

export default function Bienvenida({
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
        console.log("usuario en la pantalla de bienvenida: ", usuarioEnSesion)
    }, [])

    return (
        <>
            {usuarioEnSesion ? (
                <>
                    {usuarioEnSesion?.idRol === 2 ? (
                        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4 md:p-6 lg:p-8">
                            <div className="max-w-full mx-auto">
                                <Card className="mb-4 bg-white/80 backdrop-blur-sm">
                                    <CardContent className="p-4 md:p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-4">
                                                <User className="w-10 h-10 text-primary" />
                                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                                    Bienvenido, {usuarioEnSesion.usuario}!
                                                </h1>
                                            </div>
                                            <p className="text-sm md:text-base text-gray-600">
                                                Gestiona tus reservas y disfruta de tu estadía con nosotros.
                                            </p>
                                        </div>
                                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                                <TabsTrigger value="nueva-reserva" className="text-sm md:text-base py-2">
                                                    <CalendarDays className="w-4 h-4 mr-2" />
                                                    Nueva Reserva
                                                </TabsTrigger>
                                                <TabsTrigger value="mis-reservas" className="text-sm md:text-base py-2">
                                                    <Hotel className="w-4 h-4 mr-2" />
                                                    Mis Reservas
                                                </TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="nueva-reserva" className="mt-4">
                                                <ReservaUsuario 
                                                    usuarioEnSesion={usuarioEnSesion}
                                                    setToken={setToken}
                                                    setUsuarioEnSesion={setUsuarioEnSesion}
                                                    setEstaEnSesion={setEstaEnSesion} 
                                                />
                                            </TabsContent>
                                            <TabsContent value="mis-reservas" className="mt-4">
                                                <MisReservas 
                                                    usuarioEnSesion={usuarioEnSesion}
                                                    token={token}
                                                    setToken={setToken}
                                                    setUsuarioEnSesion={setUsuarioEnSesion}
                                                    setEstaEnSesion={setEstaEnSesion} 
                                                />
                                            </TabsContent>
                                        </Tabs>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ) : (
                        <AdminHotel />
                    )}
                </>
            ) : (
                <NoLogin className="bg-red-500" />
            )}
        </>
    )
}