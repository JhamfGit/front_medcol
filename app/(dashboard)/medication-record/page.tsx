"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MoreVertical, Download, Printer, Eye, Pill, CheckCircle } from "lucide-react"

// Importar useAuth y useRouter al principio del archivo
import { useAuth } from "@/app/context/auth-context"
import { useRouter } from "next/navigation"

// Datos de ejemplo para medicamentos
const deliveredMedications = [
  {
    id: "MED-001",
    patientId: "P-12345",
    name: "Amoxicilina",
    dosage: "500mg",
    frequency: "3x diario",
    deliveryDate: "2023-05-15",
    status: "Entregado",
  },
  {
    id: "MED-002",
    patientId: "P-67890",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "1x diario",
    deliveryDate: "2023-05-14",
    status: "Entregado",
  },
  {
    id: "MED-003",
    patientId: "P-54321",
    name: "Metformina",
    dosage: "1000mg",
    frequency: "2x diario",
    deliveryDate: "2023-05-13",
    status: "Entregado",
  },
]

const pendingMedications = [
  {
    id: "MED-004",
    patientId: "P-98765",
    name: "Atorvastatina",
    dosage: "20mg",
    frequency: "1x diario",
    requestDate: "2023-05-12",
    status: "Pendiente",
  },
  {
    id: "MED-005",
    patientId: "P-13579",
    name: "Levotiroxina",
    dosage: "50mcg",
    frequency: "1x diario",
    requestDate: "2023-05-11",
    status: "Pendiente",
  },
]

// Añadir verificación de permisos al principio de la función del componente
export default function MedicationRecordPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [deliveredSearchTerm, setDeliveredSearchTerm] = useState("")
  const [pendingSearchTerm, setPendingSearchTerm] = useState("")

  // Redirigir si el usuario es externo
  useEffect(() => {
    if (user?.role === "externo") {
      router.push("/dashboard")
    }
  }, [user, router])

  // Si el usuario es externo, mostrar mensaje de acceso denegado
  if (user?.role === "externo") {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Acceso Denegado</h1>
          <p className="text-muted-foreground">No tienes permiso para acceder a esta página.</p>
        </div>
      </div>
    )
  }

  const filteredDeliveredMedications = deliveredMedications.filter(
    (med) =>
      med.name.toLowerCase().includes(deliveredSearchTerm.toLowerCase()) ||
      med.patientId.toLowerCase().includes(deliveredSearchTerm.toLowerCase()),
  )

  const filteredPendingMedications = pendingMedications.filter(
    (med) =>
      med.name.toLowerCase().includes(pendingSearchTerm.toLowerCase()) ||
      med.patientId.toLowerCase().includes(pendingSearchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Registro de Medicamentos</h1>
        <p className="text-muted-foreground">Ver y gestionar entregas de medicamentos</p>
      </div>

      <Tabs defaultValue="delivered" className="space-y-6">
        <TabsList>
          <TabsTrigger value="delivered">Entregados</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
        </TabsList>

        <TabsContent value="delivered">
          <Card>
            <CardHeader>
              <CardTitle>Medicamentos Entregados</CardTitle>
              <CardDescription>Ver todos los medicamentos que han sido entregados a los pacientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar medicamentos..."
                    className="pl-8"
                    value={deliveredSearchTerm}
                    onChange={(e) => setDeliveredSearchTerm(e.target.value)}
                  />
                </div>
                <Button>
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir Informe
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Medicamento</TableHead>
                      <TableHead>ID Paciente</TableHead>
                      <TableHead>Medicamento</TableHead>
                      <TableHead>Dosis</TableHead>
                      <TableHead>Frecuencia</TableHead>
                      <TableHead>Fecha de Entrega</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeliveredMedications.length > 0 ? (
                      filteredDeliveredMedications.map((med) => (
                        <TableRow key={med.id}>
                          <TableCell className="font-medium">{med.id}</TableCell>
                          <TableCell>{med.patientId}</TableCell>
                          <TableCell>{med.name}</TableCell>
                          <TableCell>{med.dosage}</TableCell>
                          <TableCell>{med.frequency}</TableCell>
                          <TableCell>{new Date(med.deliveryDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500">{med.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Acciones</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver Detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  Descargar Registro
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Printer className="mr-2 h-4 w-4" />
                                  Imprimir Registro
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No se encontraron medicamentos.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Medicamentos Pendientes</CardTitle>
              <CardDescription>Ver todos los medicamentos que están pendientes de entrega</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar medicamentos..."
                    className="pl-8"
                    value={pendingSearchTerm}
                    onChange={(e) => setPendingSearchTerm(e.target.value)}
                  />
                </div>
                <Button>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Marcar como Entregado
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Medicamento</TableHead>
                      <TableHead>ID Paciente</TableHead>
                      <TableHead>Medicamento</TableHead>
                      <TableHead>Dosis</TableHead>
                      <TableHead>Frecuencia</TableHead>
                      <TableHead>Fecha de Solicitud</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPendingMedications.length > 0 ? (
                      filteredPendingMedications.map((med) => (
                        <TableRow key={med.id}>
                          <TableCell className="font-medium">{med.id}</TableCell>
                          <TableCell>{med.patientId}</TableCell>
                          <TableCell>{med.name}</TableCell>
                          <TableCell>{med.dosage}</TableCell>
                          <TableCell>{med.frequency}</TableCell>
                          <TableCell>{new Date(med.requestDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                              {med.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Acciones</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver Detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Pill className="mr-2 h-4 w-4" />
                                  Actualizar Estado
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Printer className="mr-2 h-4 w-4" />
                                  Imprimir Registro
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No se encontraron medicamentos pendientes.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

