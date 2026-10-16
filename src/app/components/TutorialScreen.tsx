import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { ArrowLeft, BookOpen, Database, Settings, Users, FileText, Globe } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface TutorialScreenProps {
  onBack: () => void;
}

export function TutorialScreen({ onBack }: TutorialScreenProps) {
  const { t } = useLanguage();

  const tutorialSteps = [
    {
      icon: <Settings className="w-6 h-6" />,
      title: 'Langkah 1: Persiapan Server',
      description: 'Siapkan hosting dan domain untuk server pondok pesantren Anda',
      details: [
        '⚠️ Gunakan LAPTOP/PC untuk setup server dan database (Lebih mudah dan efisien)',
        'Pilih penyedia hosting yang reliable (VPS atau Cloud)',
        'Siapkan domain (contoh: server-pondok-almunawwarah.com)',
        'Install Node.js dan database (MySQL/PostgreSQL)',
        'Setup SSL certificate untuk keamanan'
      ]
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: 'Langkah 2: Setup Database',
      description: 'Buat dan konfigurasi database untuk menyimpan data santri',
      details: [
        '⚠️ Disarankan menggunakan LAPTOP/PC untuk manajemen database',
        'Buat database baru dengan nama yang sesuai',
        'Import struktur tabel yang telah disediakan',
        'Konfigurasi user database dengan hak akses yang tepat',
        'Setup backup otomatis untuk keamanan data'
      ]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Langkah 3: Input Data Santri',
      description: 'Masukkan data santri, kelas, dan kamar sesuai format yang ditentukan',
      details: [
        'Import data santri dari Excel/CSV',
        'Pastikan format nama sesuai dengan data resmi',
        'Kelompokkan santri berdasarkan kelas dan kamar',
        'Validasi data untuk menghindari duplikasi'
      ]
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Langkah 4: Konfigurasi Sistem',
      description: 'Atur pengaturan pembayaran, notifikasi, dan fitur lainnya',
      details: [
        'Setup virtual account untuk pembayaran SPP',
        'Konfigurasi gateway pembayaran',
        'Atur template notifikasi WhatsApp/SMS',
        'Setup jadwal backup dan maintenance'
      ]
    }
  ];

  const databaseExamples = {
    santri: [
      { field: 'id', type: 'INT', description: 'ID unik santri (auto increment)' },
      { field: 'nama', type: 'VARCHAR(100)', description: 'Nama lengkap santri' },
      { field: 'kelas', type: 'VARCHAR(20)', description: 'Kelas santri (1 Ula, 2 Ula, dst)' },
      { field: 'kamar', type: 'VARCHAR(50)', description: 'Nama kamar santri' },
      { field: 'daerah_asal', type: 'VARCHAR(100)', description: 'Daerah asal santri' },
      { field: 'tanggal_masuk', type: 'DATE', description: 'Tanggal masuk pondok' },
      { field: 'status', type: 'ENUM', description: 'aktif, alumni, keluar' }
    ],
    wali: [
      { field: 'id', type: 'INT', description: 'ID unik wali (auto increment)' },
      { field: 'nama', type: 'VARCHAR(100)', description: 'Nama lengkap wali' },
      { field: 'nomor_hp', type: 'VARCHAR(15)', description: 'Nomor HP wali' },
      { field: 'pin', type: 'VARCHAR(60)', description: 'PIN terenkripsi (hashed)' },
      { field: 'tanggal_lahir', type: 'DATE', description: 'Tanggal lahir wali' },
      { field: 'santri_id', type: 'INT', description: 'ID santri (foreign key)' }
    ],
    spp: [
      { field: 'id', type: 'INT', description: 'ID unik tagihan (auto increment)' },
      { field: 'santri_id', type: 'INT', description: 'ID santri (foreign key)' },
      { field: 'bulan', type: 'VARCHAR(20)', description: 'Bulan tagihan (Januari 2025)' },
      { field: 'jumlah', type: 'DECIMAL(10,2)', description: 'Jumlah tagihan SPP' },
      { field: 'status', type: 'ENUM', description: 'pending, paid, overdue' },
      { field: 'tanggal_jatuh_tempo', type: 'DATE', description: 'Tanggal jatuh tempo' }
    ]
  };

  const learningResources = [
    {
      title: 'Belajar Database Dasar',
      description: 'Tutorial lengkap tentang database MySQL untuk pemula',
      url: 'https://www.w3schools.com/mysql/',
      icon: <Database className="w-5 h-5" />
    },
    {
      title: 'Panduan Hosting Website',
      description: 'Cara memilih dan setup hosting untuk aplikasi web',
      url: 'https://www.hostinger.co.id/tutorial/cara-membeli-hosting',
      icon: <Globe className="w-5 h-5" />
    },
    {
      title: 'Keamanan Server Dasar',
      description: 'Best practices untuk menjaga keamanan server aplikasi',
      url: 'https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  return (
    <div className="size-full bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 safe-area-top safe-area-bottom overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-20 max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white truncate">
                Tutorial Setup Server
              </h1>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 truncate">
                Panduan lengkap membuat server pondok pesantren
              </p>
            </div>
          </div>

          {/* Introduction */}
          <Card className="border-l-4 border-l-primary bg-primary/5 dark:bg-primary/10">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center text-base md:text-lg">
                <BookOpen className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
                Pengantar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-4">
                Tutorial ini akan membantu Anda membuat server baru untuk sistem manajemen pondok pesantren. 
                Ikuti langkah-langkah berikut dengan seksama.
              </p>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-3 md:p-4 rounded-lg">
                <p className="text-xs md:text-sm text-amber-800 dark:text-amber-200">
                  ⚠️ <strong>Catatan Penting:</strong> Proses ini memerlukan pengetahuan dasar IT. 
                  Jika Anda tidak familiar dengan teknologi, disarankan untuk bekerjasama dengan teknisi IT.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tutorial Steps */}
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
              Langkah-langkah Setup
            </h2>
            
            {tutorialSteps.map((step, index) => (
              <Card key={index}>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="flex items-start md:items-center text-sm md:text-base">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center text-white mr-3 flex-shrink-0">
                      {step.icon}
                    </div>
                    <span className="flex-1 min-w-0">{step.title}</span>
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm mt-2">{step.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start">
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full mt-1.5 md:mt-2 mr-2 md:mr-3 flex-shrink-0"></span>
                        <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300 flex-1 break-words">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Database Structure Examples */}
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center text-base md:text-lg">
                <Database className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
                Contoh Struktur Database
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Format tabel dan data yang diperlukan oleh aplikasi
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0 space-y-4 md:space-y-6">
              {Object.entries(databaseExamples).map(([tableName, fields]) => (
                <div key={tableName}>
                  <h4 className="font-medium text-sm md:text-base text-gray-900 dark:text-white mb-3 capitalize">
                    Tabel {tableName}
                  </h4>
                  <div className="border rounded-lg overflow-x-auto">
                    <div className="min-w-[500px]">
                      <table className="w-full text-xs md:text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-2 md:px-3 py-2 text-left font-medium">Field</th>
                            <th className="px-2 md:px-3 py-2 text-left font-medium">Type</th>
                            <th className="px-2 md:px-3 py-2 text-left font-medium">Keterangan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {fields.map((field, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                              <td className="px-2 md:px-3 py-2 font-mono text-xs whitespace-nowrap">{field.field}</td>
                              <td className="px-2 md:px-3 py-2 font-mono text-xs text-blue-600 dark:text-blue-400 whitespace-nowrap">
                                {field.type}
                              </td>
                              <td className="px-2 md:px-3 py-2 text-gray-600 dark:text-gray-300">
                                {field.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Learning Resources */}
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center text-base md:text-lg">
                <Globe className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
                Sumber Belajar
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Tautan untuk mempelajari dasar-dasar database dan server
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0 space-y-2 md:space-y-3">
              {learningResources.map((resource, index) => (
                <div key={index} className="p-3 md:p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                      {resource.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm md:text-base text-gray-900 dark:text-white truncate">
                        {resource.title}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-2 break-words">
                        {resource.description}
                      </p>
                      <a 
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs md:text-sm text-primary hover:underline break-all"
                      >
                        Buka Tutorial →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Support Information */}
          <Card className="border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <Users className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm md:text-base text-green-900 dark:text-green-100 mb-2">
                    Butuh Bantuan Teknis?
                  </h4>
                  <p className="text-xs md:text-sm text-green-700 dark:text-green-300 mb-3 break-words">
                    Jika Anda mengalami kesulitan dalam setup server, tim support kami siap membantu.
                  </p>
                  <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
                    <p className="text-green-700 dark:text-green-300 break-words">
                      📧 Email: support@pondokapp.com
                    </p>
                    <p className="text-green-700 dark:text-green-300 break-words">
                      📱 WhatsApp: +62 812-3456-7890
                    </p>
                    <p className="text-green-700 dark:text-green-300 break-words">
                      🕒 Jam Kerja: Senin-Jumat 09:00-17:00 WIB
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}