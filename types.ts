
export type Theme = 'light' | 'dark';

export type View = 'dashboard' | 'community' | 'tools' | 'chat' | 'templates' | 'profile' | 'settings' | 'editor';

export type ToolCategory = 'Creator' | 'Designer' | 'Strategist' | 'Utility';

export interface ToolInput {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'color' | 'number' | 'list';
  placeholder?: string;
  options?: string[]; // For select
  defaultValue?: any;
}

export interface ToolDefinition {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  icon: any; // Lucide icon component
  inputs: ToolInput[];
  systemPrompt?: string; // For AI
  model?: string; // Specific model override
  toolType: 'ai-gen' | 'utility-color' | 'utility-wheel' | 'utility-random';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  joinDate: string;
  stats: {
    projects: number;
    followers: number;
    following: number;
  }
}

export interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  liked?: boolean;
}

export interface Project {
  id: string;
  title: string;
  thumbnail: string;
  lastEdited: string;
  type: string;
}
