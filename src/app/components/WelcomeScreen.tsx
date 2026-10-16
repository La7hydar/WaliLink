import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BookOpen, WifiOff } from 'lucide-react';
import { OfflineModeIndicator } from './OfflineModeIndicator';
import belajarKomputer from './Images/belajar_komputer.png';
import kegiatanPramuka from './Images/kegiatan_pramuka.png';
import pensi from './Images/pensi.png';
import ujianLisan from './Images/ujian_lisan.png';

// @ts-ignore
import logoIcon from './Images/icon.png';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null); 

  const images = [
    {
      url: belajarKomputer,
      title: 'Belajar Komputer'
    },
    {
      url: kegiatanPramuka,
      title: 'Kegiatan Pramuka'
    },
    {
      url: pensi,
      title: 'Pentas Seni'
    },
    {
      url: ujianLisan,
      title: 'Ujian Lisan'
    }
  ];

  // Efek Auto-slide otomatis tiap 3 detik
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentImageIndex + 1) % images.length;
      setCurrentImageIndex(nextIndex);

      if (scrollRef.current) {
        const container = scrollRef.current;
        container.scrollTo({
          left: nextIndex * container.clientWidth,
          behavior: 'smooth'
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentImageIndex, images.length]);
  // Efek deteksi jika user menggeser manual dengan tangan/mouse
  const handleScroll = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const slideWidth = container.clientWidth;
      const newIndex = Math.round(container.scrollLeft / slideWidth);
      if (newIndex !== currentImageIndex && newIndex >= 0 && newIndex < images.length) {
        setCurrentImageIndex(newIndex);
      }
    }
  };
  

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-emerald-50 to-emerald-100 overflow-hidden">
      {/* Status Bar Space — respects device notch/status bar */}
      <div
        className="flex items-center justify-center"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)', minHeight: 'calc(env(safe-area-inset-top, 0px) + 1.5rem)' }}
      >
        <OfflineModeIndicator variant="badge" />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6">
        {/* Logo and Title */}
        <div className="text-center pt-12 pb-8">
          <div className="w-17 h-17 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <img 
              src={logoIcon} 
              alt="Icon" 
              className="h-15 w-15 object-contain rounded-2xl" 
            />
          </div>
          <h1 className="text-2xl font-bold text-emerald-900 mb-2">
            WaliLink
          </h1>
          <p className="text-emerald-600 text-sm">
            Pantau perkembangan putra-putri Anda di pondok pesantren
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-emerald-700">
            <WifiOff className="w-3 h-3" />
            <span>Mode Offline - Data Lokal</span>
          </div>
        </div>

        {/* Auto-sliding Images */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="relative w-full h-64 mb-6">
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg"
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <ImageWithFallback
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-medium text-sm">{image.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Image Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-emerald-600' : 'bg-emerald-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pb-8 space-y-3">
          <Button 
            onClick={onStart}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-semibold"
            size="lg"
          >
            Mulai Aplikasi
          </Button>
          
          <p className="text-xs text-emerald-600 text-center pt-2">
            Aplikasi berjalan offline. Semua data tersimpan di perangkat lokal.
          </p>
        </div>
      </div>
    </div>
  );
}