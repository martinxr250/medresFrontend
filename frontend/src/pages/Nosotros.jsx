'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, MapPin, Star, Users } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { AspectRatio } from "@/components/ui/aspect-ratio"

const PhotoCarousel = ({ photos }) => {
  return (
    <Carousel className="w-full max-w-lg mx-auto">
      <CarouselContent>
        {photos.map((photo, index) => (
          <CarouselItem key={index}>
            <AspectRatio ratio={3/2}>
              <img
                src={photo}
                alt={`Hotel Mediterraneo Laboulaye - Foto ${index + 1}`}
                className="rounded-lg shadow-lg w-full h-full object-cover"
              />
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

const FeatureCard = ({ icon: Icon, title }) => (
  <Card>
    <CardContent className="flex items-center p-4">
      <Icon className="h-6 w-6 mr-2 text-primary" />
      <span>{title}</span>
    </CardContent>
  </Card>
)

const AboutUs = ({ usuarioEnSesion, token, setToken, setUsuarioEnSesion, setEstaEnSesion }) => {
  const [activeTab, setActiveTab] = useState("about")

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

  const photos = [
    "/public/hotel-mediterraneo-perfil.jpg?height=500&width=800",
    "/public/RECEPCION.jpg?height=500&width=800",
    "/public/SALON.PNG?height=500&width=800",
    "/public/comedor.png?height=500&width=800",
  ]

  const features = [
    { icon: Clock, title: "Abierto 24/7" },
    { icon: MapPin, title: "Ubicación céntrica" },
    { icon: Star, title: "Servicio de calidad" },
    { icon: Users, title: "Personal amable" },
  ]

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8 text-primary">Sobre Nosotros</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="w-full max-w-lg mx-auto">
            <PhotoCarousel photos={photos}/>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hotel Mediterráneo</CardTitle>
                <CardDescription>Su hogar lejos de casa en Laboulaye</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                El Hotel Mediterráneo, inaugurado en 2009, se ha convertido en sinónimo de hospitalidad y confort, ubicado en una zona privilegiada a la vera de la Ruta Nacional 7. A lo largo de estos años, nos hemos consolidado como el destino preferido tanto para viajeros de negocios como para turistas. Situado a pocos metros del centro comercial de la ciudad, ofrecemos una ubicación estratégica que combina comodidad y accesibilidad.
                </p>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </div>
        <Separator className="my-12" />
        <div className="text-center space-y-6">
          <h3 className="text-3xl font-semibold">Nuestros Valores</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
          En el Hotel Mediterráneo, nos regimos por principios de hospitalidad y un firme compromiso con nuestros huéspedes. Trabajamos arduamente para garantizar que su estadía sea cómoda y excepcional.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutUs