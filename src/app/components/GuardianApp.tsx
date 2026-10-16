import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Bell, 
  Settings, 
  LogOut,
  CreditCard,
  Calendar,
  Shield,
  Trophy,
  Camera,
  UserCircle,
  Wallet,
  ChevronDown,
  Users,
  Plus,
  ArrowUpRight,
  DollarSign,
  CheckCircle,
  Send,
  Home,
  MessageCircle
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { PaymentSection } from './guardian/PaymentSection';
import { AchievementSection } from './guardian/AchievementSection';
import { AlbumSection } from './guardian/AlbumSection';
import { PersonalSection } from './guardian/PersonalSection';
import { NotificationSection } from './guardian/NotificationSection';
import { SettingsSection } from './guardian/SettingsSection';
import { EventScheduleScreen } from './guardian/EventScheduleScreen';
import { ChildSelectorModal } from './guardian/ChildSelectorModal';
import { TopUpBalanceModal } from './guardian/TopUpBalanceModal';
import { DisciplineSection } from './guardian/DisciplineSection';
import { DisciplineProgressScreen } from './guardian/DisciplineProgressScreen';
import { SPPDetailScreen } from './guardian/SPPDetailScreen';
import { TransactionHistoryScreen } from './guardian/TransactionHistoryScreen';
import { ProfileInfoSection } from './guardian/ProfileInfoSection';
import { StudentSettingsSection } from './guardian/StudentSettingsSection';
import { ChatSection } from './guardian/ChatSection';
import { DompetSantriScreen } from './guardian/DompetSantriScreen';
import { SendAllowanceModal } from './guardian/SendAllowanceModal';
import { useLanguage } from '../hooks/useLanguage';
import analytics from '../utils/analytics';

interface GuardianAppProps {
  guardianData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    photo?: string;
  };
  onLogout: () => void;
}

interface ChildData {
  id: string;
  stanbuk: string;
  name: string;
  class: string;
  room: string;
  photo?: string;
  birthDate: string;
  status: 'active' | 'graduated' | 'alumni';
  notifications: number;
  sppStatus: string;
  attendanceRate: number;
  emoneyBalance: number;
  lastPayment: string;
  recentAchievement: string;
  performanceData: Array<{ subject: string; score: number }>;
}

