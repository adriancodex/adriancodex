"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Menu, X, Bell, User, LogOut, Flame } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

interface HeaderProps {
  toggleSidebar: () => void
  isSidebarOpen: boolean
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen)
    if (notificationsOpen) setNotificationsOpen(false)
  }

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen)
    if (userMenuOpen) setUserMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-sm z-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button onClick={toggleSidebar} className="px-2 text-gray-500 md:hidden" aria-label="Alternar menu lateral">
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <Flame className="h-8 w-8 text-red-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">Fire Soluções</span>
              </Link>
            </div>
          </div>

          {currentUser && (
            <div className="flex items-center">
              <div className="relative mr-4">
                <button
                  onClick={toggleNotifications}
                  className="relative p-1 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Notificações"
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                </button>

                {notificationsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <div className="px-4 py-2 text-sm text-gray-700 bg-gray-50">
                        <p className="font-medium">Notificações</p>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        <div className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                          <p className="text-sm font-medium text-gray-900">Novo comentário no chamado #1234</p>
                          <p className="text-xs text-gray-500">2 minutos atrás</p>
                        </div>
                        <div className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                          <p className="text-sm font-medium text-gray-900">
                            Status do chamado #5678 atualizado para "Em Andamento"
                          </p>
                          <p className="text-xs text-gray-500">1 hora atrás</p>
                        </div>
                        <div className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                          <p className="text-sm font-medium text-gray-900">Você foi designado para o chamado #9012</p>
                          <p className="text-xs text-gray-500">Ontem</p>
                        </div>
                      </div>
                      <div className="px-4 py-2 text-center text-sm text-red-600 hover:bg-gray-50">
                        <Link to="/notifications">Ver todas as notificações</Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Abrir menu do usuário</span>
                  {currentUser.avatar ? (
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={currentUser.avatar}
                      alt={currentUser.name}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                  <span className="ml-2 hidden md:block font-medium text-gray-700">{currentUser.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="mr-3 h-4 w-4 text-gray-500" />
                      Seu Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <LogOut className="mr-3 h-4 w-4 text-gray-500" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
