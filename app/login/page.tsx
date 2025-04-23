"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/auth-context"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FileText } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce una dirección de correo electrónico válida" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
})

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      const success = await login(values.email, values.password)

      if (success) {
        router.push("/dashboard")
      } else {
        setError("Correo electrónico o contraseña inválidos. Por favor, inténtalo de nuevo.")
      }
    } catch (error) {
      setError("Ocurrió un error. Por favor, inténtalo de nuevo.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center space-y-2 text-center">
          <div className="rounded-full bg-primary p-2">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Medcol Docs</h1>
          <p className="text-grey-500">Sistema de Gestión de Documentos de Dispensación</p>
        </div>

        <div className="rounded-lg border bg-white p-8 shadow-sm">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="Introduce tu correo electrónico" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Introduce tu contraseña" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Credenciales de demostración:</p>
            <p>Admin: admin@medcol.com / password</p>
            <p>Usuario: user@medcol.com / password</p>
            <p>Externo: externo@medcol.com / password</p>
          </div>
        </div>
      </div>
    </div>
  )
}

