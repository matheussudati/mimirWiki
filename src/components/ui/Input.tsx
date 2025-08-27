import styled, { css } from "styled-components";

// Exportar MaskedInput também
export { MaskedInput } from "./MaskedInput";

interface InputProps {
  error?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

const getSizeStyles = (size: InputProps["size"]) => {
  switch (size) {
    case "sm":
      return css`
        padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
        font-size: 0.875rem;
      `;
    case "lg":
      return css`
        padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
        font-size: 1.125rem;
      `;
    default:
      return css`
        padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
        font-size: 1rem;
      `;
  }
};

export const Input = styled.input<InputProps>`
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  border: 2px solid
    ${({ theme, error }) =>
      error ? theme.colors.error[500] : theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all ${({ theme }) => theme.transitions.default};

  ${({ size = "md" }) => getSizeStyles(size as "sm" | "md" | "lg")}

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }

  /* Remove ícones nativos do browser para campos de senha */
  &::-ms-reveal,
  &::-ms-clear {
    display: none;
  }

  &::-webkit-credentials-auto-fill-button,
  &::-webkit-strong-password-auto-fill-button {
    display: none !important;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme, error }) =>
      error ? theme.colors.error[500] : theme.colors.primary[500]};
    box-shadow: 0 0 0 3px
      ${({ theme, error }) =>
        error ? theme.colors.error[50] : theme.colors.primary[50]};
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
    color: ${({ theme }) => theme.colors.text.muted};
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme, error }) =>
      error ? theme.colors.error[600] : theme.colors.border.accent};
  }
`;

export const TextArea = styled.textarea<InputProps>`
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  border: 2px solid
    ${({ theme, error }) =>
      error ? theme.colors.error[500] : theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all ${({ theme }) => theme.transitions.default};
  resize: vertical;
  min-height: 100px;

  ${({ size = "md" }) => getSizeStyles(size as "sm" | "md" | "lg")}

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme, error }) =>
      error ? theme.colors.error[500] : theme.colors.primary[500]};
    box-shadow: 0 0 0 3px
      ${({ theme, error }) =>
        error ? theme.colors.error[50] : theme.colors.primary[50]};
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
    color: ${({ theme }) => theme.colors.text.muted};
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme, error }) =>
      error ? theme.colors.error[600] : theme.colors.border.accent};
  }
`;
