export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: 'Philosophy' | 'Environment' | 'Activity' | 'Review';
  images: string[];
  content: string; // HTML or Markdown string
  seoTitle?: string;
  seoMetaDesc?: string;
  status?: 'published' | 'draft';
}

export interface AffiliateProduct {
  id: string;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  affiliateLink: string;
  badge?: string;
  ageRange?: string; // e.g. "0-12 weeks", "13-15 months"
  category?: string;
}

export interface StaffAdvice {
  id: string;
  name: string;
  role: string;
  advice: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  status: 'New' | 'Engaged' | 'Converted' | 'Cold';
  source: string;
  joinDate: string;
  lastAction: string;
}

export interface CampaignStat {
  id: string;
  name: string;
  clicks: number;
  conversions: number;
  revenue: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface EducatorResource {
  id: string;
  title: string;
  description: string;
  icon: 'BookOpen' | 'Layout' | 'Eye' | 'Scissors' | 'Download';
  comingSoon?: boolean;
}
