export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  createdAt: string;
  role: 'admin' | 'user';
  lastLogin?: string;
  isActive?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  framework: string;
  dependencies: {
    npm: string[];
    java: string[];
  };
  repository?: string;
  status: 'active' | 'completed' | 'archived';
  authorId: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  likes: number;
  views: number;
}

export interface WikiEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  authorId: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  likes: number;
  views: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  projectId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  type: 'bug' | 'feature' | 'improvement' | 'note';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  wikiEntryId?: string;
  projectId?: string;
  noteId?: string;
  createdAt: string;
  likes: number;
}

export interface SqlScript {
  id: string;
  name: string;
  description: string;
  content: string;
  projectId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  database: string;
  version: string;
}

export interface Like {
  id: string;
  userId: string;
  targetType: 'wikiEntry' | 'project' | 'comment' | 'note';
  targetId: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean }>;
  logout: () => void;
  updateProfile?: (updates: Partial<User>) => Promise<{ success: boolean }>;
  changePassword?: (currentPassword: string, newPassword: string) => Promise<{ success: boolean }>;
  loading: boolean;
}

export interface SearchFilters {
  category?: string;
  tags?: string[];
  author?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  projectId?: string;
}

export interface ProjectFilters {
  language?: string;
  framework?: string;
  status?: string;
  isPublic?: boolean;
}

export interface DatabaseService {
  // Users
  getUsers: () => Promise<User[]>;
  getUserById: (id: string) => Promise<User | null>;
  createUser: (user: Omit<User, 'id'>) => Promise<User>;
  updateUser: (id: string, user: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  
  // Projects
  getProjects: (filters?: ProjectFilters) => Promise<Project[]>;
  getProjectById: (id: string) => Promise<Project | null>;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'views'>) => Promise<Project>;
  updateProject: (id: string, project: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  
  // Wiki Entries
  getWikiEntries: (filters?: SearchFilters) => Promise<WikiEntry[]>;
  getWikiEntryById: (id: string) => Promise<WikiEntry | null>;
  createWikiEntry: (entry: Omit<WikiEntry, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'views'>) => Promise<WikiEntry>;
  updateWikiEntry: (id: string, entry: Partial<WikiEntry>) => Promise<WikiEntry>;
  deleteWikiEntry: (id: string) => Promise<void>;
  
  // Notes
  getNotes: (projectId?: string) => Promise<Note[]>;
  getNoteById: (id: string) => Promise<Note | null>;
  createNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Note>;
  updateNote: (id: string, note: Partial<Note>) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  
  // Comments
  getComments: (targetType: string, targetId: string) => Promise<Comment[]>;
  createComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => Promise<Comment>;
  updateComment: (id: string, comment: Partial<Comment>) => Promise<Comment>;
  deleteComment: (id: string) => Promise<void>;
  
  // SQL Scripts
  getSqlScripts: (projectId?: string) => Promise<SqlScript[]>;
  getSqlScriptById: (id: string) => Promise<SqlScript | null>;
  createSqlScript: (script: Omit<SqlScript, 'id' | 'createdAt' | 'updatedAt'>) => Promise<SqlScript>;
  updateSqlScript: (id: string, script: Partial<SqlScript>) => Promise<SqlScript>;
  deleteSqlScript: (id: string) => Promise<void>;
  
  // Likes
  toggleLike: (userId: string, targetType: string, targetId: string) => Promise<void>;
  getLikes: (targetType: string, targetId: string) => Promise<Like[]>;
}
