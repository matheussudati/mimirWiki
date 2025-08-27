import React, { forwardRef, useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { applyMask, masks } from "../../utils/masks";

interface MaskedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  error?: boolean;
  fullWidth?: boolean;
  inputSize?: "sm" | "md" | "lg";
  mask?: keyof typeof masks;
  onMaskedChange?: (value: string, maskedValue: string) => void;
}

const getSizeStyles = (size: "sm" | "md" | "lg" | undefined) => {
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

interface StyledInputProps {
  error?: boolean;
  fullWidth?: boolean;
  inputSize?: "sm" | "md" | "lg";
}

const StyledInput = styled.input<StyledInputProps>`
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  border: 2px solid
    ${({ theme, error }) =>
      error ? theme.colors.error[500] : theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all ${({ theme }) => theme.transitions.default};
  position: relative;
  z-index: 1;

  ${({ inputSize = "md" }) => getSizeStyles(inputSize)}

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

  /* Hide native browser password reveal buttons */
  &::-ms-reveal,
  &::-ms-clear {
    display: none;
  }

  &::-webkit-credentials-auto-fill-button {
    display: none !important;
    visibility: hidden;
    pointer-events: none;
    position: absolute;
    right: 0;
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme, error }) =>
      error ? theme.colors.error[600] : theme.colors.border.accent};
  }
`;

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  (
    {
      mask,
      onChange,
      onMaskedChange,
      value: propValue,
      inputSize,
      error,
      fullWidth,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(
      propValue?.toString() || ""
    );

    useEffect(() => {
      if (propValue !== undefined) {
        const stringValue = propValue.toString();
        setInternalValue(mask ? applyMask(stringValue, mask) : stringValue);
      }
    }, [propValue, mask]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      let maskedValue = inputValue;
      let rawValue = inputValue;

      if (mask) {
        maskedValue = applyMask(inputValue, mask);

        // Para máscaras específicas que podem conter letras
        if (
          mask === "alphanumeric" ||
          mask === "alphabetic" ||
          mask === "email" ||
          mask === "url"
        ) {
          rawValue = maskedValue; // Para essas máscaras, use o valor mascarado
        } else {
          rawValue = inputValue.replace(/\D/g, ""); // Remove caracteres não numéricos
        }
      }

      setInternalValue(maskedValue);

      // Chama o onChange nativo (para react-hook-form)
      if (onChange) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: rawValue, // Passa o valor processado para o form
          },
        };
        onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
      }

      // Chama callback customizado se fornecido
      if (onMaskedChange) {
        onMaskedChange(rawValue, maskedValue);
      }
    };

    return (
      <StyledInput
        {...props}
        ref={ref}
        value={internalValue}
        onChange={handleChange}
        error={error}
        fullWidth={fullWidth}
        inputSize={inputSize}
      />
    );
  }
);

MaskedInput.displayName = "MaskedInput";
