import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { userServices } from "../services/usuarios.services.js";

const LoginRegisterForm = ({ setEstaEnSesion, setUsuarioEnSesion, setToken }) => {
  const registerForm = useForm();
  const loginForm = useForm();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showPassword, setShowPassword] = useState({
    register: false,
    login: false,
    confirmRegister: false
  });

  const navigate = useNavigate();

  const validateInput = (value) => {
    const sqlKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'UNION', '--'];
    return typeof value === 'string' && !sqlKeywords.some(keyword => value.toUpperCase().includes(keyword));
  };

  const onRegisterSubmit = async (data) => {
    if (!Object.values(data).every(validateInput)) {
      setModalMessage("Entrada inválida detectada. Por favor, revise sus datos.");
      setShowErrorModal(true);
      return;
    }

    if (data.contrasena !== data.confirmarContrasena) {
      setModalMessage("Las contraseñas no coinciden.");
      setShowErrorModal(true);
      return;
    }

    try {
      const response = await userServices.registerUser(data);
      if (response.error) {
        setModalMessage("Error al registrar usuario. Por favor, inténtelo de nuevo.");
        setShowErrorModal(true);
      } else {
        setModalMessage("Tu cuenta ha sido creada correctamente. Por favor, inicia sesión.");
        setShowSuccessModal(true);
        registerForm.reset();
      }
    } catch (error) {
      setModalMessage("Ocurrió un error inesperado. Por favor, inténtelo más tarde.");
      setShowErrorModal(true);
    }
  };

  const onLoginSubmit = async (data) => {
    if (!Object.values(data).every(validateInput)) {
      setModalMessage("Entrada inválida detectada. Por favor, revise sus datos.");
      setShowErrorModal(true);
      return;
    }

    try {
      const response = await userServices.login(data);
      if (response.error) {
        setModalMessage("Usuario o contraseña incorrectos.");
        setShowErrorModal(true);
      } else {
        setEstaEnSesion(true);
        setUsuarioEnSesion(response);
        window.localStorage.setItem("medres", JSON.stringify(response));
        setToken(response.token);
        loginForm.reset();
        navigate("/bienvenida");
      }
    } catch (error) {
      setModalMessage("Ocurrió un error al iniciar sesión. Por favor, inténtelo más tarde.");
      setShowErrorModal(true);
    }
  };

  const togglePasswordVisibility = (form) => {
    setShowPassword(prev => ({ ...prev, [form]: !prev[form] }));
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate("/login");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-md mx-auto">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register">Registrarse</TabsTrigger>
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
          </TabsList>
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Regístrate</CardTitle>
                <CardDescription>Ingrese sus datos para crear una cuenta.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="user_name"
                      rules={{ 
                        required: "Ingrese un nombre de usuario.",
                        validate: validateInput
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de usuario</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre de usuario" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="correo"
                      rules={{ 
                        required: "Ingrese un correo electrónico",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Ingrese un correo electrónico válido"
                        },
                        validate: validateInput
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo Electrónico</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Correo Electrónico" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="contrasena"
                      rules={{ 
                        required: "La contraseña es requerida.",
                        minLength: {
                          value: 5,
                          message: "La contraseña debe tener al menos 5 caracteres."
                        },
                        validate: validateInput
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showPassword.register ? "text" : "password"} 
                                placeholder="Contraseña" 
                                {...field} 
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => togglePasswordVisibility('register')}
                              >
                                {showPassword.register ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmarContrasena"
                      rules={{ 
                        required: "Confirme su contraseña.",
                        validate: (value) => 
                          value === registerForm.getValues("contrasena") || "Las contraseñas no coinciden."
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar Contraseña</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showPassword.confirmRegister ? "text" : "password"} 
                                placeholder="Confirmar Contraseña" 
                                {...field} 
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => togglePasswordVisibility('confirmRegister')}
                              >
                                {showPassword.confirmRegister ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="nombre"
                      rules={{ 
                        required: "Ingrese su nombre.",
                        validate: validateInput
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="apellido"
                      rules={{ 
                        required: "Ingrese su apellido.",
                        validate: validateInput
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apellido</FormLabel>
                          <FormControl>
                            <Input placeholder="Apellido" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">Registrarse</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Iniciar Sesión</CardTitle>
                <CardDescription>Puede iniciar sesión con usuario o correo y contraseña.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="user_name"
                      rules={{ 
                        required: "El nombre de usuario es requerido",
                        validate: validateInput
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de usuario o correo</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre de usuario o correo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="contrasena"
                      rules={{ 
                        required: "La contraseña es requerida",
                        minLength: { value: 5, message: "La contraseña debe tener al menos 5 caracteres." },
                        maxLength: { value: 20, message: "La contraseña debe tener máximo 20 caracteres." },
                        validate: validateInput
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showPassword.login ? "text" : "password"} 
                                placeholder="Contraseña" 
                                {...field} 
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => togglePasswordVisibility('login')}
                              >
                                {showPassword.login ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">Iniciar Sesión</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <CardFooter className="flex justify-center space-x-6 mt-4">
          <Link to="/">
            <Button variant="outline">Volver al Inicio</Button>
          </Link>
          <Link to="/recuperar-contrasena">
            <Button variant="outline">Recuperar Contraseña</Button>
          </Link>
        </CardFooter>
      </Card>

      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{modalMessage}</AlertDescription>
              </Alert>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowErrorModal(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Éxito</DialogTitle>
            <DialogDescription>
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Registro Exitoso</AlertTitle>
                <AlertDescription>{modalMessage}</AlertDescription>
              </Alert>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
          <Button onClick={() => window.location.reload()}>Ir a Iniciar Sesión</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
    
  );

  
};

export default LoginRegisterForm;