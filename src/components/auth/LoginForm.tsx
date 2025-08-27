import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { MaskedInput } from "../ui/MaskedInput";
import { validateEmailDetailed } from "../../utils/masks";
import styled, { keyframes, css } from "styled-components";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUserPlus,
  FiAlertCircle,
  FiCheck,
  FiArrowRight,
  FiShield,
  FiUser,
} from "react-icons/fi";

// Animações
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const rotateIn = keyframes`
  from {
    opacity: 0;
    transform: rotate(-180deg) scale(0.5);
  }
  to {
    opacity: 1;
    transform: rotate(0) scale(1);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const backgroundMove = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-50px, -50px);
  }
`;

// Container principal
const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.gradient};
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
        circle at 20% 80%,
        rgba(0, 0, 0, 0.05) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(0, 0, 0, 0.05) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 40% 40%,
        rgba(0, 0, 0, 0.03) 0%,
        transparent 50%
      );
    animation: ${backgroundMove} 20s ease-in-out infinite;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
        90deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, 0.01) 2px,
        rgba(0, 0, 0, 0.01) 4px
      ),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, 0.01) 2px,
        rgba(0, 0, 0, 0.01) 4px
      );
    pointer-events: none;
  }
`;

// Elementos decorativos flutuantes
const FloatingElement = styled.div<{
  delay?: number;
  size?: number;
  top?: string;
  left?: string;
}>`
  position: absolute;
  width: ${({ size = 60 }) => size}px;
  height: ${({ size = 60 }) => size}px;
  top: ${({ top = "10%" }) => top};
  left: ${({ left = "10%" }) => left};
  opacity: 0.05;
  animation: ${float} ${({ delay = 0 }) => 6 + delay}s ease-in-out infinite;
  animation-delay: ${({ delay = 0 }) => delay}s;
  pointer-events: none;
  z-index: 0;

  svg {
    width: 100%;
    height: 100%;
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

// Card principal
const LoginCard = styled.div<{ isAnimating?: boolean }>`
  width: 100%;
  max-width: 440px;
  background: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius["2xl"]};
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), 0 10px 30px rgba(0, 0, 0, 0.08),
    0 2px 10px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  padding: ${({ theme }) => theme.spacing.xxl};
  position: relative;
  z-index: 1;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  animation: ${scaleIn} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  ${({ isAnimating }) =>
    isAnimating &&
    css`
      animation: ${pulse} 0.5s ease;
    `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.12), 0 15px 35px rgba(0, 0, 0, 0.1),
      0 5px 15px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.xl};
    max-width: 100%;
  }
`;

// Logo
const Logo = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  animation: ${fadeIn} 0.8s ease-out;
  animation-delay: 0.1s;
  animation-fill-mode: both;

  h1 {
    font-size: 3rem;
    font-weight: 900;
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.text.primary} 0%,
      ${({ theme }) => theme.colors.gray[600]} 50%,
      ${({ theme }) => theme.colors.text.primary} 100%
    );
    background-size: 200% 200%;
    animation: ${shimmer} 3s linear infinite;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
    letter-spacing: -0.03em;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      background: linear-gradient(
        90deg,
        transparent,
        ${({ theme }) => theme.colors.text.primary},
        transparent
      );
      border-radius: 2px;
      animation: ${slideInFromLeft} 0.8s ease-out 0.3s both;
    }
  }

  p {
    color: ${({ theme }) => theme.colors.text.tertiary};
    margin-top: ${({ theme }) => theme.spacing.lg};
    font-size: 0.95rem;
    font-weight: 400;
    letter-spacing: 0.02em;
    animation: ${fadeIn} 0.8s ease-out 0.2s both;
  }
`;

// Formulário
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div<{ delay?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  position: relative;
  animation: ${slideInFromLeft} 0.6s ease-out;
  animation-delay: ${({ delay = 0 }) => 0.3 + delay * 0.1}s;
  animation-fill-mode: both;
`;

const Label = styled.label`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  letter-spacing: 0.01em;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
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
  animation: ${rotateIn} 0.5s ease-out;
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
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`;

