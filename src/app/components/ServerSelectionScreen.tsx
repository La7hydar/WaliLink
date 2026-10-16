import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Building2, Plus, Server, ChevronRight, BookOpen, Languages } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { useLanguage } from '../hooks/useLanguage';

interface ServerSelectionScreenProps {
  onServerSelected: (serverData: { 
    serverId: string; 
    serverName: string; 
    isMainServer: boolean; 
  }) => void;
  onCreateNewServer: () => void;
  onTutorial: () => void;
  onLanguageSettings: () => void;
}

export function ServerSelectionScreen({ onServerSelected, onCreateNewServer, onTutorial, onLanguageSettings }: ServerSelectionScreenProps) {
  const { t } = useLanguage();
  const [showCustomServer, setShowCustomServer] = useState(false);
  const [customServerUrl, setCustomServerUrl] = useState('');

  const handleMainServer = () => {
    onServerSelected({
      serverId: 'main-almunawwarah',
      serverName: 'Pondok Almunawwarah - Server Utama',
      isMainServer: true
    });
  };

  const handleCustomServer = () => {
    if (customServerUrl.trim()) {
      onServerSelected({
        serverId: `custom-${Date.now()}`,
        serverName: customServerUrl,
        isMainServer: false
      });
    }
  };

  // Mock data untuk server yang sudah ada
  const existingServers = [
    { id: 'darussalam', name: 'Pondok Darussalam Jakarta', location: 'Jakarta Selatan' },
    { id: 'modern', name: 'Pondok Modern Gontor', location: 'Ponorogo' },
    { id: 'lirboyo', name: 'Pondok Lirboyo', location: 'Kediri' },
  ];

  return (
    <div className="size-full bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 safe-area-top safe-area-bottom">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t('server.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('server.description')}
          </p>
        </div>

        {/* Pondok Almunawwarah - Main Server */}
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Server className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">{t('server.main_server')}</CardTitle>
                <CardDescription>{t('server.main_description')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              onClick={handleMainServer}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              {t('server.select_main')}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Server Pondok Lain */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-white">{t('server.other_servers')}</h3>
          
          {!showCustomServer ? (
            <div className="space-y-3">
              {existingServers.map((server) => (
                <Card key={server.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div 
                      className="flex items-center justify-between"
                      onClick={() => onServerSelected({
                        serverId: server.id,
                        serverName: server.name,
                        isMainServer: false
                      })}
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{server.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{server.location}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button 
                variant="outline" 
                onClick={() => setShowCustomServer(true)}
                className="w-full border-dashed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Masukkan URL Server Lain
              </Button>
            </div>
          ) : (
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="server-url">URL Server Pondok</Label>
                  <Input
                    id="server-url"
                    placeholder="https://server-pondok.com"
                    value={customServerUrl}
                    onChange={(e) => setCustomServerUrl(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleCustomServer}
                    disabled={!customServerUrl.trim()}
                    className="flex-1"
                  >
                    Hubungkan
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowCustomServer(false);
                      setCustomServerUrl('');
                    }}
                  >
                    Batal
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Buat Server Baru */}
        <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-4">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-green-900 dark:text-green-100">
                  Pondok Baru?
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {t('server.new_description')}
                </p>
              </div>
              <Button 
                onClick={onCreateNewServer}
                className="bg-green-600 hover:bg-green-700 text-white w-full"
              >
                {t('server.create_new')}
              </Button>
              
              {/* Tutorial Button */}
              <Button 
                onClick={onTutorial}
                variant="outline"
                className="w-full border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/20"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {t('server.tutorial')}
              </Button>
              
              {/* Language Button */}
              <Button 
                onClick={onLanguageSettings}
                variant="outline"
                className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/20"
              >
                <Languages className="w-4 h-4 mr-2" />
                {t('server.language')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bottom spacing untuk scroll */}
        <div className="h-6"></div>
      </div>
      </ScrollArea>
    </div>
  );
}