import React from 'react';
import styled from 'styled-components';
import { FiX, FiCheck, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

const AlertContainer = styled.div<{ type: 'success' | 'error' | 'warning' | 'info'; closable?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ type, theme }) => {
    switch (type) {
      case 'success':
        return theme.colors.success[500];
      case 'error':
        return theme.colors.error[500];
      case 'warning':
        return theme.colors.warning[500];
      case 'info':
        return theme.colors.info[500];
      default:
        return theme.colors.border.primary;
    }
  }};
  background-color: ${({ type, theme }) => {
    switch (type) {
      case 'success':
        return theme.colors.success[50];
      case 'error':
        return theme.colors.error[50];
      case 'warning':
        return theme.colors.warning[50];
      case 'info':
        return theme.colors.info[50];
      default:
        return theme.colors.background.card;
    }
  }};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const IconContainer = styled.div<{ type: 'success' | 'error' | 'warning' | 'info' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ type, theme }) => {
    switch (type) {
      case 'success':
        return theme.colors.success[500];
      case 'error':
        return theme.colors.error[500];
      case 'warning':
        return theme.colors.warning[500];
      case 'info':
        return theme.colors.info[500];
      default:
        return theme.colors.primary[500];
    }
  }};
  color: ${({ theme }) => theme.colors.text.primary};
  flex-shrink: 0;
  margin-top: 2px;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.div<{ type: 'success' | 'error' | 'warning' | 'info' }>`
  font-weight: 600;
  font-size: 0.875rem;
  color: ${({ type, theme }) => {
    switch (type) {
      case 'success':
        return theme.colors.success[700];
      case 'error':
        return theme.colors.error[700];
      case 'warning':
        return theme.colors.warning[700];
      case 'info':
        return theme.colors.info[700];
      default:
        return theme.colors.text.primary;
    }
  }};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Message = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  flex-shrink: 0;
  margin-top: 2px;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  closable?: boolean;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  closable = false,
  onClose,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheck size={12} />;
      case 'error':
        return <FiAlertCircle size={12} />;
      case 'warning':
        return <FiAlertTriangle size={12} />;
      case 'info':
        return <FiInfo size={12} />;
      default:
        return <FiInfo size={12} />;
    }
  };

  return (
    <AlertContainer type={type} closable={closable}>
      <IconContainer type={type}>
        {getIcon()}
      </IconContainer>
      <Content>
        {title && <Title type={type}>{title}</Title>}
        <Message>{message}</Message>
      </Content>
      {closable && onClose && (
        <CloseButton onClick={onClose}>
          <FiX size={16} />
        </CloseButton>
      )}
    </AlertContainer>
  );
};
