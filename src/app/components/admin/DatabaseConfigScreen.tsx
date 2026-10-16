import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Database, 
  Cloud, 
  Server, 
  Check, 
  AlertCircle,
  Loader2,
  ArrowLeft,
  Key,
  Link,
  Settings,
  Activity,
  BarChart3,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

interface DatabaseConfigScreenProps {
  onBack: () => void;
}

interface DatabaseConnection {
  id: string;
  name: string;
  type: 'local' | 'cloud';
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  status: 'connected' | 'disconnected' | 'error';
  lastConnected?: string;
}

export function DatabaseConfigScreen({ onBack }: DatabaseConfigScreenProps) {
  const [activeConnection, setActiveConnection] = useState<'local' | 'cloud'>('local');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Google Analytics Configuration
  const [gaEnabled, setGaEnabled] = useState(false);
  const [gaMeasurementId, setGaMeasurementId] = useState('');
  const [gtmEnabled, setGtmEnabled] = useState(false);
  const [gtmContainerId, setGtmContainerId] = useState('');

  // Database connections
  const [connections, setConnections] = useState<DatabaseConnection[]>([
    {
      id: 'local-1',
      name: 'Database Lokal',
      type: 'local',
      host: 'localhost',
      port: '3306',
      database: 'ponpes_almunawwarah',
      username: 'root',
      password: '',
      ssl: false,
      status: 'connected',
      lastConnected: '2025-01-13 10:30'
    },
    {
      id: 'cloud-1',
      name: 'Cloud Database (AWS RDS)',
      type: 'cloud',
      host: 'almunawwarah-db.cluster-xxxxx.ap-southeast-1.rds.amazonaws.com',
      port: '5432',
      database: 'ponpes_production',
      username: 'admin',
      password: '',
      ssl: true,
      status: 'disconnected'
    }
  ]);

  const [editingConnection, setEditingConnection] = useState<DatabaseConnection | null>(null);

  const handleTestConnection = async (connectionId: string) => {
    setIsTestingConnection(true);
    
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setConnections(prev => prev.map(conn => 
      conn.id === connectionId 
        ? { ...conn, status: 'connected', lastConnected: new Date().toLocaleString('id-ID') }
        : conn
    ));
    
    setIsTestingConnection(false);
    toast.success('Koneksi database berhasil!');
  };

  const handleSaveConnection = (connection: DatabaseConnection) => {
    setConnections(prev => prev.map(conn => 
      conn.id === connection.id ? connection : conn
    ));
    setEditingConnection(null);
    toast.success('Konfigurasi database disimpan');
  };

  const handleSaveAnalytics = () => {
    // Save Google Analytics & GTM configuration
    if (gaEnabled && !gaMeasurementId) {
      toast.error('Masukkan Measurement ID untuk Google Analytics');
      return;
    }
    
    if (gtmEnabled && !gtmContainerId) {
      toast.error('Masukkan Container ID untuk Google Tag Manager');
      return;
    }

    // In real implementation, this would save to backend
    toast.success('Konfigurasi analytics berhasil disimpan');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500"><Check className="w-3 h-3 mr-1" />Terhubung</Badge>;
      case 'disconnected':
        return <Badge variant="secondary">Tidak Terhubung</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Error</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b p-4 safe-area-top">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Konfigurasi Database & Analytics
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Kelola koneksi database dan integrasi analytics
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="h-full">
        <div className="p-4 pb-20 space-y-4">
          <Tabs defaultValue="database">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="database">
                <Database className="w-4 h-4 mr-2" />
                Database
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Database Configuration Tab */}
            <TabsContent value="database" className="space-y-4 mt-4">
              {/* Active Connection Card */}
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">
                        Koneksi Aktif
                      </p>
                      <p className="font-semibold text-blue-900 dark:text-blue-100">
                        {connections.find(c => c.status === 'connected')?.name || 'Tidak Ada'}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center">
                      <Activity className="w-6 h-6 text-blue-700 dark:text-blue-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Local Database */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Server className="w-5 h-5 text-gray-600" />
                      <CardTitle className="text-base">Database Lokal</CardTitle>
                    </div>
                    {getStatusBadge(connections.find(c => c.type === 'local')?.status || 'disconnected')}
                  </div>
                  <CardDescription>
                    Koneksi ke database server lokal (MySQL/PostgreSQL)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {connections.filter(c => c.type === 'local').map((conn) => (
                    <div key={conn.id} className="space-y-3 border rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Host</Label>
                          <Input 
                            value={conn.host} 
                            onChange={(e) => setConnections(prev => prev.map(c => 
                              c.id === conn.id ? { ...c, host: e.target.value } : c
                            ))}
                            placeholder="localhost"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Port</Label>
                          <Input 
                            value={conn.port} 
                            onChange={(e) => setConnections(prev => prev.map(c => 
                              c.id === conn.id ? { ...c, port: e.target.value } : c
                            ))}
                            placeholder="3306"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Database Name</Label>
                        <Input 
                          value={conn.database} 
                          onChange={(e) => setConnections(prev => prev.map(c => 
                            c.id === conn.id ? { ...c, database: e.target.value } : c
                          ))}
                          placeholder="ponpes_almunawwarah"
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Username</Label>
                          <Input 
                            value={conn.username} 
                            onChange={(e) => setConnections(prev => prev.map(c => 
                              c.id === conn.id ? { ...c, username: e.target.value } : c
                            ))}
                            placeholder="root"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Password</Label>
                          <Input 
                            type={showPassword ? 'text' : 'password'}
                            value={conn.password} 
                            onChange={(e) => setConnections(prev => prev.map(c => 
                              c.id === conn.id ? { ...c, password: e.target.value } : c
                            ))}
                            placeholder="••••••"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={conn.ssl}
                            onCheckedChange={(checked) => setConnections(prev => prev.map(c => 
                              c.id === conn.id ? { ...c, ssl: checked } : c
                            ))}
                          />
                          <Label className="text-xs">Enable SSL</Label>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleTestConnection(conn.id)}
                          disabled={isTestingConnection}
                        >
                          {isTestingConnection ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Testing...
                            </>
                          ) : (
                            <>
                              <Activity className="w-4 h-4 mr-2" />
                              Test Connection
                            </>
                          )}
                        </Button>
                      </div>
                      {conn.lastConnected && (
                        <p className="text-xs text-muted-foreground">
                          Last connected: {conn.lastConnected}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Cloud Database */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cloud className="w-5 h-5 text-blue-600" />
                      <CardTitle className="text-base">Cloud Database</CardTitle>
                    </div>
                    {getStatusBadge(connections.find(c => c.type === 'cloud')?.status || 'disconnected')}
                  </div>
                  <CardDescription>
                    Koneksi ke database cloud (AWS RDS, Google Cloud SQL, Azure)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {connections.filter(c => c.type === 'cloud').map((conn) => (
                    <div key={conn.id} className="space-y-3 border rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <Label className="text-xs">Host/Endpoint</Label>
                          <Input 
                            value={conn.host} 
                            onChange={(e) => setConnections(prev => prev.map(c => 
                              c.id === conn.id ? { ...c, host: e.target.value } : c
                            ))}
                            placeholder="your-db.region.rds.amazonaws.com"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Port</Label>
                          <Input 
                            value={conn.port} 
                            onChange={(e) => setConnections(prev => prev.map(c => 
                              c.id === conn.id ? { ...c, port: e.target.value } : c
                            ))}
                            placeholder="5432"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Database Name</Label>
                          <Input 
                            value={conn.database} 
                            onChange={(e) => setConnections(prev => prev.map(c => 
                              c.id === conn.id ? { ...c, database: e.target.value } : c
                            ))}
                            placeholder="ponpes_production"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Username</Label>
                          <Input 
                            value={conn.username} 
                            onChange={(e) => setConnections(prev => prev.map(c => 
                              c.id === conn.id ? { ...c, username: e.target.value } : c
                            ))}
                            placeholder="admin"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Password</Label>
                          <Input 
                            type={showPassword ? 'text' : 'password'}
                            value={conn.password} 
                            onChange={(e) => setConnections(prev => prev.map(c => 
                              c.id === conn.id ? { ...c, password: e.target.value } : c
                            ))}
                            placeholder="••••••"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={conn.ssl}
                            onCheckedChange={(checked) => setConnections(prev => prev.map(c => 
                              c.id === conn.id ? { ...c, ssl: checked } : c
                            ))}
                          />
                          <Label className="text-xs">Enable SSL (Recommended)</Label>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleTestConnection(conn.id)}
                          disabled={isTestingConnection}
                        >
                          {isTestingConnection ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Testing...
                            </>
                          ) : (
                            <>
                              <Activity className="w-4 h-4 mr-2" />
                              Test Connection
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200">
                <CardContent className="p-4 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-700 dark:text-amber-300">
                    <p className="font-medium mb-1">Catatan Penting:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Pastikan database server sudah berjalan sebelum melakukan koneksi</li>
                      <li>Untuk cloud database, pastikan IP server aplikasi sudah di-whitelist</li>
                      <li>Selalu gunakan SSL untuk koneksi cloud database</li>
                      <li>Simpan kredensial dengan aman dan jangan bagikan ke pihak lain</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Configuration Tab */}
            <TabsContent value="analytics" className="space-y-4 mt-4">
              {/* Google Analytics */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      <CardTitle className="text-base">Google Analytics</CardTitle>
                    </div>
                    <Switch checked={gaEnabled} onCheckedChange={setGaEnabled} />
                  </div>
                  <CardDescription>
                    Track user behavior and app performance with Google Analytics 4
                  </CardDescription>
                </CardHeader>
                {gaEnabled && (
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs">Measurement ID</Label>
                      <div className="relative mt-1">
                        <Key className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input 
                          value={gaMeasurementId}
                          onChange={(e) => setGaMeasurementId(e.target.value)}
                          placeholder="G-XXXXXXXXXX"
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Dapatkan Measurement ID dari Google Analytics dashboard
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-2">
                        Fitur Tracking:
                      </p>
                      <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                        <li className="flex items-center gap-2">
                          <Check className="w-3 h-3" />
                          Page views dan screen views
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3 h-3" />
                          User engagement metrics
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3 h-3" />
                          Custom events (login, payment, etc)
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3 h-3" />
                          User demographics dan behavior
                        </li>
                      </ul>
                    </div>

                    <div className="border-t pt-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => window.open('https://analytics.google.com', '_blank')}
                      >
                        <Link className="w-4 h-4 mr-2" />
                        Buka Google Analytics Dashboard
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Google Tag Manager */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-orange-600" />
                      <CardTitle className="text-base">Google Tag Manager</CardTitle>
                    </div>
                    <Switch checked={gtmEnabled} onCheckedChange={setGtmEnabled} />
                  </div>
                  <CardDescription>
                    Manage marketing tags and tracking codes without code changes
                  </CardDescription>
                </CardHeader>
                {gtmEnabled && (
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs">Container ID</Label>
                      <div className="relative mt-1">
                        <Key className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input 
                          value={gtmContainerId}
                          onChange={(e) => setGtmContainerId(e.target.value)}
                          placeholder="GTM-XXXXXXX"
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Dapatkan Container ID dari Google Tag Manager
                      </p>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                      <p className="text-xs font-medium text-orange-900 dark:text-orange-100 mb-2">
                        Keuntungan GTM:
                      </p>
                      <ul className="text-xs text-orange-700 dark:text-orange-300 space-y-1">
                        <li className="flex items-center gap-2">
                          <Check className="w-3 h-3" />
                          Deploy tracking codes tanpa update code
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3 h-3" />
                          Integrasi dengan berbagai platform marketing
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3 h-3" />
                          A/B testing dan conversion tracking
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3 h-3" />
                          Flexible tag management
                        </li>
                      </ul>
                    </div>

                    <div className="border-t pt-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => window.open('https://tagmanager.google.com', '_blank')}
                      >
                        <Link className="w-4 h-4 mr-2" />
                        Buka Google Tag Manager
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Privacy Notice */}
              <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200">
                <CardContent className="p-4 flex items-start gap-2">
                  <Eye className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-purple-700 dark:text-purple-300">
                    <p className="font-medium mb-1">Privasi & Keamanan Data:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Data yang dikumpulkan bersifat anonim dan tidak identifikasi personal</li>
                      <li>Digunakan hanya untuk analisis dan peningkatan layanan</li>
                      <li>Sesuai dengan kebijakan privasi Google dan regulasi data</li>
                      <li>User dapat opt-out dari tracking kapan saja</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleSaveAnalytics}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Simpan Konfigurasi
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
