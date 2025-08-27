import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { databaseService } from '../services/databaseService';
import { Project, WikiEntry, Note, SqlScript } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  FiClock, FiFilter, FiSearch, FiCode, FiDatabase, 
  FiFileText, FiFolder, FiCalendar, FiUser, FiLock, 
  FiUnlock, FiTrendingUp, FiActivity 
} from 'react-icons/fi';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.gradient};
  padding: ${({ theme }) => theme.spacing.xl};
  padding-top: 100px;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  animation: ${fadeIn} 0.6s ease-out;
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  animation: ${slideIn} 0.6s ease-out;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.text.primary} 0%,
    ${({ theme }) => theme.colors.gray[600]} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PageSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: 1.1rem;
  font-weight: 400;
`;

const FiltersBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
  animation: ${fadeIn} 0.8s ease-out 0.2s both;
`;

const SearchInput = styled.div`
  flex: 1;
  min-width: 300px;
  position: relative;

  input {
    width: 100%;
    padding: ${({ theme }) => theme.spacing.md};
    padding-left: 3rem;
    background: ${({ theme }) => theme.colors.background.card};
    border: 2px solid ${({ theme }) => theme.colors.border.primary};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    font-size: 0.95rem;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.text.primary};
      box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.05);
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.text.placeholder};
    }
  }

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.text.muted};
  }
`;

const FilterButton = styled.button<{ active?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme, active }) => 
    active ? theme.colors.text.primary : theme.colors.background.card};
  color: ${({ theme, active }) => 
    active ? theme.colors.text.inverse : theme.colors.text.primary};
  border: 2px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: ${({ theme }) => theme.colors.text.primary};
  }

  svg {
    font-size: 1.1rem;
  }
`;

const TimelineContainer = styled.div`
  position: relative;
  padding-left: ${({ theme }) => theme.spacing.xl};

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(
      180deg,
      ${({ theme }) => theme.colors.border.primary},
      ${({ theme }) => theme.colors.border.secondary}
    );
  }
`;

const TimelineItem = styled.div`
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  animation: ${slideIn} 0.6s ease-out;
  animation-fill-mode: both;

  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  &:nth-child(4) { animation-delay: 0.4s; }
  &:nth-child(5) { animation-delay: 0.5s; }
`;

const TimelineDot = styled.div<{ type: string }>`
  position: absolute;
  left: -2.5rem;
  top: 1rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: ${({ theme, type }) => {
    switch(type) {
      case 'project': return theme.colors.info[500];
      case 'wiki': return theme.colors.success[500];
      case 'note': return theme.colors.warning[500];
      case 'sql': return theme.colors.error[500];
      default: return theme.colors.gray[500];
    }
  }};
  border: 3px solid ${({ theme }) => theme.colors.background.primary};
  box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.background.secondary};
`;

const TimelineCard = styled.div`
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: ${({ theme }) => theme.colors.border.secondary};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CardMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.muted};

  span {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const CardContent = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CardTags = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const Tag = styled.span<{ type?: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme, type }) => {
    switch(type) {
      case 'private': return theme.colors.gray[100];
      case 'public': return theme.colors.success[50];
      default: return theme.colors.gray[50];
    }
  }};
  color: ${({ theme, type }) => {
    switch(type) {
      case 'private': return theme.colors.text.tertiary;
      case 'public': return theme.colors.success[700];
      default: return theme.colors.text.secondary;
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.813rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.text.muted};
  animation: ${fadeIn} 0.6s ease-out;

  h3 {
    font-size: 1.5rem;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  transition: all ${({ theme }) => theme.transitions.default};
  animation: ${fadeIn} 0.6s ease-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

const StatIcon = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ color }) => color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};

  svg {
    font-size: 1.5rem;
  }
`;

const StatInfo = styled.div`
  flex: 1;

  h4 {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  p {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text.tertiary};
    margin: 0;
  }
