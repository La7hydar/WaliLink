import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, User, Users, Phone, Calendar, MessageCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { useLanguage } from '../hooks/useLanguage';

interface ChildData {
  id: string;
  name: string;
  class: string;
  room: string;
  region: string;
}

interface GuardianAccountCreationProps {
  onBack: () => void;
  onAccountCreated: (guardianData: any) => void;
}

export function GuardianAccountCreation({ onBack, onAccountCreated }: GuardianAccountCreationProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [guardianData, setGuardianData] = useState({
    name: '',
    phone: '',
    pin: '',
    confirmPin: '',
    birthDate: '',
    children: [] as ChildData[]
  });

  const [currentChild, setCurrentChild] = useState({
    name: '',
    class: '',
    room: '',
    region: ''
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [nameSearch, setNameSearch] = useState('');
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);

  // Mock data untuk suggestion - nama santri yang ada di database
  const existingStudentNames = [
    'Ahmad Fauzi Rahman', 'Muhammad Rizki Pratama', 'Abdul Aziz Hakim', 'Faisal Ahmad Sidiq',
    'Zain Malik Ibrahim', 'Hasan Ali Ridwan', 'Omar Faruq Usman', 'Yusuf Hakim Ramadhan',
    'Khalil Rahman Sari', 'Daud Malik Harun', 'Isa Mahmud Yaqub', 'Musa Ibrahim Yusuf'
  ];
  const classSuggestions = ['1 Ula', '2 Ula', '3 Ula', '1 Wusta', '2 Wusta', '3 Wusta', '1 Ulya', '2 Ulya', '3 Ulya'];
  const roomSuggestions = ['Kamar 1A', 'Kamar 1B', 'Kamar 2A', 'Kamar 2B', 'Kamar 3A', 'Kamar 3B'];
  const regionSuggestions = ['Jakarta', 'Bogor', 'Depok', 'Tangerang', 'Bekasi', 'Bandung', 'Surabaya'];

  const filteredNames = existingStudentNames.filter(name => 
    name.toLowerCase().includes(nameSearch.toLowerCase())
  );

  const handleNameChange = (value: string) => {
    setNameSearch(value);
    setCurrentChild(prev => ({ ...prev, name: value }));
    setShowNameSuggestions(value.length > 0);
  };

  const handleNameSelect = (name: string) => {
    setCurrentChild(prev => ({ ...prev, name }));
    setNameSearch(name);
    setShowNameSuggestions(false);
  };

  const addChild = () => {
    if (currentChild.name && currentChild.class && currentChild.room && currentChild.region) {
      // Check if name exists in database
      const nameExists = existingStudentNames.includes(currentChild.name);
      if (!nameExists) {
        alert('Nama anak tidak ditemukan dalam database santri. Silakan hubungi admin data.');
        return;
      }
      
      const newChild: ChildData = {
        id: Date.now().toString(),
        ...currentChild
      };
      setGuardianData(prev => ({
        ...prev,
        children: [...prev.children, newChild]
      }));
      setCurrentChild({ name: '', class: '', room: '', region: '' });
      setNameSearch('');
    }
  };

  const removeChild = (id: string) => {
    setGuardianData(prev => ({
      ...prev,
      children: prev.children.filter(child => child.id !== id)
    }));
  };

  const handleSendVerification = () => {
    setIsVerifying(true);
    // Simulasi pengiriman kode verifikasi
    setTimeout(() => {
      setIsVerifying(false);
      setStep(3);
      alert(`Kode verifikasi telah dikirim ke ${guardianData.phone}`);
    }, 2000);
  };

  const handleVerifyAndCreate = () => {
    // Validasi kode verifikasi (simulasi)
    if (verificationCode === '123456') {
      const newGuardianAccount = {
        id: Date.now().toString(),
        ...guardianData,
        createdAt: new Date().toISOString(),
        isVerified: true
      };
      onAccountCreated(newGuardianAccount);
    } else {
      alert('Kode verifikasi salah. Gunakan 123456 untuk demo.');
    }
  };

  const isStep1Valid = guardianData.children.length > 0; // Step 1 is now children data
  const isStep2Valid = guardianData.name && guardianData.phone && guardianData.pin && 
                      guardianData.pin === guardianData.confirmPin && guardianData.birthDate;

  return (
    <div className="size-full bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 safe-area-top safe-area-bottom">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6 pb-20">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('guardian.create_title')}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Langkah {step} dari 3
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {/* Step 1: Children Data (moved to first) */}
          {step === 1 && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    {t('guardian.child_data')}
                  </CardTitle>
                  <CardDescription>
                    {t('guardian.child_data_desc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 relative">
                    <Label htmlFor="child-name">{t('guardian.child_name')}*</Label>
                    <Input
                      id="child-name"
                      placeholder="Ketik nama anak..."
                      value={nameSearch}
                      onChange={(e) => handleNameChange(e.target.value)}
                      onFocus={() => setShowNameSuggestions(nameSearch.length > 0)}
                    />
                    
                    {/* Name Suggestions Dropdown */}
                    {showNameSuggestions && filteredNames.length > 0 && (
                      <Card className="absolute z-10 w-full mt-1 max-h-40 overflow-y-auto">
                        <CardContent className="p-2">
                          {filteredNames.slice(0, 5).map((name, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              className="w-full justify-start text-sm h-auto p-2"
                              onClick={() => handleNameSelect(name)}
                            >
                              {name}
                            </Button>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                    
                    {/* Contact Admin if name not found */}
                    {nameSearch.length > 2 && filteredNames.length === 0 && (
                      <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                          {t('guardian.name_not_found')}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          {t('guardian.contact_admin')}
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="child-class">{t('guardian.child_class')}*</Label>
                    <Select
                      value={currentChild.class}
                      onValueChange={(value) => setCurrentChild(prev => ({ ...prev, class: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        {classSuggestions.map((cls) => (
                          <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="child-room">{t('guardian.child_room')}*</Label>
                    <Select
                      value={currentChild.room}
                      onValueChange={(value) => setCurrentChild(prev => ({ ...prev, room: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kamar" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomSuggestions.map((room) => (
                          <SelectItem key={room} value={room}>{room}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="child-region">{t('guardian.child_region')}*</Label>
                    <Select
                      value={currentChild.region}
                      onValueChange={(value) => setCurrentChild(prev => ({ ...prev, region: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih daerah asal" />
                      </SelectTrigger>
                      <SelectContent>
                        {regionSuggestions.map((region) => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={addChild}
                    disabled={!currentChild.name || !currentChild.class || !currentChild.room || !currentChild.region}
                    className="w-full"
                  >
                    {t('guardian.add_child')}
                  </Button>
                </CardContent>
              </Card>

              {/* Children List */}
              {guardianData.children.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Daftar Anak</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {guardianData.children.map((child) => (
                      <div key={child.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{child.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {child.class} • {child.room} • {child.region}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeChild(child.id)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {guardianData.children.length === 0 && (
                <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Belum ada anak yang ditambahkan</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Guardian Data (moved to second) */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  {t('guardian.guardian_data')}
                </CardTitle>
                <CardDescription>
                  {t('guardian.guardian_data_desc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guardian-name">{t('guardian.full_name')}*</Label>
                  <Input
                    id="guardian-name"
                    placeholder="Nama lengkap sesuai KTP"
                    value={guardianData.name}
                    onChange={(e) => setGuardianData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="guardian-phone">{t('guardian.phone')}*</Label>
                  <Input
                    id="guardian-phone"
                    placeholder="0812-3456-7890"
                    value={guardianData.phone}
                    onChange={(e) => setGuardianData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Nomor HP akan digunakan untuk verifikasi dan notifikasi
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="guardian-pin">{t('guardian.pin')}*</Label>
                  <Input
                    id="guardian-pin"
                    type="password"
                    placeholder="••••••"
                    maxLength={6}
                    value={guardianData.pin}
                    onChange={(e) => setGuardianData(prev => ({ ...prev, pin: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-pin">{t('guardian.confirm_pin')}*</Label>
                  <Input
                    id="confirm-pin"
                    type="password"
                    placeholder="••••••"
                    maxLength={6}
                    value={guardianData.confirmPin}
                    onChange={(e) => setGuardianData(prev => ({ ...prev, confirmPin: e.target.value }))}
                  />
                  {guardianData.pin && guardianData.confirmPin && 
                   guardianData.pin !== guardianData.confirmPin && (
                    <p className="text-sm text-red-600 dark:text-red-400">PIN tidak cocok</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="birth-date">{t('guardian.birth_date')}*</Label>
                  <Input
                    id="birth-date"
                    type="date"
                    value={guardianData.birthDate}
                    onChange={(e) => setGuardianData(prev => ({ ...prev, birthDate: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Untuk verifikasi identitas
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Verification */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Verifikasi Nomor HP
                </CardTitle>
                <CardDescription>
                  Masukkan kode verifikasi yang dikirim ke {guardianData.phone}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verification-code">Kode Verifikasi</Label>
                  <Input
                    id="verification-code"
                    placeholder="123456"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p>📱 Untuk demo, gunakan kode: <strong>123456</strong></p>
                </div>
                
                <Button variant="outline" className="w-full">
                  Kirim Ulang Kode
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex space-x-3">
            {step > 1 && step < 3 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                {t('common.back')}
              </Button>
            )}
            
            {step === 1 && (
              <Button 
                onClick={() => setStep(2)}
                disabled={!isStep1Valid}
                className="flex-1"
              >
                {t('common.next')}
              </Button>
            )}
            
            {step === 2 && (
              <Button 
                onClick={handleSendVerification}
                disabled={!isStep2Valid || isVerifying}
                className="flex-1"
              >
                {isVerifying ? 'Mengirim...' : 'Kirim Kode Verifikasi'}
              </Button>
            )}
            
            {step === 3 && (
              <Button 
                onClick={handleVerifyAndCreate}
                disabled={verificationCode.length !== 6}
                className="flex-1"
              >
                Verifikasi & Buat Akun
              </Button>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}