import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';
import {
  Search,
  CreditCard,
  Lock,
  Fingerprint,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  User,
  ArrowLeft,
  Edit,
  Plus
} from 'lucide-react';

interface PaymentDataUpdateProps {
  onBack: () => void;
}

interface StudentPaymentData {
  id: string;
  name: string;
  stanbuk: string;
  class: string;
  idCard: string;
  fingerprint: string;
  pin: string;
  status: 'active' | 'inactive';
  lastUpdated: string;
}

export function PaymentDataUpdate({ onBack }: PaymentDataUpdateProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentPaymentData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    idCard: '',
    fingerprint: '',
    pin: ''
  });

  // Sample student data
  const students: StudentPaymentData[] = [
    {
      id: '1',
      name: 'Ahnaf Haidar',
      stanbuk: '2023001',
      class: '2 Wusta',
      idCard: '**** **** **** 3456',
      fingerprint: 'Tangan kanan - Jari telunjuk',
      pin: '****',
      status: 'active',
      lastUpdated: '15 Jan 2026'
    },
    {
      id: '2',
      name: 'Raihan Firdaus',
      stanbuk: '2023045',
      class: '1 Ula',
      idCard: '**** **** **** 7890',
      fingerprint: 'Tangan kanan - Jari telunjuk',
      pin: '****',
      status: 'active',
      lastUpdated: '12 Jan 2026'
    },
    {
      id: '3',
      name: 'Zidny Huda Qonita',
      stanbuk: '2024078',
      class: '3 Ulya',
      idCard: '**** **** **** 1234',
      fingerprint: 'Tangan kanan - Jari telunjuk',
      pin: '****',
      status: 'active',
      lastUpdated: '14 Jan 2026'
    }
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.stanbuk.includes(searchQuery)
  );

  const handleSelectStudent = (student: StudentPaymentData) => {
    setSelectedStudent(student);
    setFormData({
      idCard: student.idCard,
      fingerprint: student.fingerprint,
      pin: student.pin
    });
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // In real app, this would save to database
    alert(`Data pembayaran untuk ${selectedStudent?.name} berhasil diperbarui`);
    setIsEditing(false);
    if (selectedStudent) {
      setSelectedStudent({
        ...selectedStudent,
        idCard: formData.idCard,
        fingerprint: formData.fingerprint,
        pin: formData.pin,
        lastUpdated: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (selectedStudent) {
      setFormData({
        idCard: selectedStudent.idCard,
        fingerprint: selectedStudent.fingerprint,
        pin: selectedStudent.pin
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b p-4">
        <div className="flex items-center gap-3 mb-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="font-semibold text-lg">Update Data Pembayaran</h2>
            <p className="text-sm text-muted-foreground">Kelola metode pembayaran santri</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari santri (nama atau STANBUK)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          {/* Student List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Daftar Santri</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedStudent?.id === student.id
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => handleSelectStudent(student)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{student.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {student.stanbuk} • {student.class}
                          </p>
                        </div>
                        <Badge
                          variant={student.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {student.status === 'active' ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <CreditCard className="h-3 w-3" />
                        <span>{student.idCard}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Student Detail & Edit Form */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {selectedStudent ? 'Detail Data Pembayaran' : 'Pilih Santri'}
                </CardTitle>
                {selectedStudent && !isEditing && (
                  <Button size="sm" onClick={handleEdit} variant="outline">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!selectedStudent ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
                  <User className="h-12 w-12 mb-3 opacity-50" />
                  <p className="text-sm">Pilih santri dari daftar untuk melihat detail</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Student Info */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedStudent.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedStudent.stanbuk} • {selectedStudent.class}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-4">
                    {/* ID Card */}
                    <div>
                      <Label htmlFor="idCard" className="flex items-center gap-2 mb-2">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                        <span>ID Card</span>
                      </Label>
                      {isEditing ? (
                        <Input
                          id="idCard"
                          value={formData.idCard}
                          onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                          placeholder="**** **** **** 1234"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="font-mono">{selectedStudent.idCard}</p>
                        </div>
                      )}
                    </div>

                    {/* Fingerprint */}
                    <div>
                      <Label htmlFor="fingerprint" className="flex items-center gap-2 mb-2">
                        <Fingerprint className="h-4 w-4 text-green-600" />
                        <span>Data Sidik Jari</span>
                      </Label>
                      {isEditing ? (
                        <div className="space-y-2">
                          <Select
                            value={formData.fingerprint}
                            onValueChange={(value) => setFormData({ ...formData, fingerprint: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih data sidik jari" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Tangan kanan - Jari telunjuk">
                                Tangan kanan - Jari telunjuk
                              </SelectItem>
                              <SelectItem value="Tangan kanan - Jari tengah">
                                Tangan kanan - Jari tengah
                              </SelectItem>
                              <SelectItem value="Tangan kiri - Jari telunjuk">
                                Tangan kiri - Jari telunjuk
                              </SelectItem>
                              <SelectItem value="Tangan kiri - Jari tengah">
                                Tangan kiri - Jari tengah
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-xs text-orange-700 dark:text-orange-300">
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            <span>Proses scan sidik jari dilakukan dengan alat terpisah</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p>{selectedStudent.fingerprint}</p>
                        </div>
                      )}
                    </div>

                    {/* PIN */}
                    <div>
                      <Label htmlFor="pin" className="flex items-center gap-2 mb-2">
                        <Lock className="h-4 w-4 text-purple-600" />
                        <span>PIN Transaksi</span>
                      </Label>
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            id="pin"
                            type="password"
                            value={formData.pin}
                            onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                            placeholder="****"
                            maxLength={4}
                          />
                          <p className="text-xs text-muted-foreground">PIN harus 4 digit angka</p>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="font-mono">{selectedStudent.pin}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Last Updated Info */}
                  <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                    <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Terakhir diperbarui: {selectedStudent.lastUpdated}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleSave} className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        Simpan Perubahan
                      </Button>
                      <Button onClick={handleCancel} variant="outline" className="flex-1">
                        Batal
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Information Panel */}
        <div className="p-4">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-200">Panduan Update Data Pembayaran</p>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                    <li>• ID Card: Masukkan 16 digit nomor kartu santri</li>
                    <li>• Sidik Jari: Pilih data sidik jari yang telah di-scan menggunakan alat terpisah</li>
                    <li>• PIN: Masukkan 4 digit PIN untuk transaksi santri</li>
                    <li>• Data yang diperbarui akan langsung tersinkronisasi ke akun wali</li>
                    <li>• Pastikan semua data terisi dengan benar sebelum menyimpan</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
