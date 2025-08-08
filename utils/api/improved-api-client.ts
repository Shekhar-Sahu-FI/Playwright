import { request, APIRequestContext } from '@playwright/test';
import { ApiResponse, ApiRequestOptions, ApiClientConfig } from '../../types/api-types';

export class ImprovedApiClient {
  private context: APIRequestContext | null = null;
  private config: ApiClientConfig;
  private authToken: string | null = null;

  constructor(config: ApiClientConfig) {
    this.config = config;
  }

  private async getContext(): Promise<APIRequestContext> {
    if (!this.context) {
      this.context = await request.newContext({
        baseURL: this.config.baseURL,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` })
        },
        timeout: this.config.timeout
      });
    }
    return this.context;
  }

  async authenticate(credentials: { emailId: string; password: string }): Promise<void> {
    const context = await this.getContext();
    const response = await context.post('/Auth/login', {
      data: credentials
    });

    if (response.status() !== 200) {
      throw new Error(`Authentication failed: ${response.status()} ${response.statusText()}`);
    }

    const body = await response.json();
    this.authToken = body.token;
    
    // Update context with new token
    this.context = null;
  }

  async request<T = any>(options: ApiRequestOptions): Promise<ApiResponse<T>> {
    const context = await this.getContext();
    const url = options.endpoint.startsWith('http') ? options.endpoint : `${this.config.baseURL}${options.endpoint}`;
    
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.config.retries; attempt++) {
      try {
        const response = await context[options.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete'](url, {
          data: options.data,
          headers: options.headers,
          timeout: options.timeout || this.config.timeout
        });

        const body = await response.json();
        
        if (response.status() >= 400) {
          throw new Error(`HTTP ${response.status()}: ${body.message || response.statusText()}`);
        }

        return {
          success: response.status() >= 200 && response.status() < 300,
          data: body,
          validationErrors: body.validationErrors
        };
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === this.config.retries) {
          break;
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    throw lastError || new Error('Request failed after all retries');
  }

  async get<T = any>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', endpoint, headers });
  }

  async post<T = any>(endpoint: string, data: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', endpoint, data, headers });
  }

  async put<T = any>(endpoint: string, data: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', endpoint, data, headers });
  }

  async delete<T = any>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', endpoint, headers });
  }

  // Convenience methods for common operations
  async saveMaster<T = any>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.post<T>(`${endpoint}/Save`, data);
  }

  async updateMaster<T = any>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.put<T>(`${endpoint}/Update`, data);
  }

  async getById<T = any>(endpoint: string, id: string | number): Promise<ApiResponse<T>> {
    return this.get<T>(`${endpoint}/GetById/${id}`);
  }

  async getAll<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.get<T>(`${endpoint}/GetAll`);
  }

  async search<T = any>(endpoint: string, searchQuery: Record<string, any>): Promise<ApiResponse<T>> {
    return this.post<T>(`${endpoint}/Search`, searchQuery);
  }

  async deleteById<T = any>(endpoint: string, id: string | number): Promise<ApiResponse<T>> {
    return this.put<T>(`${endpoint}/Delete/${id}`, {});
  }

  dispose(): void {
    if (this.context) {
      this.context.dispose();
      this.context = null;
    }
  }
}
