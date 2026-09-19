const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Event Response Type
export interface EventResponse {
  eventId: number;
  eventName: string;
  eventDate: string; // LocalDate comes as string from API
  deadline: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  coordinatorName: string | null;
  notes: string | null;
}

// User Response Type
export interface UserResponse {
  userId: number;
  name: string;
  email: string;
  phoneNum: string | null;
  role: 'OPERATIONS_MANAGER' | 'EVENT_COORDINATOR';
}

// Request Types
export interface AssignEventRequest {
  eventName: string;
  eventDate: string;
  deadline: string;
  coordinatorId: number;
  notes?: string;
}

export interface UpdateEventStatusRequest {
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: 'OPERATIONS_MANAGER' | 'EVENT_COORDINATOR';
}

// API Service
class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Helper method for fetch requests
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Event APIs
  async getAllEvents(): Promise<EventResponse[]> {
    return this.request<EventResponse[]>('/events');
  }

  async getEventById(eventId: number): Promise<EventResponse> {
    return this.request<EventResponse>(`/events/${eventId}`);
  }

  async getAllCoordinators(): Promise<UserResponse[]> {
    return this.request<UserResponse[]>('/events/coordinators');
  }

  async assignEvent(data: AssignEventRequest): Promise<EventResponse> {
    return this.request<EventResponse>('/events/assign', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEventStatus(
    eventId: number,
    data: UpdateEventStatusRequest
  ): Promise<EventResponse> {
    return this.request<EventResponse>(`/events/${eventId}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateEvent(
    eventId: number,
    data: Partial<AssignEventRequest>
  ): Promise<EventResponse> {
    return this.request<EventResponse>(`/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEvent(eventId: number): Promise<void> {
    await this.request<void>(`/events/${eventId}`, {
      method: 'DELETE',
    });
  }

  // Auth APIs
  async register(data: RegisterRequest): Promise<UserResponse> {
    return this.request<UserResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();
