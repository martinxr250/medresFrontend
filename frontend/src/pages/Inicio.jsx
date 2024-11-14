import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {Star,Facebook, Instagram } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"


export default function Component({
  usuarioEnSesion,
  setToken,
  setUsuarioEnSesion,
  setEstaEnSesion
}) {
  useEffect(() => {
    const logueado = window.localStorage.getItem("medres")
    if (logueado) {
      const logueadoJSON = JSON.parse(logueado)
      setToken(logueadoJSON.token)
      setUsuarioEnSesion(logueadoJSON)
      setEstaEnSesion(true)
    }
  }, [])

  useEffect(() => {
    console.log("usuario en la pantalla de Inicio: ", usuarioEnSesion)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#f0e5cf] to-[#d9c7a7] text-gray-800">
      <main className="flex-grow">
        <section className="relative h-[100vh] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hotel-mediterraneo-perfil.jpg?height=1080&width=1920')" }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <motion.div
            className="relative z-10 text-center text-white max-w-3xl mx-auto px-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            <h2 className="text-5xl font-bold mb-6 leading-tight">Descubre el Hotel Mediterráneo</h2>
            <p className="text-xl mb-8 leading-relaxed">Sumérgete en una experiencia de tranquilidad y confort</p>
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <Link to="/bienvenida">
                <Button 
                  size="lg" 
                  className="text-xl px-8 py-8 bg-white text-black hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                >
                  Reserva Ahora
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        <section id="infoHuesped" className="py-24 bg-[#F5E8D3]">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-4xl font-bold text-center mb-16"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              Lo Que Dicen Nuestros Huéspedes
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">            
                <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-primary text-primary animate-pulse" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="text-lg italic mb-4">
                      "El Hotel Mediterráneo superó todas mis expectativas. El personal fue increíblemente atento y amable, haciendo que mi estadia fuera muy cómoda. Las habitaciones estaban impecables ... definitivamente volveré"
                    </blockquote>
                    <p className="font-semibold">- Juan Pereyra</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-primary text-primary animate-pulse" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="text-lg italic mb-4">
                      "Desde el momento en que llegamos, nos sentimos bienvenidos. El hotel cuenta con una ubicación ideal cerca de la ruta y tiene todas las comodidades necesarias para una estadía relajante"
                    </blockquote>
                    <p className="font-semibold">- Francisco Casas</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-primary text-primary animate-pulse" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="text-lg italic mb-4">
                      "El ambiente del Hotel Mediterráneo es maravilloso. El servicio al cliente fue de primera, siempre dispuestos a ayudar. La habitación era amplia y con una cama muy cómoda"
                    </blockquote>
                    <p className="font-semibold">- Facundo Raviolo</p>
                  </CardContent>
                </Card>
            </div>
          </div>
        </section>

        <section id="googleMaps" className="py-16 bg-[#E5D5B5]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Nuestra Ubicación</h2>
            <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3194.5734279533162!2d-63.39819182427324!3d-34.14474463340439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95cf7b326f3cd60f%3A0x472c824b64a3304b!2sHotel%20Mediterraneo!5e1!3m2!1ses-419!2sar!4v1725766153669!5m2!1ses-419!2sar"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Embed"
              ></iframe>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#555555] text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-4">Hotel Mediterráneo Laboulaye</h3>
              <p className="mb-2">Ruta Nro. 7 </p>
              <p className="mb-2">Laboulaye 6120 Laboulaye Córdoba</p>
              <p className="mb-2">Argentina</p>
              <p className="mb-2">info@mediterraneohotel.com.ar</p>
              <p>Tel: +54 03385 42-1986</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Sobre Nosotros</h3>
              <ul className="space-y-2">
                <li><a href="/nosotros" className="hover:underline">Nosotros</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Síguenos en</h3>
              <div className="flex space-x-4">
                <a href="https://web.facebook.com/hotelmediterraneolaboualye" className="hover:text-secondary transition-colors">
                  <Facebook className="inline-block mr-2" /> Facebook
                </a>
                <a href="https://www.instagram.com/hotelmediterraneolaboulaye/" className="hover:text-secondary transition-colors">
                  <Instagram className="inline-block mr-2" /> Instagram
                </a>
              </div>
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">Suscríbete a nuestras novedades</h4>
                <form action="https://formspree.io/f/mwpejzgw" method="POST" className="flex">
                  <Input type="email" name="email" placeholder="Tu email" className="rounded-l-none p-2 text-black" required />
                  <Button type="submit" className="rounded-l-none">Suscribirse</Button>
                </form>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center">
            <p>&copy; 2024 Hotel Mediterráneo</p>
          </div>
        </div>
      </footer>
    </div>
  )
}