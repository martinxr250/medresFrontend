'use client'

import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { Pie, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, CalendarIcon, RefreshCw } from 'lucide-react'
import { format, startOfYear, endOfYear, startOfMonth, endOfMonth, eachDayOfInterval, eachMonthOfInterval } from 'date-fns'
import { es } from 'date-fns/locale'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

// Define status colors
const statusColors = {
  'Confirmada': '#4CAF50',
  'Pendiente': '#FFC107',
  'Cancelada': '#F44336'
}

const PDFContent = ({ data, charts, filters }) => (
  <div className="p-8 bg-white">
    <h1 className="text-3xl font-bold mb-6 text-center">Reporte de Reservas</h1>
    <p className="text-sm text-gray-500 mb-6 text-center">
      Generado el: {format(new Date(), "dd/MM/yyyy HH:mm:ss")}
    </p>
    
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Filtros Aplicados</h2>
      <ul className="list-disc pl-5">
        {filters.nameFilter && <li>Nombre o Apellido: {filters.nameFilter}</li>}
        <li>Estados: {filters.statusFilter.join(', ')}</li>
        {filters.startDateFilter && <li>Fecha de Inicio: {format(filters.startDateFilter, "dd/MM/yyyy")}</li>}
        {filters.endDateFilter && <li>Fecha de Fin: {format(filters.endDateFilter, "dd/MM/yyyy")}</li>}
        <li>Período del Histograma: {filters.histogramPeriod === 'year' ? 'Anual' : filters.histogramPeriod === 'month' ? 'Mensual' : 'Personalizado'}</li>
      </ul>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Ingresos Totales</h2>
        <p className="text-2xl font-bold">${data.totalRevenue.toFixed(2)}</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Duración Promedio de Estadía</h2>
        <p className="text-2xl font-bold">{data.averageStayDuration.toFixed(2)} días</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Tasa de Ocupación</h2>
        <p className="text-2xl font-bold">{data.occupancyRate.toFixed(2)}%</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Total de Reservas</h2>
        <p className="text-2xl font-bold">{data.totalReservations}</p>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-6 mb-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Estado de Reservas</h2>
        <img src={charts.pieChart} alt="Estado de Reservas" className="w-full" />
        <div className="mt-4">
          {Object.entries(data.reservationsByStatus).map(([status, count]) => (
            <div key={status} className="flex justify-between items-center mt-2">
              <span>{status}</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Reservas por Período</h2>
        <img src={charts.barChart} alt="Reservas por Período" className="w-full" />
      </div>
    </div>
    
    <h2 className="text-xl font-semibold mb-2">Detalle de Reservas</h2>
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 p-2">Nro. Reserva</th>
          <th className="border border-gray-300 p-2">Nombre</th>
          <th className="border border-gray-300 p-2">Apellido</th>
          <th className="border border-gray-300 p-2">Fecha Ingreso</th>
          <th className="border border-gray-300 p-2">Fecha Salida</th>
          <th className="border border-gray-300 p-2">Habitación</th>
          <th className="border border-gray-300 p-2">Estado</th>
          <th className="border border-gray-300 p-2">Precio Total</th>
        </tr>
      </thead>
      <tbody>
        {data.reservations.map((reservation) => (
          <tr key={reservation.nroReserva}>
            <td className="border border-gray-300 p-2">{reservation.nroReserva}</td>
            <td className="border border-gray-300 p-2">{reservation.nombre}</td>
            <td className="border border-gray-300 p-2">{reservation.apellido}</td>
            <td className="border border-gray-300 p-2">{new Date(reservation.fechaIngreso).toLocaleDateString()}</td>
            <td className="border border-gray-300 p-2">{new Date(reservation.fechaSalida).toLocaleDateString()}</td>
            <td className="border border-gray-300 p-2">{reservation.habitacione.nombre}</td>
            <td className="border border-gray-300 p-2">
              <span
                className="px-2 py-1 rounded-full text-white text-xs font-semibold"
                style={{ backgroundColor: statusColors[reservation.estado] }}
              >
                {reservation.estado}
              </span>
            </td>
            <td className="border border-gray-300 p-2">${reservation.precioTotal.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default function EnhancedReservationReports() {
  const [reservations, setReservations] = useState([])
  const [filteredReservations, setFilteredReservations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const reportRef = useRef(null)

  // Filters
  const [nameFilter, setNameFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState(Object.keys(statusColors))
  const [startDateFilter, setStartDateFilter] = useState(null)
  const [endDateFilter, setEndDateFilter] = useState(null)
  const [histogramPeriod, setHistogramPeriod] = useState('year')
  const [detailStatusFilter, setDetailStatusFilter] = useState('all')

  const fetchReservations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:4001/api/medres/reservas')
      if (!response.ok) {
        throw new Error('Failed to fetch reservations')
      }
      const data = await response.json()
      setReservations(data)
      setFilteredReservations(data)
      setIsLoading(false)
    } catch (err) {
      setError('Error fetching reservations. Please try again later.')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  useEffect(() => {
    const filtered = reservations.filter(reservation => {
      const nameMatch = reservation.nombre.toLowerCase().includes(nameFilter.toLowerCase()) ||
                        reservation.apellido.toLowerCase().includes(nameFilter.toLowerCase())
      const statusMatch = statusFilter.includes(reservation.estado)
      const startDate = startDateFilter ? new Date(startDateFilter) : null
      const endDate = endDateFilter ? new Date(endDateFilter) : null
      const reservationDate = new Date(reservation.fechaIngreso)
      const dateMatch = (!startDate || reservationDate >= startDate) &&
                        (!endDate || reservationDate <= endDate)
      return nameMatch && statusMatch && dateMatch
    })
    setFilteredReservations(filtered)
  }, [nameFilter, statusFilter, startDateFilter, endDateFilter, reservations])

  const getTotalRevenue = () => {
    return filteredReservations.reduce((total, reservation) => total + reservation.precioTotal, 0)
  }

  const getAverageStayDuration = () => {
    const totalDays = filteredReservations.reduce((total, reservation) => total + reservation.dias, 0)
    return filteredReservations.length ? totalDays / filteredReservations.length : 0
  }

  const getReservationsByStatus = () => {
    const statusCount = filteredReservations.reduce((count, reservation) => {
      count[reservation.estado] = (count[reservation.estado] || 0) + 1
      return count
    }, {})

    return {
      labels: Object.keys(statusCount),
      datasets: [{
        data: Object.values(statusCount),
        backgroundColor: Object.keys(statusCount).map(status => statusColors[status]),
        hoverBackgroundColor: Object.keys(statusCount).map(status => statusColors[status])
      }]
    }
  }

  const getReservationsByPeriod = () => {
    let dateRange
    let labelFormat
    
    if (histogramPeriod === 'year') {
      dateRange = eachMonthOfInterval({
        start: startOfYear(new Date()),
        end: endOfYear(new Date())
      })
      labelFormat = 'MMM'
    } else if (histogramPeriod === 'month') {
      dateRange = eachDayOfInterval({
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date())
      })
      labelFormat = 'd'
    } else if (histogramPeriod === 'custom') {
      if (!startDateFilter || !endDateFilter) {
        return { labels: [], datasets: [{ data: [] }] }
      }
      dateRange = eachDayOfInterval({
        start: startDateFilter,
        end: endDateFilter
      })
      labelFormat = 'dd/MM'
    }

    const periodCount = dateRange.reduce((count, date) => {
      count[format(date, labelFormat, { locale: es })] = 0
      return count
    }, {})

    filteredReservations.forEach(reservation => {
      const reservationDate = new Date(reservation.fechaIngreso)
      const label = format(reservationDate, labelFormat, { locale: es })
      if (periodCount.hasOwnProperty(label)) {
        periodCount[label]++
      }
    })

    return {
      labels: Object.keys(periodCount),
      datasets: [{
        label: 'Reservas',
        data: Object.values(periodCount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    }
  }

  const getOccupancyRate = () => {
    if (filteredReservations.length === 0) return 0
    const totalRoomDays = filteredReservations.reduce((total, reservation) => total + reservation.dias, 0)
    const totalDaysInYear = 365 * (filteredReservations[0]?.habitacione?.cantidadPersonas || 1)
    return (totalRoomDays / totalDaysInYear) * 100
  }

  const downloadPDF = async () => {
    const pieChartCanvas = await html2canvas(document.querySelector('.pie-chart-container canvas'))
    const barChartCanvas = await html2canvas(document.querySelector('.bar-chart-container canvas'))

    const pdfContent = (
      <PDFContent
        data={{
          totalRevenue: getTotalRevenue(),
          averageStayDuration: getAverageStayDuration(),
          occupancyRate: getOccupancyRate(),
          totalReservations: filteredReservations.length,
          reservations: filteredReservations,
          reservationsByStatus: getReservationsByStatus().datasets[0].data.reduce((obj, value, index) => {
            obj[getReservationsByStatus().labels[index]] = value
            return obj
          }, {})
        }}
        charts={{
          pieChart: pieChartCanvas.toDataURL('image/png'),
          barChart: barChartCanvas.toDataURL('image/png')
        }}
        filters={{
          nameFilter,
          statusFilter,
          startDateFilter,
          endDateFilter,
          histogramPeriod,
          detailStatusFilter
        }}
      />
    )

    const root = document.createElement('div')
    ReactDOM.render(pdfContent, root)
    document.body.appendChild(root)

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    await html2canvas(root).then((canvas) => {
      
      const imgData = canvas.toDataURL('image/png')
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    })

    document.body.removeChild(root)
    pdf.save('reporte_reservas_filtrado.pdf')
  }

  const resetFilters = () => {
    setNameFilter('')
    setStatusFilter(Object.keys(statusColors))
    setStartDateFilter(null)
    setEndDateFilter(null)
    setHistogramPeriod('year')
    setDetailStatusFilter('all')
  }

  if (isLoading) return <div className="flex justify-center items-center h-screen">Cargando...</div>
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Reporte de Reservas</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name-filter">Nombre o Apellido</Label>
              <Input
                id="name-filter"
                placeholder="Filtrar por nombre"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <div className="flex flex-col space-y-2">
                {Object.keys(statusColors).map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={statusFilter.includes(status)}
                      onCheckedChange={(checked) => {
                        setStatusFilter(prev =>
                          checked
                            ? [...prev, status]
                            : prev.filter(s => s !== status)
                        )
                      }}
                    />
                    <label
                      htmlFor={`status-${status}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {status}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-date">Fecha de Inicio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${!startDateFilter && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDateFilter ? format(startDateFilter, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDateFilter}
                    onSelect={setStartDateFilter}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Fecha de Fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${!endDateFilter && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDateFilter ? format(endDateFilter, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDateFilter}
                    onSelect={setEndDateFilter}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={resetFilters} variant="outline" className="mr-2">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reiniciar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mb-6">
        <Select 
          value={histogramPeriod} 
          onValueChange={(value) => {
            setHistogramPeriod(value)
            if (value === 'year') {
              setStartDateFilter(startOfYear(new Date()))
              setEndDateFilter(endOfYear(new Date()))
            } else if (value === 'month') {
              setStartDateFilter(startOfMonth(new Date()))
              setEndDateFilter(endOfMonth(new Date()))
            }
          }}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Seleccionar período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="year">Anual</SelectItem>
            <SelectItem value="month">Mensual</SelectItem>
            <SelectItem value="custom">
              {startDateFilter && endDateFilter
                ? `${format(startDateFilter, "dd/MM/yyyy")} - ${format(endDateFilter, "dd/MM/yyyy")}`
                : "Personalizado"}
            </SelectItem>
          </SelectContent>
        </Select>
        {histogramPeriod === 'custom' && (
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-[140px] justify-start text-left font-normal ${!startDateFilter && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDateFilter ? format(startDateFilter, "dd/MM/yyyy") : <span>Fecha inicio</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDateFilter}
                  onSelect={setStartDateFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-[140px] justify-start text-left font-normal ${!endDateFilter && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDateFilter ? format(endDateFilter, "dd/MM/yyyy") : <span>Fecha fin</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDateFilter}
                  onSelect={setEndDateFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
        <Button onClick={downloadPDF} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Descargar PDF Filtrado
        </Button>
      </div>

      <div ref={reportRef} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Ingresos Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${getTotalRevenue().toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Duración Promedio de Estadía</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{getAverageStayDuration().toFixed(2)} días</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tasa de Ocupación</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{getOccupancyRate().toFixed(2)}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total de Reservas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{filteredReservations.length}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Estado de Reservas</CardTitle>
            </CardHeader>
            <CardContent className="pie-chart-container">
              <Pie 
                data={getReservationsByStatus()} 
                options={{
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          let label = context.label || '';
                          if (label) {
                            label += ': ';
                          }
                          if (context.parsed !== undefined) {
                            label += context.parsed;
                          }
                          return label;
                        }
                      }
                    }
                  }
                }}
              />
              <div className="mt-4">
                {getReservationsByStatus().labels.map((label, index) => (
                  <div key={label} className="flex justify-between items-center mt-2">
                    <span>{label}</span>
                    <span>{getReservationsByStatus().datasets[0].data[index]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reservas por Período</CardTitle>
            </CardHeader>
            <CardContent className="bar-chart-container">
              <Bar 
                data={getReservationsByPeriod()} 
                options={{
                  responsive: true,
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Período de tiempo'
                      },
                      grid: {
                        display: false
                      }
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Número de reservas'
                      },
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      callbacks: {
                        title: function(context) {
                          return `Período: ${context[0].label}`;
                        },
                        label: function(context) {
                          return `Número de reservas: ${context.parsed.y}`;
                        }
                      }
                    }
                  }
                }} 
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detalle de Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="detail-status-filter">Filtrar por Estado</Label>
              <Select value={detailStatusFilter} onValueChange={setDetailStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {Object.keys(statusColors).map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nro. Reserva</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Apellido</TableHead>
                  <TableHead>Fecha Ingreso</TableHead>
                  <TableHead>Fecha Salida</TableHead>
                  <TableHead>Habitación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Precio Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations
                  .filter(reservation => detailStatusFilter === 'all' || reservation.estado === detailStatusFilter)
                  .map((reservation) => (
                    <TableRow key={reservation.nroReserva}>
                      <TableCell>{reservation.nroReserva}</TableCell>
                      <TableCell>{reservation.nombre}</TableCell>
                      <TableCell>{reservation.apellido}</TableCell>
                      <TableCell>{new Date(reservation.fechaIngreso).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(reservation.fechaSalida).toLocaleDateString()}</TableCell>
                      <TableCell>{reservation.habitacione.nombre}</TableCell>
                      <TableCell>
                        <span
                          className="px-2 py-1 rounded-full text-white text-xs font-semibold"
                          style={{ backgroundColor: statusColors[reservation.estado] }}
                        >
                          {reservation.estado}
                        </span>
                      </TableCell>
                      <TableCell>${reservation.precioTotal.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}