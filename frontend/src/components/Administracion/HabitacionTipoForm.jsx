'use client'

import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { XCircle, CheckCircle, ToggleLeft, ToggleRight, Pencil, Trash2, Bed, DollarSign, Search } from "lucide-react"
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
  const [roomTypes, setRoomTypes] = useState([])
  const [selectedRoomType, setSelectedRoomType] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    esActivo: true
  })
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState({ type: '', content: '' })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [roomTypeToDelete, setRoomTypeToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 6
  const formRef = useRef(null)
  const successMessageRef = useRef(null)

  useEffect(() => {
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

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/medres/tipohabitaciones`)
      setRoomTypes(response.data)
    } catch (error) {
      console.error('Error fetching room types:', error)
      setMessage({ type: 'error', content: 'No se pudieron cargar los tipos de habitaciones' })
    }
  }

  const handleSelectRoomType = (roomType) => {
    setSelectedRoomType(roomType)
    setFormData({
      nombre: roomType.nombre,
      descripcion: roomType.descripcion,
      precio: roomType.precio.toString(),
      esActivo: roomType.esActivo
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
      precio: /^\d+(\.\d{1,2})?$/
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
        await axios.put(`${API_URL}/api/medres/tipohabitaciones/${selectedRoomType.id}`, formData)
        setMessage({ type: 'success', content: 'Tipo de habitación actualizado correctamente' })
      } else {
        await axios.post(`${API_URL}/api/medres/tipohabitaciones`, formData)
        setMessage({ type: 'success', content: 'Nuevo tipo de habitación creado correctamente' })
      }
      fetchRoomTypes()
      resetForm()
      setTimeout(() => {
        successMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error) {
      console.error('Error updating/creating room type:', error)
      setMessage({ type: 'error', content: 'No se pudo actualizar/crear el tipo de habitación' })
    }
  }

  const handleDeleteClick = (roomType) => {
    setRoomTypeToDelete(roomType)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_URL}/api/medres/tipohabitaciones/${roomTypeToDelete.id}`)
      setMessage({ type: 'success', content: 'Tipo de habitación eliminado correctamente' })
      fetchRoomTypes()
      resetForm()
      setTimeout(() => {
        successMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error) {
      console.error('Error deleting room type:', error)
      setMessage({ type: 'error', content: 'No se pudo eliminar el tipo de habitación' })
    } finally {
      setIsDeleteDialogOpen(false)
      setRoomTypeToDelete(null)
    }
  }

  const handleToggleActive = async (roomType) => {
    try {
      const updatedRoomType = { ...roomType, esActivo: !roomType.esActivo }
      await axios.put(`${API_URL}/api/medres/tipohabitaciones/${roomType.id}`, updatedRoomType)
      setMessage({ type: 'success', content: `Tipo de habitación ${updatedRoomType.esActivo ? 'activado' : 'desactivado'} correctamente` })
      fetchRoomTypes()
      setTimeout(() => {
        successMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error) {
      console.error('Error toggling room type active status:', error)
      setMessage({ type: 'error', content: 'No se pudo cambiar el estado de activación del tipo de habitación' })
    }
  }

  const resetForm = () => {
    setSelectedRoomType(null)
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      esActivo: true
    })
    setIsEditing(false)
  }

  const filteredRoomTypes = roomTypes.filter(roomType =>
    roomType.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    roomType.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedRoomTypes = filteredRoomTypes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredRoomTypes.length / itemsPerPage)

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
            <span>Tipos de Habitaciones</span>
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar tipo de habitación"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="hidden md:table-cell">Descripción</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRoomTypes.map((roomType) => (
                <TableRow key={roomType.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Bed className="h-4 w-4" />
                      <span>{roomType.nombre}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{roomType.descripcion}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span>{roomType.precio}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={roomType.esActivo ? "primary" : "destructive"}
                      onClick={() => handleToggleActive(roomType)}
                      className={roomType.esActivo ? "bg-green-600 text-white" : "bg-gray-500 text-white"}
                    >
                      {roomType.esActivo ? (
                        <React.Fragment>
                          <ToggleRight className="mr-2 h-4 w-4" />
                          <span>Habilitado</span>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <ToggleLeft className="mr-2 h-4 w-4" />
                          <span>Deshabilitado</span>
                        </React.Fragment>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => handleSelectRoomType(roomType)}>
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
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(roomType)}>
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
          <CardTitle>{isEditing ? 'Editar' : 'Crear'} Tipo de Habitación</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
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
                <Label  htmlFor="precio">Precio</Label>
                <Input
                  id="precio"
                  name="precio"
                  type="number"
                  value={formData.precio}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  pattern="^\d+(\.\d{1,2})?$"
                  title="Ingrese un número válido con hasta dos decimales"
                />
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
            </div>
            <div className="flex justify-between">
              <Button type="submit">{isEditing ? 'Actualizar' : 'Crear'} Tipo de Habitación</Button>
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
              ¿Está seguro de que desea eliminar el tipo de habitación "{roomTypeToDelete?.nombre}"?
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