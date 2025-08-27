import React from 'react';
import styled from 'styled-components';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { FiBook, FiCode, FiUsers, FiTrendingUp, FiStar } from 'react-icons/fi';

const PageContainer = styled.div`
  margin-left: 250px;
  padding: ${({ theme }) => theme.spacing.xl};
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.gray[50]};
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled(Card)`
  text-align: center;
`;

const StatIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  
  svg {
    color: white;
    width: 24px;
    height: 24px;
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: 0.875rem;
  font-weight: 500;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const RecentEntries = styled(Card)`
  height: fit-content;
`;

const EntryItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  
  &:last-child {
    border-bottom: none;
  }
`;

const EntryIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.primary[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    color: ${({ theme }) => theme.colors.primary[600]};
    width: 18px;
    height: 18px;
  }
`;

const EntryInfo = styled.div`
  flex: 1;
`;

const EntryTitle = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const EntryMeta = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const QuickActions = styled(Card)`
  height: fit-content;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[50]};
    border-color: ${({ theme }) => theme.colors.primary[300]};
    color: ${({ theme }) => theme.colors.primary[600]};
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const WelcomeMessage = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[50]} 0%, ${({ theme }) => theme.colors.primary[100]} 100%);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const WelcomeTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary[700]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const WelcomeText = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 1rem;
`;

export const DashboardPage: React.FC = () => {
  const stats = [
    {
      icon: FiBook,
      value: '24',
      label: 'Entradas na Wiki',
      color: '#3b82f6',
    },
    {
      icon: FiCode,
      value: '8',
      label: 'Projetos Ativos',
      color: '#10b981',
    },
    {
      icon: FiUsers,
      value: '12',
      label: 'Colaboradores',
      color: '#f59e0b',
    },
    {
      icon: FiTrendingUp,
      value: '156',
      label: 'Visualizações',
      color: '#ef4444',
    },
  ];

  const recentEntries = [
    {
      id: '1',
      title: 'Como configurar React com TypeScript',
      category: 'Frontend',
      date: 'há 2 horas',
    },
    {
      id: '2',
      title: 'Padrões de API REST',
      category: 'Backend',
      date: 'há 1 dia',
    },
    {
      id: '3',
      title: 'Docker para Desenvolvimento',
      category: 'DevOps',
      date: 'há 3 dias',
    },
    {
      id: '4',
      title: 'Testes Unitários com Jest',
      category: 'Testing',
      date: 'há 1 semana',
    },
  ];

  const quickActions = [
    {
      icon: FiBook,
      label: 'Nova Entrada na Wiki',
      action: () => console.log('Nova entrada'),
    },
    {
      icon: FiCode,
      label: 'Novo Projeto',
      action: () => console.log('Novo projeto'),
    },
    {
      icon: FiUsers,
      label: 'Convidar Colaborador',
      action: () => console.log('Convidar'),
    },
    {
      icon: FiStar,
      label: 'Ver Favoritos',
      action: () => console.log('Favoritos'),
    },
  ];

  return (
    <PageContainer>
      <WelcomeMessage>
        <WelcomeTitle>Bem-vindo ao Mimir Wiki!</WelcomeTitle>
        <WelcomeText>
          Sua plataforma centralizada para documentação e conhecimento de projetos
        </WelcomeText>
      </WelcomeMessage>

      <PageTitle>Dashboard</PageTitle>

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <CardContent>
              <StatIcon color={stat.color}>
                <stat.icon />
              </StatIcon>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </CardContent>
          </StatCard>
        ))}
      </StatsGrid>

      <ContentGrid>
        <RecentEntries>
          <CardHeader>
            <CardTitle>Entradas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentEntries.map((entry) => (
              <EntryItem key={entry.id}>
                <EntryIcon>
                  <FiBook />
                </EntryIcon>
                <EntryInfo>
                  <EntryTitle>{entry.title}</EntryTitle>
                  <EntryMeta>
                    {entry.category} • {entry.date}
                  </EntryMeta>
                </EntryInfo>
              </EntryItem>
            ))}
          </CardContent>
        </RecentEntries>

        <QuickActions>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            {quickActions.map((action, index) => (
              <ActionButton key={index} onClick={action.action}>
                <action.icon />
                {action.label}
              </ActionButton>
            ))}
          </CardContent>
        </QuickActions>
      </ContentGrid>
    </PageContainer>
  );
};
