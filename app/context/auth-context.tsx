"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

type User = {
  id: string
  name: string
  email: string
  role: "admin" | "user" | "externo"
  position?: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar si el usuario ha iniciado sesión
    const storedUser = Cookies.get("medcol-user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Error al analizar los datos del usuario", e)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulación de llamada a API - en una aplicación real, esto sería un fetch a tu backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Validación simulada - reemplazar con validación API real
      if (email === "admin@medcol.com" && password === "password") {
        const userData: User = {
          id: "1",
          name: "Usuario Administrador",
          email: "admin@medcol.com",
          role: "admin",
          position: "Administrador del Sistema",
        }
        setUser(userData)
        Cookies.set("medcol-user", JSON.stringify(userData), { expires: 7 })
        setIsLoading(false)
        return true
      } else if (email === "user@medcol.com" && password === "password") {
        const userData: User = {
          id: "2",
          name: "Usuario Regular",
          email: "user@medcol.com",
          role: "user",
          position: "Personal Médico",
        }
        setUser(userData)
        Cookies.set("medcol-user", JSON.stringify(userData), { expires: 7 })
        setIsLoading(false)
        return true
      } else if (email === "externo@medcol.com" && password === "password") {
        const userData: User = {
          id: "3",
          name: "Usuario Externo",
          email: "externo@medcol.com",
          role: "externo",
          position: "Consultor Externo",
        }
        setUser(userData)
        Cookies.set("medcol-user", JSON.stringify(userData), { expires: 7 })
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error("Error de inicio de sesión:", error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    Cookies.remove("medcol-user")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}

