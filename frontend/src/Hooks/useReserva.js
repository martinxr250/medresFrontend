import { useState } from 'react';
import { crearReserva } from '@/services/reservaService';

export default function useReserva() {
  const [paso, setPaso] = useState(1);
  const [reservaData, setReservaData] = useState({
    tipoHabitacion: '',
    fechaIngreso: '',
    fechaSalida: '',
    adultos: 1,
    niños: 0,
    dniHuesped: '',
  });

  const handleNext = () => setPaso(paso + 1);
  const handlePrev = () => setPaso(paso - 1);

  const updateReservaData = (newData) => {
    setReservaData({ ...reservaData, ...newData });
  };

  const submitReserva = async () => {
    try {
      const response = await crearReserva(reservaData);
      if (response.success) {
        setPaso(5); // Ir al paso de confirmación
      } else {
        // Manejar error
      }
    } catch (error) {
      // Manejar error
    }
  };

  return {
    paso,
    reservaData,
    handleNext,
    handlePrev,
    updateReservaData,
    submitReserva
  };
}