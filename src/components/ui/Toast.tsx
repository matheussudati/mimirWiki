import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiX, FiCheck, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div<{ type: 'success' | 'error' | 'warning' | 'info'; isVisible: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  min-width: 300px;
  max-width: 400px;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
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
  animation: ${({ isVisible }) => isVisible ? slideIn : slideOut} 0.3s ease-in-out;
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    left: 20px;
    right: 20px;
    min-width: auto;
    max-width: none;
  }
`;

const IconContainer = styled.div<{ type: 'success' | 'error' | 'warning' | 'info' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
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
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const ProgressBar = styled.div<{ type: 'success' | 'error' | 'warning' | 'info'; progress: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: ${({ progress }) => progress}%;
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
  border-radius: 0 0 ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg};
  transition: width 0.1s linear;
`;

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (duration / 100));
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [duration, id, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheck size={16} />;
      case 'error':
        return <FiAlertCircle size={16} />;
      case 'warning':
        return <FiAlertTriangle size={16} />;
      case 'info':
        return <FiInfo size={16} />;
      default:
        return <FiInfo size={16} />;
    }
  };

  return (
    <ToastContainer type={type} isVisible={isVisible}>
      <IconContainer type={type}>
        {getIcon()}
      </IconContainer>
      <Content>
        <Title type={type}>{title}</Title>
        <Message>{message}</Message>
      </Content>
      <CloseButton onClick={handleClose}>
        <FiX size={16} />
      </CloseButton>
      <ProgressBar type={type} progress={progress} />
    </ToastContainer>
  );
};
