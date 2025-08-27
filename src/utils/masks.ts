// Utilitários para máscaras de input

export const masks = {
  // Máscara para CPF: 000.000.000-00
  cpf: (value: string): string => {
    return value
      .replace(/\D/g, "") // Remove caracteres não numéricos
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  },

  // Máscara para CNPJ: 00.000.000/0000-00
  cnpj: (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  },

  // Máscara para telefone: (00) 00000-0000
  phone: (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  },

  // Máscara para CEP: 00000-000
  cep: (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1");
  },

  // Máscara para data: 00/00/0000
  date: (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{4})\d+?$/, "$1");
  },

  // Máscara para hora: 00:00
  time: (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1:$2")
      .replace(/(:59)\d+?$/, "$1");
  },

  // Máscara para moeda: R$ 0.000,00
  currency: (value: string): string => {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = (parseInt(numericValue) / 100).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
    return formattedValue;
  },

  // Máscara para cartão de crédito: 0000 0000 0000 0000
  creditCard: (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{4})(\d)/, "$1 $2")
      .replace(/(\d{4})(\d)/, "$1 $2")
      .replace(/(\d{4})(\d)/, "$1 $2")
      .replace(/(\d{4})\d+?$/, "$1");
  },

  // Remove apenas caracteres especiais, mantém letras e números
  alphanumeric: (value: string): string => {
    return value.replace(/[^a-zA-Z0-9\s]/g, "");
  },

  // Apenas números
  numeric: (value: string): string => {
    return value.replace(/\D/g, "");
  },

  // Apenas letras
  alphabetic: (value: string): string => {
    return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
  },

  // Email rigoroso com validação em três partes: nome@dominio.extensao
  email: (value: string): string => {
    // Remove espaços e converte para minúsculo
    let cleaned = value.toLowerCase().trim();

    // Remove apenas caracteres realmente inválidos para email
    cleaned = cleaned.replace(/[^a-z0-9@._-]/g, "");

    // Garante apenas um @
    const atCount = (cleaned.match(/@/g) || []).length;
    if (atCount > 1) {
      const parts = cleaned.split("@");
      cleaned = parts[0] + "@" + parts.slice(1).join("");
    }

    // Retorna o valor limpo sem processar demais durante a digitação
    return cleaned.substring(0, 320); // Limite total para email
  },

  // URL básica
  url: (value: string): string => {
    return value.toLowerCase().trim();
  },
};

// Função para aplicar máscara
export const applyMask = (
  value: string,
  maskType: keyof typeof masks
): string => {
  if (!value) return "";
  return masks[maskType](value);
};

// Função para remover máscara (obter apenas valores)
export const removeMask = (value: string): string => {
  return value.replace(/\D/g, "");
};

// Validadores para campos com máscara
export const validators = {
  cpf: (value: string): boolean => {
    const cpf = removeMask(value);
    if (cpf.length !== 11) return false;

    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validar dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cpf.charAt(10));
  },

  cnpj: (value: string): boolean => {
    const cnpj = removeMask(value);
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnpj.charAt(i)) * weights1[i];
    }
    let remainder = sum % 11;
    const digit1 = remainder < 2 ? 0 : 11 - remainder;

    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cnpj.charAt(i)) * weights2[i];
    }
    remainder = sum % 11;
    const digit2 = remainder < 2 ? 0 : 11 - remainder;

    return (
      digit1 === parseInt(cnpj.charAt(12)) &&
      digit2 === parseInt(cnpj.charAt(13))
    );
  },

  cep: (value: string): boolean => {
    const cep = removeMask(value);
    return cep.length === 8;
  },

  phone: (value: string): boolean => {
    const phone = removeMask(value);
    return phone.length === 10 || phone.length === 11;
  },

  email: (value: string): boolean => {
    if (!value || typeof value !== "string") return false;

    // Validação básica de formato
    const basicRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!basicRegex.test(value)) return false;

    // Separar em partes
    const parts = value.split("@");
    if (parts.length !== 2) return false;

    const [localPart, domainPart] = parts;

    // Validar parte local (antes do @)
    if (localPart.length === 0 || localPart.length > 64) return false;
    if (localPart.startsWith(".") || localPart.endsWith(".")) return false;
    if (localPart.includes("..")) return false;
    if (!/^[a-z0-9._-]+$/i.test(localPart)) return false;

    // Validar domínio
    if (domainPart.length === 0 || domainPart.length > 253) return false;
    if (domainPart.startsWith(".") || domainPart.endsWith(".")) return false;
    if (domainPart.startsWith("-") || domainPart.endsWith("-")) return false;
    if (domainPart.includes("..") || domainPart.includes("--")) return false;

    // Verificar se tem pelo menos um ponto no domínio
    const domainParts = domainPart.split(".");
    if (domainParts.length < 2) return false;

    // Verificar cada parte do domínio
    for (const part of domainParts) {
      if (part.length === 0 || part.length > 63) return false;
      if (part.startsWith("-") || part.endsWith("-")) return false;
      if (!/^[a-z0-9-]+$/i.test(part)) return false;
    }

    // Verificar extensão (última parte)
    const extension = domainParts[domainParts.length - 1];
    if (extension.length < 2 || !/^[a-z]+$/i.test(extension)) return false;

    return true;
  },
};

// Função para validação detalhada de email com feedback
export const validateEmailDetailed = (value: string) => {
  const result = {
    isValid: false,
    hasLocalPart: false,
    hasAtSymbol: false,
    hasDomain: false,
    hasExtension: false,
    errors: [] as string[],
  };

  if (!value) {
    result.errors.push("Email é obrigatório");
    return result;
  }

  // Verificar parte local
  const atIndex = value.indexOf("@");
  if (atIndex === -1) {
    result.errors.push("Deve conter @");
    return result;
  }

  result.hasAtSymbol = true;

  const localPart = value.substring(0, atIndex);
  const domainPart = value.substring(atIndex + 1);

  // Validar parte local
  if (localPart.length === 0) {
    result.errors.push("Nome de usuário obrigatório");
  } else if (localPart.length > 64) {
    result.errors.push("Nome muito longo (máx. 64 caracteres)");
  } else if (localPart.startsWith(".") || localPart.endsWith(".")) {
    result.errors.push("Nome não pode começar ou terminar com ponto");
  } else if (localPart.includes("..")) {
    result.errors.push("Nome não pode ter pontos consecutivos");
  } else if (!/^[a-z0-9._-]+$/i.test(localPart)) {
    result.errors.push("Use apenas letras, números, pontos, _ e -");
  } else {
    result.hasLocalPart = true;
  }

  // Validar domínio
  if (domainPart.length === 0) {
    result.errors.push("Domínio obrigatório");
  } else if (!domainPart.includes(".")) {
    result.errors.push("Domínio deve ter extensão");
  } else {
    const domainParts = domainPart.split(".");

    if (domainParts.length >= 2) {
      result.hasDomain = true;

      // Verificar extensão
      const extension = domainParts[domainParts.length - 1];
      if (extension.length >= 2 && /^[a-z]+$/i.test(extension)) {
        result.hasExtension = true;
      } else {
        result.errors.push("Extensão inválida");
      }
    }
  }

  result.isValid =
    result.hasLocalPart &&
    result.hasAtSymbol &&
    result.hasDomain &&
    result.hasExtension &&
    result.errors.length === 0;

  return result;
};
