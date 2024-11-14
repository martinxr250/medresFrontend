import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TipoHabitacionSelector({ tipoHabitacion, onSelect, onNext, tiposHabitacion }) {
  const handleSelect = (valor) => {
    console.log("Tipo de habitación seleccionado:", valor);
    onSelect(valor);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Seleccione el tipo de habitación</h2>
      <Select value={tipoHabitacion} onValueChange={handleSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccione un tipo" />
        </SelectTrigger>
        <SelectContent>
          {tiposHabitacion.map((tipo) => (
            <SelectItem key={tipo.id} value={tipo.id.toString()}>
              {tipo.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={onNext} disabled={!tipoHabitacion}>Siguiente</Button>
    </div>
  );
}