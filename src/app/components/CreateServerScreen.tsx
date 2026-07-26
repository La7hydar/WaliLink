import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Building2, Shield } from 'lucide-react';

interface CreateServerScreenProps {
  onBack: () => void;
  onServerCreated: (serverData: any) => void;
}

export function CreateServerScreen({ onBack, onServerCreated }: CreateServerScreenProps) {
  const [step, setStep] = useState(1);
  const [serverData, setServerData] = useState({
    pondokName: '',
    location: '',
    description: '',
    mainAdmin: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    }
  });

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    }
  };

  const handleCreateServer = () => {
    // Validasi data
    if (!serverData.mainAdmin.name || !serverData.mainAdmin.email || 
        !serverData.mainAdmin.password || serverData.mainAdmin.password !== serverData.mainAdmin.confirmPassword) {
      alert('Lengkapi data admin utama dengan benar');
      return;
    }

    // Simulasi pembuatan server
    const newServer = {
      serverId: `custom-${Date.now()}`,
      serverName: serverData.pondokName,
      location: serverData.location,
      description: serverData.description,
      admins: [
        {
          ...serverData.mainAdmin,
          role: 'Super Admin',
          sections: ['all']
        }
      ],
      isMainServer: false,
      createdAt: new Date().toISOString()
    };

    onServerCreated(newServer);
  };

  const isStep1Valid = serverData.pondokName && serverData.location;
  const isStep2Valid = serverData.mainAdmin.name && serverData.mainAdmin.email && 
                      serverData.mainAdmin.password && 
                      serverData.mainAdmin.password === serverData.mainAdmin.confirmPassword;

  return (
    <div className="size-full bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 safe-area-top safe-area-bottom">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Buat Server Baru
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Langkah {step} dari 2
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Informasi Pondok
              </CardTitle>
              <CardDescription>
                Masukkan informasi dasar pondok pesantren
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pondok-name">Nama Pondok Pesantren*</Label>
                <Input
                  id="pondok-name"
                  placeholder="Contoh: Pondok Pesantren Darussalam"
                  value={serverData.pondokName}
                  onChange={(e) => setServerData(prev => ({ ...prev, pondokName: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Lokasi*</Label>
                <Input
                  id="location"
                  placeholder="Contoh: Jakarta Selatan, DKI Jakarta"
                  value={serverData.location}
                  onChange={(e) => setServerData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi (Opsional)</Label>
                <Textarea
                  id="description"
                  placeholder="Deskripsi singkat tentang pondok pesantren..."
                  value={serverData.description}
                  onChange={(e) => setServerData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Akun Admin Utama
              </CardTitle>
              <CardDescription>
                Buat akun admin utama untuk mengelola server
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Nama Lengkap*</Label>
                <Input
                  id="admin-name"
                  placeholder="Nama admin utama"
                  value={serverData.mainAdmin.name}
                  onChange={(e) => setServerData(prev => ({
                    ...prev,
                    mainAdmin: { ...prev.mainAdmin, name: e.target.value }
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email*</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@pondok.com"
                  value={serverData.mainAdmin.email}
                  onChange={(e) => setServerData(prev => ({
                    ...prev,
                    mainAdmin: { ...prev.mainAdmin, email: e.target.value }
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-phone">No. HP (Opsional)</Label>
                <Input
                  id="admin-phone"
                  placeholder="0812-3456-7890"
                  value={serverData.mainAdmin.phone}
                  onChange={(e) => setServerData(prev => ({
                    ...prev,
                    mainAdmin: { ...prev.mainAdmin, phone: e.target.value }
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password*</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Minimal 8 karakter"
                  value={serverData.mainAdmin.password}
                  onChange={(e) => setServerData(prev => ({
                    ...prev,
                    mainAdmin: { ...prev.mainAdmin, password: e.target.value }
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-confirm">Konfirmasi Password*</Label>
                <Input
                  id="admin-confirm"
                  type="password"
                  placeholder="Ulangi password"
                  value={serverData.mainAdmin.confirmPassword}
                  onChange={(e) => setServerData(prev => ({
                    ...prev,
                    mainAdmin: { ...prev.mainAdmin, confirmPassword: e.target.value }
                  }))}
                />
              </div>
              
              {serverData.mainAdmin.password && serverData.mainAdmin.confirmPassword && 
               serverData.mainAdmin.password !== serverData.mainAdmin.confirmPassword && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  Password tidak cocok
                </p>
              )}

              <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p>💡 Tips: Admin bagian dapat ditambahkan nanti melalui panel admin utama setelah server dibuat</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex space-x-3">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Kembali
            </Button>
          )}
          
          {step < 2 ? (
            <Button 
              onClick={handleNext}
              disabled={step === 1 && !isStep1Valid}
              className="flex-1"
            >
              Lanjutkan
            </Button>
          ) : (
            <Button 
              onClick={handleCreateServer}
              disabled={!isStep2Valid}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Buat Server
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}