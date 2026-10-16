# React API Integration Examples

## Basic Setup

### 1. Install Dependencies
```bash
npm install axios
# or
npm install fetch
```

### 2. Environment Variables
Create `.env` file:
```env
REACT_APP_API_URL=https://api.pesantren-app.com/v1
REACT_APP_API_TIMEOUT=10000
```

### 3. API Client Setup
```typescript
// services/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## Component Examples

### 1. Achievement Section with API Integration

```typescript
// components/guardian/AchievementSection.tsx
import React, { useState, useEffect } from 'react';
import { useAchievements } from '../../hooks/useApi';
import { Achievement } from '../../types/api';
import { LoadingWrapper } from '../../hooks/useApi';

interface AchievementSectionProps {
  studentId: string;
}

export function AchievementSection({ studentId }: AchievementSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // Use custom hook for API call
  const { 
    data: achievements, 
    loading, 
    error, 
    refetch 
  } = useAchievements(studentId, selectedCategory);

  const categories = [
    { id: '', label: 'Semua' },
    { id: 'academic', label: 'Akademik' },
    { id: 'religious', label: 'Keagamaan' },
    { id: 'sports', label: 'Olahraga' },
    { id: 'arts', label: 'Seni' },
    { id: 'leadership', label: 'Kepemimpinan' }
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Achievements List */}
      <LoadingWrapper
        loading={loading}
        error={error}
        skeleton={<AchievementSkeleton />}
      >
        <div className="space-y-3">
          {achievements?.map((achievement) => (
            <AchievementCard 
              key={achievement.id} 
              achievement={achievement}
              onRefresh={refetch}
            />
          ))}
          
          {achievements?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Belum ada prestasi untuk kategori ini
              </p>
            </div>
          )}
        </div>
      </LoadingWrapper>
    </div>
  );
}

function AchievementCard({ 
  achievement, 
  onRefresh 
}: { 
  achievement: Achievement;
  onRefresh: () => void;
}) {
  const getCategoryColor = (category: string) => {
    const colors = {
      academic: 'bg-blue-100 text-blue-800',
      religious: 'bg-green-100 text-green-800',
      sports: 'bg-orange-100 text-orange-800',
      arts: 'bg-purple-100 text-purple-800',
      leadership: 'bg-yellow-100 text-yellow-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(achievement.category)}`}>
          {achievement.category}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{achievement.level} • {achievement.position}</span>
        <span>{new Date(achievement.date).toLocaleDateString('id-ID')}</span>
      </div>
    </div>
  );
}

function AchievementSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 2. Dashboard with Real-time Data

```typescript
// components/guardian/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  useStudentProfile, 
  usePerformanceData, 
  useNotifications,
  usePayments 
} from '../../hooks/useApi';

export function Dashboard({ studentId }: { studentId: string }) {
  // Multiple API calls
  const { data: profile, loading: profileLoading } = useStudentProfile(studentId);
  const { data: performance, loading: performanceLoading } = usePerformanceData(studentId);
  const { data: notifications } = useNotifications(studentId, true);
  const { data: payments } = usePayments(studentId, 'pending');

  // Computed values from API data
  const studentData = React.useMemo(() => {
    if (!profile) return null;
    
    return {
      name: profile.student.name,
      class: profile.student.class,
      room: profile.student.dormitory,
      profilePhoto: profile.student.profilePhoto,
      emoneyBalance: profile.emoneyBalance,
      attendanceRate: profile.attendanceRate,
      notifications: notifications?.length || 0,
      pendingPayments: payments?.length || 0,
      sppStatus: payments?.some(p => p.type === 'spp') ? 'Pending' : 'Lunas'
    };
  }, [profile, notifications, payments]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      // Refresh critical data
      refetchProfile();
      refetchNotifications();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (profileLoading || !studentData) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-4 space-y-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon="💰"
          label="SPP"
          value={studentData.sppStatus}
          color={studentData.sppStatus === 'Lunas' ? 'green' : 'orange'}
        />
        <StatCard
          icon="💳"
          label="E-Money"
          value={`Rp ${studentData.emoneyBalance.toLocaleString()}`}
          color="blue"
        />
        <StatCard
          icon="✅"
          label="Kehadiran"
          value={`${studentData.attendanceRate}%`}
          color="green"
        />
      </div>

      {/* Performance Chart */}
      <PerformanceChart 
        data={performance} 
        loading={performanceLoading} 
      />

      {/* Recent Activities */}
      <RecentActivities studentId={studentId} />
    </div>
  );
}
```

### 3. Payment Section with Transactions

```typescript
// components/guardian/PaymentSection.tsx
import React, { useState } from 'react';
import { usePayments, useEmoneyTransactions } from '../../hooks/useApi';
import { apiClient } from '../../services/api';

export function PaymentSection({ studentId }: { studentId: string }) {
  const [activeTab, setActiveTab] = useState<'spp' | 'emoney'>('spp');
  const [processing, setProcessing] = useState<string | null>(null);
  
  const { data: payments, loading: paymentsLoading, refetch: refetchPayments } = usePayments(studentId);
  const { data: emoneyTransactions, refetch: refetchEmoney } = useEmoneyTransactions(studentId);

  const handlePayment = async (paymentId: string) => {
    setProcessing(paymentId);
    
    try {
      const response = await apiClient.processPayment(studentId, paymentId, 'Bank Transfer');
      
      if (response.success) {
        // Show success message
        alert('Pembayaran berhasil diproses!');
        
        // Refresh data
        refetchPayments();
        refetchEmoney();
      } else {
        throw new Error(response.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Gagal memproses pembayaran. Silakan coba lagi.');
    } finally {
      setProcessing(null);
    }
  };

  const handleTopup = async (amount: number) => {
    try {
      const response = await apiClient.topupEmoney(studentId, amount);
      
      if (response.success) {
        alert('Top up berhasil!');
        refetchEmoney();
      }
    } catch (error) {
      alert('Gagal melakukan top up');
    }
  };

  return (
    <div className="p-4">
      {/* Tab Navigation */}
      <div className="flex mb-4">
        <button
          onClick={() => setActiveTab('spp')}
          className={`flex-1 py-2 px-4 text-center ${
            activeTab === 'spp' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Pembayaran SPP
        </button>
        <button
          onClick={() => setActiveTab('emoney')}
          className={`flex-1 py-2 px-4 text-center ${
            activeTab === 'emoney' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          E-Money
        </button>
      </div>

      {/* SPP Tab */}
      {activeTab === 'spp' && (
        <div className="space-y-3">
          {paymentsLoading ? (
            <PaymentSkeleton />
          ) : (
            payments?.filter(p => p.type === 'spp').map((payment) => (
              <div key={payment.id} className="bg-white rounded-lg p-4 border">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{payment.description}</h3>
                    <p className="text-sm text-gray-600">
                      Jatuh tempo: {new Date(payment.dueDate).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    payment.status === 'paid' 
                      ? 'bg-green-100 text-green-800'
                      : payment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {payment.status === 'paid' ? 'Lunas' : 
                     payment.status === 'pending' ? 'Belum Bayar' : 'Terlambat'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">
                    Rp {payment.amount.toLocaleString()}
                  </span>
                  
                  {payment.status === 'pending' && (
                    <button
                      onClick={() => handlePayment(payment.id)}
                      disabled={processing === payment.id}
                      className="bg-green-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                    >
                      {processing === payment.id ? 'Memproses...' : 'Bayar Sekarang'}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* E-Money Tab */}
      {activeTab === 'emoney' && (
        <div className="space-y-4">
          {/* Top Up Section */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Top Up E-Money</h3>
            <div className="grid grid-cols-3 gap-2">
              {[50000, 100000, 200000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleTopup(amount)}
                  className="bg-blue-600 text-white p-2 rounded text-sm"
                >
                  +Rp {amount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction History */}
          <div>
            <h3 className="font-semibold mb-3">Riwayat Transaksi</h3>
            <div className="space-y-2">
              {emoneyTransactions?.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.date).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <span className={`font-bold ${
                    transaction.type === 'topup' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'topup' ? '+' : '-'}Rp {transaction.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 4. Real-time Notifications

```typescript
// hooks/useRealTimeNotifications.ts
import { useState, useEffect } from 'react';
import { Notification } from '../types/api';

export function useRealTimeNotifications(studentId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Initial load
    loadNotifications();

    // Set up polling for new notifications
    const interval = setInterval(loadNotifications, 30000); // 30 seconds

    // Set up WebSocket for real-time updates (if available)
    const ws = new WebSocket(`wss://api.pesantren-app.com/ws/students/${studentId}/notifications`);
    
    ws.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show browser notification
      if (Notification.permission === 'granted') {
        new Notification(newNotification.title, {
          body: newNotification.message,
          icon: '/icon-192x192.png'
        });
      }
    };

    return () => {
      clearInterval(interval);
      ws.close();
    };
  }, [studentId]);

  const loadNotifications = async () => {
    try {
      const response = await fetch(`/api/students/${studentId}/notifications`);
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.data);
        setUnreadCount(data.data.filter((n: Notification) => !n.read).length);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/students/${studentId}/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    refresh: loadNotifications
  };
}
```

### 5. Error Boundary and Loading States

```typescript
// components/common/ApiErrorBoundary.tsx
import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

