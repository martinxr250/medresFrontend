'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { BedDouble, Users, Info, Calendar as CalendarIcon, DollarSign, UserCheck, Mail } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

moment.locale('es')
const localizer = momentLocalizer(moment)

const colorPalette = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', 
  '#F06292', '#AED581', '#7986CB', '#4DB6AC', '#FFD54F'
]

export default function CalendarioReservas() {
  const [reservas, setReservas] = useState([])
  const [reservasFiltradas, setReservasFiltradas] = useState([])
  const [tiposHabitacionSeleccionados, setTiposHabitacionSeleccionados] = useState({})
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null)
  const [contadorHabitaciones, setContadorHabitaciones] = useState({})
  const [modalAbierto, setModalAbierto] = useState(false)
  const [reservasDia, setReservasDia] = useState([])
  const [modalDiaAbierto, setModalDiaAbierto] = useState(false)
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null)

  useEffect(() => {
    obtenerReservas()
  }, [])

  useEffect(() => {
    filtrarReservas()
  }, [reservas, tiposHabitacionSeleccionados])

  useEffect(() => {
    contarHabitaciones()
  }, [reservasFiltradas])

  const obtenerReservas = async () => {
    try {
      const respuesta = await fetch('http://localhost:4001/api/medres/reservas')
      const datos = await respuesta.json()
      const reservasConColor = (Array.isArray(datos) ? datos : [datos]).map((reserva, index) => ({
        ...reserva,
        color: colorPalette[index % colorPalette.length]
      }))
      setReservas(reservasConColor)
      const tiposIniciales = reservasConColor.reduce((acc, reserva) => {
        acc[reserva.habitacione.tipoHabitacion] = true
        return acc
      }, {})
      setTiposHabitacionSeleccionados(tiposIniciales)
    } catch (error) {
      console.error('Error al obtener las reservas:', error)
    }
  }

  const filtrarReservas = () => {
    const filtradas = reservas.filter(res => 
      tiposHabitacionSeleccionados[res.habitacione.tipoHabitacion]
    )
    setReservasFiltradas(filtradas)
  }

  const contarHabitaciones = () => {
    const contador = reservasFiltradas.reduce((acc, reserva) => {
      const tipo = reserva.habitacione.tipoHabitacion
      acc[tipo] = (acc[tipo] || 0) + 1
      return acc
    }, {})
    setContadorHabitaciones(contador)
  }

  const eventos = reservasFiltradas.map(reserva => ({
    id: reserva.nroReserva,
    title: `Hab ${reserva.idHabitaciones} - ${reserva.habitacione.nombre}`,
    start: new Date(reserva.fechaIngreso),
    end: new Date(reserva.fechaSalida),
    resource: reserva,
    color: reserva.color
  }))

  const manejarSeleccionEvento = (evento) => {
    setReservaSeleccionada(evento.resource)
    setModalAbierto(true)
  }

  const manejarSeleccionDia = (date) => {
    const reservasDelDia = eventos.filter(evento => 
      moment(evento.start).isSame(date, 'day') || 
      (moment(date).isBetween(evento.start, evento.end, 'day', '[]'))
    )
    setReservasDia(reservasDelDia)
    setFechaSeleccionada(date)
    setModalDiaAbierto(true)
  }

  const tiposHabitaciones = [...new Set(reservas.map(res => res.habitacione.tipoHabitacion))]

  const toggleTipoHabitacion = (tipo) => {
    setTiposHabitacionSeleccionados(prev => ({
      ...prev,
      [tipo]: !prev[tipo]
    }))
  }

  const messages = {
    allDay: 'Todo el día',
    previous: 'Anterior',
    next: 'Siguiente',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'No hay reservas en este rango.',
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary">Calendario de Reservas</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1 md:col-span-2 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Tipos de Habitación</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Selecciona los tipos de habitación que deseas ver en el calendario</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {tiposHabitaciones.map(tipo => (
                  <div key={tipo} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`tipo-${tipo}`} 
                      checked={tiposHabitacionSeleccionados[tipo]} 
                      onCheckedChange={() => toggleTipoHabitacion(tipo)}
                    />
                    <Label htmlFor={`tipo-${tipo}`}>
                      Habitación para {tipo} Persona(s)
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Resumen de Habitaciones</h2>
              {Object.entries(contadorHabitaciones).map(([tipo, cantidad]) => (
                <div key={tipo} className="flex items-center justify-between mb-2">
                  <span className="flex items-center">
                    <BedDouble className="mr-2 text-primary" />
                    Habitación para {tipo} Persona(s):
                  </span>
                  <span className="font-bold text-primary">{cantidad}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <div className="h-[600px]">
              <Calendar
                localizer={localizer}
                events={eventos}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={manejarSeleccionEvento}
                onSelectSlot={({ start }) => manejarSeleccionDia(start)}
                views={['month']}
                messages={messages}
                selectable
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: event.color,
                    borderRadius: '4px',
                    opacity: 0.8,
                    color: '#fff',
                    border: '0px',
                    display: 'block'
                  }
                })}
                className="rounded-lg overflow-hidden"
              />
            </div>
          </CardContent>
        </Card>

        <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary">Detalles de la Reserva</DialogTitle>
              <DialogDescription>
                Información detallada sobre la reserva seleccionada.
              </DialogDescription>
            </DialogHeader>
            {reservaSeleccionada && (
              <div className="grid gap-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{reservaSeleccionada.habitacione.nombre}</h3>
                  <Badge variant={reservaSeleccionada.estado === 'Pendiente' ? 'warning' : 'success'}>
                    {reservaSeleccionada.estado}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <UserCheck className="w-5 h-5 mr-2 text-primary" />
                    <span>{reservaSeleccionada.nombre} {reservaSeleccionada.apellido}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-primary" />
                    <span>Adultos: {reservaSeleccionada.adultos}, Niños: {reservaSeleccionada.niños}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
                    <span>{moment(reservaSeleccionada.fechaIngreso).format('DD/MM/YYYY')} - {moment(reservaSeleccionada.fechaSalida).format('DD/MM/YYYY')}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-primary" />
                    <span>Precio Total: ${reservaSeleccionada.precioTotal}</span>
                  </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Detalles de la Habitación</h4>
                  <p>Tipo: Habitación para {reservaSeleccionada.habitacione.tipoHabitacion} Persona(s)</p>
                  <p>Descripción: {reservaSeleccionada.habitacione.descripcion}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Información de Contacto</h4>
                  <p>Teléfono: {reservaSeleccionada.telefono}</p>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-primary" />
                    <span>
                      {reservaSeleccionada.usuario && reservaSeleccionada.usuario.correo 
                        ? reservaSeleccionada.usuario.correo 
                        : 'Correo no disponible'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setModalAbierto(false)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={modalDiaAbierto} onOpenChange={setModalDiaAbierto}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary">
                Reservas del {fechaSeleccionada && moment(fechaSeleccionada).format('DD/MM/YYYY')}
              </DialogTitle>
              <DialogDescription>
                Listado de reservas para el día seleccionado.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] w-full pr-4">
              {reservasDia.length > 0 ? (
                reservasDia.map((evento) => (
                  <Card key={evento.id} className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">{evento.title}</h3>
                        <Badge variant={evento.resource.estado === 'Pendiente' ? 'warning' : 'success'}>
                          {evento.resource.estado}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {moment(evento.start).format('DD/MM/YYYY')} - {moment(evento.end).format('DD/MM/YYYY')}
                      </p>
                      <Button onClick={() => {
                        
                        setReservaSeleccionada(evento.resource)
                        setModalDiaAbierto(false)
                        setModalAbierto(true)
                      }}>
                        Ver Detalles
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-500">No hay reservas para este día.</p>
              )}
            </ScrollArea>
            <DialogFooter>
              <Button onClick={() => setModalDiaAbierto(false)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}