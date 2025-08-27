import React from "react";
import styled from "styled-components";
import { FiCheck, FiX, FiMail, FiAtSign, FiGlobe } from "react-icons/fi";
import { validateEmailDetailed } from "../../utils/masks";

const Container = styled.div<{ show: boolean }>`
  max-height: ${({ show }) => (show ? "200px" : "0")};
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  margin-top: ${({ theme, show }) => (show ? theme.spacing.sm : "0")};
`;

const ValidatorCard = styled.div`
  background: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ProgressFill = styled.div<{ progress: number; isValid: boolean }>`
  width: ${({ progress }) => progress}%;
  height: 100%;
  background-color: ${({ theme, isValid, progress }) => {
    if (progress === 100 && isValid) return theme.colors.success[500];
    if (progress > 50) return theme.colors.warning[500];
    return theme.colors.error[500];
  }};
  transition: all 0.3s ease-in-out;
`;

const ChecklistContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const CheckItem = styled.div<{ checked: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 0.875rem;
  color: ${({ theme, checked }) =>
    checked ? theme.colors.success[600] : theme.colors.text.muted};
  transition: all 0.2s ease-in-out;
`;

const IconWrapper = styled.div<{ checked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${({ theme, checked }) =>
    checked ? theme.colors.success[100] : theme.colors.background.tertiary};
  color: ${({ theme, checked }) =>
    checked ? theme.colors.success[600] : theme.colors.text.muted};
  transition: all 0.2s ease-in-out;
`;

const EmailPreview = styled.div<{ isValid: boolean }>`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme, isValid }) =>
    isValid ? theme.colors.success[50] : theme.colors.background.tertiary};
  border: 1px solid
    ${({ theme, isValid }) =>
      isValid ? theme.colors.success[200] : theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-family: "Fira Code", monospace;
  font-size: 0.875rem;
  word-break: break-all;
  color: ${({ theme, isValid }) =>
    isValid ? theme.colors.success[700] : theme.colors.text.secondary};
`;

const StatusText = styled.div<{ isValid: boolean }>`
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme, isValid }) =>
    isValid ? theme.colors.success[600] : theme.colors.error[500]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

interface EmailValidatorProps {
  email: string;
  show?: boolean;
}

export const EmailValidator: React.FC<EmailValidatorProps> = ({
  email,
  show = true,
}) => {
  const validation = validateEmailDetailed(email);

  const progress =
    [
      validation.hasLocalPart,
      validation.hasAtSymbol,
      validation.hasDomain,
      validation.hasExtension,
    ].filter(Boolean).length * 25;

  const checkItems = [
    {
      id: "local",
      label: "Nome válido (letras, números, pontos, _ e -)",
      checked: validation.hasLocalPart,
      icon: FiMail,
    },
    {
      id: "at",
      label: "Símbolo @ presente",
      checked: validation.hasAtSymbol,
      icon: FiAtSign,
    },
    {
      id: "domain",
      label: "Domínio válido",
      checked: validation.hasDomain,
      icon: FiGlobe,
    },
    {
      id: "extension",
      label: "Extensão válida (.com, .br, etc)",
      checked: validation.hasExtension,
      icon: FiGlobe,
    },
  ];

  return (
    <Container show={show && email.length > 0}>
      <ValidatorCard>
        <ProgressBar>
          <ProgressFill progress={progress} isValid={validation.isValid} />
        </ProgressBar>

        <ChecklistContainer>
          {checkItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <CheckItem key={item.id} checked={item.checked}>
                <IconWrapper checked={item.checked}>
                  {item.checked ? (
                    <FiCheck size={12} />
                  ) : (
                    <IconComponent size={12} />
                  )}
                </IconWrapper>
                {item.label}
              </CheckItem>
            );
          })}
        </ChecklistContainer>

        {email && (
          <EmailPreview isValid={validation.isValid}>{email}</EmailPreview>
        )}

        <StatusText isValid={validation.isValid}>
          {validation.isValid ? (
            <>
              <FiCheck size={14} />
              Email válido e formatado corretamente!
            </>
          ) : (
            <>
              <FiX size={14} />
              {validation.errors[0] || "Complete o formato do email"}
            </>
          )}
        </StatusText>
      </ValidatorCard>
    </Container>
  );
};
