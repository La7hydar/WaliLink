import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  MessageSquare, 
  Settings, 
  User,
  X
} from 'lucide-react';

interface ProfileActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onChat: () => void;
  onSettings: () => void;
  studentData: {
    name: string;
    class: string;
    room: string;
    profilePhoto: string;
  };
}

export function ProfileActionMenu({ 
  isOpen, 
  onClose, 
  onChat, 
  onSettings, 
  studentData 
}: ProfileActionMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm mx-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Menu Aksi</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-emerald-700 rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Student Info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-white/20">
                <AvatarImage 
                  src={studentData.profilePhoto}
                  alt={studentData.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-emerald-700 text-white">
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium text-white">{studentData.name}</h4>
                <p className="text-sm text-emerald-100">{studentData.class}</p>
                <p className="text-xs text-emerald-200">{studentData.room}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 space-y-3">
            <Button
              onClick={onChat}
              className="w-full flex items-center justify-start gap-3 h-12 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
              variant="outline"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Chat & Komunikasi</p>
                <p className="text-xs text-muted-foreground">Hubungi wali, ustadz, atau admin</p>
              </div>
            </Button>

            <Button
              onClick={onSettings}
              className="w-full flex items-center justify-start gap-3 h-12 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
              variant="outline"
            >
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <Settings className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Pengaturan & Info</p>
                <p className="text-xs text-muted-foreground">Kelola profil dan preferensi</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}