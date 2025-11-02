const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5299';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  errors?: string[];
}

export interface Entry {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  category?: string;
  tags?: string[];
  userId: string;
}

export interface CreateEntryRequest {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
}

export interface UpdateEntryRequest {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
}

export interface EntryStats {
  totalEntries: number;
  thisMonthEntries: number;
  categories: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
          ...options.headers,
        },
      });

      // Handle 204 No Content
      if (response.status === 204) {
        return { data: undefined as T };
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.message || data.errors?.[0] || 'An error occurred',
          errors: data.errors,
        };
      }

      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Auth endpoints
  async register(email: string, password: string) {
    return this.request<{ token: string; email: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ token: string; email: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Entry endpoints
  async getEntries(params?: { category?: string; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request<Entry[]>(`/api/entries${query}`);
  }

  async getEntry(id: number) {
    return this.request<Entry>(`/api/entries/${id}`);
  }

  async createEntry(data: CreateEntryRequest) {
    return this.request<Entry>('/api/entries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEntry(id: number, data: UpdateEntryRequest) {
    return this.request<Entry>(`/api/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEntry(id: number) {
    return this.request<void>(`/api/entries/${id}`, {
      method: 'DELETE',
    });
  }

  async getStats() {
    return this.request<EntryStats>('/api/entries/stats');
  }

  // Helper methods
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export const apiClient = new ApiClient(API_URL);
