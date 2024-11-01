export interface Message {
  id: string;
  speaker: string;
  timestamp: string;
  content: string;
  isStarred?: boolean;
  intent?: "follow-up" | "goal" | "decision" | null;
}

export interface Meeting {
  id: string;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  participants: string[];
  transcript?: Message[];
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Space {
  id: string;
  name: string;
  members: Member[];
}

export interface ActionItem {
  id: string;
  content: string;
  isInferred: boolean;
  isEditing: boolean;
}
