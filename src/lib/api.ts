const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'vendor' | 'supplier';
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
}

interface Order {
  id: string;
  vendorId: string;
  supplierId: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Test connection to backend
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      return response.ok;
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return false;
    }
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    console.log('ApiClient.request:', url, config);

    try {
      const response = await fetch(url, config);
      
      // Handle network errors
      if (!response.ok) {
        let errorMessage = 'API request failed';
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // If we can't parse the error response, use status text
          errorMessage = response.statusText || errorMessage;
        }
        
        console.log('ApiClient.request: response not ok', response.status, errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('ApiClient.request: response data', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      // Handle specific network errors
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }
      
      throw error;
    }
  }

  // Authentication
  async signIn(email: string, password: string): Promise<{ user: User; token: string }> {
    console.log('ApiClient.signIn called with', email);
    return this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signUp(userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'vendor' | 'supplier';
  }): Promise<{ user: User; token: string }> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // User Profile
  async getProfile(): Promise<User> {
    return this.request('/profile');
  }

  async updateProfile(updates: {
    name?: string;
    phone?: string;
    password?: string;
  }): Promise<User> {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Messages
  async getConversations(): Promise<Conversation[]> {
    return this.request('/messages/conversations');
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return this.request(`/messages/conversations/${conversationId}`);
  }

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    return this.request(`/messages/conversations/${conversationId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    return this.request(`/messages/${messageId}/read`, {
      method: 'PUT',
    });
  }

  // Orders
  async getOrders(filters?: {
    status?: string;
    supplierId?: string;
  }): Promise<Order[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.supplierId) params.append('supplierId', filters.supplierId);

    const queryString = params.toString();
    const endpoint = queryString ? `/orders?${queryString}` : '/orders';
    
    return this.request(endpoint);
  }

  async getOrder(orderId: string): Promise<Order> {
    return this.request(`/orders/${orderId}`);
  }

  // Suppliers (for vendors)
  async getSuppliers(filters?: {
    category?: string;
    location?: string;
  }): Promise<User[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.location) params.append('location', filters.location);

    const queryString = params.toString();
    const endpoint = queryString ? `/suppliers?${queryString}` : '/suppliers';
    
    return this.request(endpoint);
  }
}

export const api = new ApiClient(API_BASE_URL);
export type { User, Message, Conversation, Order, ApiResponse }; 