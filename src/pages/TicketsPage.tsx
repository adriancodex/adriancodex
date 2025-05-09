import type React from "react"
import { Link } from "react-router-dom"
import { Plus } from "lucide-react"
import { useTickets } from "../contexts/TicketContext"
import TicketList from "../components/Tickets/TicketList"

const TicketsPage: React.FC = () => {
  const { tickets, loading } = useTickets()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Todos Chamados</h1>
          <p className="mt-1 text-sm text-gray-500">Clique no chamado desejado para mais informações</p>
        </div>

        <Link
          to="/tickets/new"
          className="mt-2 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Chamado
        </Link>
      </div>

      <TicketList tickets={tickets} loading={loading} />
    </div>
  )
}

export default TicketsPage