const StyledInput = styled(Input)<{ hasIcon?: boolean; hasError?: boolean }>`
  padding-left: ${({ hasIcon }) => (hasIcon ? "2.75rem" : "1rem")};
  padding-right: ${({ theme }) => theme.spacing.md};
  height: 52px;
  font-size: 0.95rem;
  background: ${({ theme }) => theme.colors.gray[50]};
  border: 2px solid
    ${({ theme, hasError }) =>
      hasError ? theme.colors.error[400] : theme.colors.border.primary};
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  z-index: 1;

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

  &:hover {
    border-color: ${({ theme, hasError }) =>
      hasError ? theme.colors.error[500] : theme.colors.border.secondary};
    background: ${({ theme }) => theme.colors.background.primary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) =>
      hasError ? theme.colors.error[500] : theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.background.primary};
    box-shadow: 0 0 0 4px
      ${({ theme, hasError }) =>
        hasError ? "rgba(239, 68, 68, 0.1)" : "rgba(0, 0, 0, 0.05)"};
    transform: translateY(-1px);

    & ~ ${IconWrapper} {
      color: ${({ theme, hasError }) =>
        hasError ? theme.colors.error[500] : theme.colors.text.primary};
      transform: translateY(-50%) scale(1.1);
    }
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.placeholder};
    font-weight: 400;
  }
`;

const ErrorMessage = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.error[600]};
  font-size: 0.813rem;
  margin-top: ${({ theme }) => theme.spacing.xs};
  animation: ${slideInFromLeft} 0.3s ease-out;
  font-weight: 500;

  svg {
    flex-shrink: 0;
    animation: ${pulse} 1s ease infinite;
  }
`;

const RememberSection = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xs};
  animation: ${fadeIn} 0.6s ease-out 0.5s both;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  user-select: none;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    transform: translateX(2px);
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  border: 2px solid ${({ theme }) => theme.colors.border.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  accent-color: ${({ theme }) => theme.colors.text.primary};
  position: relative;

  &:checked {
    background-color: ${({ theme }) => theme.colors.text.primary};
    border-color: ${({ theme }) => theme.colors.text.primary};
    animation: ${scaleIn} 0.3s ease;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`;

const SubmitButton = styled(Button)`
  height: 52px;
  font-size: 1rem;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.text.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  border: none;
  margin-top: ${({ theme }) => theme.spacing.lg};
  transition: all ${({ theme }) => theme.transitions.default};
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  animation: ${slideInFromRight} 0.6s ease-out 0.6s both;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.6s;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.1);
    letter-spacing: 0.08em;

    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[400]};
    cursor: not-allowed;
    opacity: 0.6;
    animation: none;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.xl} 0;
  animation: ${fadeIn} 0.6s ease-out 0.7s both;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ theme }) => theme.colors.border.primary} 20%,
      ${({ theme }) => theme.colors.border.primary} 80%,
      transparent
    );
  }

  span {
    padding: 0 ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    position: relative;
  }
`;

const RegisterButton = styled(Button)`
  height: 52px;
  font-size: 0.95rem;
  font-weight: 600;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  border: 2px solid ${({ theme }) => theme.colors.border.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  transition: all ${({ theme }) => theme.transitions.default};
  position: relative;
  overflow: hidden;
  animation: ${slideInFromRight} 0.6s ease-out 0.8s both;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: ${({ theme }) => theme.colors.gray[100]};
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.primary};
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

    &::before {
      width: 500px;
      height: 500px;
    }

    svg {
      transform: translateX(4px);
    }
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    transition: transform ${({ theme }) => theme.transitions.fast};
    z-index: 1;
  }

  span {
    z-index: 1;
  }
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.success[50]},
    ${({ theme }) => theme.colors.success[100]}
  );
  border: 1px solid ${({ theme }) => theme.colors.success[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.success[700]};
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  animation: ${scaleIn} 0.4s ease-out;

  svg {
    animation: ${rotateIn} 0.6s ease-out;
  }
`;

const LoadingOverlay = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  border-radius: ${({ theme }) => theme.borderRadius["2xl"]};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  pointer-events: ${({ isVisible }) => (isVisible ? "all" : "none")};
  transition: opacity 0.3s ease;

  &::after {
    content: "";
    width: 40px;
    height: 40px;
    border: 3px solid ${({ theme }) => theme.colors.gray[300]};
    border-top-color: ${({ theme }) => theme.colors.text.primary};
    border-radius: 50%;
    animation: ${rotateIn} 0.8s linear infinite;
  }
