import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { MaskedInput } from "../ui/MaskedInput";
import { PasswordValidator } from "../ui/PasswordValidator";
import { Card } from "../ui/Card";
import styled from "styled-components";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiArrowLeft,
} from "react-icons/fi";
import { isPasswordValid } from "../../utils/passwordValidation";
import { validateEmailDetailed } from "../../utils/masks";

const RegisterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.background.secondary} 0%,
    ${({ theme }) => theme.colors.background.tertiary} 100%
  );
`;

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 450px;
  box-shadow: ${({ theme }) => theme.shadows["2xl"]};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const InputWrapper = styled.div`
  position: relative;
  transition: all ${({ theme }) => theme.transitions.default};
`;

const IconWrapper = styled.div<{ hasError?: boolean }>`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme, hasError }) =>
    hasError ? theme.colors.error[500] : theme.colors.text.muted};
  pointer-events: none;
  z-index: 5;
  transition: all ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  z-index: 10;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.gray[100]};
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 2px;
  }
`;

const StyledInput = styled(Input)`
  padding-left: 2.75rem;
  padding-right: 3rem;

  /* Remove ícones nativos do browser para campos de senha */
  &::-ms-reveal,
  &::-ms-clear {
    display: none;
  }

  /* Remove ícones do Edge/Chrome */
  &::-webkit-credentials-auto-fill-button,
  &::-webkit-strong-password-auto-fill-button {
    display: none !important;
  }
`;

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.error[500]};
  font-size: 0.875rem;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary[500]};
    margin: 0;
  }

  p {
    color: ${({ theme }) => theme.colors.text.tertiary};
    margin-top: ${({ theme }) => theme.spacing.sm};
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.tertiary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.lg} 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.border.primary};
  }

  span {
    padding: 0 ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 0.875rem;
  }
`;

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>();

  const password = watch("password") || "";

  // Limpa o formulário quando o componente é montado
  useEffect(() => {
    reset({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }, [reset]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      if (!isPasswordValid(data.password)) {
        return; // Não submete se a senha não atender aos requisitos
      }
      await registerUser(data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <BackButton onClick={() => navigate("/login")}>
          <FiArrowLeft size={16} />
          Voltar ao Login
        </BackButton>

        <Logo>
          <h1>Mimir Wiki</h1>
          <p>Crie sua conta para começar</p>
        </Logo>

        <Form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          data-lpignore="true"
          noValidate
        >
          {/* Campos falsos para confundir o autocomplete */}
          <div
            style={{
              position: "absolute",
              left: "-9999px",
              width: "1px",
              height: "1px",
              opacity: 0,
            }}
          >
            <input
              type="text"
              name="fake-username"
              autoComplete="username"
              tabIndex={-1}
            />
            <input
              type="password"
              name="fake-password"
              autoComplete="current-password"
              tabIndex={-1}
            />
          </div>
          <FormGroup>
            <Label htmlFor="name">Nome Completo</Label>
            <InputWrapper>
              <IconWrapper hasError={!!errors.name}>
                <FiUser size={18} />
              </IconWrapper>
              <MaskedInput
                id="name"
                type="text"
                placeholder="Digite seu nome completo"
                fullWidth
                mask="alphabetic"
                error={!!errors.name}
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-lpignore="true"
                data-form-type="other"
                style={{ paddingLeft: "2.75rem" }}
                {...register("name", {
                  required: "Nome é obrigatório",
                  minLength: {
                    value: 2,
                    message: "Nome deve ter pelo menos 2 caracteres",
                  },
                })}
              />
            </InputWrapper>
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <InputWrapper>
              <IconWrapper hasError={!!errors.email}>
                <FiMail size={18} />
              </IconWrapper>
              <MaskedInput
                id="email"
                type="email"
                placeholder="Digite seu email"
                fullWidth
                mask="email"
                error={!!errors.email}
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-lpignore="true"
                data-form-type="other"
                style={{ paddingLeft: "2.75rem" }}
                {...register("email", {
                  required: "Email é obrigatório",
                  validate: (value) => {
                    const validation = validateEmailDetailed(value);
                    if (!validation.isValid) {
                      return "Email inválido";
                    }
                    return true;
                  },
                })}
              />
            </InputWrapper>
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Senha</Label>
            <InputWrapper>
              <IconWrapper hasError={!!errors.password}>
                <FiLock size={18} />
              </IconWrapper>
              <StyledInput
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                fullWidth
                error={!!errors.password}
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-lpignore="true"
                data-form-type="other"
                {...register("password", {
                  required: "Senha é obrigatória",
                  validate: (value) => {
                    if (!isPasswordValid(value)) {
                      return "Senha deve atender a todos os requisitos";
                    }
                    return true;
                  },
                })}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </PasswordToggle>
            </InputWrapper>
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
            <PasswordValidator password={password} show={password.length > 0} />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <InputWrapper>
              <IconWrapper hasError={!!errors.confirmPassword}>
                <FiLock size={18} />
              </IconWrapper>
              <StyledInput
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirme sua senha"
                fullWidth
                error={!!errors.confirmPassword}
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-lpignore="true"
                data-form-type="other"
                {...register("confirmPassword", {
                  required: "Confirmação de senha é obrigatória",
                  validate: (value) =>
                    value === password || "Senhas não coincidem",
                })}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={18} />
                ) : (
                  <FiEye size={18} />
                )}
              </PasswordToggle>
            </InputWrapper>
            {errors.confirmPassword && (
              <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
            )}
          </FormGroup>

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Criando conta..." : "Criar Conta"}
          </Button>
        </Form>

        <Divider>
          <span>ou</span>
        </Divider>

        <Button variant="outline" fullWidth onClick={() => navigate("/login")}>
          Já tenho uma conta
        </Button>
      </RegisterCard>
    </RegisterContainer>
  );
};
