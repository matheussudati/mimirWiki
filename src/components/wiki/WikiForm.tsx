import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Button } from "../ui/Button";
import { TextArea } from "../ui/Input";
import { MaskedInput } from "../ui/MaskedInput";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { FiX, FiTag, FiSave } from "react-icons/fi";
import { WikiEntry } from "../../types";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ModalContent = styled(Card)`
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled(CardHeader)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray[400]};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[600]};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: 0.875rem;
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border: 2px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: white;
  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: 1rem;
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[50]};
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  min-height: 60px;
  background-color: white;
`;

const Tag = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.primary[50]};
  color: ${({ theme }) => theme.colors.primary[600]};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.875rem;
  font-weight: 500;
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary[600]};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;

  &:hover {
    color: ${({ theme }) => theme.colors.error[500]};
  }
`;

const TagInput = styled.input`
  border: none;
  outline: none;
  background: none;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray[900]};
  min-width: 100px;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.error[500]};
  font-size: 0.875rem;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const categories = ["Frontend", "Backend", "Banco de Dados"];

interface WikiFormData {
  title: string;
  content: string;
  category: string;
  isPublic: boolean;
}

interface WikiFormProps {
  entry?: WikiEntry;
  onSave: (data: WikiFormData & { tags: string[] }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const WikiForm: React.FC<WikiFormProps> = ({
  entry,
  onSave,
  onCancel,
  loading = false,
}) => {
  const [tags, setTags] = useState<string[]>(entry?.tags || []);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WikiFormData>({
    defaultValues: {
      title: entry?.title || "",
      content: entry?.content || "",
      category: entry?.category || "",
      isPublic: entry?.isPublic || false,
    },
  });

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const onSubmit = (data: WikiFormData) => {
    onSave({ ...data, tags });
  };

  return (
    <ModalOverlay onClick={onCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <CardTitle>{entry ? "Editar Entrada" : "Nova Entrada"}</CardTitle>
          <CloseButton onClick={onCancel}>
            <FiX size={20} />
          </CloseButton>
        </ModalHeader>

        <CardContent>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label htmlFor="title">Título</Label>
              <MaskedInput
                id="title"
                placeholder="Digite o título da entrada"
                fullWidth
                mask="alphanumeric"
                error={!!errors.title}
                {...register("title", {
                  required: "Título é obrigatório",
                })}
              />
              {errors.title && (
                <ErrorMessage>{errors.title.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="category">Categoria</Label>
              <Select
                id="category"
                {...register("category", {
                  required: "Categoria é obrigatória",
                })}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
              {errors.category && (
                <ErrorMessage>{errors.category.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="content">Conteúdo</Label>
              <TextArea
                id="content"
                placeholder="Digite o conteúdo da entrada..."
                fullWidth
                error={!!errors.content}
                {...register("content", {
                  required: "Conteúdo é obrigatório",
                })}
              />
              {errors.content && (
                <ErrorMessage>{errors.content.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Tags</Label>
              <TagsContainer>
                {tags.map((tag) => (
                  <Tag key={tag}>
                    <FiTag size={12} />
                    {tag}
                    <RemoveTagButton onClick={() => removeTag(tag)}>
                      <FiX size={12} />
                    </RemoveTagButton>
                  </Tag>
                ))}
                <TagInput
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  onBlur={() => addTag(tagInput)}
                  placeholder="Adicionar tag..."
                />
              </TagsContainer>
            </FormGroup>

            <FormGroup>
              <Label>
                <input type="checkbox" {...register("isPublic")} /> Tornar
                pública
              </Label>
            </FormGroup>

            <ActionsContainer>
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                <FiSave size={16} />
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </ActionsContainer>
          </Form>
        </CardContent>
      </ModalContent>
    </ModalOverlay>
  );
};
