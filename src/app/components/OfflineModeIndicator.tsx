import { Badge } from './ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import { config } from '../config/environment';
import { isSupabaseConfigured } from '../supabase/client';

interface OfflineModeIndicatorProps {
  variant?: 'badge' | 'banner' | 'tooltip';
  className?: string;
}

export function OfflineModeIndicator({ 
  variant = 'badge',
  className = '' 
}: OfflineModeIndicatorProps) {
  // Only show if offline mode is enabled
  if (!config.offline.enabled && !isSupabaseConfigured) {
    return null;
  }

  if (variant === 'badge') {
    return (
      <Badge 
        variant="outline" 
        className={`${isSupabaseConfigured
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800'
          : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'} ${className}`}
      >
        {isSupabaseConfigured
          ? <Wifi className="w-3 h-3 mr-1" />
          : <WifiOff className="w-3 h-3 mr-1" />}
        {isSupabaseConfigured ? 'Supabase Terkonfigurasi' : 'Mode Offline'}
      </Badge>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 px-4 py-2 ${className}`}>
        <div className="flex items-center justify-center gap-2 text-xs text-blue-700 dark:text-blue-300">
          {isSupabaseConfigured ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          <span>{isSupabaseConfigured
            ? 'Login wali dan Beranda menggunakan Supabase; fitur lain masih memakai data lokal.'
            : 'Aplikasi berjalan dalam mode offline. Data demo disimpan di perangkat lokal.'}</span>
        </div>
      </div>
    );
  }

  return null;
}

// Offline warning for payment features
export function OfflinePaymentWarning() {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4">
      <div className="flex items-start gap-2">
        <WifiOff className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-amber-700 dark:text-amber-300">
          <p className="font-medium mb-1">Mode Offline - Simulasi Pembayaran</p>
          <p className="text-amber-600 dark:text-amber-400">
            Aplikasi berjalan dalam mode offline. Pembayaran ini adalah simulasi dan tidak akan memproses transaksi nyata. 
            Semua data disimpan hanya di perangkat lokal Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
