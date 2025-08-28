import { DatabaseService, User, Project, WikiEntry, Note, Comment, SqlScript, Like, ProjectFilters, SearchFilters } from '../types';
import database from '../data/database.json';

class LocalDatabaseService implements DatabaseService {
  private data: any = { ...database };

  // Métodos auxiliares
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  private saveToLocalStorage() {
    console.log("Saving to localStorage:", this.data);
    try {
      localStorage.setItem('mimir_database', JSON.stringify(this.data));
      console.log("Successfully saved to localStorage");
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  private loadFromLocalStorage() {
    const stored = localStorage.getItem('mimir_database');
    if (stored) {
      this.data = JSON.parse(stored);
    }
  }

  constructor() {
    this.loadFromLocalStorage();
  }

  // Users
  async getUsers(): Promise<User[]> {
    return this.data.users;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.data.users.find((user: any) => user.id === id) || null;
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    console.log("databaseService.createUser called with:", user);
    const newUser: User = {
      ...user,
      id: this.generateId(),
    };
    console.log("Created new user:", newUser);
    this.data.users.push(newUser);
    this.saveToLocalStorage();
    console.log("User saved to database");
    return newUser;
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    const index = this.data.users.findIndex((u: any) => u.id === id);
    if (index === -1) throw new Error('User not found');
    
    this.data.users[index] = { ...this.data.users[index], ...user };
    this.saveToLocalStorage();
    return this.data.users[index];
  }

  async deleteUser(id: string): Promise<void> {
    this.data.users = this.data.users.filter((user: any) => user.id !== id);
    this.saveToLocalStorage();
  }

  // Projects
  async getProjects(filters?: ProjectFilters): Promise<Project[]> {
    let projects = this.data.projects;

    if (filters) {
      if (filters.language) {
        projects = projects.filter((p: any) => p.language === filters.language);
      }
      if (filters.framework) {
        projects = projects.filter((p: any) => p.framework === filters.framework);
      }
      if (filters.status) {
        projects = projects.filter((p: any) => p.status === filters.status);
      }
      if (filters.isPublic !== undefined) {
        projects = projects.filter((p: any) => p.isPublic === filters.isPublic);
      }
    }

    return projects;
  }

  async getProjectById(id: string): Promise<Project | null> {
    return this.data.projects.find((project: any) => project.id === id) || null;
  }

  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'views'>): Promise<Project> {
    const newProject: Project = {
      ...project,
      id: this.generateId(),
      createdAt: this.getCurrentTimestamp(),
      updatedAt: this.getCurrentTimestamp(),
      likes: 0,
      views: 0,
    };
    this.data.projects.push(newProject);
    this.saveToLocalStorage();
    return newProject;
  }

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const index = this.data.projects.findIndex((p: any) => p.id === id);
    if (index === -1) throw new Error('Project not found');
    
    this.data.projects[index] = { 
      ...this.data.projects[index], 
      ...project, 
      updatedAt: this.getCurrentTimestamp() 
    };
    this.saveToLocalStorage();
    return this.data.projects[index];
  }

  async deleteProject(id: string): Promise<void> {
    this.data.projects = this.data.projects.filter((project: any) => project.id !== id);
    this.saveToLocalStorage();
  }

  // Wiki Entries
  async getWikiEntries(filters?: SearchFilters): Promise<WikiEntry[]> {
    let entries = this.data.wikiEntries;

    if (filters) {
      if (filters.category) {
        entries = entries.filter((e: any) => e.category === filters.category);
      }
      if (filters.tags && filters.tags.length > 0) {
        entries = entries.filter((e: any) => 
          filters.tags!.some(tag => e.tags.includes(tag))
        );
      }
      if (filters.author) {
        entries = entries.filter((e: any) => e.authorId === filters.author);
      }
      if (filters.projectId) {
        entries = entries.filter((e: any) => e.projectId === filters.projectId);
      }
    }

    return entries;
  }

  async getWikiEntryById(id: string): Promise<WikiEntry | null> {
    return this.data.wikiEntries.find((entry: any) => entry.id === id) || null;
  }

  async createWikiEntry(entry: Omit<WikiEntry, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'views'>): Promise<WikiEntry> {
    const newEntry: WikiEntry = {
      ...entry,
      id: this.generateId(),
      createdAt: this.getCurrentTimestamp(),
      updatedAt: this.getCurrentTimestamp(),
      likes: 0,
      views: 0,
    };
    this.data.wikiEntries.push(newEntry);
    this.saveToLocalStorage();
    return newEntry;
  }

  async updateWikiEntry(id: string, entry: Partial<WikiEntry>): Promise<WikiEntry> {
    const index = this.data.wikiEntries.findIndex((e: any) => e.id === id);
    if (index === -1) throw new Error('Wiki entry not found');
    
    this.data.wikiEntries[index] = { 
      ...this.data.wikiEntries[index], 
      ...entry, 
      updatedAt: this.getCurrentTimestamp() 
    };
    this.saveToLocalStorage();
    return this.data.wikiEntries[index];
  }

  async deleteWikiEntry(id: string): Promise<void> {
    this.data.wikiEntries = this.data.wikiEntries.filter((entry: any) => entry.id !== id);
    this.saveToLocalStorage();
  }

  // Notes
  async getNotes(projectId?: string): Promise<Note[]> {
    let notes = this.data.notes;
    if (projectId) {
      notes = notes.filter((note: any) => note.projectId === projectId);
    }
    return notes;
  }

  async getNoteById(id: string): Promise<Note | null> {
    return this.data.notes.find((note: any) => note.id === id) || null;
  }

