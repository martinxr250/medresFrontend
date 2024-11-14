import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function ConfirmacionReserva({ reservaData }) {
  return (
    <div className="space-y-4 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
      <h2 className="text-2xl font-semibold">¡Reserva confirmada!</h2>
      <p>Su reserva ha sido registrada con éxito.</p>
      <Button onClick={() => window.location.reload()}>Realizar otra reserva</Button>
    </div>
  );
}