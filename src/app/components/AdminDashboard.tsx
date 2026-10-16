import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  LogOut, 
  Calendar, 
  Shield, 
  Trophy, 
  CreditCard, 
  Camera, 
  Users, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Key,
  Database,
  LogIn,
  Eye,
  EyeOff,
  UserPlus,
  Globe,
  BarChart3,
  Server
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { ScrollArea } from './ui/scroll-area';
import { useLanguage } from '../hooks/useLanguage';
import { DatabaseConfigScreen } from './admin/DatabaseConfigScreen';

interface AdminDashboardProps {
  adminData: any;
  onLogout: () => void;
  onAccessSection?: (section: string) => void;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'super-admin' | 'admin';
  section: string;
  permissions: {
    read: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  tablePermissions?: {
    [tableName: string]: {
      read: boolean;
      edit: boolean;
      delete: boolean;
    };
  };
  isActive: boolean;
  lastLogin?: string;
}

export function AdminDashboard({ adminData, onLogout, onAccessSection }: AdminDashboardProps) {
  const [selectedSection, setSelectedSection] = useState('overview');
  const [isAddingData, setIsAddingData] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddAdminForm, setShowAddAdminForm] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('id');
  const [showPassword, setShowPassword] = useState(false);
  const [showDatabaseConfig, setShowDatabaseConfig] = useState(false);
  const [showSectionAccessModal, setShowSectionAccessModal] = useState(false);
  const { changeLanguage } = useLanguage();

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'admin' as 'super-admin' | 'admin',
    section: '',
    customSection: '',
    permissions: {
      read: true,
      create: false,
      edit: false,
      delete: false
    },
    tablePermissions: {
      'Santri': { read: true, edit: false, delete: false },
      'Wali': { read: true, edit: false, delete: false },
      'Pembayaran': { read: true, edit: false, delete: false },
      'Kedisiplinan': { read: true, edit: false, delete: false },
      'Prestasi': { read: true, edit: false, delete: false },
      'Album': { read: true, edit: false, delete: false }
    }
  });

  const [existingAdmins, setExistingAdmins] = useState<AdminUser[]>([
    {
      id: '1',
      name: 'Ahmad Fauzi',
      email: 'ahmad@almunawwarah.com',
      phone: '0812-1111-2222',
      role: 'admin',
      section: 'Absensi & Kehadiran',
      permissions: { read: true, create: true, edit: true, delete: false },
      tablePermissions: {
        'Santri': { read: true, edit: true, delete: false },
        'Wali': { read: true, edit: false, delete: false },
        'Pembayaran': { read: true, edit: false, delete: false },
        'Kedisiplinan': { read: true, edit: true, delete: true },
        'Prestasi': { read: true, edit: false, delete: false },
        'Album': { read: true, edit: false, delete: false }
      },
      isActive: true,
      lastLogin: '2025-01-08 09:30'
    },
    {
      id: '2', 
      name: 'Siti Aisyah',
      email: 'siti@almunawwarah.com',
      phone: '0813-2222-3333',
      role: 'admin',
      section: 'Keuangan & Pembayaran',
      permissions: { read: true, create: true, edit: true, delete: true },
      tablePermissions: {
        'Santri': { read: true, edit: false, delete: false },
        'Wali': { read: true, edit: true, delete: false },
        'Pembayaran': { read: true, edit: true, delete: true },
        'Kedisiplinan': { read: true, edit: false, delete: false },
        'Prestasi': { read: true, edit: false, delete: false },
        'Album': { read: true, edit: false, delete: false }
      },
      isActive: true,
      lastLogin: '2025-01-08 08:15'
    }
  ]);

  const adminSections = [
    { id: 'attendance', name: 'Absensi & Kehadiran', icon: Calendar, color: 'blue' },
    { id: 'discipline', name: 'Kedisiplinan', icon: Shield, color: 'red' },
    { id: 'achievement', name: 'Prestasi & Nilai', icon: Trophy, color: 'yellow' },
    { id: 'payment', name: 'Keuangan & Pembayaran', icon: CreditCard, color: 'green' },
    { id: 'album', name: 'Album & Dokumentasi', icon: Camera, color: 'purple' },
    { id: 'students', name: 'Data Santri', icon: Users, color: 'indigo' },
    { id: 'settings', name: 'Pengaturan Umum', icon: Settings, color: 'gray' },
  ];

  const predefinedSections = [
    'Absensi & Kehadiran',
    'Kedisiplinan', 
    'Prestasi & Nilai',
    'Keuangan & Pembayaran',
    'Album & Dokumentasi',
    'Data Santri',
    'Pengaturan Umum'
  ];

  const mockStudents = [
    { id: 1, name: 'Ahmad Fauzi', class: '2 Wusta', room: 'Kamar 1A', region: 'Jakarta' },
    { id: 2, name: 'Muhammad Ridho', class: '1 Ulya', room: 'Kamar 2B', region: 'Bogor' },
    { id: 3, name: 'Abdul Rahman', class: '3 Ula', room: 'Kamar 1B', region: 'Depok' },
  ];

  const handleAddAdmin = () => {
    const finalSection = newAdmin.section === 'custom' ? newAdmin.customSection : newAdmin.section;
    
    const admin: AdminUser = {
      id: Date.now().toString(),
      name: newAdmin.name,
      email: newAdmin.email,
      phone: newAdmin.phone,
      role: newAdmin.role,
      section: finalSection,
      permissions: newAdmin.permissions,
      tablePermissions: newAdmin.tablePermissions,
      isActive: true
    };

    setExistingAdmins([...existingAdmins, admin]);
    setNewAdmin({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'admin',
      section: '',
      customSection: '',
      permissions: {
        read: true,
        create: false,
        edit: false,
        delete: false
      },
      tablePermissions: {
        'Santri': { read: true, edit: false, delete: false },
        'Wali': { read: true, edit: false, delete: false },
        'Pembayaran': { read: true, edit: false, delete: false },
        'Kedisiplinan': { read: true, edit: false, delete: false },
        'Prestasi': { read: true, edit: false, delete: false },
        'Album': { read: true, edit: false, delete: false }
      }
    });
    setShowAddAdminForm(false);
  };

  const handleQuickLogin = (admin: AdminUser) => {
    alert(`Login cepat ke akun ${admin.name} (${admin.section})\nNotifikasi telah dikirim ke admin tersebut.`);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    changeLanguage(language);
  };

  const toggleAdminPermission = (adminId: string, permission: keyof AdminUser['permissions']) => {
    setExistingAdmins(admins => 
      admins.map(admin => 
        admin.id === adminId 
          ? { 
              ...admin, 
              permissions: { 
                ...admin.permissions, 
                [permission]: !admin.permissions[permission] 
              } 
            }
          : admin
      )
    );
  };

  const renderAdminManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Manajemen Admin</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Kelola admin utama dan admin bagian
          </p>
        </div>
        <Button onClick={() => setShowAddAdminForm(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Tambah Admin
        </Button>
      </div>

      {showAddAdminForm && (
        <Card>
          <CardHeader>
            <CardTitle>Tambah Admin Baru</CardTitle>
            <CardDescription>
              Buat akun admin utama atau admin bagian baru
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Nama Lengkap*</Label>
                <Input
                  placeholder="Nama admin"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Email*</Label>
                <Input
                  type="email"
                  placeholder="admin@pondok.com"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>No. HP*</Label>
                <Input
                  placeholder="0812-3456-7890"
                  value={newAdmin.phone}
                  onChange={(e) => setNewAdmin({...newAdmin, phone: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Password*</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 8 karakter"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Role*</Label>
                <Select value={newAdmin.role} onValueChange={(value: 'super-admin' | 'admin') => 
                  setNewAdmin({...newAdmin, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super-admin">Admin Utama</SelectItem>
                    <SelectItem value="admin">Admin Bagian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newAdmin.role === 'admin' && (
                <div className="space-y-2">
                  <Label>Bagian*</Label>
                  <Select value={newAdmin.section} onValueChange={(value) => 
                    setNewAdmin({...newAdmin, section: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih bagian" />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedSections.map((section) => (
                        <SelectItem key={section} value={section}>
                          {section}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Bagian Lain (Tulis Manual)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {newAdmin.section === 'custom' && (
                <div className="space-y-2">
                  <Label>Nama Bagian Custom*</Label>
                  <Input
                    placeholder="Nama bagian baru"
                    value={newAdmin.customSection}
                    onChange={(e) => setNewAdmin({...newAdmin, customSection: e.target.value})}
                  />
                </div>
              )}

              {newAdmin.role === 'admin' && (
                <div className="space-y-3">
                  <Label>Izin Akses</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="read"
                        checked={newAdmin.permissions.read}
                        onCheckedChange={(checked) => 
                          setNewAdmin({
                            ...newAdmin, 
                            permissions: {...newAdmin.permissions, read: !!checked}
                          })
                        }
                      />
                      <Label htmlFor="read">Baca</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="create"
                        checked={newAdmin.permissions.create}
                        onCheckedChange={(checked) => 
                          setNewAdmin({
                            ...newAdmin, 
                            permissions: {...newAdmin.permissions, create: !!checked}
                          })
                        }
                      />
                      <Label htmlFor="create">Buat</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="edit"
                        checked={newAdmin.permissions.edit}
                        onCheckedChange={(checked) => 
                          setNewAdmin({
                            ...newAdmin, 
                            permissions: {...newAdmin.permissions, edit: !!checked}
                          })
                        }
                      />
                      <Label htmlFor="edit">Edit</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="delete"
                        checked={newAdmin.permissions.delete}
                        onCheckedChange={(checked) => 
                          setNewAdmin({
                            ...newAdmin, 
                            permissions: {...newAdmin.permissions, delete: !!checked}
                          })
                        }
                      />
                      <Label htmlFor="delete">Hapus</Label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Izin Akses Per Tabel</Label>
                    <div className="border rounded-lg overflow-x-auto">
                      <div className="min-w-max">
                        <div className="grid grid-cols-4 gap-0 bg-gray-100 dark:bg-gray-800 border-b">
                          <div className="p-2 font-medium text-xs">Tabel</div>
                          <div className="p-2 font-medium text-xs text-center">Baca</div>
                          <div className="p-2 font-medium text-xs text-center">Edit</div>
                          <div className="p-2 font-medium text-xs text-center">Hapus</div>
                        </div>
                        {Object.keys(newAdmin.tablePermissions).map((tableName) => (
                          <div key={tableName} className="grid grid-cols-4 gap-0 border-b last:border-b-0">
                            <div className="p-2 text-xs font-medium">{tableName}</div>
                            <div className="p-2 flex justify-center items-center">
                              <Checkbox
                                checked={newAdmin.tablePermissions[tableName].read}
                                onCheckedChange={(checked) => 
                                  setNewAdmin({
                                    ...newAdmin,
                                    tablePermissions: {
                                      ...newAdmin.tablePermissions,
                                      [tableName]: {
                                        ...newAdmin.tablePermissions[tableName],
                                        read: !!checked
                                      }
                                    }
                                  })
                                }
                              />
                            </div>
                            <div className="p-2 flex justify-center items-center">
                              <Checkbox
                                checked={newAdmin.tablePermissions[tableName].edit}
                                onCheckedChange={(checked) => 
                                  setNewAdmin({
                                    ...newAdmin,
                                    tablePermissions: {
                                      ...newAdmin.tablePermissions,
                                      [tableName]: {
                                        ...newAdmin.tablePermissions[tableName],
                                        edit: !!checked
                                      }
                                    }
                                  })
                                }
                              />
                            </div>
                            <div className="p-2 flex justify-center items-center">
                              <Checkbox
                                checked={newAdmin.tablePermissions[tableName].delete}
                                onCheckedChange={(checked) => 
                                  setNewAdmin({
                                    ...newAdmin,
                                    tablePermissions: {
                                      ...newAdmin.tablePermissions,
                                      [tableName]: {
                                        ...newAdmin.tablePermissions[tableName],
                                        delete: !!checked
                                      }
                                    }
                                  })
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleAddAdmin} className="flex-1">
                Buat Admin
              </Button>
              <Button variant="outline" onClick={() => setShowAddAdminForm(false)}>
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Admins List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Admin</CardTitle>
          <CardDescription>
            Admin yang terdaftar di sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {existingAdmins.map((admin) => (
              <div key={admin.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium">{admin.name}</h4>
                      <Badge variant={admin.role === 'super-admin' ? 'default' : 'secondary'}>
                        {admin.role === 'super-admin' ? 'Admin Utama' : 'Admin Bagian'}
                      </Badge>
                      <Badge variant={admin.isActive ? 'default' : 'destructive'} className="bg-green-500">
                        {admin.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {admin.email} • {admin.phone}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Bagian: {admin.section}
                    </p>
                    {admin.lastLogin && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Login terakhir: {admin.lastLogin}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickLogin(admin)}
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Login Cepat
                    </Button>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {admin.role === 'admin' && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm font-medium mb-2">Izin Akses:</p>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(admin.permissions).map(([permission, granted]) => (
                        <div key={permission} className="flex items-center space-x-1">
                          <Switch
                            checked={granted}
                            onCheckedChange={() => toggleAdminPermission(admin.id, permission as keyof AdminUser['permissions'])}
                            size="sm"
                          />
                          <span className="text-xs capitalize">{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Database Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Akses Database
          </CardTitle>
          <CardDescription>
            Akses penuh ke seluruh database sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Tabel Santri
            </Button>
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Tabel Wali
            </Button>
            <Button variant="outline">
              <CreditCard className="w-4 h-4 mr-2" />
              Tabel Pembayaran
            </Button>
            <Button variant="outline">
              <Shield className="w-4 h-4 mr-2" />
              Tabel Kedisiplinan
            </Button>
            <Button variant="outline">
              <Trophy className="w-4 h-4 mr-2" />
              Tabel Prestasi
            </Button>
            <Button variant="outline">
              <Camera className="w-4 h-4 mr-2" />
              Tabel Album
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Pengaturan Akun</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Kelola informasi akun dan preferensi
        </p>
      </div>

      {/* Database & Analytics Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Server className="w-5 h-5 mr-2" />
            Database & Analytics
          </CardTitle>
          <CardDescription>
            Konfigurasi koneksi database dan integrasi Google Analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => setShowDatabaseConfig(true)}
            className="w-full"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Buka Konfigurasi Database & Analytics
          </Button>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Pengaturan Bahasa
          </CardTitle>
          <CardDescription>
            Pilih bahasa antarmuka aplikasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Bahasa Aplikasi</Label>
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">🇮🇩 Bahasa Indonesia</SelectItem>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                  <SelectItem value="ar">🇸🇦 العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Perubahan bahasa akan diterapkan secara langsung di seluruh aplikasi.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Profil</CardTitle>
          <CardDescription>
            Update informasi profil admin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nama Lengkap</Label>
            <Input defaultValue={adminData?.name || 'Admin Utama'} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue={adminData?.email || 'admin@almunawwarah.com'} />
          </div>
          <div className="space-y-2">
            <Label>No. HP</Label>
            <Input defaultValue={adminData?.phone || '0812-1111-2222'} />
          </div>
          <Button>Simpan Perubahan</Button>
        </CardContent>
      </Card>

      {/* Password Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Ganti Password</CardTitle>
          <CardDescription>
            Update password untuk keamanan akun
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Password Lama</Label>
            <Input type="password" />
          </div>
          <div className="space-y-2">
            <Label>Password Baru</Label>
            <Input type="password" />
          </div>
          <div className="space-y-2">
            <Label>Konfirmasi Password Baru</Label>
            <Input type="password" />
          </div>
          <Button>Ganti Password</Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderSectionContent = () => {
    switch (selectedSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Statistik Hari Ini</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">95%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Kehadiran</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">12</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Laporan Disiplin</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Akses Cepat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {adminSections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <Button
                          key={section.id}
                          variant="outline"
                          onClick={() => setSelectedSection(section.id)}
                          className="h-auto p-4 flex flex-col items-center space-y-2"
                        >
                          <Icon className="w-6 h-6" />
                          <span className="text-xs text-center">{section.name}</span>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'admin-management':
        return renderAdminManagement();

      case 'admin-settings':
        return renderSettings();

      case 'attendance':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Absensi & Kehadiran</h3>
              <Button onClick={() => setIsAddingData(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Data
              </Button>
            </div>

            {isAddingData ? (
              <Card>
                <CardHeader>
                  <CardTitle>Input Data Absensi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Pilih Santri</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih santri" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockStudents.map((student) => (
                          <SelectItem key={student.id} value={student.id.toString()}>
                            {student.name} - {student.class}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tanggal</Label>
                    <Input type="date" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Status Kehadiran</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hadir">Hadir</SelectItem>
                        <SelectItem value="izin">Izin</SelectItem>
                        <SelectItem value="sakit">Sakit</SelectItem>
                        <SelectItem value="alpha">Alpha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Keterangan (Opsional)</Label>
                    <Textarea placeholder="Keterangan tambahan..." />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1">Simpan</Button>
                    <Button variant="outline" onClick={() => setIsAddingData(false)}>
                      Batal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Ahmad Fauzi - 2 Wusta</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Hari ini: Hadir
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'students':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Data Santri</h3>
              <Button onClick={() => setIsAddingData(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Santri
              </Button>
            </div>

            <Card>
              <CardContent className="p-4 space-y-3">
                {mockStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {student.class} • {student.room} • {student.region}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <p>Bagian dalam pengembangan</p>
          </div>
        );
    }
  };

  const isMainAdmin = adminData?.role === 'Super Admin';

  return (
    <div className="size-full bg-gray-50 dark:bg-gray-900 safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {adminData?.name || 'Admin'} • {adminData?.role || 'Admin Bagian'}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="overflow-x-auto">
          <div className="flex p-2 space-x-1 min-w-max">
            <Button
              variant={selectedSection === 'overview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedSection('overview')}
              className="whitespace-nowrap flex-shrink-0"
            >
              <Settings className="w-4 h-4 mr-2" />
              Overview
            </Button>
            
            {isMainAdmin && (
              <>
                <Button
                  variant={selectedSection === 'admin-management' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedSection('admin-management')}
                  className="whitespace-nowrap flex-shrink-0"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Manajemen Admin
                </Button>
              </>
            )}

            {adminSections.map((section) => {
              const Icon = section.icon;
              return (
                <Button
                  key={section.id}
                  variant={selectedSection === section.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setSelectedSection(section.id);
                    if (onAccessSection) {
                      onAccessSection(section.id);
                    }
                  }}
                  className="whitespace-nowrap flex-shrink-0"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {section.name}
                </Button>
              );
            })}

            <Button
              variant={selectedSection === 'admin-settings' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedSection('admin-settings')}
              className="whitespace-nowrap flex-shrink-0"
            >
              <Settings className="w-4 h-4 mr-2" />
              Pengaturan
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <ScrollArea className="h-full">
          <div className="p-4 pb-20">
            {renderSectionContent()}
          </div>
        </ScrollArea>
      </div>

      {/* Database Config Screen Overlay */}
      {showDatabaseConfig && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
          <DatabaseConfigScreen onBack={() => setShowDatabaseConfig(false)} />
        </div>
      )}
    </div>
  );
}