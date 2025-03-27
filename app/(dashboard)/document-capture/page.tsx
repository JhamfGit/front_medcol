"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Search, Upload, Camera, FileText, Download, Eye, Check, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/app/context/auth-context"
import { useRouter } from "next/navigation"

// Datos simulados de pacientes (en una aplicación real, esto vendría de una API)
const patientData = [
  {
    cedula: "1098765432",
    nombre: "Maria Alejandra Rodriguez Gomez",
    direccion: "Calle 123 #45-67, Bogotá, Colombia",
    eps: "Sanitas EPS",
    msd: "MSD-001",
  },
  {
    cedula: "0987654321",
    nombre: "Carlos Andrés Martínez López",
    direccion: "Carrera 45 #12-34, Medellín, Colombia",
    eps: "Nueva EPS",
    msd: "MSD-002",
  },
  {
    cedula: "5678901234",
    nombre: "Ana María Pérez Sánchez",
    direccion: "Avenida 67 #89-12, Cali, Colombia",
    eps: "Compensar EPS",
    msd: "MSD-003",
  },
]

const formSchema = z.object({
  searchType: z.enum(["msd", "cedula"]),
  searchTerm: z.string().min(1, "Por favor, introduce un término de búsqueda"),
})

export default function DocumentCapturePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [patientFound, setPatientFound] = useState<(typeof patientData)[0] | null>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [currentDocumentType, setCurrentDocumentType] = useState<string>("")
  const [capturedImages, setCapturedImages] = useState<Record<string, string>>({})
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({})
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchType: "msd",
      searchTerm: "",
    },
  })

  // Redirigir si el usuario es externo
  useEffect(() => {
    if (user?.role === "externo") {
      router.push("/dashboard")
    }
  }, [user, router])

  // Limpiar el stream de la cámara cuando se cierra
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

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

  // Función para buscar paciente
  const searchPatient = (data: z.infer<typeof formSchema>) => {
    let found = null
    if (data.searchType === "msd") {
      found = patientData.find((patient) => patient.msd === data.searchTerm)
    } else {
      found = patientData.find((patient) => patient.cedula === data.searchTerm)
    }

    if (found) {
      setPatientFound(found)
    } else {
      setPatientFound(null)
      alert("No se encontró ningún paciente con los datos proporcionados.")
    }
  }

  // Función para abrir la cámara
  const openCamera = (documentType: string) => {
    setCurrentDocumentType(documentType)

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((mediaStream) => {
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
        setIsCameraOpen(true)
      })
      .catch((error) => {
        console.error("Error al acceder a la cámara:", error)
        alert("No se pudo acceder a la cámara. Por favor, verifica los permisos.")
      })
  }

  // Función para capturar imagen
  const captureImage = () => {
    if (videoRef.current && canvasRef.current && currentDocumentType) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageDataUrl = canvas.toDataURL("image/png")
        setCapturedImages((prev) => ({
          ...prev,
          [currentDocumentType]: imageDataUrl,
        }))

        // Detener la cámara
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }
        setIsCameraOpen(false)
      }
    }
  }

  // Función para cerrar la cámara
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    setIsCameraOpen(false)
  }

  // Función para manejar la subida de archivos
  const handleFileUpload = (documentType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setUploadedFiles((prev) => ({
        ...prev,
        [documentType]: file,
      }))

      // Crear URL para previsualización
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setCapturedImages((prev) => ({
            ...prev,
            [documentType]: event.target?.result as string,
          }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Función para eliminar un documento
  const removeDocument = (documentType: string) => {
    setCapturedImages((prev) => {
      const newImages = { ...prev }
      delete newImages[documentType]
      return newImages
    })

    setUploadedFiles((prev) => {
      const newFiles = { ...prev }
      delete newFiles[documentType]
      return newFiles
    })
  }

  // Función para previsualizar un documento
  const previewDocument = (imageUrl: string) => {
    setPreviewImage(imageUrl)
    setIsPreviewOpen(true)
  }

  // Función para guardar todos los documentos
  const saveAllDocuments = () => {
    setIsSubmitting(true)

    // Simular envío a API
    setTimeout(() => {
      setIsSuccess(true)
      setIsSubmitting(false)

      // Resetear después de 3 segundos
      setTimeout(() => {
        setIsSuccess(false)
        setPatientFound(null)
        setCapturedImages({})
        setUploadedFiles({})
        form.reset()
      }, 3000)
    }, 1500)
  }

  // Verificar si hay documentos para guardar
  const hasDocumentsToSave = Object.keys(capturedImages).length > 0 || Object.keys(uploadedFiles).length > 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Captura de Documentos</h1>
        <p className="text-muted-foreground">Sube documentos de dispensación de medicamentos</p>
      </div>

      {isSuccess && (
        <Alert className="bg-green-50">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle>Éxito</AlertTitle>
          <AlertDescription>Los documentos han sido guardados correctamente.</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Buscar Paciente</CardTitle>
          <CardDescription>Introduce el número MSD o cédula para buscar la información del paciente</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(searchPatient)} className="space-y-4">
              <div className="flex flex-col space-y-4">
                <div className="flex space-x-4">
                  <FormField
                    control={form.control}
                    name="searchType"
                    render={({ field }) => (
                      <FormItem className="space-y-0 flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="msd"
                            value="msd"
                            checked={field.value === "msd"}
                            onChange={() => field.onChange("msd")}
                            className="mr-1"
                          />
                          <label htmlFor="msd">MSD Number</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="cedula"
                            value="cedula"
                            checked={field.value === "cedula"}
                            onChange={() => field.onChange("cedula")}
                            className="mr-1"
                          />
                          <label htmlFor="cedula">ID Card (Cédula)</label>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex space-x-4">
                  <FormField
                    control={form.control}
                    name="searchTerm"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder={`Introduce ${form.getValues().searchType === "msd" ? "MSD" : "cédula"}`}
                              className="pl-8"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">
                    <Search className="mr-2 h-4 w-4" />
                    Buscar Paciente
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {patientFound && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Información del Paciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nombre Completo</h3>
                  <p className="mt-1 text-lg font-medium">{patientFound.nombre}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Número de Cédula</h3>
                  <p className="mt-1 text-lg font-medium">{patientFound.cedula}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Dirección</h3>
                  <p className="mt-1 text-lg font-medium">{patientFound.direccion}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">EPS</h3>
                  <p className="mt-1 text-lg font-medium">{patientFound.eps}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentos Requeridos</CardTitle>
              <CardDescription>Sube o captura los siguientes documentos requeridos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Autorización */}
              <div className="border-b pb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium">Autorización</h3>
                    <p className="text-sm text-gray-500">Sube o captura una imagen clara de la autorización</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => document.getElementById("autorizacion-upload")?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Subir Archivo
                    </Button>
                    <input
                      id="autorizacion-upload"
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload("autorizacion", e)}
                    />
                    <Button variant="outline" onClick={() => openCamera("autorizacion")}>
                      <Camera className="mr-2 h-4 w-4" />
                      Tomar Foto
                    </Button>
                  </div>
                </div>
                {capturedImages["autorizacion"] && (
                  <div className="mt-4 relative bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-blue-500 mr-2" />
                        <div>
                          <p className="font-medium">Autorización</p>
                          <p className="text-sm text-gray-500">Documento capturado</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => previewDocument(capturedImages["autorizacion"])}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeDocument("autorizacion")}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Cédula */}
              <div className="border-b pb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium">ID Card (Cédula)</h3>
                    <p className="text-sm text-gray-500">Sube o captura una imagen clara de la cédula</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => document.getElementById("cedula-upload")?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Subir Archivo
                    </Button>
                    <input
                      id="cedula-upload"
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload("cedula", e)}
                    />
                    <Button variant="outline" onClick={() => openCamera("cedula")}>
                      <Camera className="mr-2 h-4 w-4" />
                      Tomar Foto
                    </Button>
                  </div>
                </div>
                {capturedImages["cedula"] && (
                  <div className="mt-4 relative bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-blue-500 mr-2" />
                        <div>
                          <p className="font-medium">Cédula</p>
                          <p className="text-sm text-gray-500">Documento capturado</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => previewDocument(capturedImages["cedula"])}>
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeDocument("cedula")}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Fórmula Médica */}
              <div className="border-b pb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium">Fórmula Médica</h3>
                    <p className="text-sm text-gray-500">Sube o captura una imagen clara de la fórmula médica</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => document.getElementById("formula-upload")?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Subir Archivo
                    </Button>
                    <input
                      id="formula-upload"
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload("formula", e)}
                    />
                    <Button variant="outline" onClick={() => openCamera("formula")}>
                      <Camera className="mr-2 h-4 w-4" />
                      Tomar Foto
                    </Button>
                  </div>
                </div>
                {capturedImages["formula"] && (
                  <div className="mt-4 relative bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-blue-500 mr-2" />
                        <div>
                          <p className="font-medium">Fórmula Médica</p>
                          <p className="text-sm text-gray-500">Documento capturado</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => previewDocument(capturedImages["formula"])}>
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeDocument("formula")}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* MSD */}
              <div className="pb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium">MSD</h3>
                    <p className="text-sm text-gray-500">Sube o captura una imagen clara del MSD</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => document.getElementById("msd-upload")?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Subir Archivo
                    </Button>
                    <input
                      id="msd-upload"
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload("msd", e)}
                    />
                    <Button variant="outline" onClick={() => openCamera("msd")}>
                      <Camera className="mr-2 h-4 w-4" />
                      Tomar Foto
                    </Button>
                  </div>
                </div>
                {capturedImages["msd"] && (
                  <div className="mt-4 relative bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-blue-500 mr-2" />
                        <div>
                          <p className="font-medium">MSD</p>
                          <p className="text-sm text-gray-500">Documento capturado</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => previewDocument(capturedImages["msd"])}>
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeDocument("msd")}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <input
                  type="checkbox"
                  id="pending-delivery"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="pending-delivery" className="text-sm font-medium text-gray-700">
                  Marcar como entrega pendiente
                </label>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  onClick={saveAllDocuments}
                  disabled={!hasDocumentsToSave || isSubmitting}
                  className="w-full md:w-auto"
                >
                  {isSubmitting ? "Guardando..." : "Guardar Documentos"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Diálogo para la cámara */}
      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Capturar Documento</DialogTitle>
            <DialogDescription>Posiciona el documento frente a la cámara y haz clic en "Capturar"</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-full border rounded-lg overflow-hidden">
              <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
            </div>

            <div className="flex space-x-4">
              <Button onClick={captureImage}>
                <Camera className="mr-2 h-4 w-4" />
                Capturar
              </Button>
              <Button variant="outline" onClick={closeCamera}>
                Cancelar
              </Button>
            </div>
          </div>

          {/* Canvas oculto para capturar la imagen */}
          <canvas ref={canvasRef} className="hidden" />
        </DialogContent>
      </Dialog>

      {/* Diálogo para previsualización de documentos */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Previsualización de Documento</DialogTitle>
          </DialogHeader>

          <div className="flex justify-center">
            <img
              src={previewImage || "/placeholder.svg"}
              alt="Documento"
              className="max-h-[500px] object-contain border rounded-lg"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Cerrar
            </Button>
            {previewImage && (
              <Button onClick={() => window.open(previewImage, "_blank")}>
                <Download className="mr-2 h-4 w-4" />
                Descargar
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

