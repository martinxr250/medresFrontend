import React, { useEffect,useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Users, User, Phone } from "lucide-react";
import axios from 'axios';

export default function HuespedSelector({ tipoHabitacion,adultos, niños, dniHuesped, nombre, apellido, telefono, onSelect, onNext, onPrev }) {
  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value, 10) : e.target.value;
    onSelect({ [e.target.name]: value });
  };

  const[cantidadPersonas, setCantidadPersonas] = useState(0);

  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        const response = await axios.get('http://localhost:4001/api/medres/habitaciones');
        const habitaciones = response.data;
  
        for (const habitacion of habitaciones) {
          if (habitacion.tipohabitacione.id == tipoHabitacion) {
            setCantidadPersonas(habitacion.cantidadPersonas);
            break;
          }
        }
      } catch (error) {
        console.error('Error fetching habitaciones:', error);
      }
    };
  
    fetchHabitaciones();
  }, [tipoHabitacion]);
  
  
  

  const isFormValid = adultos > 0 && dniHuesped && nombre && apellido && telefono;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Información de huéspedes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Por favor, complete la información del huésped principal.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input 
              type="text" 
              id="nombre" 
              name="nombre"
              value={nombre} 
              onChange={handleChange}
              placeholder="Ingrese su nombre"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apellido">Apellido</Label>
            <Input 
              type="text" 
              id="apellido" 
              name="apellido"
              value={apellido} 
              onChange={handleChange}
              placeholder="Ingrese su apellido"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dniHuesped">DNI o Pasaporte</Label>
            <Input 
              type="text" 
              id="dniHuesped" 
              name="dniHuesped"
              value={dniHuesped} 
              onChange={handleChange}
              placeholder="Ingrese su DNI o Pasaporte"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono del huésped</Label>
            <Input 
              type="tel" 
              id="telefono" 
              name="telefono"
              value={telefono} 
              onChange={handleChange}
              placeholder="Ingrese su teléfono"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Máxima cantidad de personas</Label>
          <div className="flex items-center space-x-2">
            <InfoIcon className="h-4 w-4 text-muted-foreground" />
            <span>{cantidadPersonas}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="adultos">Número de adultos</Label>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <Input 
                type="number" 
                id="adultos" 
                name="adultos"
                value={adultos} 
                onChange={handleChange}
                min="1"
                max="5"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="niños">Número de niños</Label>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Input 
                type="number" 
                id="niños" 
                name="niños"
                value={niños} 
                onChange={handleChange}
                min="0"
                max="4"
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onPrev} variant="outline">Anterior</Button>
        <Button onClick={onNext} disabled={!isFormValid||adultos + niños > cantidadPersonas}>
          {isFormValid ? 'Siguiente' : 'Complete todos los campos'}
        </Button>
      </CardFooter>
    </Card>
  );
}