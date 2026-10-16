import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Video, 
  File,
  Plus,
  Trash2,
  Eye,
  Calendar
} from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  title: string;
  description: string;
  date: string;
  category: string;
}

interface MediaUploadSectionProps {
  onUpload: (files: MediaFile[]) => void;
}

export function MediaUploadSection({ onUpload }: MediaUploadSectionProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);

  const categories = [
    'Kegiatan Harian',
    'Pembelajaran',
    'Olahraga',
    'Keagamaan',
    'Acara Khusus',
    'Lomba & Kompetisi',
    'Kunjungan',
    'Lainnya'
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) {
        alert('Hanya file gambar dan video yang diperbolehkan');
        return;
      }

      // Check file size (max 50MB for video, 10MB for image)
      const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`Ukuran file terlalu besar. Maksimal ${isVideo ? '50MB' : '10MB'}`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const newMedia: MediaFile = {
          id: Date.now().toString() + Math.random(),
          file,
          preview: event.target?.result as string,
          type: isImage ? 'image' : 'video',
          title: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          category: categories[0]
        };
        setMediaFiles(prev => [...prev, newMedia]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const updateMedia = (id: string, updates: Partial<MediaFile>) => {
    setMediaFiles(prev =>
      prev.map(media =>
        media.id === id ? { ...media, ...updates } : media
      )
    );
  };

  const removeMedia = (id: string) => {
    setMediaFiles(prev => prev.filter(media => media.id !== id));
    if (selectedFile?.id === id) {
      setSelectedFile(null);
    }
  };

  const handleImport = () => {
    // Validate that all files have titles
    const missingTitles = mediaFiles.some(media => !media.title.trim());
    if (missingTitles) {
      alert('Semua file harus memiliki judul');
      return;
    }

    onUpload(mediaFiles);
    setMediaFiles([]);
    setSelectedFile(null);
    alert(`Berhasil mengimpor ${mediaFiles.length} file ke database`);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload File
          </CardTitle>
          <CardDescription>
            Upload foto (JPG, PNG, maksimal 10MB) atau video (MP4, maksimal 50MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
            <input
              type="file"
              id="media-upload"
              className="hidden"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
            />
            <label htmlFor="media-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Klik untuk upload file</p>
                  <p className="text-sm text-muted-foreground">atau drag & drop file di sini</p>
                </div>
                <Button type="button" variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Pilih File
                </Button>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Preview & Details */}
      {mediaFiles.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>File yang Dipilih ({mediaFiles.length})</CardTitle>
                  <CardDescription>
                    Isi detail untuk setiap file sebelum diimpor ke database
                  </CardDescription>
                </div>
                <Button 
                  onClick={handleImport}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import ke Database ({mediaFiles.length})
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {mediaFiles.map((media) => (
                    <Card key={media.id} className="overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                        {/* Preview */}
                        <div className="space-y-2">
                          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                            {media.type === 'image' ? (
                              <img
                                src={media.preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <video
                                src={media.preview}
                                className="w-full h-full object-cover"
                                controls
                              />
                            )}
                            <Badge 
                              className="absolute top-2 left-2"
                              variant={media.type === 'image' ? 'default' : 'secondary'}
                            >
                              {media.type === 'image' ? (
                                <>
                                  <ImageIcon className="w-3 h-3 mr-1" />
                                  Foto
                                </>
                              ) : (
                                <>
                                  <Video className="w-3 h-3 mr-1" />
                                  Video
                                </>
                              )}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            <File className="w-3 h-3 inline mr-1" />
                            {media.file.name} • {(media.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>

                        {/* Details Form */}
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium">Judul *</label>
                            <Input
                              placeholder="Berikan judul untuk file ini"
                              value={media.title}
                              onChange={(e) => updateMedia(media.id, { title: e.target.value })}
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium">Deskripsi</label>
                            <Textarea
                              placeholder="Deskripsi atau keterangan tambahan (opsional)"
                              value={media.description}
                              onChange={(e) => updateMedia(media.id, { description: e.target.value })}
                              className="mt-1 h-20"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-sm font-medium">Tanggal</label>
                              <Input
                                type="date"
                                value={media.date}
                                onChange={(e) => updateMedia(media.id, { date: e.target.value })}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Kategori</label>
                              <select
                                value={media.category}
                                onChange={(e) => updateMedia(media.id, { category: e.target.value })}
                                className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                              >
                                {categories.map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeMedia(media.id)}
                            className="w-full mt-2"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Hapus File
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-800">
                    Siap untuk diimpor: {mediaFiles.length} file
                  </p>
                  <p className="text-sm text-green-700">
                    {mediaFiles.filter(m => m.type === 'image').length} foto, {' '}
                    {mediaFiles.filter(m => m.type === 'video').length} video
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (confirm('Hapus semua file yang belum diimpor?')) {
                        setMediaFiles([]);
                        setSelectedFile(null);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus Semua
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
