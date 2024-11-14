import React, { useState, useEffect } from 'react';
import { format, differenceInDays, addDays, isBefore, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, XCircleIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function FechaSelector({ fechaIngreso, fechaSalida, onSelect, onNext, onPrev }) {
  const [date, setDate] = useState({
    from: fechaIngreso ? new Date(fechaIngreso) : undefined,
    to: fechaSalida ? new Date(fechaSalida) : undefined,
  });
  const [error, setError] = useState("");

  const today = new Date();
  const maxDate = addDays(today, 365); // Permite reservas hasta un año en el futuro

  useEffect(() => {
    if (date.from && date.to && date.to >= date.from) {
      setError("");
      onSelect({
        fechaIngreso: format(date.from, 'yyyy-MM-dd'),
        fechaSalida: format(date.to, 'yyyy-MM-dd')
      });
    }
  }, [date, onSelect]);

  const handleSelect = (newDate) => {
    let updatedDate = { ...newDate };

    if (updatedDate.from && updatedDate.to && updatedDate.from.getTime() === updatedDate.to.getTime()) {
      updatedDate.to = addDays(updatedDate.from, 1);
    }

    if (updatedDate.from && isBefore(updatedDate.from, today)) {
      setError("La fecha de ingreso no puede ser en el pasado.");
      return;
    }

    if (updatedDate.to && isBefore(updatedDate.to, today)) {
      setError("La fecha de salida no puede ser en el pasado.");
      return;
    }

    if (updatedDate.from && updatedDate.to && isBefore(updatedDate.to, updatedDate.from)) {
      const temp = updatedDate.from;
      updatedDate.from = updatedDate.to;
      updatedDate.to = temp;
    }

    setDate(updatedDate);
  };

  const handleNext = () => {
    if (!date.from || !date.to) {
      setError("Por favor, seleccione las fechas de ingreso y salida.");
      return;
    }
    onNext();
  };

  const clearDates = () => {
    setDate({ from: undefined, to: undefined });
    setError("");
  };

  const nightsCount = date.from && date.to ? differenceInDays(date.to, date.from) : 0;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Fechas de su estadía</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <Calendar
              mode="range"
              selected={date}
              onSelect={handleSelect}
              numberOfMonths={1}
              locale={es}
              disabled={(date) => date < today || date > maxDate}
              initialFocus
            />
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {date.from && date.to && !error && (
              <div className="bg-muted p-4 rounded-md space-y-2">
                <div className="flex justify-between items-center">
                  <span>Check-in:</span>
                  <Badge variant="outline">{format(date.from, "d 'de' MMMM, yyyy", { locale: es })}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Check-out:</span>
                  <Badge variant="outline">{format(date.to, "d 'de' MMMM, yyyy", { locale: es })}</Badge>
                </div>
                <div className="flex justify-between items-center font-semibold">
                  <span>Duración de la estadía:</span>
                  <Badge>{nightsCount} {nightsCount === 1 ? 'noche' : 'noches'}</Badge>
                </div>
              </div>
            )}
            <Alert>
              <CalendarIcon className="h-4 w-4" />
              <AlertDescription>
                Seleccione la fecha de ingreso y salida. Las fechas en gris no están disponibles.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={clearDates} 
              variant="outline" 
              className="w-full"
              disabled={!date.from && !date.to}
            >
              <XCircleIcon className="mr-2 h-4 w-4" />
              Limpiar fechas
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onPrev} variant="outline">Anterior</Button>
        <Button onClick={handleNext} disabled={!date.from || !date.to || !!error}>
          Continuar
        </Button>
      </CardFooter>
    </Card>
  );
}