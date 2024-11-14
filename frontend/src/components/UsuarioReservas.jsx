import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserIcon, BedDoubleIcon, WifiIcon, CoffeeIcon, UtensilsIcon, CalendarIcon } from 'lucide-react';

// Simulated room data
const rooms = [
  { id: 1, name: "Habitación Estándar", capacity: 2, price: 100, image: "/placeholder.svg?height=200&width=300", amenities: ["Wi-Fi", "TV", "Aire acondicionado"] },
  { id: 2, name: "Suite Junior", capacity: 3, price: 150, image: "/placeholder.svg?height=200&width=300", amenities: ["Wi-Fi", "TV", "Minibar", "Vista al mar"] },
  { id: 3, name: "Suite Familiar", capacity: 4, price: 200, image: "/placeholder.svg?height=200&width=300", amenities: ["Wi-Fi", "TV", "Cocina", "Balcón"] },
];

export default function UserView({ usuario }) {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 p-8 rounded-lg">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Bienvenido al Hotel Mediterráneo, {usuario}</h1>
        <p className="text-gray-600">Disfrute de una experiencia única en nuestro lujoso hotel</p>
      </header>

      <Tabs defaultValue="rooms" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="rooms">Habitaciones</TabsTrigger>
          <TabsTrigger value="amenities">Servicios</TabsTrigger>
          <TabsTrigger value="reservations">Mis Reservas</TabsTrigger>
        </TabsList>
        <TabsContent value="rooms">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <Card key={room.id} className="overflow-hidden rounded-lg shadow-md">
                <img src={room.image} alt={room.name} className="w-full h-64 object-cover" />
                <CardHeader>
                  <CardTitle>{room.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <UserIcon className="mr-2 h-5 w-5" />
                      <span>Hasta {room.capacity} personas</span>
                    </div>
                    <div className="flex items-center">
                      <BedDoubleIcon className="mr-2 h-5 w-5" />
                      <span>{room.capacity - 1} camas</span>
                    </div>
                  </div>
                  <p className="text-xl font-semibold mb-4">${room.price} / noche</p>
                  <div className="text-sm text-gray-600">
                    {room.amenities.map((amenity, index) => (
                      <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Reservar Ahora</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="amenities">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="rounded-lg shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <WifiIcon className="mr-2" />
                  Wi-Fi Gratuito
                </CardTitle>
              </CardHeader>
              <CardContent>
                Conexión de alta velocidad en todas las áreas del hotel.
              </CardContent>
            </Card>
            <Card className="rounded-lg shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CoffeeIcon className="mr-2" />
                  Desayuno Buffet
                </CardTitle>
              </CardHeader>
              <CardContent>
                Disfrute de un delicioso desayuno con una amplia variedad de opciones.
              </CardContent>
            </Card>
            <Card className="rounded-lg shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UtensilsIcon className="mr-2" />
                  Restaurante Gourmet
                </CardTitle>
              </CardHeader>
              <CardContent>
                Experimente la alta cocina en nuestro restaurante con vista al mar.
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="reservations">
          <Card className="rounded-lg shadow-md">
            <CardHeader>
              <CardTitle>Mis Reservas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="check-in">Fecha de Entrada</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="check-in"
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="check-out">Fecha de Salida</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="check-out"
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                <Button className="w-full">Buscar Reservas</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
