import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Phone, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  BookOpen,
  Shield,
  AlertCircle,
  Calendar,
  Trophy,
  CreditCard,
  Camera,
  Users,
  Building,
  UtensilsCrossed,
  Package
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useLanguage } from '../../hooks/useLanguage';
import { Alert, AlertDescription } from '../ui/alert';

interface AdminSectionLoginProps {
  onLogin: (credentials: { 
    email: string; 
    password: string; 
    section: string;
    role: 'admin' | 'super-admin';
  }) => void;
  onBack: () => void;
}

const adminSections = [
  { id: 'attendance', name: 'Absensi & Kehadiran', icon: Calendar, color: 'blue' },
  { id: 'discipline', name: 'Kedisiplinan', icon: Shield, color: 'red' },
  { id: 'achievement', name: 'Prestasi & Nilai', icon: Trophy, color: 'yellow' },
  { id: 'payment', name: 'Keuangan & Pembayaran', icon: CreditCard, color: 'green' },
  { id: 'album', name: 'Album & Dokumentasi', icon: Camera, color: 'purple' },
  { id: 'students', name: 'Data Santri', icon: Users, color: 'indigo' },
  { id: 'building', name: 'Bangunan & Fasilitas', icon: Building, color: 'orange' },
  { id: 'food', name: 'Makanan & Konsumsi', icon: UtensilsCrossed, color: 'pink' },
  { id: 'assets', name: 'Aset Pondok', icon: Package, color: 'teal' },
];

export function AdminSectionLogin({ onLogin, onBack }: AdminSectionLoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'super-admin'>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const handleLogin = async () => {
    if (!email || !password || (!selectedSection && selectedRole === 'admin')) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onLogin({
        email,
        password,
        section: selectedSection,
        role: selectedRole
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header absorbs safe-area-inset-top */}
      <div
        className="bg-red-600 text-white px-4 pb-4 shrink-0"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 1rem)' }}
      >
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-red-700 rounded-full p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">Admin Dashboard</span>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-2">
              Login Admin
            </h1>
            <p className="text-red-100 text-sm">
              Akses panel admin untuk mengelola data pondok
            </p>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-center">
              Masuk sebagai Admin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Tipe Admin</label>
              <Select value={selectedRole} onValueChange={(value: 'admin' | 'super-admin') => setSelectedRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe admin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super-admin">Admin Utama</SelectItem>
                  <SelectItem value="admin">Admin Bagian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Section Selection - Only for Admin Bagian */}
            {selectedRole === 'admin' && (
              <div>
                <label className="block text-sm font-medium mb-2">Bagian</label>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih bagian Anda" />
                  </SelectTrigger>
                  <SelectContent>
                    {adminSections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <SelectItem key={section.id} value={section.id}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {section.name}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="admin@pondok.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading || !email || !password || (!selectedSection && selectedRole === 'admin')}
              className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Memproses...
                </div>
              ) : (
                'Masuk'
              )}
            </Button>

            <div className="text-center">
              <Button variant="link" className="text-red-600 text-sm">
                Lupa Password?
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-4 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800 mb-1">Demo Login</p>
                <p className="text-xs text-red-700 mb-2">Gunakan kredensial berikut untuk demo:</p>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-white rounded border border-red-200">
                    <p className="font-medium text-red-800 mb-1">Admin Utama:</p>
                    <p className="text-red-600"><strong>Email:</strong> admin@almunawwarah.com</p>
                    <p className="text-red-600"><strong>Password:</strong> admin123</p>
                  </div>
                  <div className="p-2 bg-white rounded border border-red-200">
                    <p className="font-medium text-red-800 mb-1">Admin Absensi:</p>
                    <p className="text-red-600"><strong>Email:</strong> absensi@almunawwarah.com</p>
                    <p className="text-red-600"><strong>Password:</strong> admin123</p>
                  </div>
                  <div className="p-2 bg-white rounded border border-red-200">
                    <p className="font-medium text-red-800 mb-1">Admin Keuangan:</p>
                    <p className="text-red-600"><strong>Email:</strong> keuangan@almunawwarah.com</p>
                    <p className="text-red-600"><strong>Password:</strong> admin123</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-2 mt-6 text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span className="text-xs">Data Anda dilindungi dengan enkripsi end-to-end</span>
        </div>
      </div>
    </div>
  );
}