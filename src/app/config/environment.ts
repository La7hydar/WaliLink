// Environment Configuration - OFFLINE MODE
// All data is stored locally on the device
// No external API or server connections required

export const config = {
  // App Information
  app: {
    name: 'WaliSantri Offline',
    version: '2.0.0-offline',
    mode: 'offline', // Changed from 'development' | 'production' to 'offline'
  },

  // Local Storage Configuration (replaces API)
  storage: {
    prefix: 'walisantri_',
    enableEncryption: false, // Can be enabled for sensitive data
    maxStorageSize: 10 * 1024 * 1024, // 10MB limit recommendation
  },

  // Mock/Simulation Settings
  mock: {
    enabled: true,
    delay: 100, // Reduced delay for better UX in offline mode
    simulateErrors: false,
  },

  // Features Configuration
  features: {
    offline: true,
    paymentGateway: false, // Disabled - requires internet
    cloudSync: false, // Disabled - requires internet
    analytics: false, // Disabled - requires internet
    pushNotifications: false, // Disabled - requires internet
    externalAPI: false, // Disabled - requires internet
  },

  // UI Configuration
  ui: {
    theme: {
      defaultTheme: 'light',
      enableDarkMode: true,
    },
    language: {
      defaultLanguage: 'id',
      supportedLanguages: ['id', 'en', 'ar'],
    },
    dateFormat: 'DD-MM-YYYY',
    timeFormat: '24h',
  },

  // Offline Capabilities
  offline: {
    enabled: true,
    localDataOnly: true,
    noServerConnection: true,
    dataBackup: true, // Allow export/import of data
  },
};

// Data Source Configuration (untuk migrasi ke server di masa depan)
export const ENV_CONFIG = {
  // Data source mode: 'local' atau 'remote'
  dataSourceMode: (import.meta.env.VITE_DATA_SOURCE_MODE || 'local') as 'local' | 'remote',

  // Local data path
  localDataPath: import.meta.env.VITE_LOCAL_DATA_PATH || '/data',

  // Remote API configuration (untuk masa depan)
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  apiKey: import.meta.env.VITE_API_KEY || '',
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),

  // Database type
  databaseType: (import.meta.env.VITE_DATABASE_TYPE || 'json') as 'json' | 'indexeddb',

  // Cache configuration
  enableCache: import.meta.env.VITE_ENABLE_CACHE === 'true',
  cacheDuration: parseInt(import.meta.env.VITE_CACHE_DURATION || '3600000'),

  // Debug mode
  debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
};

// Helper function untuk logging (hanya jika debug mode aktif)
export const debugLog = (...args: any[]) => {
  if (ENV_CONFIG.debugMode) {
    console.log('[DEBUG]', ...args);
  }
};

// Helper function untuk mendapatkan full path ke data file
export const getDataFilePath = (filename: string): string => {
  return `${ENV_CONFIG.localDataPath}/${filename}`;
};

// Offline Mode Notice
export const OFFLINE_MODE_MESSAGE =
  'Aplikasi berjalan dalam mode offline. Semua data disimpan di perangkat lokal.';

export default config;