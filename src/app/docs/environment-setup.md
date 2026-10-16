# Environment Setup Guide

## Environment Configuration

Since this app is designed to work in browser environments without Node.js process variables, environment configuration is handled through the `/config/environment.ts` file.

### Browser-Compatible Configuration

For development and production environments, update `/config/environment.ts`:

```typescript
export const config = {
  api: {
    baseUrl: 'http://localhost:3001/api/v1', // Development
    // baseUrl: 'https://api.pesantren-app.com/v1', // Production

# Authentication
REACT_APP_JWT_SECRET=dev_jwt_secret_key
REACT_APP_TOKEN_EXPIRY=86400

# Mock Data Configuration
REACT_APP_USE_MOCK_DATA=true
REACT_APP_MOCK_DELAY=800

# WebSocket Configuration
REACT_APP_WS_URL=ws://localhost:3001/ws
REACT_APP_WS_RECONNECT_INTERVAL=5000

# Feature Flags
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_REALTIME_CHAT=true
REACT_APP_ENABLE_ANALYTICS=false

# Debug Configuration
REACT_APP_DEBUG_MODE=true
REACT_APP_LOG_LEVEL=debug
```

### Production (.env.production)
```env
# API Configuration
REACT_APP_API_URL=https://api.pesantren-app.com/v1
REACT_APP_API_TIMEOUT=15000
REACT_APP_ENVIRONMENT=production

# Authentication
REACT_APP_JWT_SECRET=prod_jwt_secret_key_very_secure
REACT_APP_TOKEN_EXPIRY=3600

# Mock Data Configuration
REACT_APP_USE_MOCK_DATA=false
REACT_APP_MOCK_DELAY=0

# WebSocket Configuration
REACT_APP_WS_URL=wss://api.pesantren-app.com/ws
REACT_APP_WS_RECONNECT_INTERVAL=10000

# Feature Flags
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_REALTIME_CHAT=true
REACT_APP_ENABLE_ANALYTICS=true

# Debug Configuration
REACT_APP_DEBUG_MODE=false
REACT_APP_LOG_LEVEL=error

# Performance Monitoring
REACT_APP_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
REACT_APP_ENABLE_PERFORMANCE_MONITORING=true

# CDN Configuration
REACT_APP_CDN_URL=https://cdn.pesantren-app.com
REACT_APP_STATIC_ASSETS_URL=https://static.pesantren-app.com
```

### Staging (.env.staging)
```env
# API Configuration
REACT_APP_API_URL=https://staging-api.pesantren-app.com/v1
REACT_APP_API_TIMEOUT=12000
REACT_APP_ENVIRONMENT=staging

# Authentication
REACT_APP_JWT_SECRET=staging_jwt_secret_key
REACT_APP_TOKEN_EXPIRY=7200

# Mock Data Configuration
REACT_APP_USE_MOCK_DATA=false
REACT_APP_MOCK_DELAY=0

# WebSocket Configuration
REACT_APP_WS_URL=wss://staging-api.pesantren-app.com/ws
REACT_APP_WS_RECONNECT_INTERVAL=7500

# Feature Flags
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_REALTIME_CHAT=true
REACT_APP_ENABLE_ANALYTICS=true

# Debug Configuration
REACT_APP_DEBUG_MODE=true
REACT_APP_LOG_LEVEL=info
```

## Environment Configuration

### 1. API Client Configuration
```typescript
// config/environment.ts
export const config = {
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1',
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
    retryAttempts: 3,
    retryDelay: 1000,
  },
  
  auth: {
    tokenKey: 'pesantren_auth_token',
    refreshTokenKey: 'pesantren_refresh_token',
    tokenExpiry: parseInt(process.env.REACT_APP_TOKEN_EXPIRY || '3600'),
  },
  
  mock: {
    enabled: process.env.REACT_APP_USE_MOCK_DATA === 'true',
    delay: parseInt(process.env.REACT_APP_MOCK_DELAY || '800'),
  },
  
  websocket: {
    url: process.env.REACT_APP_WS_URL || 'ws://localhost:3001/ws',
    reconnectInterval: parseInt(process.env.REACT_APP_WS_RECONNECT_INTERVAL || '5000'),
  },
  
  features: {
    notifications: process.env.REACT_APP_ENABLE_NOTIFICATIONS === 'true',
    realtimeChat: process.env.REACT_APP_ENABLE_REALTIME_CHAT === 'true',
    analytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  },
  
  debug: {
    enabled: process.env.REACT_APP_DEBUG_MODE === 'true',
    logLevel: process.env.REACT_APP_LOG_LEVEL || 'info',
  },
  
  cdn: {
    baseUrl: process.env.REACT_APP_CDN_URL || '',
    staticAssetsUrl: process.env.REACT_APP_STATIC_ASSETS_URL || '',
  },
  
  monitoring: {
    sentryDsn: process.env.REACT_APP_SENTRY_DSN,
    performanceMonitoring: process.env.REACT_APP_ENABLE_PERFORMANCE_MONITORING === 'true',
  }
};

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isStaging = process.env.REACT_APP_ENVIRONMENT === 'staging';
```

