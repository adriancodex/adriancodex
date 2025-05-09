import type React from "react"
import { AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react"
import type { Chamado } from "../../types"

interface StatCardsProps {
  tickets: Chamado[]
}

const StatCards: React.FC<StatCardsProps> = ({ tickets }) => {
  const openTickets = tickets.filter((ticket) => ticket.status === "aberto").length
  const inProgressTickets = tickets.filter((ticket) => ticket.status === "em-andamento").length
  const resolvedTickets = tickets.filter((ticket) => ticket.status === "resolvido").length
  const closedTickets = tickets.filter((ticket) => ticket.status === "fechado").length

  // Calculate percentages for the progress bars
  const totalTickets = tickets.length
  const openPercentage = totalTickets ? Math.round((openTickets / totalTickets) * 100) : 0
  const inProgressPercentage = totalTickets ? Math.round((inProgressTickets / totalTickets) * 100) : 0
  const resolvedPercentage = totalTickets ? Math.round((resolvedTickets / totalTickets) * 100) : 0
  const closedPercentage = totalTickets ? Math.round((closedTickets / totalTickets) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Open Tickets */}
      <div className="bg-white overflow-hidden shadow rounded-lg transition-all hover:shadow-md">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4 w-full">
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg font-medium text-gray-900">Abertos</h3>
                <p className="text-2xl font-semibold text-gray-900">{openTickets}</p>
              </div>
              <div className="mt-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${openPercentage}%` }}></div>
                </div>
                <p className="mt-1 text-sm text-gray-500">{openPercentage}% do total</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* In Progress Tickets */}
      <div className="bg-white overflow-hidden shadow rounded-lg transition-all hover:shadow-md">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Loader2 className="h-8 w-8 text-amber-500" />
            </div>
            <div className="ml-4 w-full">
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg font-medium text-gray-900">Em Andamento</h3>
                <p className="text-2xl font-semibold text-gray-900">{inProgressTickets}</p>
              </div>
              <div className="mt-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${inProgressPercentage}%` }}></div>
                </div>
                <p className="mt-1 text-sm text-gray-500">{inProgressPercentage}% do total</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resolved Tickets */}
      <div className="bg-white overflow-hidden shadow rounded-lg transition-all hover:shadow-md">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4 w-full">
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg font-medium text-gray-900">Resolvidos</h3>
                <p className="text-2xl font-semibold text-gray-900">{resolvedTickets}</p>
              </div>
              <div className="mt-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${resolvedPercentage}%` }}></div>
                </div>
                <p className="mt-1 text-sm text-gray-500">{resolvedPercentage}% do total</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Closed Tickets */}
      <div className="bg-white overflow-hidden shadow rounded-lg transition-all hover:shadow-md">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-gray-500" />
            </div>
            <div className="ml-4 w-full">
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg font-medium text-gray-900">Fechados</h3>
                <p className="text-2xl font-semibold text-gray-900">{closedTickets}</p>
              </div>
              <div className="mt-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-500 h-2 rounded-full" style={{ width: `${closedPercentage}%` }}></div>
                </div>
                <p className="mt-1 text-sm text-gray-500">{closedPercentage}% do total</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatCards
