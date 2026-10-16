import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  LogOut, 
  Calendar, 
  Shield, 
  Trophy, 
  CreditCard, 
  Camera, 
  Users, 
  Settings,
  Building,
  UtensilsCrossed,
  Package,
  Plus,
  FileText,
  BarChart3,
  Upload,
  Image as ImageIcon,
  Video,
  Globe,
  Bell,
  Moon,
  Sun,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  User,
  Eye,
  EyeOff,
  Fingerprint,
  History,
  Home,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { DataTableInput } from './DataTableInput';
import { MediaUploadSection } from './MediaUploadSection';
import { PaymentDataUpdate } from './PaymentDataUpdate';
import { DataChangeHistory } from './DataChangeHistory';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useLanguage } from '../../hooks/useLanguage';
import { Separator } from '../ui/separator';

interface AdminSectionDashboardProps {
  adminData: {
    name: string;
    email: string;
    section: string;
    role: string;
  };
  onLogout: () => void;
}

type ViewType = 'home' | 'input' | 'payment-methods' | 'statistics' | 'settings' | 'history';

interface MenuCard {
  id: ViewType;
  title: string;
  description: string;
  icon: any;
  color: string;
  badge?: string;
}

export function AdminSectionDashboard({ adminData, onLogout }: AdminSectionDashboardProps) {
  const [selectedView, setSelectedView] = useState<ViewType>('home');
  const [selectedLanguage, setSelectedLanguage] = useState('id');
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { changeLanguage } = useLanguage();
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    superAdminLogin: true,
    dataChanges: true,
    systemUpdates: false,
    emailNotifications: true,
  });

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    changeLanguage(language);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const getSectionIcon = () => {
    const sectionKey = adminData.section.toLowerCase();
    if (sectionKey.includes('absensi')) return Calendar;
    if (sectionKey.includes('disiplin')) return Shield;
    if (sectionKey.includes('prestasi')) return Trophy;
    if (sectionKey.includes('keuangan')) return CreditCard;
    if (sectionKey.includes('album')) return Camera;
    if (sectionKey.includes('santri')) return Users;
    if (sectionKey.includes('bangunan')) return Building;
    if (sectionKey.includes('makanan')) return UtensilsCrossed;
    if (sectionKey.includes('aset')) return Package;
    return FileText;
  };

  const SectionIcon = getSectionIcon();

  // Define menu cards based on section
  const getMenuCards = (): MenuCard[] => {
    const section = adminData.section.toLowerCase();
    
    // Common menus for all sections
    const commonMenus: MenuCard[] = [
      {
        id: 'input',
        title: 'Input Data',
        description: 'Tambah dan kelola data baru',
        icon: Plus,
        color: 'bg-blue-500',
      },
      {
        id: 'statistics',
        title: 'Statistik',
        description: 'Lihat ringkasan dan statistik',
        icon: BarChart3,
        color: 'bg-green-500',
      },
      {
        id: 'history',
        title: 'Riwayat',
        description: 'Log perubahan data',
        icon: History,
        color: 'bg-purple-500',
        badge: 'Baru'
      },
      {
        id: 'settings',
        title: 'Pengaturan',
        description: 'Atur profil dan preferensi',
        icon: Settings,
        color: 'bg-gray-500',
      },
    ];

    // Special menu for payment section
    if (section.includes('keuangan')) {
      return [
        {
          id: 'input',
          title: 'Input Data',
          description: 'Input data pembayaran dan transaksi',
          icon: Plus,
          color: 'bg-blue-500',
        },
        {
          id: 'payment-methods',
          title: 'Metode Pembayaran',
          description: 'Kelola ID Card, Sidik Jari, dan PIN',
          icon: Fingerprint,
          color: 'bg-orange-500',
        },
        {
          id: 'statistics',
          title: 'Statistik',
          description: 'Laporan keuangan dan statistik',
          icon: BarChart3,
          color: 'bg-green-500',
        },
        {
          id: 'history',
          title: 'Riwayat',
          description: 'Log perubahan data pembayaran',
          icon: History,
          color: 'bg-purple-500',
          badge: 'Baru'
        },
        {
          id: 'settings',
          title: 'Pengaturan',
          description: 'Atur profil dan notifikasi',
          icon: Settings,
          color: 'bg-gray-500',
        },
      ];
    }

    // Special menu for album section
    if (section.includes('album')) {
      return [
        {
          id: 'input',
          title: 'Upload Media',
          description: 'Upload foto dan video album',
          icon: Upload,
          color: 'bg-blue-500',
        },
        {
          id: 'statistics',
          title: 'Statistik',
          description: 'Total media dan views',
          icon: BarChart3,
          color: 'bg-green-500',
        },
        {
          id: 'history',
          title: 'Riwayat',
          description: 'Log upload dan perubahan',
          icon: History,
          color: 'bg-purple-500',
          badge: 'Baru'
        },
        {
          id: 'settings',
          title: 'Pengaturan',
          description: 'Atur profil dan preferensi',
          icon: Settings,
          color: 'bg-gray-500',
        },
      ];
    }

    return commonMenus;
  };

  const getTableColumns = () => {
    const section = adminData.section.toLowerCase();
    
    if (section.includes('absensi')) {
      return [
        { key: 'santri_name', label: 'Nama Santri', type: 'student-autocomplete' as const, placeholder: 'Cari santri...' },
        { key: 'class', label: 'Kelas', type: 'text' as const, placeholder: 'Auto-filled' },
        { key: 'date', label: 'Tanggal', type: 'date' as const },
        { key: 'time', label: 'Waktu', type: 'time' as const },
        { key: 'status', label: 'Status', type: 'select' as const, options: ['Hadir', 'Izin', 'Sakit', 'Alpa'] },
        { key: 'activity', label: 'Kegiatan', type: 'text' as const, placeholder: 'Sholat Subuh, Mengaji, dll' },
        { key: 'notes', label: 'Catatan', type: 'text' as const, placeholder: 'Opsional' },
      ];
    }
    
    if (section.includes('disiplin')) {
      return [
        { key: 'santri_name', label: 'Nama Santri', type: 'student-autocomplete' as const, placeholder: 'Cari santri...' },
        { key: 'class', label: 'Kelas', type: 'text' as const, placeholder: 'Auto-filled' },
        { key: 'date', label: 'Tanggal', type: 'date' as const },
        { key: 'violation_type', label: 'Jenis Pelanggaran', type: 'select' as const, options: ['Ringan', 'Sedang', 'Berat'] },
        { key: 'violation_detail', label: 'Detail Pelanggaran', type: 'text' as const },
        { key: 'points', label: 'Poin', type: 'number' as const, placeholder: 'Poin pelanggaran' },
        { key: 'sanction', label: 'Sanksi', type: 'text' as const, placeholder: 'Sanksi yang diberikan' },
      ];
    }
    
    if (section.includes('prestasi')) {
      return [
        { key: 'santri_name', label: 'Nama Santri', type: 'student-autocomplete' as const, placeholder: 'Cari santri...' },
        { key: 'class', label: 'Kelas', type: 'text' as const, placeholder: 'Auto-filled' },
        { key: 'subject', label: 'Mata Pelajaran', type: 'text' as const },
        { key: 'exam_type', label: 'Jenis Ujian', type: 'select' as const, options: ['UTS', 'UAS', 'Harian', 'Praktik'] },
        { key: 'score', label: 'Nilai', type: 'number' as const, placeholder: '0-100' },
        { key: 'date', label: 'Tanggal', type: 'date' as const },
        { key: 'notes', label: 'Catatan', type: 'text' as const, placeholder: 'Opsional' },
      ];
    }
    
    if (section.includes('keuangan')) {
      return [
        { key: 'santri_name', label: 'Nama Santri', type: 'student-autocomplete' as const, placeholder: 'Cari santri...' },
        { key: 'class', label: 'Kelas', type: 'text' as const, placeholder: 'Auto-filled' },
        { key: 'payment_type', label: 'Jenis Pembayaran', type: 'select' as const, options: ['SPP', 'Daftar Ulang', 'Kegiatan', 'Lainnya'] },
        { key: 'amount', label: 'Nominal', type: 'number' as const, placeholder: 'Rupiah' },
        { key: 'payment_date', label: 'Tanggal Bayar', type: 'date' as const },
        { key: 'payment_method', label: 'Metode', type: 'select' as const, options: ['Tunai', 'Transfer', 'Virtual Account'] },
        { key: 'status', label: 'Status', type: 'select' as const, options: ['Lunas', 'Belum Lunas', 'Cicilan'] },
      ];
    }
    
    if (section.includes('bangunan')) {
      return [
        { key: 'building_name', label: 'Nama Bangunan', type: 'text' as const, placeholder: 'Asrama A, Musholla, dll' },
        { key: 'building_type', label: 'Jenis', type: 'select' as const, options: ['Asrama', 'Kelas', 'Musholla', 'Kantor', 'Lainnya'] },
        { key: 'capacity', label: 'Kapasitas', type: 'number' as const, placeholder: 'Jumlah orang' },
        { key: 'condition', label: 'Kondisi', type: 'select' as const, options: ['Baik', 'Perlu Perbaikan', 'Rusak'] },
        { key: 'last_maintenance', label: 'Maintenance Terakhir', type: 'date' as const },
        { key: 'notes', label: 'Catatan', type: 'text' as const, placeholder: 'Opsional' },
      ];
    }
    
    if (section.includes('makanan')) {
      return [
        { key: 'date', label: 'Tanggal', type: 'date' as const },
        { key: 'meal_time', label: 'Waktu Makan', type: 'select' as const, options: ['Sarapan', 'Makan Siang', 'Makan Malam'] },
        { key: 'menu', label: 'Menu', type: 'text' as const, placeholder: 'Nasi, Lauk, Sayur' },
        { key: 'portion', label: 'Porsi', type: 'number' as const, placeholder: 'Jumlah porsi' },
        { key: 'cost', label: 'Biaya per Porsi', type: 'number' as const, placeholder: 'Rupiah' },
        { key: 'notes', label: 'Catatan', type: 'text' as const, placeholder: 'Opsional' },
      ];
    }
    
    if (section.includes('aset')) {
      return [
        { key: 'asset_name', label: 'Nama Aset', type: 'text' as const, placeholder: 'Komputer, Meja, dll' },
        { key: 'category', label: 'Kategori', type: 'select' as const, options: ['Elektronik', 'Furniture', 'Kendaraan', 'Alat Tulis', 'Lainnya'] },
        { key: 'quantity', label: 'Jumlah', type: 'number' as const },
        { key: 'condition', label: 'Kondisi', type: 'select' as const, options: ['Baik', 'Perlu Perbaikan', 'Rusak'] },
        { key: 'purchase_date', label: 'Tanggal Beli', type: 'date' as const },
        { key: 'price', label: 'Harga', type: 'number' as const, placeholder: 'Rupiah' },
        { key: 'location', label: 'Lokasi', type: 'text' as const, placeholder: 'Ruang/Gedung' },
      ];
    }

    if (section.includes('santri')) {
      return [
        { key: 'name', label: 'Nama Lengkap', type: 'text' as const, placeholder: 'Nama santri' },
        { key: 'nis', label: 'NIS', type: 'text' as const, placeholder: 'Nomor Induk' },
        { key: 'class', label: 'Kelas', type: 'select' as const, options: ['1 Ula', '2 Ula', '3 Ula', '1 Wusta', '2 Wusta', '3 Wusta', '1 Ulya', '2 Ulya', '3 Ulya'] },
        { key: 'gender', label: 'Jenis Kelamin', type: 'select' as const, options: ['Laki-laki', 'Perempuan'] },
        { key: 'birth_date', label: 'Tanggal Lahir', type: 'date' as const },
        { key: 'room', label: 'Kamar', type: 'text' as const, placeholder: 'Kamar 1A' },
        { key: 'parent_phone', label: 'No. HP Wali', type: 'text' as const, placeholder: '0812-xxxx-xxxx' },
      ];
    }
    
    // Default columns for album section or fallback
    return [
      { key: 'title', label: 'Judul', type: 'text' as const },
      { key: 'description', label: 'Deskripsi', type: 'text' as const },
      { key: 'date', label: 'Tanggal', type: 'date' as const },
    ];
  };

  const handleImport = (data: any[]) => {
    console.log('Importing data:', data);
    // Here you would typically send the data to your backend/database
  };

  // Render Home View with Icon Menu Cards
  const renderHomeView = () => {
    const menuCards = getMenuCards();
    
    return (
      <div className="space-y-4">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <SectionIcon className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">Selamat Datang, {adminData.name}!</h3>
                <p className="text-sm text-red-100">
                  Admin {adminData.section}
                </p>
                <Badge className="mt-2 bg-white/20 text-white border-white/30">
                  {adminData.role}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {menuCards.map((menu) => (
            <Card 
              key={menu.id}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
              onClick={() => setSelectedView(menu.id)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 ${menu.color} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md`}>
                  <menu.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-sm mb-1">{menu.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {menu.description}
                </p>
                {menu.badge && (
                  <Badge className="mt-2 text-xs bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
                    {menu.badge}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ringkasan Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">12</p>
                <p className="text-xs text-muted-foreground">Data Baru</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">8</p>
                <p className="text-xs text-muted-foreground">Diupdate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">3</p>
                <p className="text-xs text-muted-foreground">Perubahan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render Input Data View
  const renderInputView = () => {
    const section = adminData.section.toLowerCase();
    
    if (section.includes('album')) {
      return (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedView('home')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold">Upload Media</h2>
              <p className="text-sm text-muted-foreground">
                Upload foto dan video untuk album pondok
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Foto & Video
              </CardTitle>
              <CardDescription>
                Pilih file dari perangkat Anda untuk diupload
              </CardDescription>
            </CardHeader>
          </Card>
          
          <MediaUploadSection onUpload={handleImport} />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedView('home')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">Input Data</h2>
            <p className="text-sm text-muted-foreground">
              Tambah dan kelola data {adminData.section.toLowerCase()}
            </p>
          </div>
        </div>

        <DataTableInput
          title={`Input Data ${adminData.section}`}
          description="Tambahkan data dalam tabel di bawah, lalu klik Import untuk menyimpan ke database"
          columns={getTableColumns()}
          onImport={handleImport}
        />
      </div>
    );
  };

  // Render Payment Methods View
  const renderPaymentMethodsView = () => {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedView('home')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">Metode Pembayaran</h2>
            <p className="text-sm text-muted-foreground">
              Kelola ID Card, Sidik Jari, dan PIN santri
            </p>
          </div>
        </div>

        <PaymentDataUpdate onBack={() => setSelectedView('home')} />
      </div>
    );
  };

  // Render Statistics View
  const renderStatisticsView = () => {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedView('home')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">Statistik</h2>
            <p className="text-sm text-muted-foreground">
              Ringkasan dan statistik data {adminData.section.toLowerCase()}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Statistik {adminData.section}</CardTitle>
            <CardDescription>
              Data dan laporan lengkap
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">245</p>
                    <p className="text-sm text-muted-foreground mt-2">Total Data</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">32</p>
                    <p className="text-sm text-muted-foreground mt-2">Data Bulan Ini</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-orange-600">8</p>
                    <p className="text-sm text-muted-foreground mt-2">Data Hari Ini</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Statistics Cards */}
            <div className="space-y-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Rata-rata per Hari</p>
                      <p className="text-xs text-muted-foreground">7 hari terakhir</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">4.2</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Pertumbuhan</p>
                      <p className="text-xs text-muted-foreground">vs bulan lalu</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      +12.5%
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Data Terbaru</p>
                      <p className="text-xs text-muted-foreground">Update terakhir</p>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">2 jam lalu</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render History View
  const renderHistoryView = () => {
    return <DataChangeHistory onBack={() => setSelectedView('home')} />;
  };

  // Render Settings View
  const renderSettingsView = () => {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedView('home')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">Pengaturan</h2>
            <p className="text-sm text-muted-foreground">
              Atur profil dan preferensi akun
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Profile Photo Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <User className="w-5 h-5 mr-2" />
                Foto Profil
              </CardTitle>
              <CardDescription>
                Atur foto profil akun admin Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="" alt={adminData.name} />
                  <AvatarFallback className="bg-red-600 text-white text-xl">
                    {adminData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Foto Baru
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Format: JPG, PNG (Max 2MB)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informasi Pribadi</CardTitle>
              <CardDescription>
                Update informasi pribadi dan kontak Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Nama Lengkap</Label>
                <Input id="admin-name" defaultValue={adminData.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input id="admin-email" type="email" defaultValue={adminData.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-region">Daerah Asal</Label>
                <Input id="admin-region" placeholder="Jakarta" />
              </div>
              <Button>Simpan Perubahan</Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Phone className="w-5 h-5 mr-2" />
                Informasi Kontak
              </CardTitle>
              <CardDescription>
                Nomor telepon dan kontak darurat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-phone">No. HP / WhatsApp</Label>
                <Input id="admin-phone" type="tel" placeholder="0812-xxxx-xxxx" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-emergency">Kontak Darurat</Label>
                <Input id="admin-emergency" type="tel" placeholder="0812-xxxx-xxxx" />
              </div>
              <Button>Simpan Kontak</Button>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <MapPin className="w-5 h-5 mr-2" />
                Alamat Rumah
              </CardTitle>
              <CardDescription>
                Alamat lengkap tempat tinggal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-address">Alamat Lengkap</Label>
                <Textarea 
                  id="admin-address" 
                  placeholder="Jl. Contoh No. 123, RT/RW 001/002" 
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-city">Kota/Kabupaten</Label>
                  <Input id="admin-city" placeholder="Jakarta" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-province">Provinsi</Label>
                  <Input id="admin-province" placeholder="DKI Jakarta" />
                </div>
              </div>
              <Button>Simpan Alamat</Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Bell className="w-5 h-5 mr-2" />
                Pengaturan Notifikasi
              </CardTitle>
              <CardDescription>
                Kelola notifikasi yang Anda terima
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifikasi Login Admin Utama</Label>
                  <p className="text-xs text-muted-foreground">
                    Terima notifikasi saat admin utama masuk ke akun Anda
                  </p>
                </div>
                <Switch
                  checked={notifications.superAdminLogin}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, superAdminLogin: checked})
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Perubahan Data</Label>
                  <p className="text-xs text-muted-foreground">
                    Notifikasi saat ada perubahan data penting
                  </p>
                </div>
                <Switch
                  checked={notifications.dataChanges}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, dataChanges: checked})
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Update Sistem</Label>
                  <p className="text-xs text-muted-foreground">
                    Informasi tentang pembaruan sistem
                  </p>
                </div>
                <Switch
                  checked={notifications.systemUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, systemUpdates: checked})
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifikasi</Label>
                  <p className="text-xs text-muted-foreground">
                    Kirim notifikasi ke email
                  </p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, emailNotifications: checked})
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Globe className="w-5 h-5 mr-2" />
                Pengaturan Bahasa
              </CardTitle>
              <CardDescription>
                Pilih bahasa antarmuka aplikasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Bahasa Aplikasi</Label>
                  <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">🇮🇩 Bahasa Indonesia</SelectItem>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="ar">🇸🇦 العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-muted-foreground">
                  Perubahan bahasa akan diterapkan secara langsung di seluruh aplikasi.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                {darkMode ? <Moon className="w-5 h-5 mr-2" /> : <Sun className="w-5 h-5 mr-2" />}
                Tema Tampilan
              </CardTitle>
              <CardDescription>
                Pilih tema gelap atau terang
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mode Gelap</Label>
                  <p className="text-xs text-muted-foreground">
                    {darkMode ? 'Tema gelap aktif' : 'Tema terang aktif'}
                  </p>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={handleDarkModeToggle}
                />
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ganti Password</CardTitle>
              <CardDescription>
                Update password untuk keamanan akun
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="old-password">Password Lama</Label>
                <Input 
                  id="old-password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Masukkan password lama"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Password Baru</Label>
                <Input 
                  id="new-password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Minimal 8 karakter"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                <Input 
                  id="confirm-password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Ulangi password baru"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={showPassword}
                  onCheckedChange={setShowPassword}
                />
                <Label className="text-sm">Tampilkan password</Label>
              </div>
              <Button>Ganti Password</Button>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <HelpCircle className="w-5 h-5 mr-2" />
                Bantuan & Dukungan
              </CardTitle>
              <CardDescription>
                Butuh bantuan? Kami siap membantu Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-auto py-3">
                <FileText className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-sm">Panduan Pengguna</p>
                  <p className="text-xs text-muted-foreground">Pelajari cara menggunakan sistem</p>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start h-auto py-3">
                <Video className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-sm">Video Tutorial</p>
                  <p className="text-xs text-muted-foreground">Tutorial penggunaan fitur</p>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start h-auto py-3">
                <HelpCircle className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-sm">FAQ (Pertanyaan Umum)</p>
                  <p className="text-xs text-muted-foreground">Jawaban untuk pertanyaan umum</p>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Contact Us */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Mail className="w-5 h-5 mr-2" />
                Hubungi Kami
              </CardTitle>
              <CardDescription>
                Tim dukungan kami siap membantu Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email Support</p>
                    <p className="text-xs text-muted-foreground">support@almunawwarah.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">WhatsApp Support</p>
                    <p className="text-xs text-muted-foreground">+62 812-3456-7890</p>
                  </div>
                </div>
              </div>
              <Button className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Kirim Pesan
              </Button>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informasi Akun</CardTitle>
              <CardDescription>
                Detail akun admin Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Nama</span>
                  <span className="text-sm font-medium">{adminData.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium">{adminData.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Bagian</span>
                  <span className="text-sm font-medium">{adminData.section}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <Badge variant="secondary">{adminData.role}</Badge>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-muted-foreground">Jenis Kelamin</span>
                  <span className="text-sm font-medium">Laki-laki</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Main render based on selected view
  const renderContent = () => {
    switch (selectedView) {
      case 'home':
        return renderHomeView();
      case 'input':
        return renderInputView();
      case 'payment-methods':
        return renderPaymentMethodsView();
      case 'statistics':
        return renderStatisticsView();
      case 'history':
        return renderHistoryView();
      case 'settings':
        return renderSettingsView();
      default:
        return renderHomeView();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div
        className="bg-red-600 text-white px-4 pb-4 shadow-md flex-shrink-0"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 1rem)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <SectionIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">{adminData.name}</h2>
              <p className="text-xs text-red-100">
                Admin {adminData.section}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout} className="text-white hover:bg-red-700">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 pb-20">
            {renderContent()}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
