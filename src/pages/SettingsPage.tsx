"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Bell, Moon, Sun, User, Lock, Globe, Save, X } from "lucide-react"
import { atualizarUsuario, alterarSenha } from "../services/usuarioService"

const SettingsPage: React.FC = () => {
  const { currentUser } = useAuth()

  const [activeTab, setActiveTab] = useState("perfil")
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Perfil do usuário
  const [profileForm, setProfileForm] = useState({
    nome: currentUser?.nome || "",
    email: currentUser?.email || "",
    telefone: currentUser?.telefone || "",
    departamento: currentUser?.departamento || "",
  })

  // Preferências de notificação
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    pushNotifications: true,
    ticketUpdates: true,
    ticketComments: true,
    ticketAssigned: true,
    systemAnnouncements: false,
  })

  // Configurações de aparência
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    fontSize: "medium",
    language: "pt-BR",
  })

  // Alteração de senha
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Atualizar formulário quando o usuário mudar
  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        nome: currentUser.nome || "",
        email: currentUser.email || "",
        telefone: currentUser.telefone || "",
        departamento: currentUser.departamento || "",
      })
    }
  }, [currentUser])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setNotificationPrefs((prev) => ({ ...prev, [name]: checked }))
  }

  const handleAppearanceChange = (name: string, value: string) => {
    setAppearanceSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) {
      setSaveMessage({ type: "error", text: "Você precisa estar logado para salvar as configurações." })
      return
    }

    try {
      setIsSubmitting(true)

      // Atualizar perfil do usuário
      await atualizarUsuario(currentUser.id, {
        nome: profileForm.nome,
        telefone: profileForm.telefone,
        departamento: profileForm.departamento,
      })

      setSaveMessage({ type: "success", text: "Configurações salvas com sucesso!" })

      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        setSaveMessage(null)
      }, 3000)
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
      setSaveMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Erro ao salvar configurações.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) {
      setSaveMessage({ type: "error", text: "Você precisa estar logado para alterar a senha." })
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSaveMessage({ type: "error", text: "As senhas não coincidem." })
      return
    }

    if (passwordForm.newPassword.length < 8) {
      setSaveMessage({ type: "error", text: "A senha deve ter pelo menos 8 caracteres." })
      return
    }

    if (!/[A-Z]/.test(passwordForm.newPassword)) {
      setSaveMessage({ type: "error", text: "A senha deve conter pelo menos uma letra maiúscula." })
      return
    }

    if (!/[0-9]/.test(passwordForm.newPassword)) {
      setSaveMessage({ type: "error", text: "A senha deve conter pelo menos um número." })
      return
    }

    if (!/[^A-Za-z0-9]/.test(passwordForm.newPassword)) {
      setSaveMessage({ type: "error", text: "A senha deve conter pelo menos um caractere especial." })
      return
    }

    try {
      setIsSubmitting(true)

      // Alterar senha
      const success = await alterarSenha(currentUser.id, passwordForm.currentPassword, passwordForm.newPassword)

      if (success) {
        setSaveMessage({ type: "success", text: "Senha alterada com sucesso!" })
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        setSaveMessage({ type: "error", text: "Senha atual incorreta." })
      }

      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        setSaveMessage(null)
      }, 3000)
    } catch (error) {
      console.error("Erro ao alterar senha:", error)
      setSaveMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Erro ao alterar senha.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Configurações</h1>
        <p className="mt-1 text-sm text-gray-500">Gerencie suas preferências e configurações da conta</p>
      </div>

      {saveMessage && (
        <div
          className={`p-4 rounded-md flex items-start justify-between ${
            saveMessage.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          <p>{saveMessage.text}</p>
          <button onClick={() => setSaveMessage(null)}>
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="sm:flex sm:divide-x sm:divide-gray-200">
          {/* Sidebar de navegação */}
          <aside className="py-6 sm:w-64 sm:flex-shrink-0 border-b sm:border-b-0 border-gray-200">
            <nav className="space-y-1 px-4">
              <button
                onClick={() => setActiveTab("perfil")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "perfil"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <User className="mr-3 h-5 w-5 text-gray-500" />
                Perfil do Usuário
              </button>

              <button
                onClick={() => setActiveTab("notificacoes")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "notificacoes"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Bell className="mr-3 h-5 w-5 text-gray-500" />
                Notificações
              </button>

              <button
                onClick={() => setActiveTab("aparencia")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "aparencia"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Sun className="mr-3 h-5 w-5 text-gray-500" />
                Aparência
              </button>

              <button
                onClick={() => setActiveTab("senha")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "senha"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Lock className="mr-3 h-5 w-5 text-gray-500" />
                Alterar Senha
              </button>
            </nav>
          </aside>

          {/* Conteúdo principal */}
          <div className="flex-1 p-6">
            {/* Perfil do Usuário */}
            {activeTab === "perfil" && (
              <form onSubmit={handleSaveSettings}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Perfil do Usuário</h3>
                    <p className="mt-1 text-sm text-gray-500">Atualize suas informações pessoais e de contato.</p>
                  </div>

                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {currentUser?.avatar ? (
                        <img
                          className="h-16 w-16 rounded-full object-cover"
                          src={currentUser.avatar || "/placeholder.svg"}
                          alt={currentUser.nome}
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl">
                          {currentUser?.nome.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="ml-5">
                      <button
                        type="button"
                        className="px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Alterar foto
                      </button>
                      <p className="mt-1 text-xs text-gray-500">JPG, GIF ou PNG. Máximo de 2MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                        Nome completo
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="nome"
                          id="nome"
                          value={profileForm.nome}
                          onChange={handleProfileChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={profileForm.email}
                          disabled
                          className="shadow-sm bg-gray-100 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                        <p className="mt-1 text-xs text-gray-500">O email não pode ser alterado.</p>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
                        Telefone
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="telefone"
                          id="telefone"
                          value={profileForm.telefone}
                          onChange={handleProfileChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="departamento" className="block text-sm font-medium text-gray-700">
                        Departamento
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="departamento"
                          id="departamento"
                          value={profileForm.departamento}
                          onChange={handleProfileChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Salvando..." : "Salvar alterações"}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Notificações */}
            {activeTab === "notificacoes" && (
              <form onSubmit={handleSaveSettings}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Preferências de Notificação</h3>
                    <p className="mt-1 text-sm text-gray-500">Escolha como e quando deseja receber notificações.</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Canais de notificação</h4>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="emailNotifications"
                              name="emailNotifications"
                              type="checkbox"
                              checked={notificationPrefs.emailNotifications}
                              onChange={handleNotificationChange}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                              Notificações por email
                            </label>
                            <p className="text-gray-500">Receba atualizações por email.</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="pushNotifications"
                              name="pushNotifications"
                              type="checkbox"
                              checked={notificationPrefs.pushNotifications}
                              onChange={handleNotificationChange}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="pushNotifications" className="font-medium text-gray-700">
                              Notificações push
                            </label>
                            <p className="text-gray-500">Receba notificações no navegador.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Tipos de notificação</h4>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="ticketUpdates"
                              name="ticketUpdates"
                              type="checkbox"
                              checked={notificationPrefs.ticketUpdates}
                              onChange={handleNotificationChange}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="ticketUpdates" className="font-medium text-gray-700">
                              Atualizações de chamados
                            </label>
                            <p className="text-gray-500">Quando um chamado mudar de status.</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="ticketComments"
                              name="ticketComments"
                              type="checkbox"
                              checked={notificationPrefs.ticketComments}
                              onChange={handleNotificationChange}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="ticketComments" className="font-medium text-gray-700">
                              Comentários em chamados
                            </label>
                            <p className="text-gray-500">Quando alguém comentar em um chamado seu.</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="ticketAssigned"
                              name="ticketAssigned"
                              type="checkbox"
                              checked={notificationPrefs.ticketAssigned}
                              onChange={handleNotificationChange}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="ticketAssigned" className="font-medium text-gray-700">
                              Chamados atribuídos
                            </label>
                            <p className="text-gray-500">Quando um chamado for atribuído a você.</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="systemAnnouncements"
                              name="systemAnnouncements"
                              type="checkbox"
                              checked={notificationPrefs.systemAnnouncements}
                              onChange={handleNotificationChange}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="systemAnnouncements" className="font-medium text-gray-700">
                              Anúncios do sistema
                            </label>
                            <p className="text-gray-500">Atualizações e novidades sobre o sistema.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Salvando..." : "Salvar alterações"}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Aparência */}
            {activeTab === "aparencia" && (
              <form onSubmit={handleSaveSettings}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Aparência</h3>
                    <p className="mt-1 text-sm text-gray-500">Personalize a aparência do sistema.</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Tema</h4>
                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div
                          className={`relative rounded-lg border ${
                            appearanceSettings.theme === "light"
                              ? "border-blue-500 ring-2 ring-blue-500"
                              : "border-gray-300"
                          } p-4 flex cursor-pointer focus:outline-none`}
                          onClick={() => handleAppearanceChange("theme", "light")}
                        >
                          <div className="flex items-center justify-center w-full">
                            <div className="flex items-center">
                              <div className="text-sm">
                                <p className="font-medium text-gray-900 flex items-center">
                                  <Sun className="mr-2 h-5 w-5 text-gray-500" />
                                  Claro
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`relative rounded-lg border ${
                            appearanceSettings.theme === "dark"
                              ? "border-blue-500 ring-2 ring-blue-500"
                              : "border-gray-300"
                          } p-4 flex cursor-pointer focus:outline-none`}
                          onClick={() => handleAppearanceChange("theme", "dark")}
                        >
                          <div className="flex items-center justify-center w-full">
                            <div className="flex items-center">
                              <div className="text-sm">
                                <p className="font-medium text-gray-900 flex items-center">
                                  <Moon className="mr-2 h-5 w-5 text-gray-500" />
                                  Escuro
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`relative rounded-lg border ${
                            appearanceSettings.theme === "system"
                              ? "border-blue-500 ring-2 ring-blue-500"
                              : "border-gray-300"
                          } p-4 flex cursor-pointer focus:outline-none`}
                          onClick={() => handleAppearanceChange("theme", "system")}
                        >
                          <div className="flex items-center justify-center w-full">
                            <div className="flex items-center">
                              <div className="text-sm">
                                <p className="font-medium text-gray-900">Sistema</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Tamanho da fonte</h4>
                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div
                          className={`relative rounded-lg border ${
                            appearanceSettings.fontSize === "small"
                              ? "border-blue-500 ring-2 ring-blue-500"
                              : "border-gray-300"
                          } p-4 flex cursor-pointer focus:outline-none`}
                          onClick={() => handleAppearanceChange("fontSize", "small")}
                        >
                          <div className="flex items-center justify-center w-full">
                            <div className="text-sm">
                              <p className="font-medium text-gray-900">Pequeno</p>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`relative rounded-lg border ${
                            appearanceSettings.fontSize === "medium"
                              ? "border-blue-500 ring-2 ring-blue-500"
                              : "border-gray-300"
                          } p-4 flex cursor-pointer focus:outline-none`}
                          onClick={() => handleAppearanceChange("fontSize", "medium")}
                        >
                          <div className="flex items-center justify-center w-full">
                            <div className="text-sm">
                              <p className="font-medium text-gray-900">Médio</p>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`relative rounded-lg border ${
                            appearanceSettings.fontSize === "large"
                              ? "border-blue-500 ring-2 ring-blue-500"
                              : "border-gray-300"
                          } p-4 flex cursor-pointer focus:outline-none`}
                          onClick={() => handleAppearanceChange("fontSize", "large")}
                        >
                          <div className="flex items-center justify-center w-full">
                            <div className="text-sm">
                              <p className="font-medium text-gray-900">Grande</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Idioma</h4>
                      <div className="mt-4">
                        <div className="flex items-center">
                          <div
                            className={`relative rounded-lg border ${
                              appearanceSettings.language === "pt-BR"
                                ? "border-blue-500 ring-2 ring-blue-500"
                                : "border-gray-300"
                            } p-4 flex cursor-pointer focus:outline-none w-full sm:w-64`}
                            onClick={() => handleAppearanceChange("language", "pt-BR")}
                          >
                            <div className="flex items-center w-full">
                              <Globe className="h-5 w-5 text-gray-500 mr-2" />
                              <div className="text-sm">
                                <p className="font-medium text-gray-900">Português (Brasil)</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Salvando..." : "Salvar alterações"}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Alterar Senha */}
            {activeTab === "senha" && (
              <form onSubmit={handleSavePassword}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Alterar Senha</h3>
                    <p className="mt-1 text-sm text-gray-500">Atualize sua senha para manter sua conta segura.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Senha atual
                      </label>
                      <div className="mt-1">
                        <input
                          type="password"
                          name="currentPassword"
                          id="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        Nova senha
                      </label>
                      <div className="mt-1">
                        <input
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirmar nova senha
                      </label>
                      <div className="mt-1">
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="text-sm text-gray-500">
                      <p>
                        A senha deve ter pelo menos 8 caracteres e incluir letras maiúsculas, números e caracteres
                        especiais.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Alterando..." : "Alterar senha"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
