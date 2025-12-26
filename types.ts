
export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  status: 'Draft' | 'Submitted' | 'In Progress';
  updatedAt: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  isCompleted?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
