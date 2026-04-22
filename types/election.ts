export interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  createdAt: Date;
}

export interface TimelineEvent {
  id: string;
  phase: string;
  date: string;
  endDate?: string;
  title: string;
  description: string;
  details: string[];
  states?: string[];
}

export interface JourneyStep {
  id: string;
  order: number;
  title: string;
  description: string;
  externalLink?: string;
}
