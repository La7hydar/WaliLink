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
    <div className=\"flex flex-col h-screen bg-background\">\n      {/* Header */}\n      <div className=\"bg-purple-600 text-white px-4 py-4 shadow-md\">\n        <div className=\"flex items-center justify-between mb-4\">\n          <div className=\"flex items-center gap-3\">\n            <Button\n              variant=\"ghost\"\n              size=\"sm\"\n              onClick={onBack}\n              className=\"text-white hover:bg-purple-700 rounded-full p-2\"\n            >\n              <ArrowLeft className=\"h-5 w-5\" />\n            </Button>\n            <div>\n              <h2 className=\"font-semibold\">Album Pondok</h2>\n              <p className=\"text-xs text-purple-100\">\n                Dokumentasi kegiatan pondok pesantren\n              </p>\n            </div>\n          </div>\n          <div className=\"w-10 h-10 bg-white/20 rounded-full flex items-center justify-center\">\n            <Camera className=\"h-5 w-5 text-white\" />\n          </div>\n        </div>\n\n        {/* Search and Filter */}\n        <div className=\"flex space-x-2\">\n          <div className=\"flex-1 relative\">\n            <Search className=\"w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70\" />\n            <Input\n              placeholder=\"Cari album...\"\n              value={searchTerm}\n              onChange={(e) => setSearchTerm(e.target.value)}\n              className=\"pl-10 bg-purple-700 border-purple-500 text-white placeholder:text-white/70\"\n            />\n          </div>\n          <Button\n            variant=\"ghost\"\n            size=\"sm\"\n            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}\n            className=\"text-white hover:bg-purple-700\"\n          >\n            {viewMode === 'grid' ? <List className=\"w-5 h-5\" /> : <Grid3x3 className=\"w-5 h-5\" />}\n          </Button>\n        </div>\n      </div>\n\n      {/* Content */}\n      <div className=\"flex-1 overflow-y-auto\">\n        <ScrollArea className=\"h-full\">\n          <div className=\"p-4 pb-20\">\n            {/* Filter Tabs */}\n            <div className=\"flex space-x-2 mb-4 overflow-x-auto pb-2\">\n              <Button\n                variant={filterType === 'all' ? 'default' : 'outline'}\n                size=\"sm\"\n                onClick={() => setFilterType('all')}\n                className={filterType === 'all' ? 'bg-purple-600' : ''}\n              >\n                Semua ({albumData.length})\n              </Button>\n              <Button\n                variant={filterType === 'photo' ? 'default' : 'outline'}\n                size=\"sm\"\n                onClick={() => setFilterType('photo')}\n                className={filterType === 'photo' ? 'bg-purple-600' : ''}\n              >\n                <Camera className=\"w-4 h-4 mr-2\" />\n                Foto\n              </Button>\n              <Button\n                variant={filterType === 'video' ? 'default' : 'outline'}\n                size=\"sm\"\n                onClick={() => setFilterType('video')}\n                className={filterType === 'video' ? 'bg-purple-600' : ''}\n              >\n                <Video className=\"w-4 h-4 mr-2\" />\n                Video\n              </Button>\n            </div>\n\n            {/* Stats */}\n            <div className=\"grid grid-cols-3 gap-3 mb-4\">\n              <Card>\n                <CardContent className=\"p-4 text-center\">\n                  <Camera className=\"w-6 h-6 mx-auto mb-2 text-purple-600\" />\n                  <p className=\"text-2xl font-bold\">{albumData.filter(a => a.type === 'photo').length}</p>\n                  <p className=\"text-xs text-muted-foreground\">Foto</p>\n                </CardContent>\n              </Card>\n              <Card>\n                <CardContent className=\"p-4 text-center\">\n                  <Video className=\"w-6 h-6 mx-auto mb-2 text-purple-600\" />\n                  <p className=\"text-2xl font-bold\">{albumData.filter(a => a.type === 'video').length}</p>\n                  <p className=\"text-xs text-muted-foreground\">Video</p>\n                </CardContent>\n              </Card>\n              <Card>\n                <CardContent className=\"p-4 text-center\">\n                  <Eye className=\"w-6 h-6 mx-auto mb-2 text-purple-600\" />\n                  <p className=\"text-2xl font-bold\">{albumData.reduce((sum, a) => sum + (a.views || 0), 0)}</p>\n                  <p className=\"text-xs text-muted-foreground\">Views</p>\n                </CardContent>\n              </Card>\n            </div>\n\n            {/* Album Grid/List */}\n            {isLoading ? (\n              <div className=\"text-center py-12\">\n                <div className=\"w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3\"></div>\n                <p className=\"text-muted-foreground\">Memuat album...</p>\n              </div>\n            ) : filteredAlbums.length === 0 ? (\n              <div className=\"text-center py-12 text-muted-foreground\">\n                <Camera className=\"w-12 h-12 mx-auto mb-2 opacity-50\" />\n                <p>Tidak ada album ditemukan</p>\n              </div>\n            ) : viewMode === 'grid' ? (\n              <div className=\"grid grid-cols-2 gap-3\">\n                {filteredAlbums.map((item) => (\n                  <Card key={item.id} className=\"overflow-hidden cursor-pointer hover:shadow-lg transition-shadow\" onClick={() => setSelectedImage(item)}>\n                    <div className=\"aspect-square bg-gray-100 relative\">\n                      {item.type === 'video' ? (\n                        <div className=\"absolute inset-0 flex items-center justify-center\">\n                          <div className=\"w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center\">\n                            <Video className=\"w-6 h-6 text-white\" />\n                          </div>\n                        </div>\n                      ) : (\n                        <div className=\"absolute inset-0 flex items-center justify-center\">\n                          <Camera className=\"w-12 h-12 text-gray-400\" />\n                        </div>\n                      )}\n                      <Badge className=\"absolute top-2 right-2 bg-purple-600\">\n                        {item.type === 'photo' ? 'Foto' : 'Video'}\n                      </Badge>\n                    </div>\n                    <CardContent className=\"p-3\">\n                      <h3 className=\"font-medium text-sm line-clamp-2 mb-1\">{item.title}</h3>\n                      <div className=\"flex items-center justify-between text-xs text-muted-foreground\">\n                        <span className=\"flex items-center gap-1\">\n                          <Calendar className=\"w-3 h-3\" />\n                          {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}\n                        </span>\n                        <span className=\"flex items-center gap-1\">\n                          <Eye className=\"w-3 h-3\" />\n                          {item.views}\n                        </span>\n                      </div>\n                    </CardContent>\n                  </Card>\n                ))}\n              </div>\n            ) : (\n              <div className=\"space-y-3\">\n                {filteredAlbums.map((item) => (\n                  <Card key={item.id} className=\"cursor-pointer hover:shadow-lg transition-shadow\" onClick={() => setSelectedImage(item)}>\n                    <CardContent className=\"p-4\">\n                      <div className=\"flex items-start gap-3\">\n                        <div className=\"w-20 h-20 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center\">\n                          {item.type === 'video' ? (\n                            <Video className=\"w-8 h-8 text-purple-600\" />\n                          ) : (\n                            <Camera className=\"w-8 h-8 text-purple-600\" />\n                          )}\n                        </div>\n                        <div className=\"flex-1\">\n                          <div className=\"flex items-start justify-between mb-2\">\n                            <div>\n                              <h3 className=\"font-medium text-sm mb-1\">{item.title}</h3>\n                              <p className=\"text-xs text-muted-foreground line-clamp-2\">{item.description}</p>\n                            </div>\n                            <Badge variant=\"outline\" className=\"ml-2\">\n                              {item.type === 'photo' ? 'Foto' : 'Video'}\n                            </Badge>\n                          </div>\n                          <div className=\"flex items-center gap-3 text-xs text-muted-foreground\">\n                            <span className=\"flex items-center gap-1\">\n                              <Calendar className=\"w-3 h-3\" />\n                              {new Date(item.date).toLocaleDateString('id-ID')}\n                            </span>\n                            <span className=\"flex items-center gap-1\">\n                              <User className=\"w-3 h-3\" />\n                              {item.uploadedBy}\n                            </span>\n                            <span className=\"flex items-center gap-1\">\n                              <Eye className=\"w-3 h-3\" />\n                              {item.views}\n                            </span>\n                          </div>\n                        </div>\n                      </div>\n                    </CardContent>\n                  </Card>\n                ))}\n              </div>\n            )}\n          </div>\n        </ScrollArea>\n      </div>\n\n      {/* Image Modal */}\n      {selectedImage && (\n        <div className=\"fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4\" onClick={() => setSelectedImage(null)}>\n          <div className=\"max-w-4xl w-full\">\n            <div className=\"bg-white rounded-lg overflow-hidden\" onClick={(e) => e.stopPropagation()}>\n              <div className=\"p-4 border-b flex items-center justify-between\">\n                <h3 className=\"font-semibold\">{selectedImage.title}</h3>\n                <Button variant=\"ghost\" size=\"sm\" onClick={() => setSelectedImage(null)}>\n                  ✕\n                </Button>\n              </div>\n              <div className=\"p-4\">\n                <div className=\"aspect-video bg-gray-100 rounded flex items-center justify-center mb-4\">\n                  {selectedImage.type === 'video' ? (\n                    <div className=\"w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center\">\n                      <Video className=\"w-12 h-12 text-white\" />\n                    </div>\n                  ) : (\n                    <Camera className=\"w-24 h-24 text-gray-400\" />\n                  )}\n                </div>\n                <p className=\"text-sm text-muted-foreground mb-4\">{selectedImage.description}</p>\n                <div className=\"flex items-center justify-between text-sm\">\n                  <div className=\"space-y-1\">\n                    <p><strong>Kategori:</strong> {selectedImage.category}</p>\n                    <p><strong>Upload:</strong> {new Date(selectedImage.date).toLocaleDateString('id-ID')}</p>\n                    <p><strong>Oleh:</strong> {selectedImage.uploadedBy}</p>\n                  </div>\n                  <Button className=\"bg-purple-600 hover:bg-purple-700\">\n                    <Download className=\"w-4 h-4 mr-2\" />\n                    Download\n                  </Button>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      )}\n    </div>\n  );\n}