`;

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<LoginFormData>({
    defaultValues: {
      rememberMe: false,
    },
  });

  useEffect(() => {
    // Limpa o formulário quando o componente é montado
    reset({
      email: "",
      password: "",
      rememberMe: false,
    });
  }, [reset]);

  useEffect(() => {
    // Trigger initial animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSuccess(false);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);

      const result = await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (error: any) {
      // Tratamento específico de erros
      if (error.message === "Email não encontrado") {
        setError("email", {
          type: "manual",
          message: "Este email não está cadastrado no sistema",
        });
      } else if (error.message === "Senha incorreta") {
        setError("password", {
          type: "manual",
          message: "Senha incorreta. Tente novamente",
        });
      } else if (error.message === "Usuário bloqueado") {
        setError("email", {
          type: "manual",
          message:
            "Conta bloqueada por múltiplas tentativas. Aguarde 30 minutos",
        });
      } else {
        setError("email", {
          type: "manual",
          message: "Erro ao fazer login. Verifique suas credenciais",
        });
      }
    }
  };

  const handleRegisterClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate("/register");
    }, 300);
  };

  return (
    <LoginContainer>
      {/* Elementos decorativos flutuantes */}
      <FloatingElement delay={0} size={80} top="15%" left="10%">
        <FiShield />
      </FloatingElement>
      <FloatingElement delay={2} size={60} top="70%" left="15%">
        <FiLock />
      </FloatingElement>
      <FloatingElement delay={1} size={70} top="20%" left="85%">
        <FiUser />
      </FloatingElement>
      <FloatingElement delay={3} size={50} top="80%" left="80%">
        <FiMail />
      </FloatingElement>

      <LoginCard isAnimating={isAnimating}>
        <LoadingOverlay isVisible={loading && !isSuccess} />

        <Logo>
          <h1>Mimir</h1>
          <p>Entre na sua conta para continuar</p>
        </Logo>

        {isSuccess && (
          <SuccessMessage>
            <FiCheck size={18} />
            Login realizado com sucesso! Redirecionando...
          </SuccessMessage>
        )}

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
          <FormGroup delay={0}>
            <Label htmlFor="email">Email</Label>
            <InputWrapper>
              <IconWrapper hasError={!!errors.email}>
                <FiMail size={18} />
              </IconWrapper>
              <MaskedInput
                id="email"
                type="email"
                placeholder="seu@email.com"
                fullWidth
                mask="email"
                error={!!errors.email}
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-lpignore="true"
                data-form-type="other"
                disabled={loading}
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
              <ErrorMessage>
                <FiAlertCircle size={14} />
                {errors.email.message}
              </ErrorMessage>
            )}
          </FormGroup>

          <FormGroup delay={1}>
            <Label htmlFor="password">Senha</Label>
            <InputWrapper>
              <IconWrapper hasError={!!errors.password}>
                <FiLock size={18} />
              </IconWrapper>
              <StyledInput
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                fullWidth
                hasIcon
                hasError={!!errors.password}
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-lpignore="true"
                data-form-type="other"
                disabled={loading}
                style={{ paddingRight: "3rem" }}
                {...register("password", {
                  required: "Senha é obrigatória",
                  minLength: {
                    value: 6,
                    message: "A senha deve ter pelo menos 6 caracteres",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message:
                      "Senha deve conter letras maiúsculas, minúsculas e números",
                  },
                })}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                disabled={loading}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </PasswordToggle>
            </InputWrapper>
            {errors.password && (
              <ErrorMessage>
                <FiAlertCircle size={14} />
                {errors.password.message}
              </ErrorMessage>
            )}
          </FormGroup>

          <RememberSection>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                disabled={loading}
                {...register("rememberMe")}
              />
              Manter conectado
            </CheckboxLabel>
          </RememberSection>

          <SubmitButton type="submit" fullWidth disabled={loading || isSuccess}>
            {loading ? "Entrando..." : isSuccess ? "Sucesso!" : "Entrar"}
            {!loading && !isSuccess && (
              <FiArrowRight style={{ marginLeft: "8px" }} />
            )}
          </SubmitButton>
        </Form>

        <Divider>
          <span>ou</span>
        </Divider>

        <RegisterButton
          variant="outline"
          fullWidth
          onClick={handleRegisterClick}
          disabled={loading}
        >
          <FiUserPlus size={18} />
          <span>Criar Nova Conta</span>
        </RegisterButton>
      </LoginCard>
    </LoginContainer>
  );
};
