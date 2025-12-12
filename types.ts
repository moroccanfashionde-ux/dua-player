export interface Dua {
  id: string;
  title: string;
  tag: string;
  color: 'green' | 'blue' | 'purple' | 'orange';
  roman: string;
  arabic: string;
  de: string;
  audioUrl: string;
}

export type LoopMode = 'off' | 'track' | 'all';

export type TextTab = 'roman' | 'arabic' | 'de';

export type SpeakMode = 'arabic' | 'german';