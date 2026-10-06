const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Event Response Type
export interface EventResponse {
  eventId: number;
  eventName: string;
  eventDate: string; // LocalDate comes as string from API
  deadline: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  coordinatorId?: number;
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

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string;
  eventId: number;
  assigneeId?: number;
}

// Task Response Type
export interface TaskResponse {
  id: number;
  title: string;
  description: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  eventId: number;
  eventName: string | null;
  assigneeName: string | null;
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
        // Parse error response from backend
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `HTTP error! status: ${response.status}` };
        }
        
        // Create error with response data attached
        const error: any = new Error(errorData.message || `HTTP error! status: ${response.status}`);
        error.response = {
          status: response.status,
          data: errorData
        };
        throw error;
      }

      return await response.json();
    } catch (error: any) {
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

  // Task APIs
  async createTask(data: CreateTaskRequest): Promise<TaskResponse> {
    return this.request<TaskResponse>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTasksByEvent(eventId: number): Promise<TaskResponse[]> {
    return this.request<TaskResponse[]>(`/tasks/event/${eventId}`);
  }

  async getTasksByCoordinator(userId: number): Promise<TaskResponse[]> {
    return this.request<TaskResponse[]>(`/tasks/coordinator/${userId}`);
  }

  async updateTaskStatus(taskId: number, status: string): Promise<TaskResponse> {
    return this.request<TaskResponse>(`/tasks/${taskId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteTask(taskId: number): Promise<void> {
    await this.request<void>(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  async getEventsByCoordinator(coordinatorId: number): Promise<EventResponse[]> {
    return this.request<EventResponse[]>(`/events/coordinator/${coordinatorId}`);
  }
}

export const apiService = new ApiService();
