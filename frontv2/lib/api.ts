import { 
  LoginRequest, 
  LoginResponse, 
  User,
  Memory,
  CreateMemoryRequest,
  UpdateMemoryRequest,
  MemoriesResponse,
  StatsResponse,
  UploadResponse
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5299';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, errorText || response.statusText);
    }

    return response.json();
  }

  // Auth APIs
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token
    if (typeof window !== 'undefined' && response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  }

  async register(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token
    if (typeof window !== 'undefined' && response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  }

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  async getCurrentUser(): Promise<User> {
    const response: any = await this.request('/api/user/profile');
    console.log('getCurrentUser API response:', response);
    return {
      id: response.id,
      email: response.email,
      name: response.userName || response.email,
      createdAt: response.memberSince || response.createdAt,
      profilePhotoUrl: response.profilePhotoUrl
    };
  }

  async updateProfile(data: { name?: string; email?: string }): Promise<User> {
    const response: any = await this.request('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify({
        userName: data.name,
        email: data.email
      }),
    });
    return {
      id: response.id,
      email: response.email,
      name: response.userName || response.email,
      createdAt: response.memberSince || response.createdAt,
      profilePhotoUrl: response.profilePhotoUrl
    };
  }

  // Memory APIs
  async getMemories(params?: {
    type?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
  }): Promise<MemoriesResponse> {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    const query = queryParams.toString();
    // Backend returns { items, total, page, pageSize, totalPages }
    // Normalize to { memories, total }
    const raw = await this.request<any>(`/api/memories${query ? `?${query}` : ''}`);
    const rawItems = raw.items ?? raw.memories ?? [];
    const mapped = (rawItems as any[]).map((m) => {
      // normalize backend fields to frontend Memory shape
      const typeMap: Record<string, string> = {
        voice: 'audio',
        song: 'music'
      };

      const t = (m.type || '').toLowerCase();
      const normalizedType = (typeMap[t] as any) ?? t;

      return {
        id: String(m.id),
        userId: m.userId,
        type: normalizedType,
        title: m.title ?? undefined,
        content: m.description ?? undefined,
        filePath: m.fileUrl ?? m.filePath ?? undefined,
        memoryDate: m.memoryDate ?? m.createdAt ?? m.date,
        date: m.memoryDate ?? m.createdAt ?? m.date,
        createdAt: m.createdAt ?? m.date,
        spotifyTrackId: m.spotifyTrackId ?? undefined,
      } as any;
    });

    const total = raw.total ?? (Array.isArray(mapped) ? mapped.length : 0);
    return { memories: mapped, total } as MemoriesResponse;
  }

  async getMemory(id: string): Promise<Memory> {
    return this.request<Memory>(`/api/memories/${id}`);
  }

  async createMemory(data: CreateMemoryRequest): Promise<Memory> {
    // Map frontend fields to backend expected fields
    const payload = {
      type: data.type,
      title: data.title,
      description: data.content, // Frontend uses 'content', backend uses 'description'
      date: data.date,
      spotifyTrackId: data.spotifyTrackId,
      // If data has file fields (from upload), include them
      ...(data as any).fileUrl && {
        fileUrl: (data as any).fileUrl,
        thumbnailUrl: (data as any).thumbnailUrl,
        mimeType: (data as any).mimeType,
        fileSize: (data as any).fileSize,
      }
    };

    return this.request<Memory>('/api/memories', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateMemory(id: string, data: UpdateMemoryRequest): Promise<Memory> {
    return this.request<Memory>(`/api/memories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMemory(id: string): Promise<void> {
    return this.request<void>(`/api/memories/${id}`, {
      method: 'DELETE',
    });
  }

  async getStats(): Promise<StatsResponse> {
    return this.request<StatsResponse>('/api/memories/stats');
  }

  // Upload APIs
  async uploadFile(file: File, type: string, date: string, title?: string): Promise<UploadResponse> {
    const token = this.getAuthToken();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('date', date);
    if (title) formData.append('title', title);

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, errorText || response.statusText);
    }

    return response.json();
  }

  getFileUrl(filePath: string): string {
    return `${API_URL}${filePath}`;
  }
}

export const apiService = new ApiService();
export { ApiError };
