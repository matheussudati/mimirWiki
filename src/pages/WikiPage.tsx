import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { WikiEntry } from '../types';
import { WikiEntryCard } from '../components/wiki/WikiEntryCard';
import { WikiForm } from '../components/wiki/WikiForm';
import { Button } from '../components/ui/Button';
import { FiPlus, FiGrid, FiList } from 'react-icons/fi';
import toast from 'react-hot-toast';

const PageContainer = styled.div`
  margin-left: 250px;
  padding: ${({ theme }) => theme.spacing.xl};
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.gray[50]};
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ViewToggle = styled.div`
  display: flex;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const ViewButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ active, theme }) => 
    active ? theme.colors.primary[600] : 'transparent'};
  color: ${({ active, theme }) => 
    active ? 'white' : theme.colors.gray[600]};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: ${({ active, theme }) => 
      active ? theme.colors.primary[700] : theme.colors.gray[100]};
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: white;
  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const GridContainer = styled.div<{ viewMode: 'grid' | 'list' }>`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-template-columns: ${({ viewMode }) => 
    viewMode === 'grid' 
      ? 'repeat(auto-fill, minmax(300px, 1fr))' 
      : '1fr'};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.gray[500]};
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

// Mock data para demonstração
const mockEntries: WikiEntry[] = [
  {
    id: '1',
    title: 'Como configurar React com TypeScript',
    content: 'Guia completo para configurar um projeto React com TypeScript, incluindo configuração do webpack, ESLint e Prettier...',
    category: 'Frontend',
    tags: ['react', 'typescript', 'webpack'],
    authorId: '1',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z',
    isPublic: true,
    likes: 15,
    views: 234,
  },
  {
    id: '2',
    title: 'Padrões de API REST',
    content: 'Melhores práticas para design de APIs RESTful, incluindo convenções de nomenclatura, códigos de status HTTP e versionamento...',
    category: 'Backend',
    tags: ['api', 'rest', 'http'],
    authorId: '1',
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-18T00:00:00.000Z',
    isPublic: true,
    likes: 22,
    views: 189,
  },
  {
    id: '3',
    title: 'Docker para Desenvolvimento',
    content: 'Como usar Docker para criar ambientes de desenvolvimento consistentes e isolados...',
    category: 'DevOps',
    tags: ['docker', 'containers', 'devops'],
    authorId: '1',
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-12T00:00:00.000Z',
    isPublic: false,
    likes: 8,
    views: 67,
  },
];

const categories = ['Todos', 'Frontend', 'Backend', 'Banco de Dados'];

export const WikiPage: React.FC = () => {
  const [entries, setEntries] = useState<WikiEntry[]>(mockEntries);
  const [filteredEntries, setFilteredEntries] = useState<WikiEntry[]>(entries);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WikiEntry | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let filtered = entries;

    // Filtrar por categoria
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(entry => entry.category === selectedCategory);
    }

    // Filtrar por busca
    if (searchQuery) {
      filtered = filtered.filter(entry =>
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredEntries(filtered);
  }, [entries, selectedCategory, searchQuery]);

  const handleAddNew = () => {
    setEditingEntry(undefined);
    setShowForm(true);
  };

  const handleEdit = (entry: WikiEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDelete = (entry: WikiEntry) => {
    if (window.confirm('Tem certeza que deseja excluir esta entrada?')) {
      setEntries(entries.filter(e => e.id !== entry.id));
      toast.success('Entrada excluída com sucesso!');
    }
  };

  const handleSave = async (data: any) => {
    setLoading(true);
    
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingEntry) {
        // Editar entrada existente
        setEntries(entries.map(entry =>
          entry.id === editingEntry.id
            ? { ...entry, ...data, updatedAt: new Date() }
            : entry
        ));
        toast.success('Entrada atualizada com sucesso!');
      } else {
        // Criar nova entrada
        const newEntry: WikiEntry = {
          id: Date.now().toString(),
          ...data,
          author: {
            id: '1',
            name: 'João Silva',
            email: 'joao@example.com',
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setEntries([newEntry, ...entries]);
        toast.success('Entrada criada com sucesso!');
      }
      
      setShowForm(false);
      setEditingEntry(undefined);
    } catch (error) {
      toast.error('Erro ao salvar entrada');
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com busca (pode ser conectada ao Header)
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Wiki</PageTitle>
        <ControlsContainer>
          <ViewToggle>
            <ViewButton
              active={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
            >
              <FiGrid size={16} />
            </ViewButton>
            <ViewButton
              active={viewMode === 'list'}
              onClick={() => setViewMode('list')}
            >
              <FiList size={16} />
            </ViewButton>
          </ViewToggle>
          
          <Button onClick={handleAddNew}>
            <FiPlus size={16} />
            Nova Entrada
          </Button>
        </ControlsContainer>
      </PageHeader>

      <FiltersContainer>
        <FilterSelect
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </FilterSelect>
      </FiltersContainer>

      {filteredEntries.length === 0 ? (
        <EmptyState>
          <h3>Nenhuma entrada encontrada</h3>
          <p>
            {searchQuery || selectedCategory !== 'Todos'
              ? 'Tente ajustar os filtros de busca'
              : 'Comece criando sua primeira entrada na wiki'
            }
          </p>
          {!searchQuery && selectedCategory === 'Todos' && (
            <Button onClick={handleAddNew}>
              <FiPlus size={16} />
              Criar Primeira Entrada
            </Button>
          )}
        </EmptyState>
      ) : (
        <GridContainer viewMode={viewMode}>
          {filteredEntries.map(entry => (
            <WikiEntryCard
              key={entry.id}
              entry={entry}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </GridContainer>
      )}

      {showForm && (
        <WikiForm
          entry={editingEntry}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingEntry(undefined);
          }}
          loading={loading}
        />
      )}
    </PageContainer>
  );
};
