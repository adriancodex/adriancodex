"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Chamado, Comentario } from "../types"
import {
  listarChamados,
  criarChamado,
  atualizarStatusChamado,
  atribuirChamado,
  adicionarComentario,
  buscarChamadosPorCriador,
  buscarChamadosAtribuidos,
} from "../services/chamadoService"
import { useAuth } from "./AuthContext"

interface TicketContextType {
  tickets: Chamado[]
  loading: boolean
  error: string | null
  getTicket: (id: string) => Chamado | undefined
  createTicket: (ticket: Omit<Chamado, "id" | "comentarios" | "dataCriacao" | "dataAtualizacao">) => Promise<Chamado>
  updateTicketStatus: (id: string, status: Chamado["status"]) => Promise<Chamado | undefined>
  assignTicket: (id: string, userId: string) => Promise<Chamado | undefined>
  addTicketComment: (ticketId: string, comment: Omit<Comentario, "id" | "dataCriacao">) => Promise<Comentario>
  refreshTickets: () => Promise<void>
  getMyTickets: () => Promise<Chamado[]>
  getAssignedTickets: () => Promise<Chamado[]>
}

const TicketContext = createContext<TicketContextType>({
  tickets: [],
  loading: false,
  error: null,
  getTicket: () => undefined,
  createTicket: () => Promise.resolve({} as Chamado),
  updateTicketStatus: () => Promise.resolve(undefined),
  assignTicket: () => Promise.resolve(undefined),
  addTicketComment: () => Promise.resolve({} as Comentario),
  refreshTickets: () => Promise.resolve(),
  getMyTickets: () => Promise.resolve([]),
  getAssignedTickets: () => Promise.resolve([]),
})

export const useTickets = () => useContext(TicketContext)

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Chamado[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { currentUser } = useAuth()

  // Carregar chamados iniciais
  useEffect(() => {
    refreshTickets()
  }, [])

  const refreshTickets = async (): Promise<void> => {
    try {
      setLoading(true)
      const chamados = await listarChamados()
      setTickets(chamados)
      setError(null)
    } catch (err) {
      console.error("Erro ao carregar chamados:", err)
      setError("Falha ao carregar chamados")
    } finally {
      setLoading(false)
    }
  }

  const getMyTickets = async (): Promise<Chamado[]> => {
    if (!currentUser) return []

    try {
      const meusChamados = await buscarChamadosPorCriador(currentUser.id)
      return meusChamados
    } catch (err) {
      console.error("Erro ao buscar meus chamados:", err)
      setError("Falha ao buscar seus chamados")
      return []
    }
  }

  const getAssignedTickets = async (): Promise<Chamado[]> => {
    if (!currentUser) return []

    try {
      const chamadosAtribuidos = await buscarChamadosAtribuidos(currentUser.id)
      return chamadosAtribuidos
    } catch (err) {
      console.error("Erro ao buscar chamados atribuídos:", err)
      setError("Falha ao buscar chamados atribuídos")
      return []
    }
  }

  const getTicket = (id: string): Chamado | undefined => {
    return tickets.find((ticket) => ticket.id === id)
  }

  const createTicket = async (
    ticketData: Omit<Chamado, "id" | "comentarios" | "dataCriacao" | "dataAtualizacao">,
  ): Promise<Chamado> => {
    try {
      const newTicket = await criarChamado(ticketData)
      setTickets((prev) => [...prev, newTicket])
      return newTicket
    } catch (err) {
      console.error("Erro ao criar chamado:", err)
      setError("Falha ao criar chamado")
      throw new Error("Falha ao criar chamado")
    }
  }

  const updateTicketStatus = async (id: string, status: Chamado["status"]): Promise<Chamado | undefined> => {
    try {
      if (!currentUser) {
        throw new Error("Usuário não autenticado")
      }

      const updatedTicket = await atualizarStatusChamado(id, status, currentUser.id)

      if (updatedTicket) {
        setTickets((prev) => prev.map((ticket) => (ticket.id === id ? updatedTicket : ticket)))
      }

      return updatedTicket
    } catch (err) {
      console.error("Erro ao atualizar status do chamado:", err)
      setError("Falha ao atualizar status do chamado")
      return undefined
    }
  }

  const assignTicket = async (id: string, userId: string): Promise<Chamado | undefined> => {
    try {
      if (!currentUser) {
        throw new Error("Usuário não autenticado")
      }

      const updatedTicket = await atribuirChamado(id, userId, currentUser.id)

      if (updatedTicket) {
        setTickets((prev) => prev.map((ticket) => (ticket.id === id ? updatedTicket : ticket)))
      }

      return updatedTicket
    } catch (err) {
      console.error("Erro ao atribuir chamado:", err)
      setError("Falha ao atribuir chamado")
      return undefined
    }
  }

  const addTicketComment = async (
    ticketId: string,
    commentData: Omit<Comentario, "id" | "dataCriacao">,
  ): Promise<Comentario> => {
    try {
      const newComment = await adicionarComentario({
        chamadoId: ticketId,
        usuarioId: commentData.usuarioId,
        conteudo: commentData.conteudo,
      })

      // Atualizar o estado dos chamados para incluir o novo comentário
      setTickets((prev) =>
        prev.map((ticket) => {
          if (ticket.id === ticketId) {
            return {
              ...ticket,
              comentarios: [...ticket.comentarios, newComment],
              dataAtualizacao: new Date().toISOString(),
            }
          }
          return ticket
        }),
      )

      return newComment
    } catch (err) {
      console.error("Erro ao adicionar comentário:", err)
      setError("Falha ao adicionar comentário")
      throw new Error("Falha ao adicionar comentário")
    }
  }

  return (
    <TicketContext.Provider
      value={{
        tickets,
        loading,
        error,
        getTicket,
        createTicket,
        updateTicketStatus,
        assignTicket,
        addTicketComment,
        refreshTickets,
        getMyTickets,
        getAssignedTickets,
      }}
    >
      {children}
    </TicketContext.Provider>
  )
}
