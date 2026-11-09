import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  ArrowLeft,
  Camera,
  Video,
  Download,
  Eye,
  Calendar,
  User,
  Grid3x3,
  List,
  Filter,
  Search
} from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { getAlbumPhotos } from '../../services/localStorage';

interface AlbumViewerScreenProps {
  onBack: () => void;
}

export function AlbumViewerScreen({ onBack }: AlbumViewerScreenProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [albumData, setAlbumData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    try {
      setIsLoading(true);
      // Use mock data in offline mode
      setAlbumData(mockAlbumData);
    } catch (error) {
      console.error('Failed to load albums:', error);
      // Use mock data as fallback
      setAlbumData(mockAlbumData);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for demo
  const mockAlbumData = [
    {
      id: '1',
      title: 'Kegiatan Manasik Haji 2025',
      description: 'Praktik manasik haji santri kelas Ulya',
      type: 'photo',
      date: '2025-01-15',
      uploadedBy: 'Admin Album',
      category: 'Kegiatan',
      tags: ['manasik', 'haji', 'praktik'],
      views: 234
    },
    {
      id: '2',
      title: 'Upacara Bendera Senin',
      description: 'Upacara bendera rutin setiap hari Senin',
      type: 'photo',
      date: '2025-01-13',
      uploadedBy: 'Admin Album',
      category: 'Rutin',
      tags: ['upacara', 'bendera'],
      views: 156
    },
    {
      id: '3',
      title: 'Lomba Tahfidz Antar Kelas',
      description: 'Kompetisi hafalan Al-Quran antar kelas',
      type: 'video',
      date: '2025-01-10',
      uploadedBy: 'Admin Album',
      category: 'Lomba',
      tags: ['tahfidz', 'lomba', 'quran'],
      views: 421
    },
    {
      id: '4',
      title: 'Pembelajaran Kitab Kuning',
      description: 'Kegiatan pembelajaran kitab kuning di kelas Wusta',
      type: 'photo',
      date: '2025-01-08',
      uploadedBy: 'Admin Album',
      category: 'Pembelajaran',
      tags: ['kitab', 'pembelajaran'],
      views: 189
    },
    {
      id: '5',
      title: 'Perpisahan Santri Kelas 3 Ulya',
      description: 'Acara perpisahan dan wisuda santri angkatan 2024',
      type: 'video',
      date: '2024-12-28',
      uploadedBy: 'Admin Album',
      category: 'Acara',
      tags: ['perpisahan', 'wisuda'],
      views: 892
    },
    {
      id: '6',
      title: 'Sholat Berjamaah Subuh',
      description: 'Dokumentasi sholat berjamaah subuh di musholla',
      type: 'photo',
      date: '2025-01-12',
      uploadedBy: 'Admin Album',
      category: 'Ibadah',
      tags: ['sholat', 'subuh', 'berjamaah'],
      views: 312
    }
  ];

  const filteredAlbums = albumData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const categories = ['Semua', 'Kegiatan', 'Rutin', 'Lomba', 'Pembelajaran', 'Acara', 'Ibadah'];

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-purple-600 text-white px-4 py-4 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-purple-700 rounded-full p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="font-semibold">Album Pondok</h2>
              <p className="text-xs text-purple-100">
                Dokumentasi kegiatan pondok pesantren
              </p>
            </div>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Camera className="h-5 w-5 text-white" />
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
            <Input
              placeholder="Cari album..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-purple-700 border-purple-500 text-white placeholder:text-white/70"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="text-white hover:bg-purple-700"
          >
            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid3x3 className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <ScrollArea className="h-full">
          <div className="p-4 pb-20">
            {/* Filter Tabs */}
            <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
                className={filterType === 'all' ? 'bg-purple-600' : ''}
              >
                Semua ({albumData.length})
              </Button>
              <Button
                variant={filterType === 'photo' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('photo')}
                className={filterType === 'photo' ? 'bg-purple-600' : ''}
              >
                <Camera className="w-4 h-4 mr-2" />
                Foto
              </Button>
              <Button
                variant={filterType === 'video' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('video')}
                className={filterType === 'video' ? 'bg-purple-600' : ''}
              >
                <Video className="w-4 h-4 mr-2" />
                Video
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Camera className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <p className="text-2xl font-bold">{albumData.filter(a => a.type === 'photo').length}</p>
                  <p className="text-xs text-muted-foreground">Foto</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Video className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <p className="text-2xl font-bold">{albumData.filter(a => a.type === 'video').length}</p>
                  <p className="text-xs text-muted-foreground">Video</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Eye className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <p className="text-2xl font-bold">{albumData.reduce((sum, a) => sum + (a.views || 0), 0)}</p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </CardContent>
              </Card>
            </div>

            {/* Album Grid/List */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-muted-foreground">Memuat album...</p>
              </div>
            ) : filteredAlbums.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Tidak ada album ditemukan</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredAlbums.map((item) => (
                  <Card key={item.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedImage(item)}>
                    <div className="aspect-square bg-gray-100 relative">
                      {item.type === 'video' ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                            <Video className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Camera className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <Badge className="absolute top-2 right-2 bg-purple-600">
                        {item.type === 'photo' ? 'Foto' : 'Video'}
                      </Badge>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-medium text-sm line-clamp-2 mb-1">{item.title}</h3>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {item.views}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAlbums.map((item) => (
                  <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedImage(item)}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                          {item.type === 'video' ? (
                            <Video className="w-8 h-8 text-purple-600" />
                          ) : (
                            <Camera className="w-8 h-8 text-purple-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-medium text-sm mb-1">{item.title}</h3>
                              <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              {item.type === 'photo' ? 'Foto' : 'Video'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(item.date).toLocaleDateString('id-ID')}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {item.uploadedBy}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {item.views}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="max-w-4xl w-full">
            <div className="bg-white rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold">{selectedImage.title}</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedImage(null)}>
                  ✕
                </Button>
              </div>
              <div className="p-4">
                <div className="aspect-video bg-gray-100 rounded flex items-center justify-center mb-4">
                  {selectedImage.type === 'video' ? (
                    <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center">
                      <Video className="w-12 h-12 text-white" />
                    </div>
                  ) : (
                    <Camera className="w-24 h-24 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">{selectedImage.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="space-y-1">
                    <p><strong>Kategori:</strong> {selectedImage.category}</p>
                    <p><strong>Upload:</strong> {new Date(selectedImage.date).toLocaleDateString('id-ID')}</p>
                    <p><strong>Oleh:</strong> {selectedImage.uploadedBy}</p>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
