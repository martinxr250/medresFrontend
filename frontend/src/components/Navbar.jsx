import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { BedSingle, User, Menu, Calendar, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { motion } from "framer-motion";

export default function Navbar({
  usuarioEnSesion,
  setEstaEnSesion,
  setUsuarioEnSesion,
  setToken
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUsuarioEnSesion(null);
    setToken(null);
    setEstaEnSesion(false);
    window.localStorage.removeItem("medres");
    navigate('/');
  };

  const navItems = [
    { name: "Reservar", path: "/bienvenida" },
    { name: "Habitaciones", path: "/habitaciones" },
    { name: "Servicios", path: "/servicios" },
    { name: "Nosotros", path: "/nosotros" },
  ];

  return (
    <header className="bg-[#555555] text-primary-foreground py-2 shadow-md mb-0">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              <BedSingle className="h-10 w-10 text-white" />
              <h1 className="text-2xl font-bold tracking-tight text-white">Hotel Mediterráneo</h1>
            </motion.div>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex space-x-4 ml-auto items-center"
          >
            {navItems.map((item) => (
              <Link key={item.name} to={item.path}>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white hover:text-black transition-colors"
                >
                  {item.name}
                </Button>
              </Link>
            ))}

            {!usuarioEnSesion ? (
              <Link to="/login">
                <Button variant="secondary" className="ml-4">
                  <User className="mr-2 h-4 w-4" />
                  Iniciar Sesión
                </Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="ml-4">
                    <User className="mr-2 h-4 w-4" />
                    {usuarioEnSesion?.usuario?.toLowerCase()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/misReservas" className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Ver mis reservas
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/modificarCuenta" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Modificar Cuenta
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <User className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </motion.div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.name}>
                    <Link to={item.path}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start hover:bg-white hover:text-black transition-colors"
                      >
                        {item.name}
                      </Button>
                    </Link>
                  </SheetClose>
                ))}
                {!usuarioEnSesion ? (
                  <SheetClose asChild>
                    <Link to="/login">
                      <Button variant="secondary" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        Iniciar Sesión
                      </Button>
                    </Link>
                  </SheetClose>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Link to="/misReservas">
                        <Button variant="ghost" className="w-full justify-start">
                          <Calendar className="mr-2 h-4 w-4" />
                          Ver mis reservas
                        </Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/modificarCuenta">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Modificar Cuenta
                        </Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleLogout}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Cerrar Sesión
                      </Button>
                    </SheetClose>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}