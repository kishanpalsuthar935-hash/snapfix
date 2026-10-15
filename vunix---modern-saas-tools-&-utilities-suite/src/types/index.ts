export type ToolCategory = 'all' | 'free' | 'pro' | 'design' | 'business' | 'marketing' | 'utility';

export interface ToolDef {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  isPro: boolean;
  accent: 'lavender' | 'terracotta' | 'white';
  iconName: string;
  badge?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  isPro: boolean;
  plan?: 'monthly' | 'annual';
}