export class ApiErrorBoundary extends React.Component<Props, { hasError: boolean; error: Error | null }> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('API Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent 
          error={this.state.error!} 
          retry={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="text-red-500 text-4xl mb-4">⚠️</div>
      <h2 className="text-lg font-semibold mb-2">Terjadi Kesalahan</h2>
      <p className="text-sm text-gray-600 mb-4 text-center">{error.message}</p>
      <button 
        onClick={retry}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Coba Lagi
      </button>
    </div>
  );
}
```

## Best Practices

### 1. Caching Strategy
```typescript
// hooks/useApiWithCache.ts
import { useState, useEffect } from 'react';

const cache = new Map();

export function useApiWithCache<T>(
  key: string,
  apiCall: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutes
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < ttl) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    apiCall().then((result) => {
      cache.set(key, { data: result, timestamp: now });
      setData(result);
      setLoading(false);
    });
  }, [key]);

  return { data, loading };
}
```

### 2. Optimistic Updates
```typescript
// hooks/useOptimisticUpdate.ts
export function useOptimisticUpdate<T>(
  data: T[],
  updateFn: (id: string, updates: Partial<T>) => Promise<void>
) {
  const [optimisticData, setOptimisticData] = useState(data);

  const updateOptimistically = async (id: string, updates: Partial<T>) => {
    // Update UI immediately
    setOptimisticData(prev => 
      prev.map(item => 
        (item as any).id === id ? { ...item, ...updates } : item
      )
    );

    try {
      // Make API call
      await updateFn(id, updates);
    } catch (error) {
      // Revert on error
      setOptimisticData(data);
      throw error;
    }
  };

  return { optimisticData, updateOptimistically };
}
```

This comprehensive API integration provides a solid foundation for dynamic data management in the pesantren app, with proper error handling, loading states, and real-time updates.