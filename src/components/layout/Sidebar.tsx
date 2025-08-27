import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FiBook, FiCode, FiSettings, FiHome, FiFolder } from 'react-icons/fi';

const SidebarContainer = styled.aside`
  width: 250px;
  background-color: white;
  border-right: 1px solid ${({ theme }) => theme.colors.gray[200]};
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  padding-top: 80px;
  overflow-y: auto;
`;

const Nav = styled.nav`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const NavSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  h3 {
    font-size: 0.75rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray[500]};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const NavItem = styled.li``;

const NavLinkStyled = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[900]};
  }
  
  &.active {
    background-color: ${({ theme }) => theme.colors.primary[50]};
    color: ${({ theme }) => theme.colors.primary[600]};
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CategoryItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[900]};
  }
  
  &.active {
    background-color: ${({ theme }) => theme.colors.primary[50]};
    color: ${({ theme }) => theme.colors.primary[600]};
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const categories = [
  { id: 'frontend', name: 'Frontend', icon: FiCode },
  { id: 'backend', name: 'Backend', icon: FiCode },
  { id: 'database', name: 'Banco de Dados', icon: FiCode },
];

export const Sidebar: React.FC = () => {
  return (
    <SidebarContainer>
      <Nav>
        <NavSection>
          <h3>Geral</h3>
          <NavList>
            <NavItem>
              <NavLinkStyled to="/dashboard">
                <FiHome />
                Dashboard
              </NavLinkStyled>
            </NavItem>
            <NavItem>
              <NavLinkStyled to="/wiki">
                <FiBook />
                Wiki
              </NavLinkStyled>
            </NavItem>
            <NavItem>
              <NavLinkStyled to="/projects">
                <FiFolder />
                Projetos
              </NavLinkStyled>
            </NavItem>
          </NavList>
        </NavSection>

        <NavSection>
          <h3>Categorias</h3>
          <CategoryList>
            {categories.map((category) => (
              <CategoryItem key={category.id} to={`/wiki/category/${category.id}`}>
                <category.icon />
                {category.name}
              </CategoryItem>
            ))}
          </CategoryList>
        </NavSection>

        <NavSection>
          <h3>Configurações</h3>
          <NavList>
            <NavItem>
              <NavLinkStyled to="/settings">
                <FiSettings />
                Configurações
              </NavLinkStyled>
            </NavItem>
          </NavList>
        </NavSection>
      </Nav>
    </SidebarContainer>
  );
};
