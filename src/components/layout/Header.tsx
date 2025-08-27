import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { FiLogOut, FiUser, FiSearch, FiPlus } from 'react-icons/fi';

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.background.card};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all ${({ theme }) => theme.transitions.default};
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary[600]};
    margin: 0;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  flex: 1;
  max-width: 400px;
  margin: 0 ${({ theme }) => theme.spacing.xl};
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[50]};
    transform: translateY(-1px);
  }
  
  input {
    background: none;
    border: none;
    outline: none;
    flex: 1;
    margin-left: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text.primary};
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.text.muted};
    }
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.primary[100]};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.primary[600]};
    font-weight: 500;
  }
  
  .user-details {
    display: none;
    
    @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
      display: block;
    }
  }
  
  .user-name {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.gray[900]};
    font-size: 0.875rem;
  }
  
  .user-email {
    color: ${({ theme }) => theme.colors.gray[500]};
    font-size: 0.75rem;
  }
`;

interface HeaderProps {
  onSearch?: (query: string) => void;
  onAddNew?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, onAddNew }) => {
  const { user, logout } = useAuth();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo>
          <h1>Mimir Wiki</h1>
        </Logo>

        <SearchBar>
          <FiSearch size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Pesquisar na wiki..."
            onChange={handleSearch}
          />
        </SearchBar>

        <UserSection>
          {onAddNew && (
            <Button
              variant="primary"
              size="sm"
              onClick={onAddNew}
            >
              <FiPlus size={16} />
              Novo
            </Button>
          )}
          
          <UserInfo>
            <div className="user-avatar">
              <FiUser size={16} />
            </div>
            <div className="user-details">
              <div className="user-name">{user?.name}</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </UserInfo>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
          >
            <FiLogOut size={16} />
          </Button>
        </UserSection>
      </HeaderContent>
    </HeaderContainer>
  );
};
