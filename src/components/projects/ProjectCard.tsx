import React from 'react';
import styled from 'styled-components';
import { Project, User } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { FiEdit, FiTrash2, FiEye, FiCode, FiGitBranch, FiStar, FiUsers } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const StyledCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  transition: all 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const ProjectTitle = styled(CardTitle)`
  font-size: 1.125rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ProjectContent = styled(CardContent)`
  flex: 1;
  overflow: hidden;
  
  p {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: ${({ theme }) => theme.colors.text.secondary};
    line-height: 1.5;
  }
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const TechTag = styled.span`
  background-color: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[600]};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 500;
`;

const DependenciesContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const DependenciesTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const DependenciesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const DependencyTag = styled.span`
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  color: ${({ theme }) => theme.colors.text.tertiary};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 400;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.muted};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StatusBadge = styled.span<{ status: string }>`
  background-color: ${({ status, theme }) => {
    switch (status) {
      case 'active':
        return theme.colors.success[100];
      case 'completed':
        return theme.colors.info[100];
      case 'archived':
        return theme.colors.gray[100];
      default:
        return theme.colors.gray[100];
    }
  }};
  color: ${({ status, theme }) => {
    switch (status) {
      case 'active':
        return theme.colors.success[600];
      case 'completed':
        return theme.colors.info[600];
      case 'archived':
        return theme.colors.gray[600];
      default:
        return theme.colors.gray[600];
    }
  }};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.875rem;
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

interface ProjectCardProps {
  project: Project;
  author?: User;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onView?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  author,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <StyledCard hover>
      <CardHeader>
        <div>
          <ProjectTitle>{project.name}</ProjectTitle>
          <StatusBadge status={project.status}>
            {project.status === 'active' ? 'Ativo' : 
             project.status === 'completed' ? 'Concluído' : 'Arquivado'}
          </StatusBadge>
        </div>
      </CardHeader>

      <ProjectContent>
        <MetaInfo>
          <MetaItem>
            <FiCode />
            {project.language}
          </MetaItem>
          <MetaItem>
            <FiGitBranch />
            {project.framework}
          </MetaItem>
        </MetaInfo>

        <p>{project.description}</p>

        <TechStack>
          <TechTag>{project.language}</TechTag>
          <TechTag>{project.framework}</TechTag>
        </TechStack>

        {(project.dependencies.npm.length > 0 || project.dependencies.java.length > 0) && (
          <DependenciesContainer>
            <DependenciesTitle>Dependências principais:</DependenciesTitle>
            <DependenciesList>
              {project.dependencies.npm.slice(0, 3).map((dep) => (
                <DependencyTag key={dep}>{dep}</DependencyTag>
              ))}
              {project.dependencies.java.slice(0, 2).map((dep) => (
                <DependencyTag key={dep}>{dep}</DependencyTag>
              ))}
              {(project.dependencies.npm.length + project.dependencies.java.length) > 5 && (
                <DependencyTag>+{(project.dependencies.npm.length + project.dependencies.java.length) - 5}</DependencyTag>
              )}
            </DependenciesList>
          </DependenciesContainer>
        )}

        <StatsContainer>
          <Stat>
            <FiStar />
            {project.likes}
          </Stat>
          <Stat>
            <FiUsers />
            {project.views}
          </Stat>
          <Stat>
            {format(new Date(project.updatedAt), 'dd/MM/yyyy', { locale: ptBR })}
          </Stat>
        </StatsContainer>
      </ProjectContent>

      <CardFooter>
        <ActionsContainer>
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(project)}
            >
              <FiEye size={14} />
              Ver
            </Button>
          )}
          
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(project)}
            >
              <FiEdit size={14} />
              Editar
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(project)}
            >
              <FiTrash2 size={14} />
              Excluir
            </Button>
          )}
        </ActionsContainer>
      </CardFooter>
    </StyledCard>
  );
};
