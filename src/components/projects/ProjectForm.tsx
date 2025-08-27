import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Button } from "../ui/Button";
import { Input, TextArea } from "../ui/Input";
import { MaskedInput } from "../ui/MaskedInput";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { FiX, FiSave, FiPlus, FiTrash2 } from "react-icons/fi";
import { Project } from "../../types";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ModalContent = styled(Card)`
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const ModalHeader = styled(CardHeader)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
    color: ${({ theme }) => theme.colors.text.secondary};
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
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border: 2px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1rem;
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[50]};
  }
`;

const DependenciesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const DependencySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const DependencyInput = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const DependencyTag = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[600]};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.875rem;
  font-weight: 500;
`;

const RemoveDependencyButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.error[500]};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;

  &:hover {
    color: ${({ theme }) => theme.colors.error[600]};
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
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const languages = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C#",
  "PHP",
  "Go",
  "Rust",
  "Ruby",
  "Swift",
];
const frameworks = [
  "React",
  "Vue",
  "Angular",
  "Node.js",
  "Express",
  "Django",
  "Flask",
  "Spring",
  ".NET",
  "Laravel",
];

interface ProjectFormData {
  name: string;
  description: string;
  language: string;
  framework: string;
  repository: string;
  isPublic: boolean;
}

interface ProjectFormProps {
  project?: Project;
  onSave: (
    data: ProjectFormData & { dependencies: { npm: string[]; java: string[] } }
  ) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onSave,
  onCancel,
  loading = false,
}) => {
  const [dependencies, setDependencies] = useState<{
    npm: string[];
    java: string[];
  }>(project?.dependencies || { npm: [], java: [] });
  const [newNpmDep, setNewNpmDep] = useState("");
  const [newJavaDep, setNewJavaDep] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      language: project?.language || "",
      framework: project?.framework || "",
      repository: project?.repository || "",
      isPublic: project?.isPublic || false,
    },
  });

  const addNpmDependency = () => {
    const trimmed = newNpmDep.trim();
    if (trimmed && !dependencies.npm.includes(trimmed)) {
      setDependencies({
        ...dependencies,
        npm: [...dependencies.npm, trimmed],
      });
      setNewNpmDep("");
    }
  };

  const removeNpmDependency = (dep: string) => {
    setDependencies({
      ...dependencies,
      npm: dependencies.npm.filter((d) => d !== dep),
    });
  };

  const addJavaDependency = () => {
    const trimmed = newJavaDep.trim();
    if (trimmed && !dependencies.java.includes(trimmed)) {
      setDependencies({
        ...dependencies,
        java: [...dependencies.java, trimmed],
      });
      setNewJavaDep("");
    }
  };

  const removeJavaDependency = (dep: string) => {
    setDependencies({
      ...dependencies,
      java: dependencies.java.filter((d) => d !== dep),
    });
  };

  const onSubmit = (data: ProjectFormData) => {
    onSave({ ...data, dependencies });
  };

  return (
    <ModalOverlay onClick={onCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <CardTitle>{project ? "Editar Projeto" : "Novo Projeto"}</CardTitle>
          <CloseButton onClick={onCancel}>
            <FiX size={20} />
          </CloseButton>
        </ModalHeader>

        <CardContent>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label htmlFor="name">Nome do Projeto</Label>
              <MaskedInput
                id="name"
                placeholder="Digite o nome do projeto"
                fullWidth
                mask="alphanumeric"
                error={!!errors.name}
                {...register("name", {
                  required: "Nome é obrigatório",
                })}
              />
              {errors.name && (
                <ErrorMessage>{errors.name.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description">Descrição</Label>
              <TextArea
                id="description"
                placeholder="Descreva o projeto..."
                fullWidth
                error={!!errors.description}
                {...register("description", {
                  required: "Descrição é obrigatória",
                })}
              />
              {errors.description && (
                <ErrorMessage>{errors.description.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="language">Linguagem</Label>
              <Select
                id="language"
                {...register("language", {
                  required: "Linguagem é obrigatória",
                })}
              >
                <option value="">Selecione uma linguagem</option>
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </Select>
              {errors.language && (
                <ErrorMessage>{errors.language.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="framework">Framework</Label>
              <Select
                id="framework"
                {...register("framework", {
                  required: "Framework é obrigatório",
                })}
              >
                <option value="">Selecione um framework</option>
                {frameworks.map((framework) => (
                  <option key={framework} value={framework}>
                    {framework}
                  </option>
                ))}
              </Select>
              {errors.framework && (
                <ErrorMessage>{errors.framework.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="repository">Repositório (opcional)</Label>
              <MaskedInput
                id="repository"
                placeholder="https://github.com/usuario/projeto"
                fullWidth
                mask="url"
                {...register("repository")}
              />
            </FormGroup>

            <FormGroup>
              <Label>Dependências</Label>
              <DependenciesContainer>
                <DependencySection>
                  <Label>NPM Dependencies</Label>
                  <DependencyInput>
                    <Input
                      value={newNpmDep}
                      onChange={(e) => setNewNpmDep(e.target.value)}
                      placeholder="react@18.2.0"
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addNpmDependency())
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addNpmDependency}
                    >
                      <FiPlus size={14} />
                    </Button>
                  </DependencyInput>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                  >
                    {dependencies.npm.map((dep) => (
                      <DependencyTag key={dep}>
                        {dep}
                        <RemoveDependencyButton
                          onClick={() => removeNpmDependency(dep)}
                        >
                          <FiTrash2 size={12} />
                        </RemoveDependencyButton>
                      </DependencyTag>
                    ))}
                  </div>
                </DependencySection>

                <DependencySection>
                  <Label>Java Dependencies</Label>
                  <DependencyInput>
                    <Input
                      value={newJavaDep}
                      onChange={(e) => setNewJavaDep(e.target.value)}
                      placeholder="spring-boot-starter-web"
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addJavaDependency())
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addJavaDependency}
                    >
                      <FiPlus size={14} />
                    </Button>
                  </DependencyInput>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                  >
                    {dependencies.java.map((dep) => (
                      <DependencyTag key={dep}>
                        {dep}
                        <RemoveDependencyButton
                          onClick={() => removeJavaDependency(dep)}
                        >
                          <FiTrash2 size={12} />
                        </RemoveDependencyButton>
                      </DependencyTag>
                    ))}
                  </div>
                </DependencySection>
              </DependenciesContainer>
            </FormGroup>

            <FormGroup>
              <CheckboxContainer>
                <input
                  type="checkbox"
                  id="isPublic"
                  {...register("isPublic")}
                />
                <Label htmlFor="isPublic">Tornar público</Label>
              </CheckboxContainer>
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