### 2. API Client with Environment Configuration
```typescript
// services/apiClient.ts
import axios, { AxiosRequestConfig } from 'axios';
import { config, isDevelopment } from '../config/environment';

class ApiClient {
  private client;
  private retryCount = 0;

  constructor() {
    this.client = axios.create({
      baseURL: config.api.baseUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request ID for debugging
        if (isDevelopment) {
          config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor with retry logic
    this.client.interceptors.response.use(
      (response) => {
        this.retryCount = 0;
        return response.data;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            await this.refreshToken();
            return this.client(originalRequest);
          } catch (refreshError) {
            this.handleAuthError();
            return Promise.reject(refreshError);
          }
        }

        // Retry logic for network errors
        if (this.shouldRetry(error) && this.retryCount < config.api.retryAttempts) {
          this.retryCount++;
          await this.delay(config.api.retryDelay * this.retryCount);
          return this.client(originalRequest);
        }

        return Promise.reject(error);
      }
    );
  }

  private shouldRetry(error: any): boolean {
    return (
      !error.response || // Network error
      error.response.status >= 500 || // Server error
      error.code === 'ECONNABORTED' // Timeout
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem(config.auth.refreshTokenKey);
    if (!refreshToken) throw new Error('No refresh token');

    const response = await axios.post(`${config.api.baseUrl}/auth/refresh`, {
      refreshToken
    });

    localStorage.setItem(config.auth.tokenKey, response.data.token);
  }

  private handleAuthError(): void {
    localStorage.removeItem(config.auth.tokenKey);
    localStorage.removeItem(config.auth.refreshTokenKey);
    window.location.href = '/login';
  }

  // Public methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete(url, config);
  }
}

export const apiClient = new ApiClient();
```

### 3. Mock Data Service with Environment Toggle
```typescript
// services/mockDataService.ts
import { config } from '../config/environment';
import { apiClient } from './apiClient';
import { mockApi } from './mockData';

class DataService {
  private useMockData = config.mock.enabled;

  async getStudentProfile(studentId: string) {
    if (this.useMockData) {
      // Add artificial delay to simulate network
      await this.delay(config.mock.delay);
      return mockApi.getStudentProfile();
    }
    
    return apiClient.get(`/students/${studentId}/profile`);
  }

  async getAchievements(studentId: string, category?: string) {
    if (this.useMockData) {
      await this.delay(config.mock.delay);
      return mockApi.getAchievements();
    }

    const params = category ? `?category=${category}` : '';
    return apiClient.get(`/students/${studentId}/achievements${params}`);
  }

  // Add more methods as needed...

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Method to toggle mock data (useful for development)
  toggleMockData(enabled: boolean) {
    this.useMockData = enabled;
    console.log(`Mock data ${enabled ? 'enabled' : 'disabled'}`);
  }
}

export const dataService = new DataService();
```

### 4. Feature Flags Hook
```typescript
// hooks/useFeatureFlags.ts
import { config } from '../config/environment';

export function useFeatureFlags() {
  return {
    isNotificationsEnabled: config.features.notifications,
    isRealtimeChatEnabled: config.features.realtimeChat,
    isAnalyticsEnabled: config.features.analytics,
    
    // Computed flags
    shouldShowAdvancedFeatures: config.features.analytics && !config.mock.enabled,
    shouldEnableRealtimeUpdates: config.features.realtimeChat && config.features.notifications,
  };
}
```

