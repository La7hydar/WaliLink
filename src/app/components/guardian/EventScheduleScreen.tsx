import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { 
  ArrowLeft, 
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  BookOpen,
  Heart,
  Dumbbell,
  Music,
  Globe,
  Sparkles,
  Filter,
  List,
  Grid
} from 'lucide-react';

interface EventScheduleScreenProps {
  onBack: () => void;
}

export function EventScheduleScreen({ onBack }: EventScheduleScreenProps) {
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [viewMode, setViewMode] = useState<'poster' | 'table'>('poster');

  // Jadwal acara lengkap semester
  const events = [
    // Januari 2025
    {
      id: 1,
      title: 'Tahun Baru Islam 1447 H',
      date: '07 Jan 2025',
      time: '08:00 - 12:00',
      location: 'Aula Utama',
      category: 'religious',
      participants: 'Seluruh Santri',
      description: 'Peringatan Tahun Baru Islam dengan kajian dan doa bersama',
      month: 'jan',
      poster: 'https://images.unsplash.com/photo-1609101466601-b60143ee4274?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc2xhbWljJTIwZXZlbnQlMjBwb3N0ZXJ8ZW58MXx8fHwxNzY2NjM4MzYyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 2,
      title: 'Pemeriksaan Kesehatan Rutin',
      date: '12 Jan 2025',
      time: '09:00 - 15:00',
      location: 'Klinik Pondok',
      category: 'health',
      participants: 'Kelas 1-3',
      description: 'Pemeriksaan kesehatan berkala bekerjasama dengan Puskesmas',
      month: 'jan',
      poster: 'https://images.unsplash.com/photo-1613796446768-b7366aed3ac6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGglMjBjaGVja3xlbnwxfHx8fDE3NjY2MzgzNjR8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 3,
      title: 'Turnamen Futsal Antar Kelas',
      date: '20 Jan 2025',
      time: '14:00 - 17:00',
      location: 'Lapangan Olahraga',
      category: 'sports',
      participants: 'Seluruh Kelas',
      description: 'Kompetisi futsal untuk meningkatkan sportivitas dan kekompakan',
      month: 'jan',
      poster: 'https://images.unsplash.com/photo-1626721105368-a69248e93b32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjb21wZXRpdGlvbnxlbnwxfHx8fDE3NjY1NTgyMjR8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 4,
      title: 'Halaqah Bulanan',
      date: '25 Jan 2025',
      time: '19:30 - 21:00',
      location: 'Masjid Al-Ikhlas',
      category: 'religious',
      participants: 'Seluruh Santri',
      description: 'Kajian rutin bulanan dengan tema "Adab Menuntut Ilmu"',
      month: 'jan',
      poster: 'https://images.unsplash.com/photo-1609101466601-b60143ee4274?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc2xhbWljJTIwZXZlbnQlMjBwb3N0ZXJ8ZW58MXx8fHwxNzY2NjM4MzYyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    // Februari 2025
    {
      id: 5,
      title: 'Ujian Tengah Semester',
      date: '03-07 Feb 2025',
      time: '08:00 - 14:00',
      location: 'Ruang Kelas Masing-masing',
      category: 'academic',
      participants: 'Seluruh Santri',
      description: 'Ujian Tengah Semester untuk semua mata pelajaran',
      month: 'feb',
      poster: 'https://images.unsplash.com/photo-1763294905880-6caf7e585241?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMGV4YW1pbmF0aW9ufGVufDF8fHx8MTc2NjU0NzIyMnww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 6,
      title: 'Workshop Kaligrafi Arab',
      date: '15 Feb 2025',
      time: '13:00 - 16:00',
      location: 'Ruang Seni',
      category: 'art',
      participants: 'Peserta Terpilih (40 santri)',
      description: 'Pelatihan menulis kaligrafi dengan ustadz tamu dari Jakarta',
      month: 'feb',
      poster: 'https://images.unsplash.com/photo-1526389157-6a5cc2bb4afa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NjY1ODA5ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 7,
      title: 'Donor Darah',
      date: '18 Feb 2025',
      time: '08:00 - 12:00',
      location: 'Aula Utama',
      category: 'social',
      participants: 'Santri Usia 17+',
      description: 'Kegiatan donor darah kerjasama dengan PMI',
      month: 'feb',
      poster: 'https://images.unsplash.com/photo-1761666507437-9fb5a6ef7b0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBjaGFyaXR5fGVufDF8fHx8MTc2NjYzODM2NHww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 8,
      title: 'Peringatan Isra Miraj',
      date: '27 Feb 2025',
      time: '19:00 - 22:00',
      location: 'Masjid Al-Ikhlas',
      category: 'religious',
      participants: 'Seluruh Santri & Guru',
      description: 'Peringatan Isra Miraj dengan ceramah dan sholawat',
      month: 'feb',
      poster: 'https://images.unsplash.com/photo-1609101466601-b60143ee4274?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc2xhbWljJTIwZXZlbnQlMjBwb3N0ZXJ8ZW58MXx8fHwxNzY2NjM4MzYyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    // Maret 2025
    {
      id: 9,
      title: 'Ramadan Preparation Program',
      date: '01 Mar 2025',
      time: '15:00 - 17:00',
      location: 'Aula Utama',
      category: 'religious',
      participants: 'Seluruh Santri',
      description: 'Sosialisasi persiapan menyambut Ramadan',
      month: 'mar',
      poster: 'https://images.unsplash.com/photo-1609101466601-b60143ee4274?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc2xhbWljJTIwZXZlbnQlMjBwb3N0ZXJ8ZW58MXx8fHwxNzY2NjM4MzYyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 10,
      title: 'Lomba Pidato 3 Bahasa',
      date: '08 Mar 2025',
      time: '09:00 - 15:00',
      location: 'Auditorium',
      category: 'competition',
      participants: 'Perwakilan Kelas',
      description: 'Lomba pidato dalam bahasa Indonesia, Arab, dan Inggris',
      month: 'mar',
      poster: 'https://images.unsplash.com/photo-1763294905880-6caf7e585241?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMGV4YW1pbmF0aW9ufGVufDF8fHx8MTc2NjU0NzIyMnww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 11,
      title: 'Kunjungan ke Panti Asuhan',
      date: '15 Mar 2025',
      time: '08:00 - 14:00',
      location: 'Panti Asuhan Al-Amin',
      category: 'social',
      participants: 'Kelas 3 (30 santri)',
      description: 'Kegiatan sosial berbagi dengan anak-anak panti asuhan',
      month: 'mar',
      poster: 'https://images.unsplash.com/photo-1761666507437-9fb5a6ef7b0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBjaGFyaXR5fGVufDF8fHx8MTc2NjYzODM2NHww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 12,
      title: 'Mulai Ramadan 1446 H',
      date: '30 Mar 2025',
      time: 'Sepanjang Hari',
      location: 'Seluruh Area Pondok',
      category: 'religious',
      participants: 'Seluruh Santri',
      description: 'Dimulainya bulan suci Ramadan dengan tadarus dan ibadah',
      month: 'mar',
      poster: 'https://images.unsplash.com/photo-1609101466601-b60143ee4274?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc2xhbWljJTIwZXZlbnQlMjBwb3N0ZXJ8ZW58MXx8fHwxNzY2NjM4MzYyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    // April 2025
    {
      id: 13,
      title: 'Pesantren Kilat Ramadan',
      date: '01-25 Apr 2025',
      time: 'Setelah Tarawih',
      location: 'Masjid Al-Ikhlas',
      category: 'religious',
      participants: 'Seluruh Santri',
      description: 'Kajian dan tadarus intensif selama bulan Ramadan',
      month: 'apr',
      poster: 'https://images.unsplash.com/photo-1609101466601-b60143ee4274?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc2xhbWljJTIwZXZlbnQlMjBwb3N0ZXJ8ZW58MXx8fHwxNzY2NjM4MzYyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 14,
      title: 'Nuzulul Quran',
      date: '17 Apr 2025',
      time: '20:00 - 23:00',
      location: 'Masjid Al-Ikhlas',
      category: 'religious',
      participants: 'Seluruh Santri & Guru',
      description: 'Peringatan turunnya Al-Quran dengan khataman',
      month: 'apr',
      poster: 'https://images.unsplash.com/photo-1609101466601-b60143ee4274?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc2xhbWljJTIwZXZlbnQlMjBwb3N0ZXJ8ZW58MXx8fHwxNzY2NjM4MzYyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 15,
      title: 'Buka Puasa Bersama Wali Santri',
      date: '20 Apr 2025',
      time: '17:00 - 19:00',
      location: 'Aula Utama',
      category: 'social',
      participants: 'Santri & Wali',
      description: 'Silaturahmi dengan wali santri sambil berbuka puasa',
      month: 'apr',
      poster: 'https://images.unsplash.com/photo-1761666507437-9fb5a6ef7b0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBjaGFyaXR5fGVufDF8fHx8MTc2NjYzODM2NHww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 16,
      title: 'Idul Fitri 1446 H',
      date: '30 Apr 2025',
      time: '06:00 - 12:00',
      location: 'Lapangan Pondok',
      category: 'religious',
      participants: 'Seluruh Santri & Keluarga',
      description: 'Sholat Idul Fitri dan halal bihalal',
      month: 'apr',
      poster: 'https://images.unsplash.com/photo-1609101466601-b60143ee4274?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc2xhbWljJTIwZXZlbnQlMjBwb3N0ZXJ8ZW58MXx8fHwxNzY2NjM4MzYyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    // Mei 2025
    {
      id: 17,
      title: 'Libur Idul Fitri',
      date: '01-10 Mei 2025',
      time: 'Sepanjang Hari',
      location: '-',
      category: 'holiday',
      participants: 'Seluruh Santri',
      description: 'Libur Idul Fitri, santri kembali ke keluarga',
      month: 'may',
      poster: 'https://images.unsplash.com/photo-1609101466601-b60143ee4274?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc2xhbWljJTIwZXZlbnQlMjBwb3N0ZXJ8ZW58MXx8fHwxNzY2NjM4MzYyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 18,
      title: 'Kembali Masuk Pondok',
      date: '11 Mei 2025',
      time: '08:00 - 17:00',
      location: 'Pondok Pesantren',
      category: 'academic',
      participants: 'Seluruh Santri',
      description: 'Santri kembali ke pondok setelah libur',
      month: 'may',
      poster: 'https://images.unsplash.com/photo-1763294905880-6caf7e585241?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMGV4YW1pbmF0aW9ufGVufDF8fHx8MTc2NjU0NzIyMnww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 19,
      title: 'Study Tour ke Museum',
      date: '18 Mei 2025',
      time: '07:00 - 16:00',
      location: 'Museum Nasional Jakarta',
      category: 'educational',
      participants: 'Kelas 2 (50 santri)',
      description: 'Kunjungan edukatif ke museum untuk pembelajaran sejarah',
      month: 'may',
      poster: 'https://images.unsplash.com/photo-1763294905880-6caf7e585241?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMGV4YW1pbmF0aW9ufGVufDF8fHx8MTc2NjU0NzIyMnww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 20,
      title: 'Festival Seni & Budaya',
      date: '25 Mei 2025',
      time: '09:00 - 16:00',
      location: 'Lapangan Pondok',
      category: 'art',
      participants: 'Seluruh Santri',
      description: 'Pameran dan pentas seni hasil karya santri',
      month: 'may',
      poster: 'https://images.unsplash.com/photo-1526389157-6a5cc2bb4afa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NjY1ODA5ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    // Juni 2025
    {
      id: 21,
      title: 'Persiapan Ujian Akhir Semester',
      date: '02-06 Jun 2025',
      time: '19:00 - 21:00',
      location: 'Ruang Kelas',
      category: 'academic',
      participants: 'Seluruh Santri',
      description: 'Bimbingan belajar intensif jelang UAS',
      month: 'jun',
      poster: 'https://images.unsplash.com/photo-1763294905880-6caf7e585241?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMGV4YW1pbmF0aW9ufGVufDF8fHx8MTc2NjU0NzIyMnww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 22,
      title: 'Ujian Akhir Semester',
      date: '09-13 Jun 2025',
      time: '08:00 - 14:00',
      location: 'Ruang Kelas Masing-masing',
      category: 'academic',
      participants: 'Seluruh Santri',
      description: 'Ujian Akhir Semester untuk semua mata pelajaran',
      month: 'jun',
      poster: 'https://images.unsplash.com/photo-1763294905880-6caf7e585241?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMGV4YW1pbmF0aW9ufGVufDF8fHx8MTc2NjU0NzIyMnww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 23,
      title: 'Khataman Al-Quran Akhir Semester',
      date: '20 Jun 2025',
      time: '14:00 - 17:00',
      location: 'Masjid Al-Ikhlas',
      category: 'religious',
      participants: 'Seluruh Santri',
      description: 'Khataman Al-Quran sebagai penutup semester',
      month: 'jun',
      poster: 'https://images.unsplash.com/photo-1609101466601-b60143ee4274?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc2xhbWljJTIwZXZlbnQlMjBwb3N0ZXJ8ZW58MXx8fHwxNzY2NjM4MzYyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 24,
      title: 'Pembagian Rapor',
      date: '25 Jun 2025',
      time: '09:00 - 12:00',
      location: 'Aula Utama',
      category: 'academic',
      participants: 'Santri & Wali',
      description: 'Pembagian rapor dan rapat wali santri',
      month: 'jun',
      poster: 'https://images.unsplash.com/photo-1763294905880-6caf7e585241?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMGV4YW1pbmF0aW9ufGVufDF8fHx8MTc2NjU0NzIyMnww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 25,
      title: 'Libur Semester',
      date: '26 Jun - 15 Jul 2025',
      time: 'Sepanjang Hari',
      location: '-',
      category: 'holiday',
      participants: 'Seluruh Santri',
      description: 'Libur semester genap, santri kembali ke keluarga',
      month: 'jun',
      poster: 'https://images.unsplash.com/photo-1609101466601-b60143ee4274?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc2xhbWljJTIwZXZlbnQlMjBwb3N0ZXJ8ZW58MXx8fHwxNzY2NjM4MzYyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  const categories = [
    { id: 'religious', label: 'Keagamaan', icon: BookOpen, color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
    { id: 'academic', label: 'Akademik', icon: Award, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
    { id: 'sports', label: 'Olahraga', icon: Dumbbell, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' },
    { id: 'art', label: 'Seni', icon: Music, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
    { id: 'social', label: 'Sosial', icon: Heart, color: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300' },
    { id: 'health', label: 'Kesehatan', icon: Users, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300' },
    { id: 'competition', label: 'Lomba', icon: Award, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
    { id: 'educational', label: 'Edukatif', icon: Globe, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' },
    { id: 'holiday', label: 'Libur', icon: Sparkles, color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' }
  ];

  const getCategoryData = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  const filteredEvents = selectedMonth === 'all' 
    ? events 
    : events.filter(e => e.month === selectedMonth);

  const months = [
    { id: 'all', label: 'Semua' },
    { id: 'jan', label: 'Januari' },
    { id: 'feb', label: 'Februari' },
    { id: 'mar', label: 'Maret' },
    { id: 'apr', label: 'April' },
    { id: 'may', label: 'Mei' },
    { id: 'jun', label: 'Juni' }
  ];

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b p-4 safe-area-top">
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Jadwal Acara Semester
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Januari - Juni 2025 (Semester Genap)
            </p>
          </div>
          <div className="flex border rounded-lg p-1">
            <Button
              variant={viewMode === 'poster' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('poster')}
              className="h-8 px-3"
            >
              <Grid className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Poster</span>
            </Button>
            <Button
              variant={viewMode === 'table' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="h-8 px-3"
            >
              <List className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Tabel</span>
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-green-600">{events.filter(e => e.category === 'religious').length}</p>
              <p className="text-xs text-muted-foreground">Keagamaan</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-blue-600">{events.filter(e => e.category === 'academic').length}</p>
              <p className="text-xs text-muted-foreground">Akademik</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold">{events.length}</p>
              <p className="text-xs text-muted-foreground">Total Acara</p>
            </CardContent>
          </Card>
        </div>

        {/* Month Filter - Horizontal Scroll */}
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2 pb-2">
            {months.map((month) => (
              <Button
                key={month.id}
                variant={selectedMonth === month.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMonth(month.id)}
                className="flex-shrink-0"
              >
                {month.label}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Content */}
      <ScrollArea className="h-full">
        <div className="p-4 pb-20 space-y-3">
          {/* Poster View - Horizontal Scroll */}
          {viewMode === 'poster' && (
            <div>
              <ScrollArea className="w-full whitespace-nowrap pb-4">
                <div className="flex gap-4">
                  {filteredEvents.map((event) => {
                    const categoryData = getCategoryData(event.category);
                    const Icon = categoryData.icon;
                    
                    return (
                      <div key={event.id} className="inline-block w-64 flex-shrink-0">
                        <Card className="overflow-hidden h-full">
                          {/* Poster Image */}
                          <div className="relative h-80 overflow-hidden">
                            <ImageWithFallback
                              src={event.poster}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                            
                            {/* Category Badge on Top */}
                            <div className="absolute top-3 left-3">
                              <Badge className={`${categoryData.color} backdrop-blur-sm`}>
                                <Icon className="w-3 h-3 mr-1" />
                                {categoryData.label}
                              </Badge>
                            </div>
                            
                            {/* Event Details on Bottom */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                              <h3 className="text-base font-semibold mb-2 line-clamp-2">
                                {event.title}
                              </h3>
                              <div className="flex items-center gap-2 text-sm mb-1">
                                <Calendar className="w-3 h-3" />
                                <span className="text-xs">{event.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs">{event.time}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Additional Info */}
                          <CardContent className="p-3">
                            <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="line-clamp-1">{event.location}</span>
                            </div>
                            <p className="text-xs line-clamp-2">{event.description}</p>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <>
              {filteredEvents.map((event) => {
                const categoryData = getCategoryData(event.category);
                const Icon = categoryData.icon;
                
                return (
                  <Card key={event.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={categoryData.color}>
                              <Icon className="w-3 h-3 mr-1" />
                              {categoryData.label}
                            </Badge>
                          </div>
                          <CardTitle className="text-base mb-1">{event.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{event.participants}</span>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-sm text-blue-900 dark:text-blue-100">
                          {event.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </>
          )}

          {filteredEvents.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Tidak ada acara di bulan ini
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}