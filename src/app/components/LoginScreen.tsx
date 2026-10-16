import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Phone, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  BookOpen,
  Shield,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface LoginScreenProps {
  onLogin: (credentials: { phone?: string; email?: string; password: string }) => void;
  onBack: () => void;
  isSignUp?: boolean;
  title?: string;
  isAdmin?: boolean;
}

export function LoginScreen({ onLogin, onBack, isSignUp = false, title, isAdmin = false }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if ((!phoneNumber && loginMethod === 'phone') || (!email && loginMethod === 'email') || !password) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onLogin({
        phone: loginMethod === 'phone' ? phoneNumber : undefined,
        email: loginMethod === 'email' ? email : undefined,
        password
      });
      setIsLoading(false);
    }, 1500);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as Indonesian phone number
    if (digits.length <= 4) return digits;
    if (digits.length <= 8) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header absorbs safe-area-inset-top */}
      <div
        className="bg-emerald-600 text-white px-4 pb-4 shrink-0"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 1rem)' }}
      >
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-emerald-700 rounded-full p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">Wali Santri</span>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-2">
              {title || (isSignUp ? 'Buat Akun Baru' : 'Masuk ke Akun Anda')}
            </h1>
            <p className="text-emerald-100 text-sm">
              {isAdmin 
                ? 'Akses panel admin untuk mengelola data pondok'
                : (isSignUp ? 'Daftar untuk memulai memantau santri' : 'Pantau perkembangan santri dengan mudah')
              }
            </p>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 px-4 py-6">
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-center">
              {isSignUp ? 'Daftar' : 'Masuk'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as 'phone' | 'email')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Nomor HP
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </TabsTrigger>
              </TabsList>

              <TabsContent value="phone" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nomor HP</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="0812-3456-7890"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      className="pl-10"
                      maxLength={14}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="email" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </TabsContent>

              <div className="space-y-4">
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
                  disabled={isLoading || (!phoneNumber && loginMethod === 'phone') || (!email && loginMethod === 'email') || !password}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Memproses...
                    </div>
                  ) : (
                    isSignUp ? 'Daftar' : 'Masuk'
                  )}
                </Button>

                {!isSignUp && (
                  <div className="text-center">
                    <Button variant="link" className="text-emerald-600 text-sm">
                      Lupa Password?
                    </Button>
                  </div>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Demo Credentials - only show for login */}
        {!isSignUp && (
          <Card className="mt-4 border-emerald-200 bg-emerald-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-emerald-800 mb-1">Demo Login</p>
                  <p className="text-xs text-emerald-700 mb-2">Gunakan kredensial berikut untuk demo:</p>
                  <div className="space-y-1 text-xs text-emerald-600">
                    {isAdmin ? (
                      <>
                        <p><strong>Email:</strong> admin@almunawwarah.com</p>
                        <p><strong>HP:</strong> 0812-1111-2222</p>
                        <p><strong>Password:</strong> admin123</p>
                      </>
                    ) : (
                      <>
                        <p><strong>HP:</strong> 0812-3456-7890</p>
                        <p><strong>Email:</strong> demo@walisant.com</p>
                        <p><strong>Password:</strong> demo123</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-2 mt-6 text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span className="text-xs">Data Anda dilindungi dengan enkripsi end-to-end</span>
        </div>
      </div>
    </div>
  );
}