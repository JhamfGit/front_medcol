"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Search, Download, Trash, Eye, Upload, Camera } from "lucide-react"
import { useAuth } from "@/app/context/auth-context"

// Datos de ejemplo para documentos
const documents = [
  {
    id: "DOC-001",
    patientId: "1098765432",
    patientName: "Maria Alejandra Rodriguez Gomez",
    type: "Autorización",
    date: "2023-05-15",
    status: "Completo",
    msd: "MSD-001",
    fileUrl: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "DOC-002",
    patientId: "0987654321",
    patientName: "Carlos Andrés Martínez López",
    type: "Cédula",
    date: "2023-05-14",
    status: "Pendiente",
    msd: "MSD-002",
    fileUrl: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "DOC-003",
    patientId: "5678901234",
    patientName: "Ana María Pérez Sánchez",
    type: "Fórmula Médica",
    date: "2023-05-13",
    status: "Completo",
    msd: "MSD-003",
    fileUrl: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "DOC-004",
    patientId: "1098765432",
    patientName: "Maria Alejandra Rodriguez Gomez",
    type: "MSD",
    date: "2023-05-12",
    status: "Pendiente",
    msd: "MSD-001",
    fileUrl: "/placeholder.svg?height=600&width=400",
  },
]

export default function SavedDocumentsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState<"cedula" | "msd">("cedula")
  const [filteredDocuments, setFilteredDocuments] = useState(documents)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [currentDocument, setCurrentDocument] = useState<(typeof documents)[0] | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredDocuments(documents)
      return
    }

    const filtered = documents.filter((doc) =>
      searchType === "cedula" ? doc.patientId.includes(searchTerm) : doc.msd.includes(searchTerm),
    )

    setFilteredDocuments(filtered)
  }

  const openPreview = (document: (typeof documents)[0]) => {
    setCurrentDocument(document)
    setIsPreviewOpen(true)
  }

  const openDeleteDialog = (document: (typeof documents)[0]) => {
    setCurrentDocument(document)
    setIsDeleteDialogOpen(true)
  }

  const deleteDocument = () => {
    // En una aplicación real, aquí se haría una llamada a la API
    setFilteredDocuments((prev) => prev.filter((doc) => doc.id !== currentDocument?.id))
    setIsDeleteDialogOpen(false)
  }

  const openUploadDialog = (document: (typeof documents)[0]) => {
    setCurrentDocument(document)
    setIsUploadDialogOpen(true)
  }

  const handleFileUpload = () => {
    setIsUploading(true)

    // Simular una carga de archivo
    setTimeout(() => {
      setIsUploading(false)
      setIsUploadDialogOpen(false)
      // Aquí se actualizaría el documento en una aplicación real
    }, 1500)
  }

  // Función para abrir la cámara
  const openCamera = () => {
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
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Detener la cámara
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }
        setIsCameraOpen(false)
        setIsUploading(true)

        // Simular una carga de archivo
        setTimeout(() => {
          setIsUploading(false)
          setIsUploadDialogOpen(false)
          // Aquí se actualizaría el documento en una aplicación real
        }, 1500)
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documentos Guardados</h1>
        <p className="text-muted-foreground">Consulta y gestiona los documentos de dispensación de medicamentos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Documentos</CardTitle>
          <CardDescription>Busca documentos por cédula del paciente o número MSD</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <div className="mb-2">
                <label className="text-sm font-medium">Buscar por:</label>
                <div className="flex mt-1 space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cedula-search"
                      name="searchType"
                      className="mr-2"
                      checked={searchType === "cedula"}
                      onChange={() => setSearchType("cedula")}
                    />
                    <label htmlFor="cedula-search">Cédula</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="msd-search"
                      name="searchType"
                      className="mr-2"
                      checked={searchType === "msd"}
                      onChange={() => setSearchType("msd")}
                    />
                    <label htmlFor="msd-search">MSD</label>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={`Introduce ${searchType === "cedula" ? "cédula" : "MSD"}`}
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleSearch}>Buscar</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Biblioteca de Documentos</CardTitle>
          <CardDescription>Navega por todos los documentos guardados en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Documento</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Cédula</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>MSD</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.id}</TableCell>
                      <TableCell>{doc.patientName}</TableCell>
                      <TableCell>{doc.patientId}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>{new Date(doc.date).toLocaleDateString()}</TableCell>
                      <TableCell>{doc.msd}</TableCell>
                      <TableCell>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                            doc.status === "Completo" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {doc.status}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => openPreview(doc)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => window.open(doc.fileUrl, "_blank")}>
                            <Download className="h-4 w-4" />
                          </Button>
                          {user?.role !== "externo" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDeleteDialog(doc)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                              {doc.status === "Pendiente" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openUploadDialog(doc)}
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  <Upload className="h-4 w-4" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No se encontraron documentos.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de previsualización */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Previsualización de Documento</DialogTitle>
            <DialogDescription>
              {currentDocument?.type} - {currentDocument?.patientName} - {currentDocument?.msd}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center">
            <img
              src={currentDocument?.fileUrl || "/placeholder.svg"}
              alt="Documento"
              className="max-h-[500px] object-contain border rounded-lg"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Cerrar
            </Button>
            <Button onClick={() => window.open(currentDocument?.fileUrl, "_blank")}>
              <Download className="mr-2 h-4 w-4" />
              Descargar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Eliminar Documento</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar este documento? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="mb-2">
              <strong>Tipo:</strong> {currentDocument?.type}
            </p>
            <p className="mb-2">
              <strong>Paciente:</strong> {currentDocument?.patientName}
            </p>
            <p className="mb-2">
              <strong>Cédula:</strong> {currentDocument?.patientId}
            </p>
            <p>
              <strong>MSD:</strong> {currentDocument?.msd}
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={deleteDocument}>
              Eliminar Documento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de subida de documento pendiente */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Subir Documento Pendiente</DialogTitle>
            <DialogDescription>
              Sube el documento pendiente para {currentDocument?.patientName} (MSD: {currentDocument?.msd})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex space-x-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => document.getElementById("upload-file")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Subir Archivo
              </Button>
              <input id="upload-file" type="file" className="hidden" accept="image/*,.pdf" ref={fileInputRef} />
              <Button variant="outline" className="flex-1" onClick={openCamera}>
                <Camera className="mr-2 h-4 w-4" />
                Tomar Foto
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleFileUpload} disabled={isUploading}>
              {isUploading ? "Subiendo..." : "Subir Documento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
    </div>
  )
}

