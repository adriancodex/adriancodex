"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Usuario } from "../types"
import { verificarCredenciais, buscarUsuarioPorId } from "../services/usuarioService"

interface AuthContextType {
  currentUser: Usuario | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  login: () => Promise.resolve(false),
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  // Verificar usuário salvo no carregamento inicial
  useEffect(() => {
    const checkSavedUser = async () => {
      const savedUser = localStorage.getItem("currentUser")
      const sessionExpiry = localStorage.getItem("sessionExpiry")

      if (savedUser && sessionExpiry) {
        try {
          // Verificar se a sessão expirou
          if (Number(sessionExpiry) < Date.now()) {
            console.log("Sessão expirada, fazendo logout")
            localStorage.removeItem("currentUser")
            localStorage.removeItem("sessionExpiry")
            setLoading(false)
            return
          }

          const user = JSON.parse(savedUser)
          // Verificar se o usuário ainda existe no banco de dados
          const dbUser = await buscarUsuarioPorId(user.id)
          if (dbUser) {
            setCurrentUser(dbUser)
            setIsAuthenticated(true)

            // Renovar a sessão
            const newExpiry = Date.now() + 8 * 60 * 60 * 1000 // 8 horas
            localStorage.setItem("sessionExpiry", newExpiry.toString())
          } else {
            // Usuário não existe mais, fazer logout
            localStorage.removeItem("currentUser")
            localStorage.removeItem("sessionExpiry")
          }
        } catch (error) {
          console.error("Falha ao analisar usuário salvo", error)
          localStorage.removeItem("currentUser")
          localStorage.removeItem("sessionExpiry")
        }
      }
      setLoading(false)
    }

    checkSavedUser()

    // Verificar expiração da sessão a cada minuto
    const intervalId = setInterval(() => {
      const sessionExpiry = localStorage.getItem("sessionExpiry")
      if (sessionExpiry && Number(sessionExpiry) < Date.now()) {
        console.log("Sessão expirada, fazendo logout")
        logout()
      }
    }, 60000)

    return () => clearInterval(intervalId)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Verificar credenciais no banco de dados
      const user = await verificarCredenciais(email, password)

      if (user) {
        setCurrentUser(user)
        setIsAuthenticated(true)

        // Definir expiração da sessão (8 horas)
        const expiry = Date.now() + 8 * 60 * 60 * 1000
        localStorage.setItem("currentUser", JSON.stringify(user))
        localStorage.setItem("sessionExpiry", expiry.toString())

        return true
      }

      return false
    } catch (error) {
      console.error("Erro no login:", error)
      return false
    }
  }

  const logout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("currentUser")
    localStorage.removeItem("sessionExpiry")
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  return <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}
