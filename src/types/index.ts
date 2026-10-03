export type PersonaId = 'senior_teacher' | 'counselor' | 'boundary_mentor' | 'silent_listener';

export interface Persona {
  id: PersonaId;
  name: string;
  role: string;
  avatar: string;
  badge: string;
  greeting: string;
  description: string;
  color: string;
  bgColor: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  personaId?: PersonaId;
  isBookmarked?: boolean;
}

export interface PrescriptionResult {
  diagnosisTitle: string;
  validationMessage: string;
  permissionStatement: string;
  microActions: string[];
  comfortQuote: string;
}

export type SchoolLevel = '유치원' | '초등학교' | '중학교' | '고등학교' | '특수학교' | '비교과(보건/상담/영양/사서)';
