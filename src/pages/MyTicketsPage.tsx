"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus } from "lucide-react"
import { useTickets } from "../contexts/TicketContext"
import TicketList from "../components/Tickets/TicketList"
import type { Chamado } from "../types"

const MyTicketsPage: React.FC = () => {
  const { getMyTickets, loading } = useTickets()
  const [myTickets, setMyTickets] = useState<Chamado[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMyTickets = async () => {
      setIsLoading(true)
      const tickets = await getMyTickets()
      setMyTickets(tickets)
      setIsLoading(false)
    }

    fetchMyTickets()
  }, [getMyTickets])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Meus Chamados</h1>
          <p className="mt-1 text-sm text-gray-500">Visualize e gerencie os chamados que você abriu</p>
        </div>

        <Link
          to="/tickets/new"
          className="mt-2 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Chamado
        </Link>
      </div>

      <TicketList tickets={myTickets} loading={isLoading || loading} />
    </div>
  )
}

export default MyTicketsPage
