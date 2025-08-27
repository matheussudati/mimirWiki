import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${({ theme }) => theme.colors.background.primary};
    color: ${({ theme }) => theme.colors.text.primary};
    line-height: 1.6;
    transition: all ${({ theme }) => theme.transitions.default};
    overflow-x: hidden;
  }

  html {
    scroll-behavior: smooth;
  }

  code {
    font-family: 'Fira Code', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace;
    background-color: ${({ theme }) => theme.colors.background.tertiary};
    color: ${({ theme }) => theme.colors.text.secondary};
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) =>
  theme.spacing.sm};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-size: 0.875rem;
  }

  pre {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
    border: 1px solid ${({ theme }) => theme.colors.border.primary};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: ${({ theme }) => theme.spacing.lg};
    overflow-x: auto;
    margin: ${({ theme }) => theme.spacing.md} 0;
    
    code {
      background: none;
      padding: 0;
      border-radius: 0;
    }
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
    transition: all ${({ theme }) => theme.transitions.default};
  }

  input, textarea, select {
    outline: none;
    border: none;
    font-family: inherit;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
    transition: all ${({ theme }) => theme.transitions.default};
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.text.muted};
    }
  }

  a {
    text-decoration: none;
    color: inherit;
    transition: color ${({ theme }) => theme.transitions.default};
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary[400]};
    }
  }

  ul, ol {
    list-style: none;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
    line-height: ${({ theme }) => theme.typography.lineHeights.tight};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSizes["4xl"]};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSizes["3xl"]};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSizes["2xl"]};
  }

  h4 {
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  }

  h5 {
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  }

  h6 {
    font-size: ${({ theme }) => theme.typography.fontSizes.base};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  }

  img {
    max-width: 100%;
    height: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: ${({ theme }) => theme.spacing.md} 0;
    
    th, td {
      padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) =>
  theme.spacing.md};
      text-align: left;
      border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
    }
    
    th {
      background-color: ${({ theme }) => theme.colors.background.secondary};
      font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
    }
    
    tr:hover {
      background-color: ${({ theme }) => theme.colors.background.tertiary};
    }
  }

  blockquote {
    border-left: 4px solid ${({ theme }) => theme.colors.primary[500]};
    padding-left: ${({ theme }) => theme.spacing.lg};
    margin: ${({ theme }) => theme.spacing.lg} 0;
    font-style: italic;
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  hr {
    border: none;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.border.primary};
    margin: ${({ theme }) => theme.spacing.xl} 0;
  }

  /* Scrollbar personalizada */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.secondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border.secondary};
    border-radius: ${({ theme }) => theme.borderRadius.full};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.border.accent};
  }

  /* Seleção de texto */
  ::selection {
    background-color: ${({ theme }) => theme.colors.primary[500]};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  /* Focus visible para acessibilidade */
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 2px;
  }

  /* Animações fluidas */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes scaleIn {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .fade-in {
    animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .slide-in {
    animation: slideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .slide-in-right {
    animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .scale-in {
    animation: scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .float {
    animation: float 3s ease-in-out infinite;
  }

  /* Hover effects */
  .hover-lift {
    transition: transform ${({ theme }) => theme.transitions.default};
  }

  .hover-lift:hover {
    transform: translateY(-4px);
  }

  .hover-glow {
    transition: box-shadow ${({ theme }) => theme.transitions.default};
  }

  .hover-glow:hover {
    box-shadow: 0 0 30px rgba(99, 102, 241, 0.3);
  }

  /* Força desabilitação completa do autocomplete */
  input[autocomplete="off"],
  input[autocomplete="new-password"],
  input[data-lpignore="true"],
  form[autocomplete="off"] input {
    background-color: white !important;
    -webkit-background-clip: text !important;
    transition: background-color 0s 5000s !important;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    -webkit-text-fill-color: initial !important;
    transition: background-color 0s 5000s !important;
  }

  /* Remove dropdown de autocomplete */
  input::-webkit-contacts-auto-fill-button,
  input::-webkit-credentials-auto-fill-button {
    visibility: hidden;
    display: none !important;
    pointer-events: none;
    height: 0;
    width: 0;
    margin: 0;
  }
`;
