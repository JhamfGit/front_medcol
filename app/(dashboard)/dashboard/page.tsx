"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Upload, Clock, AlertTriangle, CheckCircle, Pill } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/app/context/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
        <p className="text-muted-foreground">
          Bienvenido a Medcol Docs, {user?.name}. Aquí tienes una visión general de tu sistema.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documentos Pendientes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 desde ayer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Medicamentos Pendientes</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">-3 desde ayer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documentos Hoy</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+5 del promedio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alertas del Sistema</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Tareas comunes que puedes realizar</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild className="w-full">
              <Link href="/document-capture">
                <Upload className="mr-2 h-4 w-4" />
                Subir Nuevo Documento
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/document-consultation">
                <FileText className="mr-2 h-4 w-4" />
                Ver Documentos Recientes
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/medication-record">
                <Pill className="mr-2 h-4 w-4" />
                Revisar Registros de Medicamentos
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Tus últimas acciones en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {i === 1
                        ? "Documento subido"
                        : i === 2
                          ? "Registro de medicamento actualizado"
                          : i === 3
                            ? "Registro de paciente visto"
                            : "Alerta del sistema reconocida"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {i === 1
                        ? "Hace 10 minutos"
                        : i === 2
                          ? "Hace 2 horas"
                          : i === 3
                            ? "Ayer a las 15:30"
                            : "Hace 2 días"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificaciones del Sistema</CardTitle>
            <CardDescription>Alertas importantes del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-red-100 p-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Mantenimiento del Sistema</p>
                  <p className="text-xs text-muted-foreground">Mantenimiento programado el sábado a las 02:00</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-yellow-100 p-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Advertencia de Almacenamiento</p>
                  <p className="text-xs text-muted-foreground">Almacenamiento de documentos al 85% de capacidad</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-100 p-2">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Nueva Función Disponible</p>
                  <p className="text-xs text-muted-foreground">
                    Procesamiento por lotes de documentos ahora disponible
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

