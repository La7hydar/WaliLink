import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { ArrowLeft, Languages, Check } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface LanguageSelectionProps {
  onBack: () => void;
}

export function LanguageSelection({ onBack }: LanguageSelectionProps) {
  const { changeLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState('id');

  const languages = [
    {
      code: 'id',
      name: 'Bahasa Indonesia',
      nativeName: 'Bahasa Indonesia',
      flag: '🇮🇩',
      description: 'Bahasa utama untuk pengguna Indonesia'
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      description: 'International language for global users'
    },
    {
      code: 'ar',
      name: 'العربية',
      nativeName: 'العربية',
      flag: '🇸🇦',
      description: 'اللغة العربية للمستخدمين الناطقين بالعربية',
      rtl: true
    }
  ];

  const handleLanguageSelect = (languageCode: 'id' | 'en' | 'ar') => {
    setSelectedLanguage(languageCode);
  };

  const handleApplyAndBack = () => {
    changeLanguage(selectedLanguage);
    onBack();
  };

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
                Pengaturan Bahasa
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Pilih bahasa aplikasi yang Anda inginkan
              </p>
            </div>
          </div>

          {/* Current Language Info */}
          <Card className="border-l-4 border-l-primary bg-primary/5 dark:bg-primary/10">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Languages className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Bahasa Dipilih: {languages.find(l => l.code === selectedLanguage)?.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Perubahan akan diterapkan di seluruh aplikasi
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language Options */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pilih Bahasa
            </h2>
            
            {languages.map((lang) => (
              <Card 
                key={lang.code}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
                  selectedLanguage === lang.code 
                    ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                    : 'border-transparent hover:border-primary/20'
                }`}
                onClick={() => handleLanguageSelect(lang.code as 'id' | 'en' | 'ar')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">
                        {lang.flag}
                      </div>
                      <div className={lang.rtl ? 'text-right' : ''}>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {lang.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {lang.nativeName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {lang.description}
                        </p>
                      </div>
                    </div>
                    
                    {selectedLanguage === lang.code && (
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Preview Bahasa</CardTitle>
              <CardDescription>
                Contoh tampilan dengan bahasa yang dipilih
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="space-y-2">
                  {selectedLanguage === 'id' && (
                    <>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Dashboard • Pembayaran • Kedisiplinan
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Lihat Semua • Kembali • Simpan
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Saldo E-Money: Rp 150.000
                      </p>
                    </>
                  )}
                  {selectedLanguage === 'en' && (
                    <>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Dashboard • Payments • Discipline
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        View All • Back • Save
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        E-Money Balance: Rp 150.000
                      </p>
                    </>
                  )}
                  {selectedLanguage === 'ar' && (
                    <div dir="rtl">
                      <p className="font-medium text-gray-900 dark:text-white">
                        لوحة التحكم • المدفوعات • الانضباط
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        عرض الكل • رجوع • حفظ
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        رصيد النقود الإلكترونية: 150.000 روبية
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Apply Button */}
          <div className="flex space-x-3">
            <Button 
              onClick={handleApplyAndBack}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              Terapkan & Kembali
            </Button>
          </div>

          {/* Developer Note */}
          <Card className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <Languages className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Catatan Developer
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                    Sistem localization telah diimplementasikan dengan lengkap untuk mendukung multi-bahasa.
                  </p>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Bahasa Indonesia: Bahasa utama sistem</li>
                    <li>• English: Untuk pengguna internasional</li>
                    <li>• العربية: Dengan dukungan RTL (Right-to-Left)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}