"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { AlertCircle, Plus } from "lucide-react"
import { useTickets } from "../contexts/TicketContext"
import { useAuth } from "../contexts/AuthContext"
import StatCards from "../components/Dashboard/StatCards"
import CategoryChart from "../components/Dashboard/CategoryChart"
import RecentTickets from "../components/Dashboard/RecentTickets"
import type { Chamado } from "../types"

const Dashboard: React.FC = () => {
  const { tickets, loading, getMyTickets, getAssignedTickets } = useTickets()
  const { currentUser } = useAuth()
  const [myTickets, setMyTickets] = useState<Chamado[]>([])
  const [assignedTickets, setAssignedTickets] = useState<Chamado[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const isAdmin = currentUser?.cargo === "admin"
  const isSupport = currentUser?.cargo === "suporte" || isAdmin

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      // Buscar meus chamados e chamados atribuídos
      const [myTicketsData, assignedTicketsData] = await Promise.all([
        getMyTickets(),
        isSupport ? getAssignedTickets() : Promise.resolve([]),
      ])

      setMyTickets(myTicketsData)
      setAssignedTickets(assignedTicketsData)
      setIsLoading(false)
    }

    fetchData()
  }, [getMyTickets, getAssignedTickets, isSupport])

  // Calcular chamados urgentes (abertos + prioridade alta/crítica)
  const urgentTickets = tickets.filter(
    (ticket) => ticket.status === "aberto" && (ticket.prioridade === "alta" || ticket.prioridade === "critica"),
  )

  // Calcular chamados não atribuídos
  const unassignedTickets = tickets.filter((ticket) => !ticket.atribuidoPara && ticket.status !== "fechado")

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Painel de Controle</h1>
          <p className="mt-1 text-sm text-gray-500">Bem-vindo, {currentUser?.nome}</p>
        </div>

        <Link
          to="/tickets/new"
          className="mt-2 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Chamado
        </Link>
      </div>

      {loading || isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      ) : (
        <>
          {/* Estatísticas de Chamados */}
          <StatCards tickets={tickets} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gráficos */}
            <div className="lg:col-span-2">
              <CategoryChart tickets={tickets} />
            </div>

            {/* Alertas */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Alertas</h3>
                </div>

                <div className="p-5 space-y-4">
                  {urgentTickets.length > 0 && (
                    <div className="flex items-start p-3 bg-red-50 rounded-md border border-red-100">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">
                          {urgentTickets.length} {urgentTickets.length === 1 ? "chamado urgente" : "chamados urgentes"}{" "}
                          requerem atenção
                        </p>
                        <p className="mt-1 text-sm text-red-700">Chamados de alta prioridade que ainda estão abertos</p>
                      </div>
                    </div>
                  )}

                  {isSupport && unassignedTickets.length > 0 && (
                    <div className="flex items-start p-3 bg-amber-50 rounded-md border border-amber-100">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-amber-800">
                          {unassignedTickets.length} {unassignedTickets.length === 1 ? "chamado" : "chamados"} não
                          atribuídos
                        </p>
                        <p className="mt-1 text-sm text-amber-700">
                          Chamados que ainda não foram atribuídos a um agente de suporte
                        </p>
                      </div>
                    </div>
                  )}

                  {isSupport && assignedTickets.length > 0 && (
                    <div className="flex items-start p-3 bg-blue-50 rounded-md border border-blue-100">
                      <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-800">
                          {assignedTickets.length}{" "}
                          {assignedTickets.length === 1 ? "chamado atribuído" : "chamados atribuídos"} a você
                        </p>
                        <p className="mt-1 text-sm text-blue-700">Verifique seus chamados atribuídos</p>
                      </div>
                    </div>
                  )}

                  {!isSupport && myTickets.length > 0 && (
                    <div className="flex items-start p-3 bg-blue-50 rounded-md border border-blue-100">
                      <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-800">
                          Você tem {myTickets.length} {myTickets.length === 1 ? "chamado" : "chamados"}
                        </p>
                        <p className="mt-1 text-sm text-blue-700">Verifique o status dos seus chamados</p>
                      </div>
                    </div>
                  )}

                  {/* Mostrar isso se não houver alertas */}
                  {urgentTickets.length === 0 &&
                    unassignedTickets.length === 0 &&
                    (isSupport ? assignedTickets.length === 0 : myTickets.length === 0) && (
                      <div className="flex items-start p-3 bg-green-50 rounded-md border border-green-100">
                        <AlertCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-800">Tudo em ordem!</p>
                          <p className="mt-1 text-sm text-green-700">
                            Não há problemas urgentes que precisem da sua atenção.
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Chamados Recentes */}
          <RecentTickets tickets={tickets} />
        </>
      )}
    </div>
  )
}

export default Dashboard
