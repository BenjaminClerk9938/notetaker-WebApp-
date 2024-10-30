export interface Message {
    id: string;
    name: string;
    time: string;
    content: string;
    isStarred?: boolean;
    intent?: 'follow-up' | 'goal' | 'decision' | null;
  }
  
  export interface Meeting {
    id: string;
    title: string;
    date: string;
    timeStart: string;
    timeEnd: string;
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