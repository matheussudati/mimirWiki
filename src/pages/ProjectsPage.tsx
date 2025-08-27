import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Project } from '../types';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectForm } from '../components/projects/ProjectForm';
import { Button } from '../components/ui/Button';
import { FiPlus, FiGrid, FiList, FiFilter } from 'react-icons/fi';
import { databaseService } from '../services/databaseService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';

const PageContainer = styled.div`
  margin-left: 250px;
  padding: ${({ theme }) => theme.spacing.xl};
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.primary};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-left: 0;
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const ViewToggle = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const ViewButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ active, theme }) => 
    active ? theme.colors.primary[500] : 'transparent'};
  color: ${({ active, theme }) => 
    active ? theme.colors.text.primary : theme.colors.text.secondary};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: ${({ active, theme }) => 
      active ? theme.colors.primary[600] : theme.colors.background.tertiary};
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
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.primary};
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
      ? 'repeat(auto-fill, minmax(350px, 1fr))' 
      : '1fr'};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.text.muted};
  
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

const languages = ['Todos', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'PHP', 'Go', 'Rust', 'Ruby', 'Swift'];
const statuses = ['Todos', 'active', 'completed', 'archived'];

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedLanguage, setSelectedLanguage] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { success, error: showError } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    if (selectedLanguage !== 'Todos') {
      filtered = filtered.filter(project => project.language === selectedLanguage);
    }

    if (selectedStatus !== 'Todos') {
      filtered = filtered.filter(project => project.status === selectedStatus);
    }

    setFilteredProjects(filtered);
  }, [projects, selectedLanguage, selectedStatus]);

  const loadProjects = async () => {
    try {
      const projectsData = await databaseService.getProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      showError('Erro', 'Erro ao carregar projetos');
    }
  };

  const handleAddNew = () => {
    setEditingProject(undefined);
    setShowForm(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (project: Project) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        await databaseService.deleteProject(project.id);
        setProjects(projects.filter(p => p.id !== project.id));
        success('Sucesso', 'Projeto excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir projeto:', error);
        showError('Erro', 'Erro ao excluir projeto');
      }
    }
  };

  const handleSave = async (data: any) => {
    setLoading(true);
    
    try {
      if (editingProject) {
        // Editar projeto existente
        const updatedProject = await databaseService.updateProject(editingProject.id, data);
        setProjects(projects.map(project =>
          project.id === editingProject.id ? updatedProject : project
        ));
        success('Sucesso', 'Projeto atualizado com sucesso!');
      } else {
        // Criar novo projeto
        const newProject = await databaseService.createProject({
          ...data,
          authorId: user?.id || '1',
          status: 'active' as const,
        });
        setProjects([newProject, ...projects]);
        success('Sucesso', 'Projeto criado com sucesso!');
      }
      
      setShowForm(false);
      setEditingProject(undefined);
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      showError('Erro', 'Erro ao salvar projeto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Projetos</PageTitle>
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
            Novo Projeto
          </Button>
        </ControlsContainer>
      </PageHeader>

      <FiltersContainer>
        <FilterSelect
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          {languages.map(language => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          {statuses.map(status => (
            <option key={status} value={status}>
              {status === 'Todos' ? 'Todos' : 
               status === 'active' ? 'Ativo' : 
               status === 'completed' ? 'Concluído' : 'Arquivado'}
            </option>
          ))}
        </FilterSelect>
      </FiltersContainer>

      {filteredProjects.length === 0 ? (
        <EmptyState>
          <h3>Nenhum projeto encontrado</h3>
          <p>
            {selectedLanguage !== 'Todos' || selectedStatus !== 'Todos'
              ? 'Tente ajustar os filtros de busca'
              : 'Comece criando seu primeiro projeto'
            }
          </p>
          {selectedLanguage === 'Todos' && selectedStatus === 'Todos' && (
            <Button onClick={handleAddNew}>
              <FiPlus size={16} />
              Criar Primeiro Projeto
            </Button>
          )}
        </EmptyState>
      ) : (
        <GridContainer viewMode={viewMode}>
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </GridContainer>
      )}

      {showForm && (
        <ProjectForm
          project={editingProject}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingProject(undefined);
          }}
          loading={loading}
        />
      )}
    </PageContainer>
  );
};
