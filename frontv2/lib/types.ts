export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  profilePhotoUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Memory {
  id: string;
  userId: string;
  type: 'photo' | 'video' | 'audio' | 'text' | 'music';
  title?: string;
  content?: string;
  filePath?: string;
  memoryDate: string; // User-selected date (YYYY-MM-DD)
  date: string; // Legacy field for backwards compatibility
  createdAt: string;
  spotifyTrackId?: string;
}

export interface CreateMemoryRequest {
  type: 'photo' | 'video' | 'audio' | 'text' | 'music';
  title?: string;
  content?: string;
  date: string;
  spotifyTrackId?: string;
}

export interface UpdateMemoryRequest {
  title?: string;
  content?: string;
  date?: string;
}

export interface MemoriesResponse {
  memories: Memory[];
  total: number;
}

export interface StatsResponse {
  total: number;
  thisMonth: number;
  thisWeek: number;
  byType: {
    photo: number;
    video: number;
    audio: number;
    text: number;
    music: number;
  };
}

export interface UploadResponse {
  fileUrl: string;
  thumbnailUrl?: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
}
