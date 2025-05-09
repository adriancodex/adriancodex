"use client"

import type React from "react"
import { NavLink } from "react-router-dom"
import { LayoutDashboard, Ticket, Plus, Users, Settings, Clock, ChevronRight, BarChart3 } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

interface SidebarProps {
  isOpen: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.role === "admin"
  const isSupport = currentUser?.role === "support" || isAdmin

  return (
    <div
      className={`fixed inset-y-0 left-0 transform bg-white border-r border-gray-200 z-30 w-64 transition duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:static md:h-screen`}
    >
      <div className="h-full flex flex-col overflow-y-auto">
        <div className="flex-shrink-0 h-16 flex items-center px-4 border-b border-gray-200 md:hidden">
          <span className="text-lg font-semibold">HelpDesk</span>
        </div>

        <nav className="mt-5 flex-1 px-2 space-y-1">
          {/* Main Navigation */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <LayoutDashboard className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-500" />
            Início
          </NavLink>

          <NavLink
            to="/tickets"
            className={({ isActive }) =>
              `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <Ticket className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-500" />
            Todos Chamados
          </NavLink>

          <NavLink
            to="/tickets/new"
            className={({ isActive }) =>
              `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <Plus className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-500" />
            Abrir chamado
          </NavLink>

          <NavLink
            to="/my-tickets"
            className={({ isActive }) =>
              `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <Clock className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-500" />
            Meus chamados
          </NavLink>

          {/* Support/Admin Only Links */}
          {isSupport && (
            <>
              <div className="pt-4 pb-2">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gerenciamento</h2>
              </div>

              <NavLink
                to="/assigned"
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <ChevronRight className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-500" />
                Para você
              </NavLink>
            </>
          )}

          {/* Admin Only Links */}
          {isAdmin && (
            <>
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <Users className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-500" />
                Usuários
              </NavLink>

              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <BarChart3 className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-500" />
                Reports
              </NavLink>

              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <Settings className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-500" />
                Configurações
              </NavLink>
            </>
          )}
        </nav>

        {/* User Info Footer */}
        {currentUser && (
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                {currentUser.avatar ? (
                  <div>
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={currentUser.avatar}
                      alt={currentUser.name}
                    />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{currentUser.name}</p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 capitalize">
                    {currentUser.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
