'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import RoomTypeForm from "@/components/Administracion/HabitacionTipoForm"
import RoomForm from "@/components/Administracion/HabitacionForm"
import ReservaForm from "@/components/Administracion/ReservaForm"
import ReservationReports from "@/components/Administracion/ReservationReports"

export default function AdminHotel() {
  const [activeTab, setActiveTab] = useState("reservations")

  const tabOptions = [
    { value: "reservations", label: "Reservas" },
    { value: "roomTypes", label: "Tipos de Habitaciones" },
    { value: "rooms", label: "Habitaciones" },
    { value: "reports", label: "Reportes" }
  ]

  return (
    <div className="container mx-auto p-4">
      {/* Versión para PC */}
      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <CardTitle>Panel de Administración del Hotel</CardTitle>
            <CardDescription>Gestione los tipos de habitaciones, reservas, habitaciones y vea reportes</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="reservations">Reservas</TabsTrigger>
                <TabsTrigger value="roomTypes">Tipos de Habitaciones</TabsTrigger>
                <TabsTrigger value="rooms">Habitaciones</TabsTrigger>
                <TabsTrigger value="reports">Reportes</TabsTrigger>
              </TabsList>
              <TabsContent value="reservations">
                <ReservaForm/>
              </TabsContent>
              <TabsContent value="roomTypes">
                <RoomTypeForm />
              </TabsContent>
              <TabsContent value="rooms">
                <RoomForm/>
              </TabsContent>
              <TabsContent value="reports">
                <ReservationReports />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Versión para móvil */}
      <div className="md:hidden">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Panel de Administración del Hotel</CardTitle>
            <CardDescription className="text-center">Gestione los tipos de habitaciones, reservas, habitaciones y vea reportes</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                {tabOptions.map((tab) => (
                  <SelectItem key={tab.value} value={tab.value}>
                    {tab.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-4">
              {activeTab === "reservations" && <ReservaForm />}
              {activeTab === "roomTypes" && <RoomTypeForm />}
              {activeTab === "rooms" && <RoomForm />}
              {activeTab === "reports" && <ReservationReports />}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}