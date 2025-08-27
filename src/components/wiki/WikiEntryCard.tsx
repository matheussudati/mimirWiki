import React from 'react';
import styled from 'styled-components';
import { WikiEntry, User } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { FiEdit, FiTrash2, FiEye, FiTag, FiUser, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const StyledCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const EntryTitle = styled(CardTitle)`
  font-size: 1.125rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const EntryContent = styled(CardContent)`
  flex: 1;
  overflow: hidden;
  
  p {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: ${({ theme }) => theme.colors.gray[600]};
    line-height: 1.5;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const Tag = styled.span`
  background-color: ${({ theme }) => theme.colors.primary[50]};
  color: ${({ theme }) => theme.colors.primary[600]};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 500;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray[500]};
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

const CategoryBadge = styled.span`
  background-color: ${({ theme }) => theme.colors.gray[100]};
  color: ${({ theme }) => theme.colors.gray[700]};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

interface WikiEntryCardProps {
  entry: WikiEntry;
  author?: User;
  onEdit?: (entry: WikiEntry) => void;
  onDelete?: (entry: WikiEntry) => void;
  onView?: (entry: WikiEntry) => void;
}

export const WikiEntryCard: React.FC<WikiEntryCardProps> = ({
  entry,
  author,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <StyledCard hover>
      <CardHeader>
        <div>
          <EntryTitle>{entry.title}</EntryTitle>
          <CategoryBadge>{entry.category}</CategoryBadge>
        </div>
      </CardHeader>

      <EntryContent>
        <MetaInfo>
          <MetaItem>
            <FiUser />
            {author?.name || 'Usuário'}
          </MetaItem>
          <MetaItem>
            <FiCalendar />
            {format(new Date(entry.updatedAt), 'dd/MM/yyyy', { locale: ptBR })}
          </MetaItem>
        </MetaInfo>

        <p>{entry.content}</p>

        {entry.tags.length > 0 && (
          <TagsContainer>
            {entry.tags.slice(0, 3).map((tag) => (
              <Tag key={tag}>
                <FiTag size={10} />
                {tag}
              </Tag>
            ))}
            {entry.tags.length > 3 && (
              <Tag>+{entry.tags.length - 3}</Tag>
            )}
          </TagsContainer>
        )}
      </EntryContent>

      <CardFooter>
        <ActionsContainer>
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(entry)}
            >
              <FiEye size={14} />
              Ver
            </Button>
          )}
          
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(entry)}
            >
              <FiEdit size={14} />
              Editar
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(entry)}
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
