import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { XCircle, Loader2, CheckCircle, CalendarDays, Users, Bed, CreditCard } from "lucide-react"
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import ReservaErrorHandler from './ReservaErrorHandler'
import FechaSelector from './FechasSelector'
import HuespedSelector from './HuespedSelector'
import ResumenReserva from './ResumenReserva'

const API_URL = 'http://localhost:4001';

const IndicadorPaso = ({ pasoActual }) => (
  <div className="flex justify-center space-x-2 mb-4">
    {[1, 2, 3, 4].map((paso) => (
      <div
        key={paso}
        className={`w-6 h-6 rounded-full flex items-center justify-center ${
          paso === pasoActual ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
        }`}
      >
        {paso}
      </div>
    ))}
  </div>
)

const TipoHabitacionSelector = ({ tipoHabitaciones, onSelect, onNext }) => {
  if (!tipoHabitaciones || tipoHabitaciones.length === 0) {
    return (
      <div className="text-center py-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2">Cargando tipos de habitaciones...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {tipoHabitaciones.map((tipo) => (
        <Card key={tipo.id} className="w-full max-w-sm overflow-hidden shadow-sm transition-transform transform hover:scale-105 border border-white flex flex-col">
          <img src={tipo.imagenes && tipo.imagenes[0] ? tipo.imagenes[0] : "/placeholder.svg"} alt={tipo.nombre} className="w-full h-48 object-cover" />
          <CardContent className="p-4 flex flex-col justify-between flex-grow">
            <div>
              <h3 className="font-semibold mb-2 text-center">{tipo.nombre || "Tipo de habitación"}</h3>
              <p className="text-sm mb-2 text-center">{tipo.descripcion || "Descripción no disponible"}</p>
            </div>
            <div>
              <p className="text-lg font-bold mb-2 text-center">
                ${tipo.precio ? parseFloat(tipo.precio).toFixed(2) : "N/A"} / noche
              </p>
              <Button 
                onClick={() => {
                  onSelect(tipo.id.toString());
                  onNext();
                }}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Seleccionar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  );
};

const ModalConfirmacion = ({ isOpen, onClose, reservaData }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold text-center">Reserva Confirmada</DialogTitle>
      </DialogHeader>
      <Card className="mt-4">
        <CardContent className="grid gap-4 pt-4">
          <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
            <Bed className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Tipo de habitación</p>
              <p className="text-sm text-muted-foreground">{reservaData.tipoHabitacion}</p>
            </div>
          </div>
          <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Fechas</p>
              <p className="text-sm text-muted-foreground">
                {reservaData.fechaIngreso} - {reservaData.fechaSalida}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Huéspedes</p>
              <p className="text-sm text-muted-foreground">
                {reservaData.adultos} adultos, {reservaData.niños} niños
              </p>
            </div>
          </div>
          <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Precio total</p>
              <p className="text-sm text-muted-foreground">${reservaData.precioTotal}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-end">
        <Button onClick={onClose}>Cerrar</Button>
      </div>
    </DialogContent>
  </Dialog>
)

export default function ReservaUsuario({
    usuarioEnSesion,
    setToken,
    setUsuarioEnSesion,
    setEstaEnSesion
}) {
  const [paso, setPaso] = useState(1)
  const [reservaData, setReservaData] = useState({
    tipoHabitacion: '',
    fechaIngreso: '',
    fechaSalida: '',
    adultos: 1,
    niños: 0,
    dniHuesped: '',
    nombre: '',
    apellido: '',
    telefono: '',
    precioTotal: 0
  })
  const [error, setError] = useState('')
  const [respuestaServidor, setRespuestaServidor] = useState(null)
  const [tiposHabitacion, setTiposHabitacion] = useState([])
  const [loading, setLoading] = useState(true)
  const [enviandoReserva, setEnviandoReserva] = useState(false)
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false)
  const [tipoHabitacion, setTipoHabitacion] = useState(0)

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
    obtenerTiposHabitacion()
  }, [])

  const obtenerTiposHabitacion = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/medres/tipohabitaciones/estado/activas`);
      const tiposConImagenes = response.data.map((tipo) => ({
        ...tipo,
        imagenes: obtenerImagenesUnicas(tipo.nombre),
        servicios: obtenerServicios(tipo.nombre),
        comodidades: obtenerComodidades(tipo.nombre)
      }));
      setTiposHabitacion(tiposConImagenes);
    } catch (error) {
      console.error('Error al obtener tipos de habitación:', error)
      setError('Error al cargar los tipos de habitaciones. Por favor, intente de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const obtenerImagenesUnicas = (nombre) => {
    const imagenesPorTipo = {
      "Simple": ["/habitacionSimple/Simple.png"],
      "Doble": ["/habitacionDoble/HAB DOBLE.webp"],
      "Triple": ["/habitacionTriple/HAB TRIPLE 1.1.webp"],
      "Cuadruple": ["/habitacionDoble/HAB DOBLE.webp"],
      "Quintuple": ["/habitacionQuintuple/HAB QUINTUPLE.webp"]
    };
    return imagenesPorTipo[nombre] || ["/placeholder.svg"];
  }

  const obtenerServicios = (nombre) => {
    return ["Wi-Fi", "TV", "Baño privado", "Desayuno", "Aire Acondicionado"];
  }

  const obtenerComodidades = (nombre) => {
    return ["Desayuno incluido", "Limpieza diaria", "Vista a la ciudad"];
  }

  const siguientePaso = () => setPaso(paso + 1)
  const pasoAnterior = () => setPaso(paso - 1)

  const actualizarDatosReserva = (nuevosDatos) => {
    setReservaData({ ...reservaData, ...nuevosDatos })
  }

  const reiniciarReserva = () => {
    setPaso(1)
    setReservaData({
      tipoHabitacion: '',
      fechaIngreso: '',
      fechaSalida: '',
      adultos: 1,
      niños: 0,
      dniHuesped: '',
      nombre: '',
      apellido: '',
      telefono: '',
      precioTotal: 0
    })
    setError('')
    setRespuestaServidor(null)
    setModalConfirmacionAbierto(false)
  }

  const calcularNoches = (ingreso, salida) => {
    const inicio = new Date(ingreso)
    const fin = new Date(salida)
    const tiempoDiferencia = Math.abs(fin - inicio)
    const diasDiferencia = Math.ceil(tiempoDiferencia / (1000 * 60 * 60 * 24))
    return diasDiferencia
  }

  const calcularPrecioTotal = (idTipoHabitacion, ingreso, salida) => {
    const tipoHabitacion = tiposHabitacion.find(tipo => tipo.id === parseInt(idTipoHabitacion))
    if (!tipoHabitacion) return 0
    const noches = calcularNoches(ingreso, salida)
    return tipoHabitacion.precio * noches
  }

  const enviarReserva = async () => {
    try {
      setEnviandoReserva(true)
      const dias = calcularNoches(reservaData.fechaIngreso, reservaData.fechaSalida)
      const precioTotal = calcularPrecioTotal(reservaData.tipoHabitacion, reservaData.fechaIngreso, reservaData.fechaSalida)

      const datosReserva = {
        tipoHabitacion: parseInt(reservaData.tipoHabitacion),
        fechaIngreso: reservaData.fechaIngreso,
        fechaSalida: reservaData.fechaSalida,
        dias,
        adultos: parseInt(reservaData.adultos),
        niños: parseInt(reservaData.niños),
        precioTotal,
        estado: "Pendiente",
        dniHuesped: parseInt(reservaData.dniHuesped),
        nombre: reservaData.nombre,
        apellido: reservaData.apellido,
        telefono: reservaData.telefono,
        idUsuario: usuarioEnSesion.id
      };

      const respuesta = await axios.post(`${API_URL}/api/medres/reservas`, datosReserva)
      
      setRespuestaServidor(respuesta.data)
      setReservaData({ ...reservaData, precioTotal })
      setModalConfirmacionAbierto(true)
      setPaso(5)
    } catch (error) {
      console.error('Error al enviar la reserva:', error)
      setError(error.response?.data?.message || 'Ocurrió un error al procesar la reserva. Por favor, intente nuevamente.')
      setPaso(5)
    } finally {
      setEnviandoReserva(false)
    }
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

  if (error && paso !== 5) {
    return (
      <Card className="w-full">
        <CardContent>
          <ReservaErrorHandler
            mensaje={error}
            onRetry={() => {
              setError('')
              obtenerTiposHabitacion()
            }}
            onReset={reiniciarReserva}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Realizar una nueva reserva</CardTitle>
      </CardHeader>
      <CardContent>
        {paso < 5 && <IndicadorPaso pasoActual={paso} />}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            {paso === 1 && (
              <TipoHabitacionSelector 
                tipoHabitaciones={tiposHabitacion}
                onSelect={(tipo) => {
                  actualizarDatosReserva({ tipoHabitacion: tipo });
                  setTipoHabitacion(tipo);
                }}
                onNext={siguientePaso}
              />
            )}
            {paso === 2 && (
              <FechaSelector 
                fechaIngreso={reservaData.fechaIngreso}
                fechaSalida={reservaData.fechaSalida}
                onSelect={(fechas) => actualizarDatosReserva(fechas)}
                onNext={siguientePaso}
                
                onPrev={pasoAnterior}
              />
            )}
            {paso === 3 && (
              <HuespedSelector
                tipoHabitacion={tipoHabitacion} 
                adultos={reservaData.adultos}
                niños={reservaData.niños}
                dniHuesped={reservaData.dniHuesped}
                nombre={reservaData.nombre}
                apellido={reservaData.apellido}
                telefono={reservaData.telefono}
                onSelect={(huespedes) => actualizarDatosReserva(huespedes)}
                onNext={siguientePaso}
                onPrev={pasoAnterior}
              />
            )}
            {paso === 4 && (
              <ResumenReserva 
                reservaData={reservaData}
                onConfirm={enviarReserva}
                onPrev={pasoAnterior}
                precioTotal={calcularPrecioTotal(reservaData.tipoHabitacion, reservaData.fechaIngreso, reservaData.fechaSalida)}
              />
            )}
            {paso === 5 && (
              <div className="text-center">
                {enviandoReserva ? (
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                    <p>Confirmando su reserva...</p>
                  </div>
                ) : error ? (
                  <ReservaErrorHandler
                    mensaje={error}
                    onRetry={enviarReserva}
                    onReset={reiniciarReserva}
                  />
                ) : respuestaServidor && (
                  <div className="flex flex-col items-center justify-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold mb-4">¡Reserva Confirmada!</h2>
                    <p>ACLARACIONES</p>
                    <p>El hotel se va a estar comunicando con usted en breve.</p>
                    <p>En caso de querer cancelar la reserva, comuníquese al WhatsApp del hotel.</p>
                    <div className="flex space-x-4 mt-4">
                      <Button onClick={reiniciarReserva}>
                        Realizar una nueva reserva
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <ModalConfirmacion
        reservaData={reservaData}
      />
    </Card>
  )
}