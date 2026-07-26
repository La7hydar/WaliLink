import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  ArrowLeft,
  MessageSquare, 
  User,
  Users,
  GraduationCap,
  Shield,
  Phone,
  Send,
  Search,
  Clock,
  CheckCircle2
} from 'lucide-react';

interface ChatSectionProps {
  studentData: {
    name: string;
    class: string;
    room: string;
    guardian: string;
  };
}

export function ChatSection({ studentData }: ChatSectionProps) {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const contacts = [
    {
      id: 'wali',
      name: studentData.guardian,
      role: 'Wali Santri',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
      status: 'online',
      lastSeen: 'Aktif sekarang',
      icon: User,
      color: 'bg-blue-500'
    },
    {
      id: 'admin',
      name: 'Admin Pondok',
      role: 'Administrasi',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
      status: 'online',
      lastSeen: '5 menit lalu',
      icon: Shield,
      color: 'bg-emerald-500'
    },
    {
      id: 'ustadz',
      name: 'Ustadz Ahmad',
      role: 'Wali Kelas',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
      status: 'away',
      lastSeen: '1 jam lalu',
      icon: GraduationCap,
      color: 'bg-orange-500'
    },
    {
      id: 'asrama',
      name: 'Pengurus Asrama',
      role: 'Asrama Al-Hikmah',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
      status: 'offline',
      lastSeen: '3 jam lalu',
      icon: Users,
      color: 'bg-purple-500'
    }
  ];

  const recentChats = [
    {
      contact: 'wali',
      message: 'Assalamualaikum, bagaimana kabar hari ini?',
      time: '10:30',
      unread: 2
    },
    {
      contact: 'admin',
      message: 'Pembayaran SPP bulan ini sudah diterima',
      time: '09:15',
      unread: 0
    },
    {
      contact: 'ustadz',
      message: 'Jangan lupa bawa buku tahfidz besok',
      time: 'Kemarin',
      unread: 1
    }
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (message.trim() && selectedContact) {
      // Handle send message logic here
      alert(`Pesan dikirim ke ${contacts.find(c => c.id === selectedContact)?.name}: "${message}"`);
      setMessage('');
    }
  };

  return (
    <div className="h-full bg-gray-50">
      {/* Content Area */}

      <div className="flex-1">
        {!selectedContact ? (
          // Contact List View
          <div className="p-4">
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari kontak..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Recent Chats */}
            {recentChats.length > 0 && (
              <Card className="mb-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Chat Terbaru</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {recentChats.map((chat) => {
                    const contact = contacts.find(c => c.id === chat.contact);
                    if (!contact) return null;
                    
                    return (
                      <Button
                        key={chat.contact}
                        variant="ghost"
                        className="w-full p-3 h-auto justify-start"
                        onClick={() => setSelectedContact(chat.contact)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={contact.avatar} alt={contact.name} />
                            <AvatarFallback>
                              <contact.icon className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 text-left">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm">{contact.name}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{chat.time}</span>
                                {chat.unread > 0 && (
                                  <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                    {chat.unread}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{chat.message}</p>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* All Contacts */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Semua Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {filteredContacts.map((contact) => {
                  const Icon = contact.icon;
                  return (
                    <Button
                      key={contact.id}
                      variant="ghost"
                      className="w-full p-3 h-auto justify-start"
                      onClick={() => setSelectedContact(contact.id)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={contact.avatar} alt={contact.name} />
                            <AvatarFallback className={contact.color}>
                              <Icon className="h-4 w-4 text-white" />
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            contact.status === 'online' ? 'bg-green-500' :
                            contact.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}></div>
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">{contact.name}</p>
                          <p className="text-xs text-muted-foreground">{contact.role}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {contact.lastSeen}
                          </p>
                        </div>
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        ) : (
          // Chat View
          <div className="h-full flex flex-col">
            {/* Chat Header */}
            <div className="bg-white border-b p-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedContact(null)}
                  className="p-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                {(() => {
                  const contact = contacts.find(c => c.id === selectedContact);
                  if (!contact) return null;
                  const Icon = contact.icon;
                  return (
                    <>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                        <AvatarFallback className={contact.color}>
                          <Icon className="h-4 w-4 text-white" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            contact.status === 'online' ? 'bg-green-500' :
                            contact.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}></div>
                          {contact.lastSeen}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 bg-gray-50">
              <div className="text-center text-muted-foreground text-sm py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Mulai percakapan dengan {contacts.find(c => c.id === selectedContact)?.name}</p>
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white border-t p-4">
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Ketik pesan..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}