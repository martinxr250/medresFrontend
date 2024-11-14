import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wifi, Car, Utensils, Beer, WashingMachine, Croissant, BedSingle, Coffee } from "lucide-react"
import { motion } from "framer-motion"

const ServiceCard = ({ icon: Icon, title, description, imageUrl }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Card className="h-full overflow-hidden group relative">
      {imageUrl ? (
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{backgroundImage: `url(${imageUrl})`}} />
      ) : null}
      <div className={`relative z-10 p-6 flex flex-col items-center text-center h-full ${imageUrl ? 'bg-black bg-opacity-60 text-white' : ''}`}>
        <div className="mb-4 p-3 bg-slate-50 rounded-full transition-all duration-300 group-hover:bg-primary-foreground">
          <Icon className={`h-12 w-12 ${imageUrl ? 'text-black' : 'text-primary-foreground'}`} />
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className={`text-sm ${imageUrl ? 'text-gray-200' : 'text-muted-foreground'}`}>{description}</p>
      </div>
    </Card>
  </motion.div>
);

const Servicios = ({ usuarioEnSesion, token, setToken, setUsuarioEnSesion, setEstaEnSesion }) => {
  const [activeTab, setActiveTab] = useState("todos")

  useEffect(() => {
    const logueado = window.localStorage.getItem("medres")
    if (logueado) {
      const logueadoJSON = JSON.parse(logueado)
      setToken(logueadoJSON.token)
      setUsuarioEnSesion(logueadoJSON)
      setEstaEnSesion(true)
    }
  }, [])

  const services = [
    { icon: Wifi, title: "Wi-Fi Gratuito", description: "Conexión de alta velocidad en todas las áreas", category: "alojamiento", imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=300&q=80" },
    { icon: BedSingle, title: "Alojamiento", description: "Habitaciones confortables para máximo descanso", category: "alojamiento", imageUrl: "/habitacionSimple/Simple.png" },
    { icon: Utensils, title: "Restaurante", description: "Experiencia gastronómica con menú variado", category: "gastronomia", imageUrl:"/Servicios/Comedor.jpg" },
    { icon: Coffee, title: "Bar", description: "Amplia selección de bebidas en ambiente exclusivo", category: "recreacion",imageUrl:"/Servicios/Cocina.jpg" },
    { icon: Croissant, title: "Desayuno y Merienda", description: "Delicioso desayuno completo y meriendas", category: "gastronomia",imageUrl:"/Servicios/Cocheras.jpg" },
    { icon: WashingMachine, title: "Lavandería", description: "Servicio rápido y eficiente todos los días", category: "alojamiento",imageUrl:"/Servicios/Lavanderia.jpg" },
    { icon: Car, title: "Cocheras", description: "Estacionamiento seguro y cubierto", category: "alojamiento",imageUrl:"/Servicios/Cocheras.jpg" },
  ];

  return (
    <div className="bg-gradient-to-b from-background to-secondary/20">
      <div className="relative bg-cover bg-center py-24" style={{ backgroundImage: "url('/Servicios/banner.jpg')" }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <motion.h2 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Nuestros Servicios
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl max-w-2xl mx-auto"
          >
            En Hotel Mediterráneo, nos dedicamos a brindarle una experiencia excepcional. 
            Descubra nuestra gama de servicios diseñados para su comodidad y disfrute.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap justify-center mb-12">
            <TabsTrigger value="todos" className="m-1 px-6 py-3 text-lg">Todos</TabsTrigger>
            <TabsTrigger value="alojamiento" className="m-1 px-6 py-3 text-lg">Alojamiento</TabsTrigger>
            <TabsTrigger value="gastronomia" className="m-1 px-6 py-3 text-lg">Gastronomía</TabsTrigger>
            <TabsTrigger value="recreacion" className="m-1 px-6 py-3 text-lg">Recreación</TabsTrigger>
          </TabsList>
          <TabsContent value="todos">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard key={index} icon={service.icon} title={service.title} description={service.description} imageUrl={service.imageUrl} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="alojamiento">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.filter(service => service.category === "alojamiento").map((service, index) => (
                <ServiceCard key={index} icon={service.icon} title={service.title} description={service.description} imageUrl={service.imageUrl} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="gastronomia">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.filter(service => service.category === "gastronomia").map((service, index) => (
                <ServiceCard key={index} icon={service.icon} title={service.title} description={service.description} imageUrl={service.imageUrl} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="recreacion">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.filter(service => service.category === "recreacion").map((service, index) => (
                <ServiceCard key={index} icon={service.icon} title={service.title} description={service.description} imageUrl={service.imageUrl} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="text-xl py-3 px-6">
            Disfrute de estos servicios en Hotel Mediterráneo
          </Badge>
        </motion.div>
      </div>
    </div>
  );
}

export default Servicios;