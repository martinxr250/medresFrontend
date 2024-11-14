import React from 'react'
import { Button } from "@/components/ui/button"
import { User, Waves } from "lucide-react"

export default function Header({ isLoggedIn, username, onLogout }) {
  return (
    <header className="bg-primary text-primary-foreground py-4 shadow-md">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Waves className="h-8 w-8" />
            <h1 className="text-2xl font-bold tracking-tight">Hotel Mediterráneo</h1>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <span className="text-sm">Bienvenido, {username}</span>
                <Button variant="secondary" onClick={onLogout}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Button variant="secondary">
                <User className="mr-2 h-4 w-4" />
                Iniciar Sesión
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}