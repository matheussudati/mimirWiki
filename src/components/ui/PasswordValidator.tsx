import React from "react";
import styled from "styled-components";
import { FiCheck, FiX } from "react-icons/fi";
import {
  validatePassword,
  getPasswordStrength,
  PasswordRequirement,
} from "../../utils/passwordValidation";

interface PasswordValidatorProps {
  password: string;
  show: boolean;
}

const ValidatorContainer = styled.div<{ show: boolean }>`
  margin-top: ${({ theme }) => theme.spacing.sm};
  opacity: ${({ show }) => (show ? 1 : 0)};
  max-height: ${({ show }) => (show ? "200px" : "0")};
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ show, theme }) => (show ? theme.spacing.md : "0")};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const StrengthMeter = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StrengthBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StrengthFill = styled.div<{ width: number; color: string }>`
  width: ${({ width }) => width}%;
  height: 100%;
  background-color: ${({ color }) => color};
  transition: all 0.3s ease-in-out;
`;

const StrengthLabel = styled.span<{ color: string }>`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ color }) => color};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RequirementsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const RequirementItem = styled.li<{ met: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 0.875rem;
  color: ${({ theme, met }) =>
    met ? theme.colors.success[600] : theme.colors.text.muted};
  transition: all 0.2s ease-in-out;
`;

const RequirementIcon = styled.div<{ met: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${({ theme, met }) =>
    met ? theme.colors.success[500] : theme.colors.background.secondary};
  color: ${({ theme, met }) => (met ? "white" : theme.colors.text.muted)};
  font-size: 10px;
  transition: all 0.2s ease-in-out;
`;

const strengthLabels = {
  "very-weak": "Muito Fraca",
  weak: "Fraca",
  fair: "Regular",
  good: "Boa",
  strong: "Forte",
};

export const PasswordValidator: React.FC<PasswordValidatorProps> = ({
  password,
  show,
}) => {
  const requirements = validatePassword(password);
  const strength = getPasswordStrength(password);
  const strengthWidth = (strength.score / 5) * 100;

  return (
    <ValidatorContainer show={show}>
      <StrengthMeter>
        <StrengthBar>
          <StrengthFill width={strengthWidth} color={strength.color} />
        </StrengthBar>
        <StrengthLabel color={strength.color}>
          {strengthLabels[strength.level]}
        </StrengthLabel>
      </StrengthMeter>

      <RequirementsList>
        {requirements.map((requirement: PasswordRequirement) => (
          <RequirementItem key={requirement.id} met={requirement.met}>
            <RequirementIcon met={requirement.met}>
              {requirement.met ? <FiCheck /> : <FiX />}
            </RequirementIcon>
            {requirement.label}
          </RequirementItem>
        ))}
      </RequirementsList>
    </ValidatorContainer>
  );
};
