import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, ingrese un correo electrónico válido." }),
});

export default function PasswordRecovery() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
  
    try {
      // Simulamos el proceso de envío
      await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos
  
      // Simulamos un 90% de éxito en el envío
      if (Math.random() < 0.9) {
        setSuccessMessage(`Se ha enviado un correo de recuperación a ${data.email}`);
      } else {
        throw new Error('Error al enviar el correo');
      }
    } catch (error) {
      setErrorMessage(error.message || 'Hubo un error al enviar el correo de recuperación.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Recuperar Contraseña</CardTitle>
          <CardDescription>Ingrese su correo electrónico para recibir un enlace de recuperación.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
            {isLoading && (
              <Alert>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <AlertDescription>Enviando correo...</AlertDescription>
              </Alert>
            )}
            {successMessage && (
              <Alert className="bg-green-100 border-green-400 text-green-700">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
            {errorMessage && (
              <Alert className="bg-red-100 border-red-400 text-red-700">
                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            <CardFooter className="flex justify-between">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Enviar'}
              </Button>
              <Link to="/login">
                <Button variant="outline">Cancelar</Button>
              </Link>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}