  async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    const newNote: Note = {
      ...note,
      id: this.generateId(),
      createdAt: this.getCurrentTimestamp(),
      updatedAt: this.getCurrentTimestamp(),
    };
    this.data.notes.push(newNote);
    this.saveToLocalStorage();
    return newNote;
  }

  async updateNote(id: string, note: Partial<Note>): Promise<Note> {
    const index = this.data.notes.findIndex((n: any) => n.id === id);
    if (index === -1) throw new Error('Note not found');
    
    this.data.notes[index] = { 
      ...this.data.notes[index], 
      ...note, 
      updatedAt: this.getCurrentTimestamp() 
    };
    this.saveToLocalStorage();
    return this.data.notes[index];
  }

  async deleteNote(id: string): Promise<void> {
    this.data.notes = this.data.notes.filter((note: any) => note.id !== id);
    this.saveToLocalStorage();
  }

  // Comments
  async getComments(targetType: string, targetId: string): Promise<Comment[]> {
    return this.data.comments.filter((comment: any) => {
      switch (targetType) {
        case 'wikiEntry':
          return comment.wikiEntryId === targetId;
        case 'project':
          return comment.projectId === targetId;
        case 'note':
          return comment.noteId === targetId;
        default:
          return false;
      }
    });
  }

  async createComment(comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>): Promise<Comment> {
    const newComment: Comment = {
      ...comment,
      id: this.generateId(),
      createdAt: this.getCurrentTimestamp(),
      likes: 0,
    };
    this.data.comments.push(newComment);
    this.saveToLocalStorage();
    return newComment;
  }

  async updateComment(id: string, comment: Partial<Comment>): Promise<Comment> {
    const index = this.data.comments.findIndex((c: any) => c.id === id);
    if (index === -1) throw new Error('Comment not found');
    
    this.data.comments[index] = { ...this.data.comments[index], ...comment };
    this.saveToLocalStorage();
    return this.data.comments[index];
  }

  async deleteComment(id: string): Promise<void> {
    this.data.comments = this.data.comments.filter((comment: any) => comment.id !== id);
    this.saveToLocalStorage();
  }

  // SQL Scripts
  async getSqlScripts(projectId?: string): Promise<SqlScript[]> {
    let scripts = this.data.sqlScripts;
    if (projectId) {
      scripts = scripts.filter((script: any) => script.projectId === projectId);
    }
    return scripts;
  }

  async getSqlScriptById(id: string): Promise<SqlScript | null> {
    return this.data.sqlScripts.find((script: any) => script.id === id) || null;
  }

  async createSqlScript(script: Omit<SqlScript, 'id' | 'createdAt' | 'updatedAt'>): Promise<SqlScript> {
    const newScript: SqlScript = {
      ...script,
      id: this.generateId(),
      createdAt: this.getCurrentTimestamp(),
      updatedAt: this.getCurrentTimestamp(),
    };
    this.data.sqlScripts.push(newScript);
    this.saveToLocalStorage();
    return newScript;
  }

  async updateSqlScript(id: string, script: Partial<SqlScript>): Promise<SqlScript> {
    const index = this.data.sqlScripts.findIndex((s: any) => s.id === id);
    if (index === -1) throw new Error('SQL script not found');
    
    this.data.sqlScripts[index] = { 
      ...this.data.sqlScripts[index], 
      ...script, 
      updatedAt: this.getCurrentTimestamp() 
    };
    this.saveToLocalStorage();
    return this.data.sqlScripts[index];
  }

  async deleteSqlScript(id: string): Promise<void> {
    this.data.sqlScripts = this.data.sqlScripts.filter((script: any) => script.id !== id);
    this.saveToLocalStorage();
  }

  // Likes
  async toggleLike(userId: string, targetType: string, targetId: string): Promise<void> {
    const existingLike = this.data.likes.find(
      (like: any) => like.userId === userId && like.targetType === targetType && like.targetId === targetId
    );

    if (existingLike) {
      // Remove like
      this.data.likes = this.data.likes.filter((like: any) => like.id !== existingLike.id);
      
      // Decrement likes count
      switch (targetType) {
        case 'wikiEntry':
          const entry = this.data.wikiEntries.find((e: any) => e.id === targetId);
          if (entry) entry.likes = Math.max(0, entry.likes - 1);
          break;
        case 'project':
          const project = this.data.projects.find((p: any) => p.id === targetId);
          if (project) project.likes = Math.max(0, project.likes - 1);
          break;
        case 'comment':
          const comment = this.data.comments.find((c: any) => c.id === targetId);
          if (comment) comment.likes = Math.max(0, comment.likes - 1);
          break;
      }
    } else {
      // Add like
      const newLike: Like = {
        id: this.generateId(),
        userId,
        targetType: targetType as any,
        targetId,
        createdAt: this.getCurrentTimestamp(),
      };
      this.data.likes.push(newLike);
      
      // Increment likes count
      switch (targetType) {
        case 'wikiEntry':
          const entry = this.data.wikiEntries.find((e: any) => e.id === targetId);
          if (entry) entry.likes++;
          break;
        case 'project':
          const project = this.data.projects.find((p: any) => p.id === targetId);
          if (project) project.likes++;
          break;
        case 'comment':
          const comment = this.data.comments.find((c: any) => c.id === targetId);
          if (comment) comment.likes++;
          break;
      }
    }
    
    this.saveToLocalStorage();
  }

  async getLikes(targetType: string, targetId: string): Promise<Like[]> {
    return this.data.likes.filter(
      (like: any) => like.targetType === targetType && like.targetId === targetId
    );
  }
}

export const databaseService = new LocalDatabaseService();
