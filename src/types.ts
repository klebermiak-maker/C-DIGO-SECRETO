export interface CipherLetter {
  letter: string;
  number: number;
  symbol?: string;
}

export interface SecretMessage {
  id: string;
  label: string; // e.g. "a)", "b)", etc.
  code: number[];
  targetWord: string;
  hint: string;
  category?: string;
  explanation?: string;
  acceptedAlternatives?: string[];
}

export interface MissionCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  missions: SecretMessage[];
}

export interface StudentProfile {
  name: string;
  school: string;
  date: string;
  classroom: string;
}

export type SymbolTheme = 'emojis' | 'animals' | 'space' | 'shapes' | 'geometric';

export interface CustomSymbolMap {
  [letter: string]: string;
}
