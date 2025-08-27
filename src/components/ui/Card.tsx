import styled from 'styled-components';

interface CardProps {
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const getPaddingStyles = (padding: CardProps['padding']) => {
  switch (padding) {
    case 'sm':
      return 'padding: 1rem;';
    case 'lg':
      return 'padding: 2rem;';
    default:
      return 'padding: 1.5rem;';
  }
};

export const Card = styled.div<CardProps>`
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  transition: all ${({ theme }) => theme.transitions.default};
  position: relative;
  overflow: hidden;
  
  ${({ padding = 'md' }) => getPaddingStyles(padding)}
  
  ${({ hover }) => hover && `
    &:hover {
      box-shadow: ${({ theme }: { theme: any }) => theme.shadows.lg};
      transform: translateY(-4px);
      border-color: ${({ theme }: { theme: any }) => theme.colors.primary[500]};
    }
  `}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary[500]}, ${({ theme }) => theme.colors.primary[600]});
    transform: scaleX(0);
    transition: transform ${({ theme }) => theme.transitions.default};
  }

  ${({ hover }) => hover && `
    &:hover::before {
      transform: scaleX(1);
    }
  `}
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

export const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
`;

export const CardContent = styled.div`
  color: ${({ theme }) => theme.colors.gray[700]};
  line-height: 1.6;
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;
