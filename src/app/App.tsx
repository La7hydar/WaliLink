import { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LoginScreen } from './components/LoginScreen';
import { GuardianApp } from './components/GuardianApp';
import { ThemeProvider } from './components/ThemeProvider';
import { LanguageProvider } from './components/LanguageProvider';
import { ServerSelectionScreen } from './components/ServerSelectionScreen';
import { CreateServerScreen } from './components/CreateServerScreen';
import { LoginOptionsScreen } from './components/LoginOptionsScreen';
import { GuardianAccountCreation } from './components/GuardianAccountCreation';
import { AdminDashboard } from './components/AdminDashboard';
import { TutorialScreen } from './components/TutorialScreen';
import { LanguageSelection } from './components/LanguageSelection';
import { AdminSectionLogin } from './components/admin/AdminSectionLogin';
import { AdminSectionDashboard } from './components/admin/AdminSectionDashboard';
import { initializeDataProvider } from './data-access/DataProviderFactory';
import { getAuthService } from './services/AuthService';

type AppState = 
  | 'welcome' 
  | 'server-selection' 
  | 'create-server' 
  | 'login-options' 
  | 'guardian-login' 
  | 'guardian-signup' 
  | 'admin-login'
  | 'admin-section-login'
  | 'guardian-authenticated' 
  | 'admin-authenticated'
  | 'admin-section-authenticated'
  | 'tutorial'
  | 'language-selection';

interface LoginCredentials {
  phone?: string;
  email?: string;
  password: string;
}

interface AdminLoginCredentials {
  email: string;
  password: string;
  section: string;
  role: 'admin' | 'super-admin';
}

interface ServerData {
  serverId: string;
  serverName: string;
  isMainServer: boolean;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerData | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Initialize data provider on app start
  useEffect(() => {
    const initApp = async () => {
      try {
        await initializeDataProvider();
        console.log('Data provider initialized successfully');
      } catch (error) {
        console.error('Failed to initialize data provider:', error);
      }
    };

    initApp();
  }, []);

  const handleStartApp = () => {
    setAppState('server-selection');
  };

  // Server Selection Handlers
  const handleServerSelected = (serverData: ServerData) => {
    setSelectedServer(serverData);
    setAppState('login-options');
  };

  const handleCreateNewServer = () => {
    setAppState('create-server');
  };

  const handleServerCreated = (serverData: any) => {
    setSelectedServer(serverData);
    setCurrentUser(serverData.admins[0]); // Auto login as main admin
    setAppState('admin-authenticated');
  };

  // Login Options Handlers
  const handleGuardianLogin = () => {
    setAppState('guardian-login');
  };

  const handleCreateGuardianAccount = () => {
    setAppState('guardian-signup');
  };

  const handleAdminLogin = () => {
    setAppState('admin-login');
  };

  const handleAdminSectionLogin = () => {
    setAppState('admin-section-login');
  };

