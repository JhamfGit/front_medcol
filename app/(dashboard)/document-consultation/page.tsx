"use client"

import { useState } from "react"
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
import { Search, FileText, Download, Eye } from "lucide-react"
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

export default function DocumentConsultationPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState<"cedula" | "msd">("cedula")
  const [filteredDocuments, setFilteredDocuments] = useState<typeof documents>([])
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [currentDocument, setCurrentDocument] = useState<(typeof documents)[0] | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredDocuments([])
      setHasSearched(false)
      return
    }

    const filtered = documents.filter((doc) =>
      searchType === "cedula" ? doc.patientId.includes(searchTerm) : doc.msd.includes(searchTerm),
    )

    setFilteredDocuments(filtered)
    setHasSearched(true)
  }

  const openPreview = (document: (typeof documents)[0]) => {
    setCurrentDocument(document)
    setIsPreviewOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Consultar Documentos</h1>
        <p className="text-muted-foreground">Busca y consulta documentos por cédula o número MSD</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Documentos</CardTitle>
          <CardDescription>Introduce la cédula del paciente o el número MSD para buscar documentos</CardDescription>
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

      {hasSearched && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados de la Búsqueda</CardTitle>
            <CardDescription>
              {filteredDocuments.length > 0
                ? `Se encontraron ${filteredDocuments.length} documentos`
                : "No se encontraron documentos con los criterios de búsqueda"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredDocuments.length > 0 ? (
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
                    {filteredDocuments.map((doc) => (
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
                              doc.status === "Completo"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
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
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No se encontraron documentos</h3>
                <p className="text-sm text-gray-500 mt-2">Intenta con diferentes criterios de búsqueda</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
    </div>
  )
}

