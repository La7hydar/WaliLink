import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Home,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  Award,
  Star,
  CreditCard,
  Copy,
  Building2
} from 'lucide-react';

interface ProfileInfoSectionProps {
  isOpen: boolean;
  onClose: () => void;
  studentData: {
    name: string;
    class: string;
    room: string;
    guardian: string;
    profilePhoto: string;
  };
}

export function ProfileInfoSection({ isOpen, onClose, studentData }: ProfileInfoSectionProps) {
  // Extended student and guardian information
  const detailedInfo = {
    student: {
      fullName: 'Ahmad Rizki Maulana',
      nickname: 'Ahmad',
      nisn: '0078594321',
      birthPlace: 'Yogyakarta',
      birthDate: '15 Agustus 2010',
      age: 14,
      class: 'Kelas 3 Tsanawiyah',
      grade: 6, // Set to 6 to show study club example
      studyClub: 'Tahfidz Club Al-Hikmah', // Shown for grade 6 students
      dormitory: 'Asrama Al-Hikmah',
      roomNumber: 'Kamar 15B',
      entryYear: '2022',
      status: 'Aktif'
    },
    guardian: {
      title: 'Bapak',
      fullName: 'Dr. H. Hasan Abdurrahman, M.Pd.I',
      relationship: 'Ayah Kandung',
      phone: '0812-3456-7890',
      whatsapp: '0812-3456-7890',
      email: 'hasan.abdurrahman@gmail.com',
      occupation: 'Dosen & Konsultan Pendidikan Islam',
      company: 'UIN Sunan Kalijaga Yogyakarta'
    },
    address: {
      street: 'Jl. Kaliurang KM 14.5 No. 123',
      village: 'Sardonoharjo',
      district: 'Ngaglik',
      regency: 'Sleman',
      province: 'Daerah Istimewa Yogyakarta',
      postalCode: '55581',
      region: 'Yogyakarta Utara'
    },
    emergency: {
      contactName: 'Ibu Siti Khadijah',
      relationship: 'Ibu Kandung',
      phone: '0856-7890-1234'
    },
    virtual_account: {
      bank_name: 'Bank Syariah Indonesia',
      account_number: '7770012345678',
      account_name: 'Ahmad Rizki Maulana',
      swift_code: 'BSYAIDJA',
      purpose: 'Transfer untuk kebutuhan santri dan pembayaran'
    }
  };

  const { student, guardian, address, emergency, virtual_account } = detailedInfo;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${label} berhasil disalin ke clipboard`);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto max-h-[80vh] overflow-y-auto bg-card dark:bg-card border-border dark:border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Informasi Personal</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Student Profile */}
          <div className="text-center">
            <Avatar className="h-20 w-20 mx-auto mb-3 border-4 border-green-200 dark:border-green-700">
              <AvatarImage 
                src={studentData.profilePhoto}
                alt={student.fullName}
                className="object-cover"
              />
              <AvatarFallback className="bg-green-100 dark:bg-green-800">
                <User className="h-10 w-10 text-green-600 dark:text-green-300" />
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">{student.fullName}</h3>
            <p className="text-sm text-muted-foreground">NISN: {student.nisn}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200">
                {student.status}
              </Badge>
              <Badge variant="outline">{student.class}</Badge>
            </div>
          </div>

          {/* Student Information */}
          <Card className="border border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                Informasi Santri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="font-medium text-muted-foreground">Tempat Lahir</label>
                  <p className="font-medium">{student.birthPlace}</p>
                </div>
                <div>
                  <label className="font-medium text-muted-foreground">Tanggal Lahir</label>
                  <p className="font-medium">{student.birthDate}</p>
                </div>
                <div>
                  <label className="font-medium text-muted-foreground">Usia</label>
                  <p className="font-medium">{student.age} tahun</p>
                </div>
                <div>
                  <label className="font-medium text-muted-foreground">Tahun Masuk</label>
                  <p className="font-medium">{student.entryYear}</p>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <label className="font-medium text-muted-foreground">Asrama & Kamar</label>
                <p className="font-medium">{student.dormitory} - {student.roomNumber}</p>
              </div>

              {student.studyClub && (
                <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <div>
                    <label className="font-medium text-xs text-muted-foreground">Study Club</label>
                    <p className="font-medium text-sm">{student.studyClub}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Guardian Information */}
          <Card className="border border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                Informasi Wali
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="font-medium text-muted-foreground">Nama Lengkap</label>
                <p className="font-semibold">{guardian.fullName}</p>
                <p className="text-sm text-muted-foreground">{guardian.relationship}</p>
              </div>
              
              <div>
                <label className="font-medium text-muted-foreground">Pekerjaan</label>
                <p className="font-medium">{guardian.occupation}</p>
                <p className="text-sm text-muted-foreground">{guardian.company}</p>
              </div>

              <div className="grid grid-cols-1 gap-2 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">{guardian.phone}</p>
                    <p className="text-xs text-muted-foreground">WhatsApp: {guardian.whatsapp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-purple-600" />
                  <p className="font-medium text-sm">{guardian.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card className="border border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Home className="h-4 w-4 text-orange-600" />
                Alamat Rumah
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="font-medium text-muted-foreground">Alamat Lengkap</label>
                <p className="font-medium leading-relaxed">
                  {address.street}<br />
                  Desa {address.village}, Kec. {address.district}<br />
                  Kab. {address.regency}, {address.province}<br />
                  {address.postalCode}
                </p>
              </div>
              
              <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                <MapPin className="h-4 w-4 text-orange-600" />
                <div>
                  <label className="font-medium text-xs text-muted-foreground">Wilayah</label>
                  <p className="font-medium text-sm">{address.region}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Virtual Account Information */}
          <Card className="border border-blue-100 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Virtual Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="font-medium text-muted-foreground">Bank</label>
                <p className="font-semibold text-blue-700 dark:text-blue-300">{virtual_account.bank_name}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg border">
                  <div>
                    <label className="font-medium text-xs text-muted-foreground">Nomor Rekening</label>
                    <p className="font-mono font-semibold text-sm">{virtual_account.account_number}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(virtual_account.account_number, 'Nomor rekening')}
                    className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg border">
                  <div>
                    <label className="font-medium text-xs text-muted-foreground">Atas Nama</label>
                    <p className="font-semibold text-sm">{virtual_account.account_name}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(virtual_account.account_name, 'Nama rekening')}
                    className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg">
                <p className="font-medium text-yellow-700 dark:text-yellow-300 mb-1">Catatan Transfer:</p>
                <p>{virtual_account.purpose}</p>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="border border-red-100 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Phone className="h-4 w-4 text-red-600 dark:text-red-400" />
                Kontak Darurat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{emergency.contactName}</p>
                  <p className="text-sm text-muted-foreground">{emergency.relationship}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => alert(`Menghubungi: ${emergency.phone}`)}
                >
                  <Phone className="h-3 w-3 mr-1" />
                  {emergency.phone}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="text-center text-xs text-muted-foreground pt-2 border-t">
            <p>Data terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}