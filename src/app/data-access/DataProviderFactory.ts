// Data Provider Factory
// Factory untuk membuat instance data provider berdasarkan konfigurasi

import type { IDataProvider } from './interfaces';
import { LocalDataProvider } from './LocalDataProvider';
import { RemoteDataProvider } from './RemoteDataProvider';
import { ENV_CONFIG, debugLog } from '../config/environment';

// Singleton instance
let dataProviderInstance: IDataProvider | null = null;

/**
 * Mendapatkan instance data provider berdasarkan konfigurasi
 * Menggunakan singleton pattern untuk memastikan hanya satu instance
 */
export const getDataProvider = (): IDataProvider => {
  if (dataProviderInstance) {
    return dataProviderInstance;
  }

  debugLog('Creating data provider with mode:', ENV_CONFIG.dataSourceMode);

  // Pilih provider berdasarkan mode
  if (ENV_CONFIG.dataSourceMode === 'remote') {
    debugLog('Using RemoteDataProvider');
    dataProviderInstance = new RemoteDataProvider();
  } else {
    debugLog('Using LocalDataProvider');
    dataProviderInstance = new LocalDataProvider();
  }

  return dataProviderInstance;
};

/**
 * Reset data provider instance (berguna untuk testing atau switching mode)
 */
export const resetDataProvider = (): void => {
  dataProviderInstance = null;
  debugLog('Data provider instance reset');
};

/**
 * Initialize data provider
 * Harus dipanggil saat aplikasi pertama kali dijalankan
 */
export const initializeDataProvider = async (): Promise<void> => {
  const provider = getDataProvider();
  await provider.initialize();
  debugLog('Data provider initialized');
};
