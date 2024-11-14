'use client'

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { format, differenceInDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle, CheckCircle, Pencil, Trash2, Calendar, Users, CreditCard, Bed, IdCard, Moon, Search, ArrowUpDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const API_URL = 'http://localhost:4001';

export default function Component() {
  const [reservas, setReservas] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reservaToDelete, setReservaToDelete] = useState(null);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingReserva, setEditingReserva] = useState(null);
  const { control, handleSubmit, reset, watch } = useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('Todos');
  const itemsPerPage = 5;
  const formRef = useRef(null);
  const successMessageRef = useRef(null);

  const tipoHabitacion = watch('tipoHabitacion');
  const fechaIngreso = watch('fechaIngreso');
  const fechaSalida = watch('fechaSalida');
  const adultos = watch('adultos');
  const niños = watch('niños');

  useEffect(() => {
    fetchReservas();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === 'e') {
        event.preventDefault();
        if (isEditing) {
          handleSubmit(onSubmit)();
        } else {
          setIsEditing(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isEditing, handleSubmit]);

  useEffect(() => {
    if (isEditing && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isEditing]);

  const fetchReservas = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/medres/reservas`);
      setReservas(response.data);
    } catch (error) {
      console.error('Error fetching reservas:', error);
      setMessage({ type: 'error', content: 'No se pudieron cargar las reservas' });
    }
  };

  const onSubmit = async (data) => {
    try {
      const fechaIngresoDate = new Date(data.fechaIngreso);
      const fechaSalidaDate = new Date(data.fechaSalida);
      const dias = differenceInDays(fechaSalidaDate, fechaIngresoDate);

      let reservaData = {
        tipoHabitacion: parseInt(data.tipoHabitacion),
        fechaIngreso: data.fechaIngreso,
        fechaSalida: data.fechaSalida,
        dias: dias,
        adultos: parseInt(data.adultos),
        niños: parseInt(data.niños),
        precioTotal: parseFloat(data.precioTotal),
        estado: data.estado,
        dniHuesped: parseInt(data.dniHuesped),
        nombre: data.nombre,
        telefono: data.telefono,
        apellido: data.apellido
      };

      let response;
      if (isEditing) {
        const changedFields = Object.keys(reservaData).reduce((acc, key) => {
          if (reservaData[key] !== editingReserva[key]) {
            acc[key] = reservaData[key];
          }
          return acc;
        }, {});

        response = await axios.put(`${API_URL}/api/medres/reservas/${editingReserva.nroReserva}`, changedFields);
      } else {
        response = await axios.post(`${API_URL}/api/medres/reservas`, reservaData);
      }
      
      if (response.data) {
        setMessage({ type: 'success', content: isEditing ? 'Reserva actualizada correctamente' : 'Reserva creada correctamente' });
        fetchReservas();
        resetForm();
        setTimeout(() => {
          successMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setMessage({ type: 'error', content: isEditing ? 'No se pudo actualizar la reserva' : 'No se pudo crear la reserva' });
      }
    } catch (error) {
      console.error('Error saving reserva:', error);
      setMessage({ type: 'error', content: error.response?.data?.message || 'No se pudo guardar la reserva' });
    }
  };

  const handleDeleteClick = (reserva) => {
    setReservaToDelete(reserva);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_URL}/api/medres/reservas/${reservaToDelete.nroReserva}`);
      setMessage({ type: 'success', content: 'Reserva eliminada correctamente' });
      fetchReservas();
    } catch (error) {
      console.error('Error deleting reserva:', error);
      setMessage({ type: 'error', content: 'No se pudo eliminar la reserva' });
    } finally {
      setIsDeleteDialogOpen(false);
      setReservaToDelete(null);
    }
  };

  const handleEditClick = (reserva) => {
    setEditingReserva(reserva);
    reset({
      ...reserva,
      tipoHabitacion: reserva.habitacione.tipoHabitacion.toString(),
      fechaIngreso: format(new Date(reserva.fechaIngreso), 'yyyy-MM-dd'),
      fechaSalida: format(new Date(reserva.fechaSalida), 'yyyy-MM-dd'),
      precioTotal: reserva.precioTotal.toString(),
    });
    setIsEditing(true);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resetForm = () => {
    reset({
      fechaIngreso: '',
      fechaSalida: '',
      adultos: '',
      niños: '',
      estado: '',
      dniHuesped: '',
      tipoHabitacion: '',
      telefono: '',
      nombre: '',
      apellido: '',
      precioTotal: '',
    });
    setIsEditing(false);
    setEditingReserva(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-yellow-500 text-white'
      case 'Confirmada':
        return 'bg-green-500 text-white'
      case 'Cancelada':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedReservas = useMemo(() => {
    let sortableReservas = [...reservas];
    if (sortConfig.key !== null) {
      sortableReservas.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableReservas;
  }, [reservas, sortConfig]);

  const filteredReservas = useMemo(() => {
    return sortedReservas.filter(reserva => 
      (reserva.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.apellido.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'Todos' || reserva.estado === statusFilter)
    );
  }, [sortedReservas, searchTerm, statusFilter]);

  const paginatedReservas = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredReservas.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReservas, currentPage]);

  const totalPages = Math.ceil(filteredReservas.length / itemsPerPage);

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
          <CardTitle>Listado de Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Search className="h-7 w-24 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre o apellido"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Confirmada">Confirmada</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Nro. Reserva</TableHead>
                  <TableHead>DNI Huésped</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Apellido</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Habitación</TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('fechaIngreso')} className="flex items-center">
                      Fechas
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Noches</TableHead>
                  <TableHead>Huéspedes</TableHead>
                  <TableHead>Precio Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReservas.map((reserva) => (
                  <TableRow key={reserva.nroReserva}>
                    <TableCell>{reserva.nroReserva}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <IdCard className="h-4 w-4" />
                        <span>{reserva.dniHuesped}</span>
                      </div>
                    </TableCell>
                    <TableCell>{reserva.nombre}</TableCell>
                    <TableCell>{reserva.apellido}</TableCell>
                    <TableCell>{reserva.telefono}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Bed className="h-4 w-4" />
                        <span>{reserva.habitacione.nombre} ({reserva.habitacione.tipoHabitacion})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(reserva.fechaIngreso), 'dd/MM/yyyy')} - 
                          {format(new Date(reserva.fechaSalida), 'dd/MM/yyyy')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Moon className="h-4 w-4" />
                        
                        <span>{reserva.dias}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{reserva.adultos} adultos, {reserva.niños} niños</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span>${reserva.precioTotal}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(reserva.estado)}>
                        {reserva.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(reserva)}>
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
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(reserva)}>
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
          <CardTitle>{isEditing ? 'Editar Reserva' : 'Crear Nueva Reserva'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Controller
                  name="nombre"
                  control={control}
                  defaultValue={editingReserva?.nombre || ""}
                  rules={{ 
                    required: 'Este campo es requerido',
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: 'Solo se permiten letras y espacios'
                    }
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input {...field} />
                      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                    </>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="apellido">Apellido</Label>
                <Controller
                  name="apellido"
                  control={control}
                  defaultValue={editingReserva?.apellido || ""}
                  rules={{ 
                    required: 'Este campo es requerido',
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: 'Solo se permiten letras y espacios'
                    }
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input {...field} />
                      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                    </>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="tipoHabitacion">Tipo de Habitación</Label>
                <Controller
                  name="tipoHabitacion"
                  control={control}
                  defaultValue={editingReserva?.habitacione?.tipoHabitacion?.toString() || ""}
                  rules={{ required: 'Este campo es requerido' }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Simple</SelectItem>
                          <SelectItem value="2">Doble</SelectItem>
                          <SelectItem value="3">Triple</SelectItem>
                          <SelectItem value="4">Cuadruple</SelectItem>
                          <SelectItem value="5">Quintuple</SelectItem>
                        </SelectContent>
                      </Select>
                      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                    </>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
                <Controller
                  name="fechaIngreso"
                  control={control}
                  defaultValue={editingReserva ? format(new Date(editingReserva.fechaIngreso), 'yyyy-MM-dd') : ""}
                  rules={{ required: 'Este campo es requerido' }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input type="date" {...field} min={format(new Date(), 'yyyy-MM-dd')} />
                      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                    </>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="fechaSalida">Fecha de Salida</Label>
                <Controller
                  name="fechaSalida"
                  control={control}
                  defaultValue={editingReserva ? format(new Date(editingReserva.fechaSalida), 'yyyy-MM-dd') : ""}
                  rules={{ 
                    required: 'Este campo es requerido',
                    validate: value => {
                      const fechaIngresoDate = new Date(fechaIngreso);
                      const fechaSalidaDate = new Date(value);
                      return fechaSalidaDate > fechaIngresoDate || 'La fecha de salida debe ser posterior a la fecha de ingreso';
                    }
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input type="date" {...field} min={fechaIngreso} />
                      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                    </>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="adultos">Adultos</Label>
                
                <Controller
                  name="adultos"
                  control={control}
                  defaultValue={editingReserva?.adultos?.toString() || ""}
                  rules={{ required: 'Este campo es requerido' }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input type="number" {...field} min="1" />
                      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                    </>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="niños">Niños</Label>
                <Controller
                  name="niños"
                  control={control}
                  defaultValue={editingReserva?.niños?.toString() || ""}
                  rules={{ required: 'Este campo es requerido' }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input type="number" {...field} min="0" />
                      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                    </>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="estado">Estado</Label>
                <Controller
                  name="estado"
                  control={control}
                  defaultValue={editingReserva?.estado || ""}
                  rules={{ required: 'Este campo es requerido' }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pendiente">Pendiente</SelectItem>
                          <SelectItem value="Confirmada">Confirmada</SelectItem>
                          <SelectItem value="Cancelada">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                    </>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="dniHuesped">DNI del Huésped</Label>
                <Controller
                  name="dniHuesped"
                  control={control}
                  defaultValue={editingReserva?.dniHuesped?.toString() || ""}
                  rules={{ required: 'Este campo es requerido' }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input type="text" {...field} maxLength="8" />
                      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                    </>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Controller
                  name="telefono"
                  control={control}
                  defaultValue={editingReserva?.telefono || ""}
                  rules={{ required: 'Este campo es requerido' }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input type="text" {...field} maxLength="14" />
                      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                    </>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="precioTotal">Precio Total</Label>
                <Controller
                  name="precioTotal"
                  control={control}
                  defaultValue={editingReserva?.precioTotal?.toString() || ""}
                  rules={{ 
                    required: 'Este campo es requerido',
                    pattern: {
                      value: /^[0-9]{1,6}$/,
                      message: 'Ingrese un valor numérico de 1 a 6 dígitos'
                    }
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input type="text" {...field} />
                      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                    </>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button type="submit">
                {isEditing ? 'Actualizar Reserva' : 'Crear Reserva'}
              </Button>
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
              ¿Está seguro de que desea eliminar la reserva número "{reservaToDelete?.nroReserva}"?
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
  );
}