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
  Play,
  Download,
  Share,
  Heart,
  MessageCircle,
  Clock,
  Eye,
  MapPin
} from 'lucide-react';

interface AlbumSectionProps {
  studentData: {
    name: string;
  };
  onShowEventSchedule?: () => void;
}

export function AlbumSection({ studentData, onShowEventSchedule }: AlbumSectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const personalPhotos = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: 'Kegiatan Belajar',
      date: '20 Des 2024',
      description: 'Ahmad sedang belajar Al-Quran'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: 'Lomba Tahfidz',
      date: '18 Des 2024',
      description: 'Saat mengikuti kompetisi hafalan Quran'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: 'Sholat Berjamaah',
      date: '15 Des 2024',
      description: 'Sholat maghrib berjamaah di masjid'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: 'Diskusi Kelompok',
      date: '12 Des 2024',
      description: 'Berdiskusi dengan teman-teman'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: 'Kegiatan Olahraga',
      date: '10 Des 2024',
      description: 'Bermain sepak bola di lapangan pondok'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: 'Makan Bersama',
      date: '8 Des 2024',
      description: 'Makan siang bersama di asrama'
    }
  ];

  const schoolEvents = [
    {
      id: 1,
      title: 'Peringatan Maulid Nabi',
      date: '22 Des 2024',
      photos: 15,
      thumbnail: 'https://images.unsplash.com/photo-1542816417-0d6ad5c6b4ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Perayaan Maulid Nabi Muhammad SAW dengan berbagai kegiatan'
    },
    {
      id: 2,
      title: 'Ujian Akhir Semester',
      date: '15 Des 2024',
      photos: 8,
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Dokumentasi pelaksanaan ujian akhir semester'
    },
    {
      id: 3,
      title: 'Kompetisi Tahfidz Quran',
      date: '10 Des 2024',
      photos: 12,
      thumbnail: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Lomba menghafal Al-Quran tingkat pondok pesantren'
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
    }
  ];

  const newsArticles = [
    {
      id: 1,
      title: 'Santri Pondok Al-Munawwarah Raih Juara Umum Kompetisi Tahfidz Tingkat Nasional',
      date: '7 Feb 2026',
      category: 'Prestasi',
      thumbnail: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      excerpt: 'Tim tahfidz pondok pesantren berhasil meraih juara umum dalam kompetisi tahfidz Al-Quran tingkat nasional yang diselenggarakan di Jakarta. Pencapaian ini merupakan bukti keseriusan santri dalam menghafal Al-Quran.',
      views: 1250,
      likes: 340
    },
    {
      id: 2,
      title: 'Renovasi Masjid Pusat Pondok Telah Selesai',
      date: '5 Feb 2026',
      category: 'Fasilitas',
      thumbnail: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      excerpt: 'Alhamdulillah, renovasi masjid pusat pondok pesantren telah selesai dilaksanakan. Masjid kini dilengkapi dengan AC, sound system baru, dan karpet berkualitas tinggi untuk kenyamanan ibadah santri.',
      views: 890,
      likes: 245
    },
    {
      id: 3,
      title: 'Program Beasiswa Penuh Untuk Santri Berprestasi Tahun 2026',
      date: '3 Feb 2026',
      category: 'Pengumuman',
      thumbnail: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      excerpt: 'Yayasan pondok pesantren membuka program beasiswa penuh untuk santri berprestasi. Pendaftaran dibuka mulai 10 Februari hingga 10 Maret 2026. Info lengkap dapat diakses di kantor administrasi.',
      views: 2100,
      likes: 580
    },
    {
      id: 4,
      title: 'Kegiatan Bakti Sosial ke Panti Asuhan dan Panti Jompo',
      date: '1 Feb 2026',
      category: 'Kegiatan',
      thumbnail: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      excerpt: 'Santri pondok pesantren mengadakan kegiatan bakti sosial dengan mengunjungi panti asuhan dan panti jompo. Kegiatan ini bertujuan untuk menumbuhkan rasa kepedulian sosial pada santri.',
      views: 650,
      likes: 190
    },
    {
      id: 5,
      title: 'Pelaksanaan Ujian Tengah Semester Berjalan Lancar',
      date: '30 Jan 2026',
      category: 'Akademik',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      excerpt: 'Ujian tengah semester periode Januari 2026 telah dilaksanakan dengan lancar. Seluruh santri mengikuti ujian dengan tertib dan hasil akan diumumkan dalam waktu 2 minggu.',
      views: 1450,
      likes: 320
    }
  ];

  return (
    <div className="p-4">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Album Personal</TabsTrigger>
          <TabsTrigger value="school">Album Umum</TabsTrigger>
          <TabsTrigger value="news">Berita Terbaru</TabsTrigger>
        </TabsList>

        {/* Personal Album */}
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Foto {studentData.name}</CardTitle>
                <Badge variant="outline">{personalPhotos.length} foto</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {personalPhotos.map((photo) => (
                  <div 
                    key={photo.id} 
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedImage(photo.url)}
                  >
                    <div className="aspect-square overflow-hidden rounded-lg">
                      <ImageWithFallback
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg flex items-end">
                      <div className="p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <p className="text-xs font-medium">{photo.title}</p>
                        <p className="text-xs opacity-80">{photo.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* School Events Album */}
        <TabsContent value="school" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Dokumentasi Kegiatan Pondok</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {schoolEvents.map((event) => (
                <div key={event.id} className="border rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="w-20 h-20 overflow-hidden rounded-lg flex-shrink-0">
                      <ImageWithFallback
                        src={event.thumbnail}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {event.photos} foto
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{event.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{event.date}</span>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-8 px-2">
                            <ImageIcon className="h-3 w-3 mr-1" />
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upcoming Events */}
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
                          <Button size="sm" className="w-full mt-3" variant="outline">
                            Ingatkan Saya
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* News Articles */}
        <TabsContent value="news" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Berita Terbaru</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {newsArticles.map((article) => (
                <div key={article.id} className="border rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="w-20 h-20 overflow-hidden rounded-lg flex-shrink-0">
                      <ImageWithFallback
                        src={article.thumbnail}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm line-clamp-2">{article.title}</h4>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {article.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{article.date}</span>
                        <div className="flex gap-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Eye className="h-3 w-3" />
                            {article.views}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Heart className="h-3 w-3" />
                            {article.likes}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
          <div className="max-w-sm w-full">
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