import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, LogIn, UserPlus, Shield, Users, User } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { useLanguage } from '../hooks/useLanguage';

interface LoginOptionsScreenProps {
  serverName: string;
  onBack: () => void;
  onLogin: () => void;
  onCreateGuardianAccount: () => void;
  onAdminLogin: () => void;
  onAdminSectionLogin?: () => void;
}

export function LoginOptionsScreen({ 
  serverName, 
  onBack, 
  onLogin, 
  onCreateGuardianAccount, 
  onAdminLogin,
  onAdminSectionLogin
}: LoginOptionsScreenProps) {
  const { t } = useLanguage();
  
  return (
    <div className="size-full bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 safe-area-top safe-area-bottom">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('login.title')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {serverName}
            </p>
          </div>
        </div>

        {/* Server Info Card */}
        <Card className="border-l-4 border-l-primary bg-primary/5 dark:bg-primary/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Terhubung ke Server
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {serverName}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Login Options */}
        <div className="space-y-4">
          
          {/* Existing Guardian Login */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <LogIn className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">{t('login.guardian_login')}</CardTitle>
                  <CardDescription>
                    {t('login.guardian_login_desc')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                onClick={onLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t('login.guardian_login_button')}
              </Button>
            </CardContent>
          </Card>

          {/* Create Guardian Account */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-green-200 dark:hover:border-green-800">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">{t('login.create_account')}</CardTitle>
                  <CardDescription>
                    {t('login.create_account_desc')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p>📝 Persiapkan data:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Data diri wali</li>
                    <li>Data anak (nama, kelas, kamar)</li>
                    <li>Nomor HP untuk verifikasi</li>
                  </ul>
                </div>
                <Button 
                  onClick={onCreateGuardianAccount}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {t('login.create_account_button')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Admin Login */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-amber-200 dark:hover:border-amber-800">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">{t('login.admin_login')}</CardTitle>
                  <CardDescription>
                    {t('login.admin_login_desc')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <p>🔐 Akses khusus untuk:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Admin utama (Super Admin)</li>
                    <li>Admin bagian pondok</li>
                    <li>Pengelola data santri</li>
                  </ul>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Button 
                    onClick={onAdminLogin}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Login Admin Utama
                  </Button>
                  {onAdminSectionLogin && (
                    <Button 
                      onClick={onAdminSectionLogin}
                      variant="outline"
                      className="w-full border-amber-600 text-amber-600 hover:bg-amber-50"
                    >
                      Login Admin Bagian
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

          {/* Footer Info */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Butuh bantuan? Hubungi admin pondok pesantren
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}