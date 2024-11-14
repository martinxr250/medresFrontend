import React from 'react'
import { AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function ReservaErrorHandler({ mensaje, onRetry, onReset }) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6 pb-8 px-8">
        <motion.div 
          className="space-y-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-800">Ha ocurrido un error</h2>
          <p className="text-gray-600">{mensaje}</p>
          <div className="space-y-3">
            <Button 
              onClick={onReset}
              variant="outline" 
              className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-50"
            >
              Comenzar nueva reserva
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}