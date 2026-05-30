export type Language = 'en' | 'zh' | 'hn';

export type ProposalCategory = 'TypeInfrastructure' | 'TypeCultural' | 'TypePolicy';

export interface Proposal {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  author: string;
  category: ProposalCategory;
  upvotes: number;
  votedUp: boolean;
  date: string;
  locationName: string;
  tags: string[];
}

export interface PollOption {
  id: string;
  text: Record<Language, string>;
  votes: number;
}

export interface Poll {
  id: string;
  question: Record<Language, string>;
  options: PollOption[];
  totalVotes: number;
  votedOptionId?: string;
  date: string;
  category: string;
}

export interface CouncilMeeting {
  id: string;
  title: Record<Language, string>;
  date: string;
  locationName: string;
  notes: Record<Language, string>;
  summary: Record<Language, string>;
  keyTakeaways: Record<Language, string>[];
}

export interface MapZone {
  id: string;
  name: Record<Language, string>;
  status: 'active' | 'warning' | 'normal';
  description: Record<Language, string>;
  projectCount: number;
}

export interface BlogPost {
  id: string;
  title: Record<Language, string>;
  content: Record<Language, string>;
  author: string;
  date: string;
  imageUrl?: string;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
