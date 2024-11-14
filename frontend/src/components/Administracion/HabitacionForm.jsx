'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { XCircle, CheckCircle, Pencil, Trash2, Bed, Users, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const API_URL = 'http://localhost:4001'

export default function Component() {
  const [rooms, setRooms] = useState([])
  const [roomTypes, setRoomTypes] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    tipoHabitacion: '',
    descripcion: '',
    estado: '',
    cantidadPersonas: '1'
  })
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState({ type: '', content: '' })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRoomType, setSelectedRoomType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 6
  const formRef = useRef(null)
  const successMessageRef = useRef(null)

  useEffect(() => {
    fetchRooms()
    fetchRoomTypes()
  }, [])

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === 'e') {
        event.preventDefault()
        if (isEditing) {
          handleSubmit(new Event('submit'))
        } else {
          setIsEditing(true)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [isEditing])

  useEffect(() => {
    if (isEditing && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isEditing])

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/medres/habitaciones`)
      setRooms(response.data)
    } catch (error) {
      console.error('Error fetching rooms:', error)
      setMessage({ type: 'error', content: 'No se pudieron cargar las habitaciones' })
    }
  }

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/medres/tipohabitaciones`)
      setRoomTypes(response.data)
    } catch (error) {
      console.error('Error fetching room types:', error)
      setMessage({ type: 'error', content: 'No se pudieron cargar los tipos de habitaciones' })
    }
  }

  const handleSelectRoom = (room) => {
    setSelectedRoom(room)
    setFormData({
      nombre: room.nombre,
      tipoHabitacion: room.tipoHabitacion.toString(),
      descripcion: room.descripcion,
      estado: room.estado,
      cantidadPersonas: room.cantidadPersonas.toString()
    })
    setIsEditing(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateInput = (name, value) => {
    const patterns = {
      nombre: /^[a-zA-Z0-9\s]{1,50}$/,
      descripcion: /^[a-zA-Z0-9\s.,]{1,255}$/,
      cantidadPersonas: /^[1-9][0-9]?$/
    }
    return patterns[name] ? patterns[name].test(value) : true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!Object.keys(formData).every(key => validateInput(key, formData[key]))) {
      setMessage({ type: 'error', content: 'Por favor, verifique los datos ingresados' })
      return
    }
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/api/medres/habitaciones/${selectedRoom.id}`, formData)
        setMessage({ type: 'success', content: 'Habitación actualizada correctamente' })
      } else {
        await axios.post(`${API_URL}/api/medres/habitaciones`, formData)
        setMessage({ type: 'success', content: 'Nueva habitación creada correctamente' })
      }
      fetchRooms()
      resetForm()
      setTimeout(() => {
        successMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error) {
      console.error('Error updating/creating room:', error)
      setMessage({ type: 'error', content: 'No se pudo actualizar/crear la habitación' })
    }
  }

  const handleDeleteClick = (room) => {
    setRoomToDelete(room)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_URL}/api/medres/habitaciones/${roomToDelete.id}`)
      setMessage({ type: 'success', content: 'Habitación eliminada correctamente' })
      fetchRooms()
      resetForm()
      setTimeout(() => {
        successMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error) {
      console.error('Error deleting room:', error)
      setMessage({ type: 'error', content: 'No se pudo eliminar la habitación' })
    } finally {
      setIsDeleteDialogOpen(false)
      setRoomToDelete(null)
    }
  }

  const resetForm = () => {
    setSelectedRoom(null)
    setFormData({
      nombre: '',
      tipoHabitacion: '',
      descripcion: '',
      estado: '',
      cantidadPersonas: ''
    })
    setIsEditing(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Disponible':
        return 'bg-green-500 text-white'
      case 'Ocupada':
        return 'bg-red-500 text-white'
      case 'Mantenimiento':
        return 'bg-yellow-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => 
      (selectedRoomType === 'all' || room.tipoHabitacion.toString() === selectedRoomType) &&
      (room.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
       room.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [rooms, selectedRoomType, searchTerm])

  const paginatedRooms = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredRooms.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredRooms, currentPage])

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage)

  return (
    <div className="space-y-8 p-6">
      {message.content && (
        <Alert 
          variant={message.type === 'error' ? 'destructive' : 'default'}
          ref={successMessageRef}
          className={message.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : ''}
        >
          {message.type === 'error' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertTitle>{message.type === 'error' ? 'Error' : 'Éxito'}</AlertTitle>
          <AlertDescription>{message.content}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Habitaciones</span>
            <div className="flex space-x-2">
              <div className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar habitación"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {roomTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>{type.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="hidden md:table-cell">Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Capacidad</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Bed className="h-4 w-4" />
                        <span>{room.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell>{room.tipohabitacione.nombre}</TableCell>
                    <TableCell className="hidden md:table-cell">{room.descripcion}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(room.estado)}>
                        {room.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{room.cantidadPersonas}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => handleSelectRoom(room)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar (Ctrl+E)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(room)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Eliminar</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink 
                      onClick={() => setCurrentPage(index + 1)}
                      isActive={currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Editar' : 'Crear'} Habitación</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit}   className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                  pattern="^[a-zA-Z0-9\s]{1,50}$"
                  title="Solo se permiten letras, números y espacios (máximo 50 caracteres)"
                />
              </div>
              <div>
                <Label htmlFor="tipoHabitacion">Tipo de Habitación</Label>
                <Select 
                  name="tipoHabitacion" 
                  value={formData.tipoHabitacion} 
                  onValueChange={(value) => handleInputChange({ target: { name: 'tipoHabitacion', value } })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un tipo de habitación" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>{type.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  required
                  maxLength={255}
                  pattern="^[a-zA-Z0-9\s.,]{1,255}$"
                  title="Solo se permiten letras, números, espacios, puntos y comas (máximo 255 caracteres)"
                />
              </div>
              <div>
                <Label htmlFor="estado">Estado</Label>
                <Select 
                  name="estado" 
                  value={formData.estado} 
                  onValueChange={(value) => handleInputChange({ target: { name: 'estado', value } })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Disponible">Disponible</SelectItem>
                    <SelectItem value="Ocupada">Ocupada</SelectItem>
                    <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cantidadPersonas">Cantidad de Personas</Label>
                <Input
                  id="cantidadPersonas"
                  name="cantidadPersonas"
                  type="number"
                  value={formData.cantidadPersonas}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="99"
                  pattern="^[1-9][0-9]?$"
                  title="Ingrese un número entre 1 y 99"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button type="submit">{isEditing ? 'Actualizar' : 'Crear'} Habitación</Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar Edición
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar la habitación "{roomToDelete?.nombre}"?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}