import styled, { css } from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
}

const getVariantStyles = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'secondary':
      return css`
        background-color: ${({ theme }) => theme.colors.gray[200]};
        color: ${({ theme }) => theme.colors.gray[800]};
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.gray[300]};
        }
      `;
    case 'outline':
      return css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.primary[600]};
        border: 2px solid ${({ theme }) => theme.colors.primary[600]};
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.primary[50]};
        }
      `;
    case 'ghost':
      return css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.gray[600]};
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.gray[100]};
        }
      `;
    default:
      return css`
        background-color: ${({ theme }) => theme.colors.primary[600]};
        color: white;
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.primary[700]};
        }
      `;
  }
};

const getSizeStyles = (size: ButtonProps['size']) => {
  switch (size) {
    case 'sm':
      return css`
        padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
        font-size: 0.875rem;
      `;
    case 'lg':
      return css`
        padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
        font-size: 1.125rem;
      `;
    default:
      return css`
        padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
        font-size: 1rem;
      `;
  }
};

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  transition: all ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  position: relative;
  overflow: hidden;
  
  ${({ variant = 'primary' }) => getVariantStyles(variant)}
  ${({ size = 'md' }) => getSizeStyles(size)}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 2px;
  }

  &:active {
    transform: scale(0.98);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left ${({ theme }) => theme.transitions.default};
  }

  &:hover::before {
    left: 100%;
  }
`;
