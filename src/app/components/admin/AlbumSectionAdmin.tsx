import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { 
  Camera, 
  Calendar, 
  Users, 
  Image as ImageIcon,
  Download,
  Clock,
  Eye,
  MapPin,
  Plus,
  Upload,
  Grid,
  List
} from 'lucide-react';

interface AlbumSectionAdminProps {
  onShowEventSchedule?: () => void;
  onUploadMedia?: () => void;
}

export function AlbumSectionAdmin({ onShowEventSchedule, onUploadMedia }: AlbumSectionAdminProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const schoolEvents = [
    {
      id: 1,
      title: 'Peringatan Maulid Nabi',
      date: '22 Des 2024',
      photos: 15,
      thumbnail: 'https://images.unsplash.com/photo-1542816417-0d6ad5c6b4ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Perayaan Maulid Nabi Muhammad SAW dengan berbagai kegiatan',
      uploadedBy: 'Admin Dokumentasi'
    },
    {
      id: 2,
      title: 'Ujian Akhir Semester',
      date: '15 Des 2024',
      photos: 8,
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Dokumentasi pelaksanaan ujian akhir semester',
      uploadedBy: 'Admin Akademik'
    },
    {
      id: 3,
      title: 'Kompetisi Tahfidz Quran',
      date: '10 Des 2024',
      photos: 12,
      thumbnail: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Lomba menghafal Al-Quran tingkat pondok pesantren',
      uploadedBy: 'Admin Tahfidz'
    },
    {
      id: 4,
      title: 'Kegiatan Olahraga Bersama',
      date: '8 Des 2024',
      photos: 20,
      thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Turnamen futsal dan voli antar kelas',
      uploadedBy: 'Admin Olahraga'
    },
    {
      id: 5,
      title: 'Kunjungan Studi Banding',
      date: '5 Des 2024',
      photos: 18,
      thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Kunjungan ke pondok pesantren lain untuk studi banding',
      uploadedBy: 'Admin Humas'
    },
    {
      id: 6,
      title: 'Pelatihan Kepemimpinan',
      date: '1 Des 2024',
      photos: 10,
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Workshop leadership untuk pengurus OSIS',
      uploadedBy: 'Admin OSIS'
    }
  ];

  const upcomingEvents = [
    {
      title: 'Wisuda Santri',
      date: '5 Jan 2025',
      time: '08:00 WIB',
      location: 'Aula Pondok',
      description: 'Acara wisuda untuk santri yang telah menyelesaikan program',
      poster: 'https://images.unsplash.com/photo-1609101466601-b60143ee4274?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc2xhbWljJTIwZXZlbnQlMjBwb3N0ZXJ8ZW58MXx8fHwxNzY2NjM4MzYyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      title: 'Pekan Olahraga',
      date: '15 Jan 2025',
      time: '07:00 WIB',
      location: 'Lapangan Pondok',
      description: 'Kompetisi olahraga antar asrama dan tingkat',
      poster: 'https://images.unsplash.com/photo-1626721105368-a69248e93b32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjb21wZXRpdGlvbnxlbnwxfHx8fDE3NjY1NTgyMjR8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      title: 'Kunjungan Wali Santri',
      date: '20 Jan 2025',
      time: '09:00 WIB',
      location: 'Seluruh Area Pondok',
      description: 'Hari kunjungan bulanan untuk wali santri',
      poster: 'https://images.unsplash.com/photo-1761666507437-9fb5a6ef7b0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBjaGFyaXR5fGVufDF8fHx8MTc2NjYzODM2NHww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      title: 'Halaqah Bulanan',
      date: '25 Jan 2025',
      time: '19:30 WIB',
      location: 'Masjid Al-Ikhlas',
      description: 'Kajian rutin bulanan dengan tema khusus',
      poster: 'https://images.unsplash.com/photo-1609101466601-b60143ee4274?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc2xhbWljJTIwZXZlbnQlMjBwb3N0ZXJ8ZW58MXx8fHwxNzY2NjM4MzYyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  return (
    <div className="p-4">
      <Tabs defaultValue="school" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="school">Album Umum</TabsTrigger>
          <TabsTrigger value="events">Jadwal Acara</TabsTrigger>
        </TabsList>

        {/* School Events Album */}
        <TabsContent value="school" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-base">Dokumentasi Kegiatan Pondok</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="flex border rounded-lg p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="h-7 px-2"
                    >
                      <Grid className="w-3 h-3" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="h-7 px-2"
                    >
                      <List className="w-3 h-3" />
                    </Button>
                  </div>
                  {onUploadMedia && (
                    <Button size="sm" onClick={onUploadMedia} className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Upload Media
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {schoolEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-48 overflow-hidden">
                        <ImageWithFallback
                          src={event.thumbnail}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                            {event.photos} foto
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm flex-1">{event.title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{event.description}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {event.uploadedBy}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            Lihat
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Download className="w-3 h-3 mr-1" />
                            Unduh
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {schoolEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <div className="flex gap-3">
                        <div className="w-24 h-24 overflow-hidden rounded-lg flex-shrink-0">
                          <ImageWithFallback
                            src={event.thumbnail}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            <Badge variant="outline" className="text-xs ml-2">
                              {event.photos} foto
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{event.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>{event.uploadedBy}</span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" className="h-8 px-2">
                                <Eye className="h-3 w-3 mr-1" />
                                Lihat
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 px-2">
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upcoming Events - Horizontal Poster Scroll */}
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Jadwal Acara Mendatang</CardTitle>
                {onShowEventSchedule && (
                  <Button variant="ghost" size="sm" onClick={onShowEventSchedule}>
                    <Eye className="h-4 w-4 mr-1" />
                    Lihat Semua
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Horizontal Poster Scroll */}
              <ScrollArea className="w-full whitespace-nowrap pb-4">
                <div className="flex gap-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="inline-block w-56 flex-shrink-0">
                      <Card className="overflow-hidden h-full">
                        {/* Event Poster */}
                        <div className="relative h-72 overflow-hidden">
                          <ImageWithFallback
                            src={event.poster}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                          
                          {/* Event Details on Poster */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <h3 className="text-base font-semibold mb-2 line-clamp-2">
                              {event.title}
                            </h3>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-3 h-3" />
                                <span className="text-xs">{event.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs">{event.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-3 h-3" />
                                <span className="text-xs line-clamp-1">{event.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Additional Info */}
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full">
            <ImageWithFallback
              src={selectedImage}
              alt="Selected photo"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
