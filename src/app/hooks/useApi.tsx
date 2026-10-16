import { useState, useEffect, useCallback } from 'react';
import { ApiResponse } from '../types/api';
import { apiClient } from '../services/api';
import { config } from '../config/environment';

// Generic API Hook
export function useApi<T,>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Student Profile Hook
export function useStudentProfile(studentId: string) {
  return useApi(
    () => apiClient.getStudentProfile(studentId),
    [studentId]
  );
}

// Performance Data Hook
export function usePerformanceData(studentId: string) {
  return useApi(
    () => apiClient.getPerformanceData(studentId),
    [studentId]
  );
}

// Academic Scores Hook
export function useAcademicScores(studentId: string, semester?: string, year?: string) {
  return useApi(
    () => apiClient.getAcademicScores(studentId, semester, year),
    [studentId, semester, year]
  );
}

// Achievements Hook
export function useAchievements(studentId: string, category?: string) {
  return useApi(
    () => apiClient.getAchievements(studentId, category),
    [studentId, category]
  );
}

// Discipline Records Hook
export function useDisciplineRecords(studentId: string, type?: 'violation' | 'reward') {
  return useApi(
    () => apiClient.getDisciplineRecords(studentId, type),
    [studentId, type]
  );
}

// Payments Hook
export function usePayments(studentId: string, status?: string) {
  return useApi(
    () => apiClient.getPayments(studentId, status),
    [studentId, status]
  );
}

// E-money Transactions Hook
export function useEmoneyTransactions(studentId: string) {
  return useApi(
    () => apiClient.getEmoneyTransactions(studentId),
    [studentId]
  );
}

// Album Photos Hook
export function useAlbumPhotos(studentId: string, category?: string) {
  return useApi(
    () => apiClient.getAlbumPhotos(studentId, category),
    [studentId, category]
  );
}

// Notifications Hook
export function useNotifications(studentId: string, unreadOnly?: boolean) {
  return useApi(
    () => apiClient.getNotifications(studentId, unreadOnly),
    [studentId, unreadOnly]
  );
}

// Chat Contacts Hook
export function useChatContacts(studentId: string) {
  return useApi(
    () => apiClient.getChatContacts(studentId),
    [studentId]
  );
}

// Loading State Wrapper Component
export function LoadingWrapper({ 
  loading, 
  error, 
  children, 
  skeleton 
}: { 
  loading: boolean; 
  error: string | null; 
  children: React.ReactNode;
  skeleton?: React.ReactNode;
}) {
  if (loading) {
    return skeleton || (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-red-500 mb-2">⚠️</div>
        <p className="text-sm text-muted-foreground">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-xs text-primary hover:underline"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