`;

type TimelineItemType = {
  id: string;
  type: 'project' | 'wiki' | 'note' | 'sql';
  title: string;
  content: string;
  author: string;
  date: string;
  isPublic?: boolean;
  tags?: string[];
  language?: string;
  framework?: string;
};

export const TimelinePage: React.FC = () => {
  const [items, setItems] = useState<TimelineItemType[]>([]);
  const [filteredItems, setFilteredItems] = useState<TimelineItemType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadTimelineData();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchQuery, activeFilter]);

  const loadTimelineData = async () => {
    try {
      setLoading(true);
      
      const [projects, wikiEntries, notes, sqlScripts] = await Promise.all([
        databaseService.getProjects(),
        databaseService.getWikiEntries(),
        databaseService.getNotes(),
        databaseService.getSqlScripts()
      ]);

      const timelineItems: TimelineItemType[] = [
        ...projects.map(p => ({
          id: p.id,
          type: 'project' as const,
          title: p.name,
          content: p.description,
          author: p.authorId,
          date: p.updatedAt,
          isPublic: p.isPublic,
          language: p.language,
          framework: p.framework,
        })),
        ...wikiEntries.map(w => ({
          id: w.id,
          type: 'wiki' as const,
          title: w.title,
          content: w.content,
          author: w.authorId,
          date: w.updatedAt,
          isPublic: w.isPublic,
          tags: w.tags,
        })),
        ...notes.map(n => ({
          id: n.id,
          type: 'note' as const,
          title: n.title,
          content: n.content,
          author: n.authorId,
          date: n.updatedAt,
          isPublic: false,
        })),
        ...sqlScripts.map(s => ({
          id: s.id,
          type: 'sql' as const,
          title: s.name,
          content: s.description,
          author: s.authorId,
          date: s.updatedAt,
          isPublic: false,
        })),
      ];

      // Ordenar por data mais recente
      timelineItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setItems(timelineItems);
    } catch (error) {
      console.error('Erro ao carregar timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...items];

    // Filtro por tipo
    if (activeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === activeFilter);
    }

    // Filtro por busca
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'project': return <FiFolder />;
      case 'wiki': return <FiFileText />;
      case 'note': return <FiCode />;
      case 'sql': return <FiDatabase />;
      default: return <FiFileText />;
    }
  };

  const stats = [
    {
      icon: <FiFolder />,
      value: items.filter(i => i.type === 'project').length,
      label: 'Projetos',
      color: '#3b82f6',
    },
    {
      icon: <FiFileText />,
      value: items.filter(i => i.type === 'wiki').length,
      label: 'Wiki Entries',
      color: '#10b981',
    },
    {
      icon: <FiCode />,
      value: items.filter(i => i.type === 'note').length,
      label: 'Notas',
      color: '#f59e0b',
    },
    {
      icon: <FiDatabase />,
      value: items.filter(i => i.type === 'sql').length,
      label: 'SQL Scripts',
      color: '#ef4444',
    },
  ];

  if (loading) {
    return (
      <PageContainer>
        <ContentWrapper>
          <EmptyState>
            <h3>Carregando...</h3>
          </EmptyState>
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <PageHeader>
          <PageTitle>Timeline</PageTitle>
          <PageSubtitle>
            Acompanhe todas as atividades e atualizações dos seus projetos
          </PageSubtitle>
        </PageHeader>

        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard key={index}>
              <StatIcon color={stat.color}>
                {stat.icon}
              </StatIcon>
              <StatInfo>
                <h4>{stat.value}</h4>
                <p>{stat.label}</p>
              </StatInfo>
            </StatCard>
          ))}
        </StatsGrid>

        <FiltersBar>
          <SearchInput>
            <FiSearch />
            <input
              type="text"
              placeholder="Buscar por título ou conteúdo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchInput>

          <FilterButton
            active={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
          >
            <FiFilter />
            Todos
          </FilterButton>
          <FilterButton
            active={activeFilter === 'project'}
            onClick={() => setActiveFilter('project')}
          >
            <FiFolder />
            Projetos
          </FilterButton>
          <FilterButton
            active={activeFilter === 'wiki'}
            onClick={() => setActiveFilter('wiki')}
          >
            <FiFileText />
            Wiki
          </FilterButton>
          <FilterButton
            active={activeFilter === 'note'}
            onClick={() => setActiveFilter('note')}
          >
            <FiCode />
            Notas
          </FilterButton>
          <FilterButton
            active={activeFilter === 'sql'}
            onClick={() => setActiveFilter('sql')}
          >
            <FiDatabase />
            SQL
          </FilterButton>
        </FiltersBar>

        {filteredItems.length === 0 ? (
          <EmptyState>
            <h3>Nenhum item encontrado</h3>
            <p>
              {searchQuery || activeFilter !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando seus primeiros projetos e notas'}
            </p>
          </EmptyState>
        ) : (
          <TimelineContainer>
            {filteredItems.map((item) => (
              <TimelineItem key={item.id}>
                <TimelineDot type={item.type} />
                <TimelineCard>
                  <CardHeader>
                    <div>
                      <CardTitle>{item.title}</CardTitle>
                      <CardMeta>
                        <span>
                          {getTypeIcon(item.type)}
                          {item.type === 'project' ? 'Projeto' :
                           item.type === 'wiki' ? 'Wiki' :
                           item.type === 'note' ? 'Nota' : 'SQL Script'}
                        </span>
                        <span>
                          <FiCalendar />
                          {format(new Date(item.date), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                        <span>
                          <FiUser />
                          {item.author}
                        </span>
                      </CardMeta>
                    </div>
                    <CardTags>
                      <Tag type={item.isPublic ? 'public' : 'private'}>
                        {item.isPublic ? <FiUnlock /> : <FiLock />}
                        {item.isPublic ? 'Público' : 'Privado'}
                      </Tag>
                    </CardTags>
                  </CardHeader>
                  
                  <CardContent>
                    {item.content.substring(0, 200)}
                    {item.content.length > 200 && '...'}
                  </CardContent>

                  {(item.tags || item.language || item.framework) && (
                    <CardTags>
                      {item.language && <Tag>{item.language}</Tag>}
                      {item.framework && <Tag>{item.framework}</Tag>}
                      {item.tags?.map(tag => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </CardTags>
                  )}
                </TimelineCard>
              </TimelineItem>
            ))}
          </TimelineContainer>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};
