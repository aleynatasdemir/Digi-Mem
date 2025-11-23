export enum MemoryType {
  PHOTO = 'PHOTO',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  TEXT = 'TEXT',
  SONG = 'SONG'
}

export interface Memory {
  id: string;
  title: string;
  date: string; // ISO Date string
  type: MemoryType;
  content?: string;
  mediaUrl?: string; // URL for image/video/audio
  thumbnailUrl?: string; // For video preview
  tags?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface StatMetric {
  label: string;
  value: string | number;
  change?: number; // percentage
  trend?: 'up' | 'down' | 'neutral';
}

export interface ChartDataPoint {
  name: string;
  value: number;
}