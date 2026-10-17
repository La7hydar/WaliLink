import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useTheme } from '../ThemeProvider';
import { useLanguage } from '../../hooks/useLanguage';
import { 
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Settings,
  Bell,
  Lock,
  LogOut,
  Edit,
  Save,
  X,
  Shield,
  Smartphone,
  Globe,
  Eye,
  HelpCircle,
  Languages,
  Moon,
  Sun,
  CreditCard,
  Trophy,
  AlertTriangle,
  ShoppingBag,
  Camera
} from 'lucide-react';

import { Badge } from '../ui/badge';

interface PersonalSectionProps {
  studentData: {
    name: string;
    class: string;
    room: string;
    guardian: string;
    profilePhoto: string;
  };
  onLogout?: () => void;
  onShowStudentSettings?: () => void;
}

export function PersonalSection({ studentData, onLogout, onShowStudentSettings }: PersonalSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { changeLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState('id');
  const [notifications, setNotifications] = useState({
    bills: true,
    achievements: true,
    discipline: true,
    shopping: false
  });

  const [profileData, setProfileData] = useState({
    guardianName: studentData.guardian,
    phone: '0812-3456-7890',
    email: 'demo@walisant.com',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat'
  });

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    changeLanguage(language);
  };

  const getLanguageLabel = (lang: string) => {
    const labels = {
      id: '🇮🇩 Bahasa Indonesia',
      en: '🇺🇸 English',
      ar: '🇸🇦 العربية'
    };
    return labels[lang as keyof typeof labels] || labels.id;
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      {/* Content Area */}

      <div className="p-4 pb-8">
        {/* Profile Section */}
        <Card className="mb-4">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Profil Wali</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="text-green-600 dark:text-green-400"
              >
                {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage 
                  src={studentData.profilePhoto}
                  alt={studentData.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-green-100 dark:bg-green-800">
                  <User className="h-8 w-8 text-green-600 dark:text-green-300" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nama Wali</label>
                  {isEditing ? (
                    <Input
                      value={profileData.guardianName}
                      onChange={(e) => setProfileData({...profileData, guardianName: e.target.value})}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium">{profileData.guardianName}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Santri</label>
                  <p className="font-medium">{studentData.name}</p>
                  <p className="text-sm text-muted-foreground">{studentData.class} • {studentData.room}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Informasi Kontak</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                <Phone className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              </div>
              {isEditing ? (
                <Input
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  placeholder="Nomor Telepon"
                />
              ) : (
                <div>
                  <p className="font-medium">{profileData.phone}</p>
                  <p className="text-sm text-muted-foreground">Nomor Telepon</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                <Mail className="h-4 w-4 text-green-600 dark:text-green-300" />
              </div>
              {isEditing ? (
                <Input
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  placeholder="Email"
                />
              ) : (
                <div>
                  <p className="font-medium">{profileData.email}</p>
                  <p className="text-sm text-muted-foreground">Email</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-300" />
              </div>
              {isEditing ? (
                <Input
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  placeholder="Alamat"
                />
              ) : (
                <div>
                  <p className="font-medium">{profileData.address}</p>
                  <p className="text-sm text-muted-foreground">Alamat</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Student Settings */}
        {onShowStudentSettings && (
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Pengaturan Santri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={onShowStudentSettings}
              >
                <Shield className="h-4 w-4 mr-3" />
                Metode Identifikasi (Kartu & Sidik Jari)
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Camera className="h-4 w-4 mr-3" />
                Ubah Foto Profil
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Payment Methods Info - Read Only */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Metode Pembayaran Santri</CardTitle>
              <Badge variant="secondary" className="text-xs">Read Only</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Data dikelola oleh Admin Keuangan. Pendaftaran dilakukan di kantor admin.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">ID Card</p>
                <p className="text-xs text-muted-foreground">**** **** **** 3456</p>
                <Badge variant="outline" className="text-xs mt-1">Terdaftar</Badge>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                <svg className="h-5 w-5 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Sidik Jari</p>
                <p className="text-xs text-muted-foreground">Tangan kanan - Jari telunjuk</p>
                <Badge variant="outline" className="text-xs mt-1">Terverifikasi</Badge>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                <Lock className="h-5 w-5 text-purple-600 dark:text-purple-300" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">PIN Transaksi</p>
                <p className="text-xs text-muted-foreground">4 digit - Terenkripsi</p>
                <Badge variant="outline" className="text-xs mt-1">Aktif</Badge>
              </div>
            </div>

            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-orange-900 dark:text-orange-200">Informasi Penting</p>
                  <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                    Untuk perubahan atau pembaruan data pembayaran, silakan hubungi kantor Admin Keuangan. 
                    Proses scan sidik jari dilakukan dengan alat khusus di kantor admin.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Pengaturan Aplikasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Language */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center">
                  <Languages className="h-4 w-4 text-orange-600 dark:text-orange-300" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Bahasa Aplikasi</p>
                  <p className="text-sm text-muted-foreground">
                    Pilih bahasa interface
                  </p>
                </div>
              </div>
              <div className="w-48">
                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">🇮🇩 Bahasa Indonesia</SelectItem>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                    <SelectItem value="ar">🇸🇦 العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  {theme === 'dark' ? <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" /> : <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" />}
                </div>
                <div>
                  <p className="font-medium">Mode Gelap</p>
                  <p className="text-sm text-muted-foreground">Tema tampilan aplikasi</p>
                </div>
              </div>
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Pengaturan Notifikasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="font-medium">Tagihan & Pembayaran</p>
                  <p className="text-sm text-muted-foreground">Notifikasi SPP dan pembayaran</p>
                </div>
              </div>
              <Switch 
                checked={notifications.bills} 
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, bills: checked})
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
                </div>
                <div>
                  <p className="font-medium">Prestasi & Pencapaian</p>
                  <p className="text-sm text-muted-foreground">Notifikasi prestasi santri</p>
                </div>
              </div>
              <Switch 
                checked={notifications.achievements} 
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, achievements: checked})
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-300" />
                </div>
                <div>
                  <p className="font-medium">Kedisiplinan</p>
                  <p className="text-sm text-muted-foreground">Notifikasi pelanggaran dan disiplin</p>
                </div>
              </div>
              <Switch 
                checked={notifications.discipline} 
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, discipline: checked})
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <p className="font-medium">Belanja & Pengeluaran</p>
                  <p className="text-sm text-muted-foreground">Notifikasi pembelian kantin</p>
                </div>
              </div>
              <Switch 
                checked={notifications.shopping} 
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, shopping: checked})
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Security & Privacy */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Keamanan & Privasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" className="w-full justify-start">
              <Lock className="h-4 w-4 mr-3" />
              Ubah Password
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-3" />
              Keamanan Akun
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Eye className="h-4 w-4 mr-3" />
              Pengaturan Privasi
            </Button>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Bantuan & Dukungan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" className="w-full justify-start">
              <HelpCircle className="h-4 w-4 mr-3" />
              Pusat Bantuan
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Phone className="h-4 w-4 mr-3" />
              Hubungi Kami
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="p-4">
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Keluar dari Akun
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}