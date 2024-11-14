import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Wifi, Tv, Bath, Coffee, AirVent, Users } from "lucide-react";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const API_URL = 'http://localhost:4001';

const serviceIcons = {
  "Wi-Fi": <Wifi className="h-4 w-4" />,
  "TV": <Tv className="h-4 w-4" />,
  "Baño": <Bath className="h-4 w-4" />,
  "Desayuno": <Coffee className="h-4 w-4" />,
  "Aire Acondicionado": <AirVent className="h-4 w-4"/>,
};

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <motion.div className="relative w-full h-48 sm:h-64 md:h-72 lg:h-80 overflow-hidden rounded-t-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>
      <Button variant="outline" size="icon" className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white" onClick={prevSlide}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white" onClick={nextSlide}>
        <ChevronRight className="h-4 w-4" />
      </Button>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </motion.div>
  );
};

const TiposHabitaciones = () => {
  const [tipoHabitaciones, setTipoHabitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTipoHabitaciones = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/medres/tipohabitaciones/estado/activas`);

        const tiposConImagenes = response.data.map((tipo) => ({
          ...tipo,
          imagenes: obtenerImagenesUnicas(tipo.nombre),
          servicios: obtenerServicios(tipo.nombre),
          comodidades: obtenerComodidades(tipo.nombre)
        }));
        setTipoHabitaciones(tiposConImagenes);
        setError(null);
      } catch (err) {
        setError('Error al cargar los tipos de habitaciones. Por favor, intente de nuevo.');
        console.error('Error fetching tipo habitaciones:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTipoHabitaciones();
  }, []);

  const obtenerImagenesUnicas = (nombre) => {
    const imagenesPorTipo = {
      "Simple": [
        "/habitacionSimple/Simple.png"
      ],
      "Doble": [
        "/habitacionDoble/HAB DOBLE.webp",
        "/habitacionDoble/HABDOBLE2.webp",
        "/habitacionDoble/HABDOBLE3.webp"
      ],
      "Triple": [
        "/habitacionTriple/HAB TRIPLE 1.1.webp",
        "/habitacionTriple/HAB TRIPLE MATRIMONIAL.webp",
        "/habitacionTriple/HAB TRIPLE TWIN.webp",
      ],
      "Cuadruple": [
        "/habitacionDoble/HAB DOBLE.webp"
      ],
      "Quintuple": [
        "/habitacionQuintuple/HAB QUINTUPLE.webp",
        "/habitacionQuintuple/HAB QUINTUPLE2.webp",
      ]
    };

    return imagenesPorTipo[nombre] || [
      "https://linktuaimagen.com/default1.jpg",
      "https://linktuaimagen.com/default2.jpg",
      "https://linktuaimagen.com/default3.jpg"
    ];
  };

  const obtenerServicios = (nombre) => {
    const serviciosPorTipo = {
      "Simple": ["Wi-Fi", "TV", "Baño", "Desayuno", "Aire Acondicionado"],
      "Doble": ["Wi-Fi", "TV", "Baño", "Desayuno", "Aire Acondicionado"],
      "Triple": ["Wi-Fi", "TV", "Baño", "Desayuno", "Aire Acondicionado"],
      "Cuadruple": ["Wi-Fi", "TV", "Baño", "Desayuno", "Aire Acondicionado"],
      "Quintuple": ["Wi-Fi", "TV", "Baño", "Desayuno", "Aire Acondicionado"]
    };

    return serviciosPorTipo[nombre] || ["Wi-Fi", "TV", "Baño", "Desayuno incluido", "Aire Acondicionado"];
  };

  const obtenerComodidades = (nombre) => {
    const comodidadesPorTipo = {
      "Simple": ["Desayuno incluido", "Limpieza diaria","Vista a la ciudad"],
      "Doble": ["Desayuno incluido", "Limpieza diaria", "Vista a la ciudad"],
      "Triple": ["Desayuno incluido", "Limpieza diaria", "Vista a la ciudad"],
      "Cuadruple": ["Desayuno incluido", "Limpieza diaria", "Vista a la ciudad"],
      "Quintuple": ["Desayuno incluido", "Limpieza diaria", "Vista a la ciudad"]
    };

    return comodidadesPorTipo[nombre] || ["Desayuno incluido", "Limpieza diaria", "Vista a la ciudad"];
  };

  if (loading) {
    return <SkeletonScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <motion.div className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-primary">Nuestros Tipos de Habitaciones</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tipoHabitaciones.map((tipo) => (
          <Card key={tipo.id} className="overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-200 flex flex-col">
            <Carousel images={tipo.imagenes} />
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl flex items-center justify-between">
                <span>Habitación {tipo.nombre}</span>
                <Badge variant="secondary" className="text-sm">
                  <Users className="h-4 w-4 mr-1" />
                  {tipo.nombre === "Simple" ? "1 persona" : 
                   tipo.nombre === "Doble" ? "2 personas" :
                   tipo.nombre === "Triple" ? "3 personas" :
                   tipo.nombre === "Cuadruple" ? "4 personas" :
                   tipo.nombre === "Quintuple" ? "5 personas" : ""}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <Tabs defaultValue="descripcion" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="descripcion">Descripción</TabsTrigger>
                  <TabsTrigger value="utilidades">Utilidades</TabsTrigger>
                </TabsList>
                <TabsContent value="descripcion">
                  <CardDescription className="text-sm sm:text-base">
                    {tipo.descripcion || 'Descripción no disponible'}
                  </CardDescription>
                </TabsContent>
                <TabsContent value="utilidades">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Servicios:</h4>
                      <ul className="grid grid-cols-2 gap-2">
                        {tipo.servicios.map((servicio, index) => (
                          <li key={index} className="flex items-center text-sm">
                            {serviceIcons[servicio] || <div className="w-4 h-4" />}
                            <span className="ml-2">{servicio}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Comodidades:</h4>
                      <ul className="list-disc list-inside text-sm">
                        {tipo.comodidades.map((comodidad, index) => (
                          <li key={index}>{comodidad}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col items-center">
              <p className="text-2xl font-bold mb-4">
                {tipo.precio !== null
                  ? `$${parseFloat(tipo.precio).toFixed(2)} / noche`
                  : 'Precio no disponible'}
              </p>
              <Link to="/servicios" className="w-full">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Más información</Button>
              </Link>
            </CardFooter>
          </Card>

        ))}
      </div>
    </motion.div>
    
  );
};

const SkeletonScreen = () => (
  <div className="container mx-auto px-4 py-8">
    <Skeleton className="h-10 w-3/4 mx-auto mb-8" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="overflow-hidden shadow-lg">
          <Skeleton className="h-48 sm:h-64 md:h-72 lg:h-80 rounded-t-lg" />
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6 mt-4" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
);

const ErrorScreen = ({ error }) => (
  <div className="container mx-auto px-4 py-8 text-center">
    <p className="text-red-500 mb-4">{error}</p>
    <Button onClick={() => window.location.reload()} variant="outline">
      Intentar de nuevo
    </Button>
  </div>
);

export default TiposHabitaciones;
