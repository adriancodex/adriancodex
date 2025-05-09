"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTickets } from "../contexts/TicketContext"
import TicketList from "../components/Tickets/TicketList"
import type { Chamado } from "../types"

const AssignedTicketsPage: React.FC = () => {
  const { getAssignedTickets, loading } = useTickets()
  const [assignedTickets, setAssignedTickets] = useState<Chamado[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAssignedTickets = async () => {
      setIsLoading(true)
      const tickets = await getAssignedTickets()
      setAssignedTickets(tickets)
      setIsLoading(false)
    }

    fetchAssignedTickets()
  }, [getAssignedTickets])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Para você</h1>
        <p className="mt-1 text-sm text-gray-500">
          Esses chamados foram designados para você, dê seu melhor para resolvê-los!
        </p>
      </div>

      <TicketList tickets={assignedTickets} loading={isLoading || loading} />
    </div>
  )
}

export default AssignedTicketsPage
