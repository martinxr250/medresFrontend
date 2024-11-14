'use client'

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Loader2, User, Mail, UserCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from 'axios'

export default function ConfiguracionUsuario({ usuarioEnSesion, estaEnSesion, setEstaEnSesion, setUsuarioEnSesion, setToken }) {
  const [usuario, setUsuario] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm()

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

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:4001/api/medres/usuarios')
        const usuarios = response.data
        const usuarioEncontrado = usuarios.find(user => user.id === usuarioEnSesion.id)
        if (usuarioEncontrado) {
          setUsuario(usuarioEncontrado)
          form.reset(usuarioEncontrado)
        }
      } catch (error) {
        console.error("Error al obtener los usuarios:", error)
      }
    }

    fetchUsuarios()
  }, [usuarioEnSesion, form])

  const onSubmit = async (data) => {
    setIsLoading(true)
    const usuarioActualizado = {
      id: usuarioEnSesion.id,
      ...data
    }
  
    try {
      const response = await axios.put('http://localhost:4001/api/medres/usuarios', usuarioActualizado)
      
      if (response.status === 200) {
        setSuccessMessage('¡Actualización exitosa! Se cerrará la sesión en 3 segundos.')
        setTimeout(() => {
          setUsuarioEnSesion(null)
          setToken(null)
          setEstaEnSesion(false)
          window.localStorage.removeItem("medres")
          navigate('/')
        }, 3000)
      } else {
        setSuccessMessage('Hubo un problema con la actualización.')
      }
    } catch (error) {
      console.error('Error en la solicitud:', error)
      setSuccessMessage('Ocurrió un error al intentar actualizar los datos.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${usuario?.nombre} ${usuario?.apellido}`} />
              <AvatarFallback><UserCircle className="w-20 h-20" /></AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-3xl font-bold">Perfil de Usuario</CardTitle>
          <CardDescription>Actualiza tu información personal</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="user_name"
                rules={{ required: "Ingrese un nombre de usuario." }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de usuario</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input placeholder="Nombre de usuario" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="correo"
                rules={{ 
                  required: "Ingrese un correo electrónico",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Ingrese un correo electrónico válido",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input type="email" placeholder="Correo Electrónico" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="nombre"
                  rules={{ required: "Ingrese su nombre." }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apellido"
                  rules={{ required: "Ingrese su apellido." }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <Input placeholder="Apellido" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </form>
          </Form>
          {successMessage && (
            <Alert className="mt-6" variant="default">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}