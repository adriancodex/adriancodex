"use client"

import type React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useTickets } from "../contexts/TicketContext"
import TicketDetail from "../components/Tickets/TicketDetail"

const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { tickets, loading } = useTickets()
  const navigate = useNavigate()

  const ticket = tickets.find((t) => t.id === id)

  const handleBack = () => {
    navigate(-1)
  }

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando detalhes do chamado...</p>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-gray-800">Chamado Não Encontrado</h2>
        <p className="mt-2 text-gray-600">O chamado que você está procurando não existe ou foi removido.</p>
        <button
          onClick={handleBack}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={handleBack}
          className="mr-4 inline-flex items-center p-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Voltar</span>
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Chamado #{id?.split("-")[1]}</h1>
          <p className="mt-1 text-sm text-gray-500">Visualizar e gerenciar detalhes do chamado</p>
        </div>
      </div>

      <TicketDetail ticket={ticket} />
    </div>
  )
}

export default TicketDetailPage
