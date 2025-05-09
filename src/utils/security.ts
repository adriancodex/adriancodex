import crypto from "crypto"

// Função para gerar um token seguro
export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString("hex")
}

// Função para validar entrada de texto
export function sanitizeInput(input: string): string {
  if (!input) return ""

  // Remover tags HTML
  const withoutTags = input.replace(/<[^>]*>/g, "")

  // Remover caracteres potencialmente perigosos
  return withoutTags.replace(/['";\\]/g, "")
}

// Função para validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Função para validar força da senha
export function validatePasswordStrength(password: string): {
  isValid: boolean
  message: string
} {
  if (password.length < 8) {
    return {
      isValid: false,
      message: "A senha deve ter pelo menos 8 caracteres",
    }
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "A senha deve conter pelo menos uma letra maiúscula",
    }
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "A senha deve conter pelo menos um número",
    }
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return {
      isValid: false,
      message: "A senha deve conter pelo menos um caractere especial",
    }
  }

  return { isValid: true, message: "Senha válida" }
}

// Função para verificar se uma string contém SQL Injection
export function containsSQLInjection(input: string): boolean {
  const sqlInjectionRegex = /('|"|;|--|\/\*|\*\/|=|drop|select|insert|delete|update|create|alter)/i
  return sqlInjectionRegex.test(input)
}

// Função para verificar se uma string contém XSS
export function containsXSS(input: string): boolean {
  const xssRegex = /<script|javascript:|on\w+\s*=|alert\s*\(|eval\s*\(|expression\s*\(|document\.cookie/i
  return xssRegex.test(input)
}

// Função para verificar se uma string contém comandos de shell
export function containsShellCommands(input: string): boolean {
  const shellRegex = /(\||;|&|`|\$\(|\$\{|\/bin\/|\/etc\/|\/usr\/|chmod|chown|rm|mv|cp|cat|echo|exec|eval|wget|curl)/i
  return shellRegex.test(input)
}

// Função para verificar se uma entrada é segura
export function isSecureInput(input: string): boolean {
  if (!input) return true

  return !(containsSQLInjection(input) || containsXSS(input) || containsShellCommands(input))
}