export function GuardianApp({ guardianData, onLogout }: GuardianAppProps) {
  const [selectedSection, setSelectedSection] = useState('home');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEventSchedule, setShowEventSchedule] = useState(false);
  const [showDisciplineProgress, setShowDisciplineProgress] = useState(false);
  const [showChildSelector, setShowChildSelector] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showSPPDetail, setShowSPPDetail] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [showDompetSantri, setShowDompetSantri] = useState(false);
  const [showSendAllowance, setShowSendAllowance] = useState(false);
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [showStudentSettings, setShowStudentSettings] = useState(false);
  const [sppSemester, setSppSemester] = useState('2024/2025 Ganjil');
  const [transactionSemester, setTransactionSemester] = useState('2024/2025 Ganjil');
  const [currentBalance, setCurrentBalance] = useState(2500000);
  const { t } = useLanguage();

  // Multi-children data with all required properties
  const [children, setChildren] = useState<ChildData[]>([
    {
      id: '1',
      stanbuk: '2023001',
      name: 'Ahnaf Haidar',
      class: '2 Wusta',
      room: 'Kamar 1A',
      photo: '',
      birthDate: '2008-05-15',
      status: 'active',
      notifications: 3,
      sppStatus: 'Lunas',
      attendanceRate: 95,
      emoneyBalance: 250000,
      lastPayment: '15 Des 2024',
      recentAchievement: 'Juara 1 Lomba Tahfidz',
      performanceData: [
        { subject: 'Akhlak', score: 90 },
        { subject: 'Tahfidz', score: 95 },
        { subject: 'Bahasa Arab', score: 85 },
        { subject: 'Fiqih', score: 88 },
        { subject: 'Hadits', score: 92 },
        { subject: 'Tafsir', score: 87 }
      ]
    },
    {
      id: '2',
      stanbuk: '2023045',
      name: 'Raihan Firdaus',
      class: '1 Ula',
      room: 'Kamar 2B',
      photo: '',
      birthDate: '2010-03-18',
      status: 'active',
      notifications: 2,
      sppStatus: 'Lunas',
      attendanceRate: 97,
      emoneyBalance: 320000,
      lastPayment: '12 Des 2024',
      recentAchievement: 'Juara 2 Lomba Kaligrafi',
      performanceData: [
        { subject: 'Akhlak', score: 92 },
        { subject: 'Tahfidz', score: 90 },
        { subject: 'Bahasa Arab', score: 88 },
        { subject: 'Fiqih', score: 91 },
        { subject: 'Hadits', score: 89 },
        { subject: 'Tafsir', score: 90 }
      ]
    },
    {
      id: '3',
      stanbuk: '2024078',
      name: 'Zidny Huda Qonita',
      class: '3 Ulya',
      room: 'Kamar 4A',
      photo: '',
      birthDate: '2007-11-25',
      status: 'active',
      notifications: 1,
      sppStatus: 'Lunas',
      attendanceRate: 98,
      emoneyBalance: 280000,
      lastPayment: '14 Des 2024',
      recentAchievement: 'Juara 1 Lomba Khitobah',
      performanceData: [
        { subject: 'Akhlak', score: 94 },
        { subject: 'Tahfidz', score: 93 },
        { subject: 'Bahasa Arab', score: 91 },
        { subject: 'Fiqih', score: 95 },
        { subject: 'Hadits', score: 92 },
        { subject: 'Tafsir', score: 94 }
      ]
    }
  ]);

  const [currentChildId, setCurrentChildId] = useState('1');
  const currentChild = children.find(c => c.id === currentChildId) || children[0];

  // Data 6 item navigasi
  const navigationItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'payment', label: 'Pembayaran', icon: CreditCard },
    { id: 'discipline', label: 'Kedisiplinan', icon: Shield },
    { id: 'achievement', label: 'Prestasi', icon: Trophy },
    { id: 'album', label: 'Album', icon: Camera },
    { id: 'personal', label: 'Personal', icon: UserCircle }
  ];

  // Logika komidi putar untuk memutar array dan memotongnya jadi 5 item visual
  const getShiftedItems = () => {
    const activeIndex = navigationItems.findIndex(item => item.id === selectedSection);
    if (activeIndex === -1) return navigationItems.slice(0, 5);

    const targetVisualIndex = 2; // Menjadikan item aktif berada di posisi tengah
    let shiftAmount = activeIndex - targetVisualIndex;

    const rotated = [
      ...navigationItems.slice(shiftAmount), 
      ...navigationItems.slice(0, shiftAmount)
    ];

    return rotated.slice(0, 5);
  };

  // Initialize analytics on mount
  useEffect(() => {
    // Analytics disabled in offline mode
  }, []);

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
    setShowDompetSantri(false);
    setShowSendAllowance(false);
  };

  const handleChildSwitch = (childId: string) => {
    setCurrentChildId(childId);
  };

  const handleTopUp = () => {
    setShowTopUpModal(true);
  };

  const handleTopUpSuccess = (amount: number, method: string) => {
    setCurrentBalance(prev => prev + amount);
  };

  const handleSendAllowanceSuccess = (amount: number) => {
    // Dalam implementasi nyata, balance akan di-refresh dari server/localStorage
    // Di sini cukup tutup modal; DompetSantriScreen akan re-load data
    setShowSendAllowance(false);
  };

  const getPageTitle = () => {
    switch (selectedSection) {
      case 'home': return 'Dashboard';
      case 'payment': return 'Pembayaran';
      case 'discipline': return 'Kedisiplinan';
      case 'achievement': return 'Prestasi';
      case 'album': return 'Album';
      case 'personal': return 'Personal';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* Header — padding-top absorbs the status bar via safe-area-inset-top */}
      <header
        className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 text-white px-4 pb-4 shrink-0"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 1rem)' }}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto hover:bg-transparent"
                onClick={() => setShowChildSelector(true)}
              >
                <Avatar className="h-12 w-12 border-2 border-white/20">
                  <AvatarImage 
                    src={currentChild.photo}
                    alt={currentChild.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-emerald-700 text-white text-lg font-semibold">
                    {currentChild.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-white">{currentChild.name}</h2>
                  {children.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-white hover:bg-emerald-700"
                      onClick={() => setShowChildSelector(true)}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-emerald-100">Kelas {currentChild.class}</p>
                <p className="text-xs text-emerald-200">{currentChild.stanbuk}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-emerald-700 rounded-full relative"
                onClick={() => setShowNotifications(true)}
              >
                <Bell className="h-5 w-5" />
                {currentChild.notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {currentChild.notifications}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Quick Stats - only show on dashboard */}
          {selectedSection === 'home' && (
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <DollarSign className="h-4 w-4 text-emerald-200" />
                  <span className="text-xs font-medium text-emerald-100">SPP</span>
                </div>
                <p className="text-sm font-bold text-white">{currentChild.sppStatus}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CreditCard className="h-4 w-4 text-emerald-200" />
                  <span className="text-xs font-medium text-emerald-100">E-Money</span>
                </div>
                <p className="text-sm font-bold text-white">Rp {currentBalance.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CheckCircle className="h-4 w-4 text-emerald-200" />
                  <span className="text-xs font-medium text-emerald-100">Kehadiran</span>
                </div>
                <p className="text-sm font-bold text-white">{currentChild.attendanceRate}%</p>
              </div>
            </div>
          )}

          {/* Page title for other sections */}
          {selectedSection !== 'home' && (
            <div className="text-center">
              <h1 className="text-lg font-semibold text-white">{getPageTitle()}</h1>
            </div>
          )}
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 pb-[calc(5rem+env(safe-area-inset-bottom,0px))]">
        {showNotifications ? (
          <NotificationSection
            onClose={() => setShowNotifications(false)}
            notificationCount={currentChild.notifications}
          />
        ) : selectedSection === 'home' ? (
          <div className="p-4 space-y-4">
            {/* Performance Analysis Chart */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Rangkuman Analisis</CardTitle>
              </CardHeader>
              <CardContent>
                {currentChild?.performanceData && currentChild.performanceData.length > 0 ? (
                  <div className="w-full mb-4" style={{ width: '100%', height: '256px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={currentChild.performanceData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                        <PolarRadiusAxis 
                          angle={90} 
                          domain={[0, 100]} 
                          tick={{ fontSize: 10 }}
                        />
                        <Radar
                          name="Performa"
                          dataKey="score"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="w-full h-64 flex items-center justify-center text-muted-foreground">
                    <p>Tidak ada data performa</p>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mx-auto mb-1"></div>
                    <span className="text-muted-foreground">Baik Sekali</span>
                  </div>
                  <div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                    <span className="text-muted-foreground">Baik</span>
                  </div>
                  <div>
                    <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-1"></div>
                    <span className="text-muted-foreground">Perlu Perbaikan</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-auto py-3 flex flex-col gap-2"
                    onClick={() => handleSectionChange('payment')}
                  >
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Bayar SPP</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-3 flex flex-col gap-2"
                    onClick={handleTopUp}
                  >
                    <Send className="h-5 w-5 text-blue-600" />
                    <span className="text-sm">Kirim Uang</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-3 flex flex-col gap-2"
                    onClick={() => handleSectionChange('album')}
                  >
                    <Camera className="h-5 w-5 text-purple-600" />
                    <span className="text-sm">Album Foto</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-3 flex flex-col gap-2"
                    onClick={() => handleSectionChange('achievement')}
                  >
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm">Prestasi</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Aktivitas Terbaru</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-green-600 dark:text-green-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Prestasi Baru</p>
                    <p className="text-xs text-muted-foreground">{currentChild.recentAchievement}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">2 hari lalu</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Pembayaran SPP</p>
                    <p className="text-xs text-muted-foreground">Bulan Desember - Lunas</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{currentChild.lastPayment}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : selectedSection === 'payment' && showDompetSantri ? (
          <DompetSantriScreen
            studentId={currentChild.id}
            studentName={currentChild.name}
            onBack={() => setShowDompetSantri(false)}
            onShowTopUp={() => setShowTopUpModal(true)}
            onShowSendAllowance={() => setShowSendAllowance(true)}
          />
        ) : selectedSection === 'payment' && !showSPPDetail && !showTransactionHistory ? (
          <PaymentSection
            studentData={{
              name: currentChild.name,
              emoneyBalance: currentChild.emoneyBalance,
              sppStatus: currentChild.sppStatus,
              lastPayment: currentChild.lastPayment
            }}
            onShowSPPDetail={() => setShowSPPDetail(true)}
            onShowTransactionHistory={() => setShowTransactionHistory(true)}
            onShowDompetSantri={() => setShowDompetSantri(true)}
            onShowTopUp={() => setShowTopUpModal(true)}
          />
        ) : selectedSection === 'payment' && showSPPDetail ? (
          <SPPDetailScreen 
            onBack={() => setShowSPPDetail(false)}
            semester={sppSemester}
            onSemesterChange={setSppSemester}
          />
        ) : selectedSection === 'payment' && showTransactionHistory ? (
          <TransactionHistoryScreen 
            onBack={() => setShowTransactionHistory(false)}
            semester={transactionSemester}
            onSemesterChange={setTransactionSemester}
          />
        ) : selectedSection === 'discipline' && !showDisciplineProgress ? (
          <DisciplineSection 
            studentData={currentChild}
            onShowProgress={() => setShowDisciplineProgress(true)}
          />
        ) : selectedSection === 'discipline' && showDisciplineProgress ? (
          <DisciplineProgressScreen
            onBack={() => setShowDisciplineProgress(false)}
            studentData={currentChild}
          />
        ) : selectedSection === 'achievement' ? (
          <AchievementSection studentData={currentChild} />
        ) : selectedSection === 'album' && !showEventSchedule ? (
          <AlbumSection 
            studentData={currentChild}
            onShowEventSchedule={() => setShowEventSchedule(true)}
          />
        ) : selectedSection === 'album' && showEventSchedule ? (
          <EventScheduleScreen onBack={() => setShowEventSchedule(false)} />
        ) : selectedSection === 'personal' ? (
          <PersonalSection 
            studentData={{
              name: currentChild.name,
              class: currentChild.class,
              room: currentChild.room,
              guardian: guardianData.name,
              profilePhoto: guardianData.photo || ''
            }}
            onLogout={onLogout}
          />
        ) : null}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] z-30">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {getShiftedItems().map((item) => {
            const Icon = item.icon;
            const isActive = selectedSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setSelectedSection(item.id)}
                className={`flex flex-col items-center justify-center transition-all duration-300 relative ${
                  isActive 
                    ? 'text-emerald-600 dark:text-emerald-400 -translate-y-1' 
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 scale-110 shadow-sm' 
                    : 'bg-transparent'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <span className={`text-[10px] font-medium mt-0.5 ${
                  isActive ? 'opacity-100 font-semibold' : 'opacity-70'
                }`}>
                  {item.label}
                </span>

                {isActive && (
                  <span className="absolute -bottom-1 w-1 h-1 bg-emerald-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsSection
          onClose={() => setShowSettings(false)}
          guardianData={guardianData}
          onLogout={onLogout}
        />
      )}

      {/* Child Selector Modal */}
      <ChildSelectorModal
        isOpen={showChildSelector}
        onClose={() => setShowChildSelector(false)}
        children={children}
        currentChildId={currentChildId}
        onSelectChild={handleChildSwitch}
      />

      {/* Top Up Balance Modal */}
      <TopUpBalanceModal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        currentBalance={currentBalance}
        onTopUpSuccess={handleTopUpSuccess}
      />

      {/* Kirim Uang Saku Modal */}
      <SendAllowanceModal
        isOpen={showSendAllowance}
        onClose={() => setShowSendAllowance(false)}
        studentId={currentChild.id}
        studentName={currentChild.name}
        currentBalance={currentBalance}
        onSuccess={handleSendAllowanceSuccess}
      />
    </div>
  );
}