### 5. Environment-specific Logging
```typescript
// utils/logger.ts
import { config, isDevelopment } from '../config/environment';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private level: LogLevel = config.debug.logLevel as LogLevel;
  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.level];
  }

  debug(message: string, ...args: any[]) {
    if (this.shouldLog('debug') && isDevelopment) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]) {
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, error?: Error, ...args: any[]) {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`, error, ...args);
    }

    // Send to monitoring service in production
    if (config.monitoring.sentryDsn && error) {
      // Sentry.captureException(error);
    }
  }
}

export const logger = new Logger();
```

### 6. Build Scripts for Different Environments

Add to `package.json`:
```json
{
  "scripts": {
    "start": "react-scripts start",
    "start:staging": "env-cmd -f .env.staging react-scripts start",
    "build": "react-scripts build",
    "build:staging": "env-cmd -f .env.staging react-scripts build",
    "build:production": "env-cmd -f .env.production react-scripts build",
    "test": "react-scripts test",
    "deploy:staging": "npm run build:staging && aws s3 sync build/ s3://staging-bucket/",
    "deploy:production": "npm run build:production && aws s3 sync build/ s3://production-bucket/"
  },
  "devDependencies": {
    "env-cmd": "^10.1.0"
  }
}
```

### 7. Environment Validation
```typescript
// utils/validateEnvironment.ts
import { config } from '../config/environment';

interface EnvironmentValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateEnvironment(): EnvironmentValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required environment variables
  if (!config.api.baseUrl) {
    errors.push('REACT_APP_API_URL is required');
  }

  // URL format validation
  try {
    new URL(config.api.baseUrl);
  } catch {
    errors.push('REACT_APP_API_URL must be a valid URL');
  }

  // Development-specific warnings
  if (process.env.NODE_ENV === 'development') {
    if (!config.mock.enabled) {
      warnings.push('Mock data is disabled in development mode');
    }
    
    if (!config.debug.enabled) {
      warnings.push('Debug mode is disabled in development');
    }
  }

  // Production-specific validations
  if (process.env.NODE_ENV === 'production') {
    if (config.mock.enabled) {
      errors.push('Mock data should not be enabled in production');
    }
    
    if (config.debug.enabled) {
      warnings.push('Debug mode is enabled in production');
    }

    if (!config.monitoring.sentryDsn) {
      warnings.push('Sentry DSN not configured for production monitoring');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Run validation on app startup
export function initializeEnvironment() {
  const validation = validateEnvironment();
  
  if (!validation.isValid) {
    console.error('Environment validation failed:', validation.errors);
    throw new Error('Invalid environment configuration');
  }

  if (validation.warnings.length > 0) {
    console.warn('Environment warnings:', validation.warnings);
  }

  console.log(`Application started in ${process.env.NODE_ENV} mode`);
  console.log(`API Base URL: ${config.api.baseUrl}`);
  console.log(`Mock Data: ${config.mock.enabled ? 'Enabled' : 'Disabled'}`);
}
```

## Deployment Configuration

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Build args for environment-specific builds
ARG REACT_APP_ENVIRONMENT=production
ARG REACT_APP_API_URL
ARG REACT_APP_CDN_URL

RUN npm run build:${REACT_APP_ENVIRONMENT}

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### CI/CD Pipeline Example (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Staging/Production

on:
  push:
    branches: [main, staging]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test -- --coverage --watchAll=false
        
      - name: Build for staging
        if: github.ref == 'refs/heads/staging'
        run: npm run build:staging
        env:
          REACT_APP_API_URL: ${{ secrets.STAGING_API_URL }}
          
      - name: Build for production
        if: github.ref == 'refs/heads/main'
        run: npm run build:production
        env:
          REACT_APP_API_URL: ${{ secrets.PRODUCTION_API_URL }}
          
      - name: Deploy to staging
        if: github.ref == 'refs/heads/staging'
        run: aws s3 sync build/ s3://${{ secrets.STAGING_BUCKET }}/
        
      - name: Deploy to production
        if: github.ref == 'refs/heads/main'
        run: aws s3 sync build/ s3://${{ secrets.PRODUCTION_BUCKET }}/
```

This environment setup provides a robust foundation for managing different deployment environments with proper configuration, validation, and deployment pipelines.