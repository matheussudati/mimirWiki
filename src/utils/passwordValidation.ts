// Utilitários para validação de senha

export interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

export const passwordRequirements: Omit<PasswordRequirement, "met">[] = [
  {
    id: "length",
    label: "Mínimo 8 caracteres",
    test: (password: string) => password.length >= 8,
  },
  {
    id: "uppercase",
    label: "Uma letra maiúscula",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "Uma letra minúscula",
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "Um número",
    test: (password: string) => /\d/.test(password),
  },
  {
    id: "special",
    label: "Um caractere especial",
    test: (password: string) =>
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  },
];

export const validatePassword = (password: string): PasswordRequirement[] => {
  return passwordRequirements.map((requirement) => ({
    ...requirement,
    met: requirement.test(password),
  }));
};

export const getPasswordStrength = (
  password: string
): {
  score: number;
  level: "very-weak" | "weak" | "fair" | "good" | "strong";
  color: string;
} => {
  const requirements = validatePassword(password);
  const metRequirements = requirements.filter((req) => req.met).length;

  let level: "very-weak" | "weak" | "fair" | "good" | "strong";
  let color: string;

  if (metRequirements === 0) {
    level = "very-weak";
    color = "#ef4444"; // red-500
  } else if (metRequirements <= 1) {
    level = "weak";
    color = "#f97316"; // orange-500
  } else if (metRequirements <= 2) {
    level = "fair";
    color = "#eab308"; // yellow-500
  } else if (metRequirements <= 3) {
    level = "good";
    color = "#22c55e"; // green-500
  } else {
    level = "strong";
    color = "#16a34a"; // green-600
  }

  return {
    score: metRequirements,
    level,
    color,
  };
};

export const isPasswordValid = (password: string): boolean => {
  const requirements = validatePassword(password);
  return requirements.every((req) => req.met);
};
