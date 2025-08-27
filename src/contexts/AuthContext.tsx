import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterCredentials, AuthContextType } from '../types';
import { databaseService } from '../services/databaseService';
import { useToast } from '../hooks/useToast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Interface para controle de tentativas de login
interface LoginAttempt {
  email: string;
  attempts: number;
  lastAttempt: Date;
  blockedUntil?: Date;
}

// Simulação de banco de dados de tentativas (em produção, isso estaria no backend)
const loginAttempts: Map<string, LoginAttempt> = new Map();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { success, error: showError, warning, info } = useToast();

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const checkStoredUser = () => {
      const storedUser = localStorage.getItem('user');
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      const sessionUser = sessionStorage.getItem('user');
      
      if (storedUser && rememberMe) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          info('Bem-vindo de volta!', `Conectado como ${userData.name}`);
        } catch {
          localStorage.removeItem('user');
          localStorage.removeItem('rememberMe');
        }
      } else if (sessionUser) {
        try {
          const userData = JSON.parse(sessionUser);
          setUser(userData);
        } catch {
          sessionStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };

    checkStoredUser();
  }, [info]);

  // Verificar se o email está bloqueado
  const checkIfBlocked = (email: string): { isBlocked: boolean; minutesRemaining?: number } => {
    const attempt = loginAttempts.get(email);
    if (!attempt || !attempt.blockedUntil) {
      return { isBlocked: false };
    }

    const now = new Date();
    if (attempt.blockedUntil > now) {
      const minutesRemaining = Math.ceil((attempt.blockedUntil.getTime() - now.getTime()) / (1000 * 60));
      return { isBlocked: true, minutesRemaining };
    }

    // Desbloquear se o tempo passou
    attempt.blockedUntil = undefined;
    attempt.attempts = 0;
    return { isBlocked: false };
  };

  // Registrar tentativa de login
  const registerLoginAttempt = (email: string, success: boolean) => {
    const now = new Date();
    let attempt = loginAttempts.get(email);

    if (!attempt) {
      attempt = {
        email,
        attempts: 0,
        lastAttempt: now,
      };
      loginAttempts.set(email, attempt);
    }

    if (success) {
      // Limpar tentativas em caso de sucesso
      loginAttempts.delete(email);
    } else {
      attempt.attempts++;
      attempt.lastAttempt = now;

      // Bloquear após 5 tentativas
      if (attempt.attempts >= 5) {
        const blockedUntil = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutos
        attempt.blockedUntil = blockedUntil;
        warning('Conta Bloqueada', 'Muitas tentativas falhadas. Tente novamente em 30 minutos.');
      } else if (attempt.attempts >= 3) {
        warning('Atenção', `${5 - attempt.attempts} tentativas restantes antes do bloqueio.`);
      }
    }
  };

  // Validar força da senha
  const validatePasswordStrength = (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 6) {
      return { isValid: false, message: 'A senha deve ter pelo menos 6 caracteres' };
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'A senha deve conter letras minúsculas' };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'A senha deve conter letras maiúsculas' };
    }
    if (!/\d/.test(password)) {
      return { isValid: false, message: 'A senha deve conter números' };
    }
    return { isValid: true };
  };

  // Validar formato de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const login = async (credentials: LoginCredentials & { rememberMe?: boolean }) => {
    try {
      setLoading(true);
      
      // Validar formato do email
      if (!validateEmail(credentials.email)) {
        showError('Email Inválido', 'Por favor, digite um email válido.');
        throw new Error('Formato de email inválido');
      }

      // Verificar se a conta está bloqueada
      const blockStatus = checkIfBlocked(credentials.email);
      if (blockStatus.isBlocked) {
        showError(
          'Conta Bloqueada', 
          `Muitas tentativas falhadas. Tente novamente em ${blockStatus.minutesRemaining} minutos.`
        );
        throw new Error('Usuário bloqueado');
      }

      // Buscar usuário no banco de dados
      const users = await databaseService.getUsers();
      const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
      
      if (!user) {
        registerLoginAttempt(credentials.email, false);
        showError('Email Não Encontrado', 'Este email não está cadastrado no sistema.');
        throw new Error('Email não encontrado');
      }

      // Verificar senha
      if (user.password !== credentials.password) {
        registerLoginAttempt(credentials.email, false);
        showError('Senha Incorreta', 'A senha informada está incorreta. Tente novamente.');
        throw new Error('Senha incorreta');
      }

      // Login bem-sucedido
      registerLoginAttempt(credentials.email, true);
      const { password, ...userWithoutPassword } = user;
      setUser(userWithoutPassword);
      
      // Salvar de acordo com a preferência
      if (credentials.rememberMe) {
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        localStorage.setItem('rememberMe', 'true');
      } else {
        sessionStorage.setItem('user', JSON.stringify(userWithoutPassword));
        localStorage.removeItem('rememberMe');
      }
      
      success('Login Realizado', `Bem-vindo de volta, ${user.name}!`);
      
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setLoading(true);
      
      // Validar formato do email
      if (!validateEmail(credentials.email)) {
        showError('Email Inválido', 'Por favor, digite um email válido.');
        throw new Error('Formato de email inválido');
      }

      // Validar força da senha
      const passwordValidation = validatePasswordStrength(credentials.password);
      if (!passwordValidation.isValid) {
        showError('Senha Fraca', passwordValidation.message!);
        throw new Error(passwordValidation.message);
      }

      // Verificar se as senhas coincidem
      if (credentials.password !== credentials.confirmPassword) {
        showError('Senhas Diferentes', 'As senhas digitadas não coincidem.');
        throw new Error('Senhas não coincidem');
      }

      // Verificar se o email já existe
      const users = await databaseService.getUsers();
      const existingUser = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
      
      if (existingUser) {
        showError('Email em Uso', 'Este email já está cadastrado. Faça login ou use outro email.');
        throw new Error('Email já cadastrado');
      }

      // Validar nome
      if (credentials.name.trim().length < 3) {
        showError('Nome Inválido', 'O nome deve ter pelo menos 3 caracteres.');
        throw new Error('Nome muito curto');
      }

      // Criar novo usuário
      const newUser = await databaseService.createUser({
        name: credentials.name.trim(),
        email: credentials.email.toLowerCase(),
        password: credentials.password,
        role: 'user',
        createdAt: new Date().toISOString(),
      });

      const { password, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      sessionStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      success('Cadastro Realizado', `Bem-vindo ao Mimir, ${newUser.name}!`);
      info('Dica', 'Complete seu perfil para ter acesso a todos os recursos.');
      
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    const userName = user?.name;
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('user');
    success('Logout Realizado', userName ? `Até logo, ${userName}!` : 'Você saiu da sua conta.');
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) {
      showError('Erro', 'Usuário não autenticado');
      throw new Error('Não autenticado');
    }

    try {
      setLoading(true);
      
      // Atualizar usuário no banco
      const updatedUser = await databaseService.updateUser(user.id, updates);
      const { password, ...userWithoutPassword } = updatedUser;
      
      setUser(userWithoutPassword);
      
      // Atualizar storage
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      } else {
        sessionStorage.setItem('user', JSON.stringify(userWithoutPassword));
      }
      
      success('Perfil Atualizado', 'Suas informações foram atualizadas com sucesso.');
      return { success: true };
    } catch (error) {
      showError('Erro', 'Não foi possível atualizar o perfil.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) {
      showError('Erro', 'Usuário não autenticado');
      throw new Error('Não autenticado');
    }

    try {
      setLoading(true);
      
      // Buscar usuário completo para verificar senha atual
      const users = await databaseService.getUsers();
      const fullUser = users.find(u => u.id === user.id);
      
      if (!fullUser || fullUser.password !== currentPassword) {
        showError('Senha Incorreta', 'A senha atual está incorreta.');
        throw new Error('Senha atual incorreta');
      }

      // Validar nova senha
      const passwordValidation = validatePasswordStrength(newPassword);
      if (!passwordValidation.isValid) {
        showError('Senha Fraca', passwordValidation.message!);
        throw new Error(passwordValidation.message);
      }

      // Atualizar senha
      await databaseService.updateUser(user.id, { password: newPassword });
      
      success('Senha Alterada', 'Sua senha foi alterada com sucesso.');
      info('Segurança', 'Por segurança, faça login novamente.');
      
      // Fazer logout após trocar senha
      setTimeout(() => {
        logout();
      }, 2000);
      
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};