import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getReservasByUsuario } from '@/services/reservaService'
import { Loader2, Calendar, BedDouble, Hash, AlertCircle, DollarSign, Users, UserCircle, Phone, ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from "@/components/ui/button"

export default function MisReservas({
    usuarioEnSesion,
    token,
    setToken,
    setUsuarioEnSesion,
    setEstaEnSesion
}) {
  const [reservas, setReservas] = useState([])
  const [habitaciones, setHabitaciones] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')

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
    if (usuarioEnSesion && token) {
      fetchReservasYHabitaciones()
    }
  }, [usuarioEnSesion, token])

  const fetchReservasYHabitaciones = async () => {
    try {
      setLoading(true)
      const [reservasData, habitacionesData] = await Promise.all([
        getReservasByUsuario(token),
        axios.get('http://localhost:4001/api/medres/habitaciones')
      ])

      const habitacionesMap = habitacionesData.data.reduce((acc, habitacion) => {
        acc[habitacion.id] = habitacion
        return acc
      }, {})

      setReservas(reservasData)
      setHabitaciones(habitacionesMap)
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Error al cargar las reservas. Por favor, intente de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const getEstadoBadge = (estado) => {
    const estadoLower = estado.toLowerCase()
    if (estadoLower === 'confirmada') return <Badge className="bg-green-500">Confirmada</Badge>
    if (estadoLower === 'pendiente') return <Badge className="bg-yellow-500">Pendiente</Badge>
    if (estadoLower === 'cancelada') return <Badge className="bg-red-500">Cancelada</Badge>
    return <Badge>{estado}</Badge>
  }

  const sortReservas = () => {
    const sortedReservas = [...reservas].sort((a, b) => {
      const dateA = parseISO(a.fechaIngreso)
      const dateB = parseISO(b.fechaIngreso)
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
    })
    setReservas(sortedReservas)
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-4">
          <div className="flex items-center justify-center text-red-500">
            <AlertCircle className="mr-2" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Mis Reservas</CardTitle>
      </CardHeader>
      <CardContent>
        {reservas.length === 0 ? (
          <p className="text-center text-muted-foreground">No tienes reservas actualmente.</p>
        ) : (
          <ScrollArea className="h-[400px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Huésped</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={sortReservas}
                      className="hover:bg-transparent"
                    >
                      Fechas
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Habitación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Precio Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservas.map((reserva) => {
                  const habitacion = habitaciones[reserva.idHabitaciones]
                  return (
                    <TableRow key={reserva.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <UserCircle className="h-4 w-4" />
                          <div>
                            <p className="font-medium">{reserva.nombre} {reserva.apellido}</p>
                            <p className="text-xs text-muted-foreground">DNI: {reserva.dniHuesped}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{reserva.telefono || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <div>
                            <p className="text-sm">{format(parseISO(reserva.fechaIngreso), "d MMM", { locale: es })}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(parseISO(reserva.fechaSalida), "d MMM, yyyy", { locale: es })}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <BedDouble className="h-4 w-4" />
                          <div>
                            <p className="text-sm">{habitacion ? habitacion.tipohabitacione.nombre : 'N/A'}</p>
                            <p className="text-xs text-muted-foreground">#{reserva.idHabitaciones}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getEstadoBadge(reserva.estado)}</TableCell>
                      <TableCell className="text-right font-medium">
                        <div className="flex items-center justify-end space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{reserva.precioTotal.toFixed(2)}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}