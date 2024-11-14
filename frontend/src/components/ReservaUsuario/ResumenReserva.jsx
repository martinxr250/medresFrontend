import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BedDouble, Users, Calendar, CreditCard, User, Phone, Loader2 } from "lucide-react";

export default function ResumenReserva({ reservaData, onConfirm, onPrev, precioTotal }) {
  const [enviandoReserva, setEnviandoReserva] = React.useState(false);

  const tiposHabitacion = {
    '1': 'Simple',
    '2': 'Doble',
    '3': 'Triple',
    '4': 'Cuádruple',
    '5': 'Quíntuple'
  };

  const fechaIngreso = new Date(reservaData.fechaIngreso);
  const fechaSalida = new Date(reservaData.fechaSalida);
  const duracionEstancia = differenceInDays(fechaSalida, fechaIngreso);

  const ResumenItem = ({ icon, title, value }) => (
    <div className="flex items-center space-x-2">
      {icon}
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );

  const handleConfirm = () => {
    if (!enviandoReserva) {
      setEnviandoReserva(true);
      onConfirm();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Resumen de su reserva</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ResumenItem 
          icon={<User className="h-5 w-5" />}
          title="Nombre"
          value={reservaData.nombre}
        />
        <ResumenItem 
          icon={<User className="h-5 w-5" />}
          title="Apellido"
          value={reservaData.apellido}
        />
        <ResumenItem 
          icon={<BedDouble className="h-5 w-5" />}
          title="Tipo de habitación"
          value={tiposHabitacion[reservaData.tipoHabitacion]}
        />
        <ResumenItem 
          icon={<Calendar className="h-5 w-5" />}
          title="Fechas de estancia"
          value={`${format(fechaIngreso, "d 'de' MMMM", { locale: es })} - ${format(fechaSalida, "d 'de' MMMM, yyyy", { locale: es })}`}
        />
        <ResumenItem 
          icon={<Users className="h-5 w-5" />}
          title="Huéspedes"
          value={`${reservaData.adultos} adulto${reservaData.adultos > 1 ? 's' : ''}${reservaData.niños > 0 ? `, ${reservaData.niños} niño${reservaData.niños > 1 ? 's' : ''}` : ''}`}
        />
        <ResumenItem 
          icon={<CreditCard className="h-5 w-5" />}
          title="DNI del huésped"
          value={reservaData.dniHuesped}
        />
        <ResumenItem 
          icon={<Phone className="h-5 w-5" />}
          title="Teléfono del huésped"
          value={reservaData.telefono}
        />
        <Separator />
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Duración de la estadia</p>
            <p className="font-medium">{duracionEstancia} noche{duracionEstancia !== 1 ? 's' : ''}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Precio total</p>
            <p className="text-xl font-bold">${precioTotal.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onPrev} variant="outline">Anterior</Button>
        <Button 
          onClick={handleConfirm} 
          disabled={enviandoReserva}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {enviandoReserva ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Confirmando...
            </>
          ) : (
            'Confirmar reserva'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}