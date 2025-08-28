import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { DashboardPage } from "./pages/DashboardPage";
import { WikiPage } from "./pages/WikiPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { theme } from "./styles/theme";
import { GlobalStyles } from "./styles/GlobalStyles";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppLayout: React.FC = () => {
  return (
    <>
      <Header />
      <Sidebar />
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/wiki" element={<WikiPage />} />
        <Route path="/wiki/category/:category" element={<WikiPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/settings" element={<div>Configurações</div>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
