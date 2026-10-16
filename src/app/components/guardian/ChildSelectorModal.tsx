import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Check, 
  GraduationCap, 
  MapPin,
  Calendar,
  Users
} from 'lucide-react';

interface Child {
  id: string;
  stanbuk: string;
  name: string;
  class: string;
  room: string;
  photo?: string;
  birthDate: string;
  status: 'active' | 'graduated' | 'alumni';
}

interface ChildSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: Child[];
  currentChildId: string;
  onSelectChild: (childId: string) => void;
}

export function ChildSelectorModal({ 
  isOpen, 
  onClose, 
  children, 
  currentChildId, 
  onSelectChild 
}: ChildSelectorModalProps) {
  const [selectedId, setSelectedId] = useState(currentChildId);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Fungsi untuk menggeser kartu terpilih TEPAT KE TENGAH layar device secara dinamis
  const scrollToCenter = (childId: string) => {
    const container = scrollContainerRef.current;
    const card = cardRefs.current[childId];

    if (container && card) {
      const containerWidth = container.clientWidth;
      const cardLeft = card.offsetLeft;
      const cardWidth = card.offsetWidth;

      // Hitung posisi scroll presisi sesuai ukuran device
      const targetScroll = cardLeft - (containerWidth / 2) + (cardWidth / 2);

      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const handleSelect = (childId: string) => {
    setSelectedId(childId);
    onSelectChild(childId);
    scrollToCenter(childId);
  };

  // Auto geser ke tengah saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToCenter(selectedId);
      }, 150);
    }
  }, [isOpen, selectedId]);

  // Deteksi scroll: Kartu yang berada di tengah otomatis menjadi terpilih
  const handleScrollEnd = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerCenter = container.scrollLeft + (container.clientWidth / 2);
    let closestId = selectedId;
    let minDistance = Infinity;

    children.forEach((child) => {
      const card = cardRefs.current[child.id];
      if (card) {
        const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
        const distance = Math.abs(containerCenter - cardCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestId = child.id;
        }
      }
    });

    // Baru ubah pilihan jika memang berganti kartu
    if (closestId !== selectedId) {
      setSelectedId(closestId);
      onSelectChild(closestId);
      scrollToCenter(closestId); // Pas-kan posisinya persis di tengah
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Aktif</Badge>;
      case 'graduated':
        return <Badge className="bg-blue-500">Lulus</Badge>;
      case 'alumni':
        return <Badge variant="secondary">Alumni</Badge>;
      default:
        return null;
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Pilih Santri
          </DialogTitle>
          <DialogDescription>
            Pilih santri yang ingin Anda lihat data dan informasinya
          </DialogDescription>
        </DialogHeader>

        <div className="relative overflow-hidden py-4">
          {/* Container Scroll - Menggunakan onTouchEnd & onScrollEnd */}
          <div 
            ref={scrollContainerRef}
            onTouchEnd={handleScrollEnd}
            onMouseUp={handleScrollEnd}
            onScrollEnd={handleScrollEnd}
            className="overflow-x-auto scrollbar-hide pb-4 pt-12 pb-8 snap-x snap-mandatory scroll-smooth"
          >
            <div className="flex gap-4 px-[calc(50%-120px)] min-w-max">
              <AnimatePresence mode="popLayout">
                {children.map((child, index) => {
                  const isSelected = child.id === selectedId;
                  const isHovered = child.id === hoveredId;
                  const age = calculateAge(child.birthDate);

                  return (
                    <motion.div
                      key={child.id}
                      ref={(el) => (cardRefs.current[child.id] = el)}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: 1,
                        scale: isSelected ? 1.15 : isHovered ? 1.05 : 0.9,
                        rotateY: isSelected ? 0 : isHovered ? 5 : 0,
                        z: isSelected ? 50 : 0,
                      }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{
                        duration: 0.4,
                        ease: [0.34, 1.56, 0.64, 1],
                        scale: { type: 'spring', stiffness: 300, damping: 20 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-shrink-0 snap-center"
                      style={{
                        perspective: '1000px',
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-300 w-[240px] relative overflow-hidden ${
                          isSelected 
                            ? 'border-2 border-green-500 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-green-900/40 dark:via-emerald-900/30 dark:to-green-900/20 shadow-lg shadow-green-200/50 dark:shadow-green-900/30' 
                            : 'hover:border-gray-400 bg-white dark:bg-gray-800 border'
                        }`}
                        onClick={() => handleSelect(child.id)}
                        onMouseEnter={() => setHoveredId(child.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        {isSelected && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-emerald-400/10 to-transparent"
                            animate={{
                              opacity: [0.5, 0.8, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'easeInOut'
                            }}
                          />
                        )}

                        <CardContent className="p-5 relative z-10">
                          <div className="flex flex-col items-center gap-3">
                            <motion.div 
                              className="relative"
                              animate={{
                                rotate: isSelected ? [0, -5, 5, 0] : 0,
                              }}
                              transition={{
                                duration: 0.6,
                                ease: 'easeInOut'
                              }}
                            >
                              <Avatar className={`${isSelected ? 'w-24 h-24' : 'w-20 h-20'} transition-all duration-300 border-4 ${
                                isSelected 
                                  ? 'border-green-400 shadow-lg shadow-green-300/50' 
                                  : 'border-white/50'
                              }`}>
                                <AvatarImage src={child.photo} alt={child.name} className="object-cover" />
                                <AvatarFallback className={`text-white text-xl font-bold ${
                                  isSelected 
                                    ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-green-600' 
                                    : 'bg-gradient-to-br from-green-400 to-emerald-600'
                                }`}>
                                  {child.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              
                              <AnimatePresence>
                                {isSelected && (
                                  <motion.div 
                                    className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center border-3 border-white shadow-lg"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 180 }}
                                    transition={{
                                      type: 'spring',
                                      stiffness: 400,
                                      damping: 15
                                    }}
                                  >
                                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>

                            <div className="flex flex-col items-center gap-2 w-full">
                              <div className="text-center">
                                <motion.h3 
                                  className={`font-bold truncate mb-1 ${
                                    isSelected 
                                      ? 'text-base text-green-700 dark:text-green-300' 
                                      : 'text-sm text-gray-700 dark:text-gray-300'
                                  }`}
                                  animate={{
                                    scale: isSelected ? 1.05 : 1
                                  }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {child.name}
                                </motion.h3>
                                <p className="text-xs text-muted-foreground">
                                  Stanbuk: {child.stanbuk}
                                </p>
                              </div>
                              
                              <div className="flex justify-center">
                                {getStatusBadge(child.status)}
                              </div>

                              <div className="space-y-1.5 w-full mt-2">
                                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                                  <GraduationCap className="w-3.5 h-3.5" />
                                  <span>Kelas {child.class}</span>
                                </div>
                                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span>{child.room}</span>
                                </div>
                                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>{age} tahun</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {children.map((child) => (
              <motion.button
                key={child.id}
                className="focus:outline-none"
                onClick={() => handleSelect(child.id)}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className={`h-2 rounded-full transition-all ${
                    child.id === selectedId
                      ? 'bg-green-500 w-8'
                      : 'bg-gray-300 dark:bg-gray-600 w-2'
                  }`}
                  animate={{
                    width: child.id === selectedId ? 32 : 8,
                    backgroundColor: child.id === selectedId 
                      ? 'rgb(34, 197, 94)' 
                      : 'rgb(209, 213, 219)'
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
          </div>
        </div>

        {children.length === 0 && (
          <motion.div 
            className="text-center py-8 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Belum ada data santri terdaftar</p>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}