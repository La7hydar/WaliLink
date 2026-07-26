import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { 
  ArrowLeft,
  CreditCard,
  Fingerprint,
  Plus,
  Check,
  X,
  Scan,
  Shield,
  Settings,
  User,
  Camera,
  Trash2,
  Edit,
  AlertCircle
} from 'lucide-react';

interface StudentSettingsSectionProps {
  studentData: {
    name: string;
    class: string;
    room: string;
    profilePhoto: string;
  };
  onBack?: () => void;
}

export function StudentSettingsSection({ studentData, onBack }: StudentSettingsSectionProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isAddingFingerprint, setIsAddingFingerprint] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [fingerprintScanProgress, setFingerprintScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  // Mock registered cards
  const [registeredCards, setRegisteredCards] = useState([
    { id: '1', cardNumber: '1234 5678 9012', registeredDate: '10 Jan 2025', status: 'active' },
    { id: '2', cardNumber: '9876 5432 1098', registeredDate: '05 Jan 2025', status: 'inactive' }
  ]);

  // Mock registered fingerprints
  const [registeredFingerprints, setRegisteredFingerprints] = useState([
    { id: '1', fingerType: 'Jari Telunjuk Kanan', registeredDate: '12 Jan 2025', quality: 95 },
    { id: '2', fingerType: 'Ibu Jari Kanan', registeredDate: '12 Jan 2025', quality: 92 }
  ]);

  const handleAddCard = () => {
    if (newCardNumber.trim()) {
      const newCard = {
        id: Date.now().toString(),
        cardNumber: newCardNumber,
        registeredDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'active'
      };
      setRegisteredCards([...registeredCards, newCard]);
      setNewCardNumber('');
      setIsAddingCard(false);
    }
  };

  const handleScanFingerprint = () => {
    setIsScanning(true);
    setFingerprintScanProgress(0);

    const interval = setInterval(() => {
      setFingerprintScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Simulate successful registration
          const newFingerprint = {
            id: Date.now().toString(),
            fingerType: 'Jari Tengah Kanan',
            registeredDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            quality: 95
          };
          setRegisteredFingerprints([...registeredFingerprints, newFingerprint]);
          setIsScanning(false);
          setIsAddingFingerprint(false);
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kartu ini?')) {
      setRegisteredCards(registeredCards.filter(card => card.id !== cardId));
    }
  };

  const handleDeleteFingerprint = (fingerprintId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus sidik jari ini?')) {
      setRegisteredFingerprints(registeredFingerprints.filter(fp => fp.id !== fingerprintId));
    }
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b p-4 safe-area-top">
        {onBack && (
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Pengaturan Akun Santri
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {studentData.name}
              </p>
            </div>
          </div>
        )}

        {/* Student Info Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  {studentData.name}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {studentData.class} • {studentData.room}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <ScrollArea className="h-full">
        <div className="p-4 pb-20 space-y-4">
          {/* Identification Methods Header */}
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Metode Identifikasi</h2>
          </div>
          <p className="text-sm text-muted-foreground -mt-2">
            Daftarkan kartu RFID dan sidik jari untuk akses otomatis ke sistem pondok
          </p>

          {/* RFID Card Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Kartu RFID</CardTitle>
                    <CardDescription className="text-xs">
                      Untuk absensi dan akses fasilitas
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={registeredCards.length > 0 ? 'default' : 'secondary'}>
                  {registeredCards.length} Terdaftar
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Registered Cards List */}
              {registeredCards.map((card) => (
                <div 
                  key={card.id}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-mono font-medium">
                        {card.cardNumber}
                      </span>
                    </div>
                    <Badge variant={card.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {card.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Terdaftar: {card.registeredDate}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCard(card.id)}
                      className="h-7 px-2"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add New Card Form */}
              {isAddingCard ? (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Scan className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium text-sm text-blue-900 dark:text-blue-100">
                      Tambah Kartu Baru
                    </h4>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Nomor Kartu RFID</Label>
                    <Input
                      id="cardNumber"
                      placeholder="Tempelkan kartu ke reader..."
                      value={newCardNumber}
                      onChange={(e) => setNewCardNumber(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleAddCard} 
                      className="flex-1"
                      disabled={!newCardNumber.trim()}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Simpan
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsAddingCard(false);
                        setNewCardNumber('');
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded text-xs text-blue-800 dark:text-blue-200">
                    <p className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        Tempelkan kartu RFID ke reader yang tersedia di kantor pondok. 
                        Nomor kartu akan terdeteksi otomatis.
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsAddingCard(true)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Kartu Baru
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Fingerprint Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <Fingerprint className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Sidik Jari</CardTitle>
                    <CardDescription className="text-xs">
                      Untuk keamanan dan akses cepat
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={registeredFingerprints.length > 0 ? 'default' : 'secondary'}>
                  {registeredFingerprints.length} Terdaftar
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Registered Fingerprints List */}
              {registeredFingerprints.map((fp) => (
                <div 
                  key={fp.id}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">
                        {fp.fingerType}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Kualitas: {fp.quality}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Terdaftar: {fp.registeredDate}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFingerprint(fp.id)}
                      className="h-7 px-2"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add New Fingerprint Form */}
              {isAddingFingerprint ? (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Scan className="w-5 h-5 text-purple-600" />
                    <h4 className="font-medium text-sm text-purple-900 dark:text-purple-100">
                      Daftarkan Sidik Jari
                    </h4>
                  </div>
                  
                  {isScanning ? (
                    <div className="text-center py-4">
                      <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900 rounded-full mx-auto mb-3 flex items-center justify-center relative overflow-hidden">
                        <Fingerprint className="w-12 h-12 text-purple-600 dark:text-purple-300 z-10" />
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-purple-500 transition-all duration-200"
                          style={{ height: `${fingerprintScanProgress}%` }}
                        />
                      </div>
                      <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">
                        Memindai Sidik Jari...
                      </p>
                      <p className="text-xs text-purple-700 dark:text-purple-300">
                        {fingerprintScanProgress}% - Tetap tempelkan jari di scanner
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="text-center py-4">
                        <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <Fingerprint className="w-12 h-12 text-purple-600 dark:text-purple-300" />
                        </div>
                        <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">
                          Siap Memindai
                        </p>
                        <p className="text-xs text-purple-700 dark:text-purple-300">
                          Tempelkan jari ke scanner sidik jari
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleScanFingerprint} 
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                        >
                          <Scan className="w-4 h-4 mr-2" />
                          Mulai Pindai
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsAddingFingerprint(false)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                  
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded text-xs text-purple-800 dark:text-purple-200">
                    <p className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        Pastikan jari bersih dan kering. Tempelkan dengan lembut ke scanner 
                        hingga proses selesai. Disarankan mendaftarkan minimal 2 jari.
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsAddingFingerprint(true)}
                  className="w-full"
                  disabled={registeredFingerprints.length >= 5}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Daftarkan Sidik Jari
                </Button>
              )}

              {registeredFingerprints.length >= 5 && (
                <p className="text-xs text-center text-muted-foreground">
                  Maksimal 5 sidik jari dapat didaftarkan
                </p>
              )}
            </CardContent>
          </Card>

          {/* Benefits Info */}
          <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-green-900 dark:text-green-100">
                Keuntungan Metode Identifikasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-green-800 dark:text-green-200">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 text-green-600" />
                <span>Absensi otomatis lebih cepat dan akurat</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 text-green-600" />
                <span>Akses masuk/keluar pondok lebih aman</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 text-green-600" />
                <span>Transaksi kantin tanpa uang tunai</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 text-green-600" />
                <span>Peminjaman buku perpustakaan otomatis</span>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button className="w-full" size="lg">
            <Check className="w-4 h-4 mr-2" />
            Simpan Perubahan
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}