import type React from "react"
import TicketForm from "../components/Tickets/TicketForm"

const NewTicketPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Create New Ticket</h1>
        <p className="mt-1 text-sm text-gray-500">Submit a new support request</p>
      </div>

      <TicketForm />
    </div>
  )
}

export default NewTicketPage
