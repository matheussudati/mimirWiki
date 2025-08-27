// Tipos estendidos para o sistema completo

export interface Favorite {
  id: string;
  userId: string;
  targetType: 'project' | 'wiki' | 'note' | 'sql';
  targetId: string;
  createdAt: string;
}

export interface Invitation {
  id: string;
  inviteCode: string;
  fromUserId: string;
  toEmail: string;
  projectId?: string;
  role: 'viewer' | 'editor' | 'admin';
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  message?: string;
  createdAt: string;
  expiresAt: string;
  acceptedAt?: string;
}

export interface ShareLink {
  id: string;
  shortId: string; // ID curto para URLs
  targetType: 'project' | 'wiki' | 'note' | 'sql';
  targetId: string;
  createdBy: string;
  password?: string; // Senha opcional
  expiresAt?: string;
  maxViews?: number;
  currentViews: number;
  isActive: boolean;
  createdAt: string;
  lastAccessedAt?: string;
  metadata?: {
    title: string;
    description: string;
    thumbnail?: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  type: 'invite' | 'comment' | 'mention' | 'like' | 'share' | 'system';
  title: string;
  message: string;
  actionUrl?: string;
  relatedId?: string;
  relatedType?: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  priority: 'low' | 'medium' | 'high';
  icon?: string;
}

export interface Collaboration {
  id: string;
  projectId: string;
  userId: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canInvite: boolean;
    canExport: boolean;
    canComment: boolean;
  };
  joinedAt: string;
  lastActiveAt: string;
  contributions: number;
}

export interface Version {
  id: string;
  documentId: string;
  documentType: 'wiki' | 'note' | 'sql';
  version: string; // ex: "1.0.0"
  content: string;
  changes: string[];
  authorId: string;
  createdAt: string;
  message?: string; // Mensagem de commit
  size: number;
  diff?: {
    additions: number;
    deletions: number;
    changes: string[];
  };
}

export interface Activity {
  id: string;
  userId: string;
  action: 'create' | 'update' | 'delete' | 'share' | 'comment' | 'like' | 'favorite';
  targetType: string;
  targetId: string;
  targetTitle?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
  description?: string;
  usageCount: number;
  createdBy: string;
  createdAt: string;
  isPublic: boolean;
}

export interface DailyNote {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  title?: string;
  content: string;
  mood?: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  tags: string[];
  tasks: {
    id: string;
    text: string;
    completed: boolean;
    priority?: 'low' | 'medium' | 'high';
  }[];
  highlights: string[];
  gratitude?: string[];
  goals?: string[];
  isPrivate: boolean;
  weather?: string;
  location?: string;
  attachments?: {
    id: string;
    type: 'image' | 'file' | 'link';
    url: string;
    name: string;
    size?: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'project' | 'wiki' | 'note' | 'sql' | 'daily';
  content: string;
  variables?: {
    name: string;
    type: 'text' | 'number' | 'date' | 'select';
    default?: any;
    options?: string[];
    required?: boolean;
  }[];
  icon?: string;
  color?: string;
  isPublic: boolean;
  usageCount: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchHistory {
  id: string;
  userId: string;
  query: string;
  filters?: Record<string, any>;
  resultsCount: number;
  clickedResults?: string[];
  createdAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  name: string;
  url: string;
  type: 'internal' | 'external';
  targetId?: string;
  targetType?: string;
  folder?: string;
  tags: string[];
  description?: string;
  favicon?: string;
  screenshot?: string;
  createdAt: string;
  lastVisitedAt?: string;
  visitCount: number;
}

export interface Integration {
  id: string;
  userId: string;
  type: 'github' | 'gitlab' | 'bitbucket' | 'slack' | 'discord' | 'notion' | 'jira';
  name: string;
  config: Record<string, any>;
  isActive: boolean;
  lastSyncAt?: string;
  syncStatus?: 'success' | 'failed' | 'pending';
  webhookUrl?: string;
  apiKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Export {
  id: string;
  userId: string;
  type: 'pdf' | 'markdown' | 'html' | 'json' | 'csv';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  targetType: string;
  targetId: string;
  url?: string;
  size?: number;
  error?: string;
  options?: {
    includeComments?: boolean;
    includeMetadata?: boolean;
    includeHistory?: boolean;
    format?: string;
  };
  createdAt: string;
  completedAt?: string;
  expiresAt?: string;
}

export interface Statistics {
  userId: string;
  period: 'day' | 'week' | 'month' | 'year' | 'all';
  metrics: {
    totalProjects: number;
    totalWikiEntries: number;
    totalNotes: number;
    totalSqlScripts: number;
    totalComments: number;
    totalLikes: number;
    totalViews: number;
    totalShares: number;
    totalCollaborators: number;
    storageUsed: number; // em bytes
    activeTime: number; // em minutos
    productivityScore: number; // 0-100
    streakDays: number;
    contributionMap: Record<string, number>; // data -> count
  };
  topTags: { name: string; count: number }[];
  topProjects: { id: string; name: string; activity: number }[];
  recentActivity: Activity[];
  calculatedAt: string;
}