  // Authentication Handlers
  const handleGuardianAuthenticate = async (credentials: LoginCredentials) => {
    setIsLoading(true);

    try {
      const authService = getAuthService();
      const identifier = credentials.email || credentials.phone || '';
      const guardian = await authService.authenticateGuardian(identifier, credentials.password);

      setIsLoading(false);

      if (guardian) {
        setCurrentUser({
          type: 'guardian',
          ...guardian,
        });
        setAppState('guardian-authenticated');
      } else {
        alert('Login gagal. Periksa kredensial Anda atau gunakan akun demo.');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Authentication error:', error);
      alert('Login gagal. Terjadi kesalahan sistem.');
    }
  };

  const handleAdminAuthenticate = async (credentials: LoginCredentials) => {
    setIsLoading(true);

    try {
      const authService = getAuthService();
      const identifier = credentials.email || credentials.phone || '';
      const admin = await authService.authenticateAdmin(identifier, credentials.password);

      setIsLoading(false);

      if (admin) {
        setCurrentUser({
          type: 'admin',
          ...admin,
        });
        setAppState('admin-authenticated');
      } else {
        alert('Login admin gagal. Gunakan: admin@almunawwarah.com / admin123');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Admin authentication error:', error);
      alert('Login gagal. Terjadi kesalahan sistem.');
    }
  };

  const handleAdminSectionAuthenticate = (credentials: AdminLoginCredentials) => {
    setIsLoading(true);
    
    // Valid credentials for different admin sections
    const sectionMapping: { [key: string]: string } = {
      'attendance': 'Absensi & Kehadiran',
      'discipline': 'Kedisiplinan',
      'achievement': 'Prestasi & Nilai',
      'payment': 'Keuangan & Pembayaran',
      'album': 'Album & Dokumentasi',
      'students': 'Data Santri',
      'building': 'Bangunan & Fasilitas',
      'food': 'Makanan & Konsumsi',
      'assets': 'Aset Pondok',
    };

    const validAdminSectionCredentials = [
      { email: 'admin@almunawwarah.com', password: 'admin123', role: 'super-admin' as const },
      { email: 'absensi@almunawwarah.com', password: 'admin123', role: 'admin' as const },
      { email: 'keuangan@almunawwarah.com', password: 'admin123', role: 'admin' as const },
    ];

    const isValid = validAdminSectionCredentials.some(cred => 
      cred.email === credentials.email && 
      cred.password === credentials.password && 
      cred.role === credentials.role
    );

    setTimeout(() => {
      setIsLoading(false);
      if (isValid) {
        const sectionName = sectionMapping[credentials.section] || credentials.section;
        setCurrentUser({ 
          type: 'admin-section', 
          name: credentials.role === 'super-admin' ? 'Admin Utama' : `Admin ${sectionName}`,
          email: credentials.email,
          section: sectionName,
          role: credentials.role === 'super-admin' ? 'Admin Utama' : 'Admin Bagian',
        });
        setAppState('admin-section-authenticated');
      } else {
        alert('Login admin gagal. Gunakan: admin@almunawwarah.com / admin123');
      }
    }, 1500);
  };

  // Handler for super admin to access section without login
  const handleSuperAdminAccessSection = (section: string) => {
    const sectionMapping: { [key: string]: string } = {
      'attendance': 'Absensi & Kehadiran',
      'discipline': 'Kedisiplinan',
      'achievement': 'Prestasi & Nilai',
      'payment': 'Keuangan & Pembayaran',
      'album': 'Album & Dokumentasi',
      'students': 'Data Santri',
      'building': 'Bangunan & Fasilitas',
      'food': 'Makanan & Konsumsi',
      'assets': 'Aset Pondok',
    };

    const sectionName = sectionMapping[section] || section;
    
    // Store current user state to return to later
    const previousUser = currentUser;
    
    setCurrentUser({ 
      type: 'admin-section', 
      name: 'Admin Utama',
      email: 'admin@almunawwarah.com',
      section: sectionName,
      role: 'Admin Utama (Akses Sementara)',
      previousUser: previousUser // Store to allow returning
    });
    setAppState('admin-section-authenticated');
  };

  const handleGuardianAccountCreated = async (guardianData: any) => {
    try {
      const authService = getAuthService();
      const newGuardian = await authService.createGuardianAccount(guardianData);

      setCurrentUser({ type: 'guardian', ...newGuardian });
      setAppState('guardian-authenticated');
    } catch (error) {
      console.error('Failed to create guardian account:', error);
      alert('Gagal membuat akun. Silakan coba lagi.');
    }
  };

  // Navigation Handlers
  const handleBackToWelcome = () => {
    setAppState('welcome');
    setSelectedServer(null);
    setCurrentUser(null);
  };

  const handleBackToServerSelection = () => {
    setAppState('server-selection');
    setSelectedServer(null);
  };

  const handleBackToLoginOptions = () => {
    setAppState('login-options');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAppState('login-options');
  };

  const handleShowTutorial = () => {
    setAppState('tutorial');
  };

  const handleShowLanguageSelection = () => {
    setAppState('language-selection');
  };

  const renderCurrentScreen = () => {
    switch (appState) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStartApp} />;
      
      case 'server-selection':
        return (
          <ServerSelectionScreen 
            onServerSelected={handleServerSelected}
            onCreateNewServer={handleCreateNewServer}
            onTutorial={handleShowTutorial}
            onLanguageSettings={handleShowLanguageSelection}
          />
        );
      
      case 'create-server':
        return (
          <CreateServerScreen 
            onBack={handleBackToServerSelection}
            onServerCreated={handleServerCreated}
          />
        );
      
      case 'login-options':
        return (
          <LoginOptionsScreen 
            serverName={selectedServer?.serverName || ''}
            onBack={handleBackToServerSelection}
            onLogin={handleGuardianLogin}
            onCreateGuardianAccount={handleCreateGuardianAccount}
            onAdminLogin={handleAdminLogin}
            onAdminSectionLogin={handleAdminSectionLogin}
          />
        );
      
      case 'guardian-login':
        return (
          <LoginScreen 
            onLogin={handleGuardianAuthenticate} 
            onBack={handleBackToLoginOptions}
            title="Login Wali Santri"
          />
        );
      
      case 'guardian-signup':
        return (
          <GuardianAccountCreation 
            onBack={handleBackToLoginOptions}
            onAccountCreated={handleGuardianAccountCreated}
          />
        );
      
      case 'admin-login':
        return (
          <LoginScreen 
            onLogin={handleAdminAuthenticate} 
            onBack={handleBackToLoginOptions}
            title="Login Admin"
            isAdmin={true}
          />
        );
      
      case 'admin-section-login':
        return (
          <AdminSectionLogin 
            onLogin={handleAdminSectionAuthenticate} 
            onBack={handleBackToLoginOptions}
          />
        );
      
      case 'guardian-authenticated':
        return <GuardianApp 
          guardianData={{
            name: currentUser?.name || 'Wali Santri',
            email: currentUser?.email || '',
            phone: currentUser?.phone || '',
            address: currentUser?.address || '',
            photo: currentUser?.photo || ''
          }}
          onLogout={handleLogout} 
        />;
      
      case 'admin-authenticated':
        return (
          <AdminDashboard 
            adminData={currentUser}
            onLogout={handleLogout}
            onAccessSection={handleSuperAdminAccessSection}
          />
        );
      
      case 'admin-section-authenticated':
        return (
          <AdminSectionDashboard 
            adminData={currentUser}
            onLogout={handleLogout}
          />
        );
      
      case 'tutorial':
        return (
          <TutorialScreen 
            onBack={handleBackToServerSelection}
          />
        );
      
      case 'language-selection':
        return (
          <LanguageSelection 
            onBack={handleBackToServerSelection}
          />
        );
      
      default:
        return <WelcomeScreen onStart={handleStartApp} />;
    }
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="h-dvh flex flex-col bg-background transition-colors duration-300 overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0">
            {renderCurrentScreen()}
          </div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}