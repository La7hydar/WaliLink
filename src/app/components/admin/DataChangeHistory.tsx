import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  History,
  Search,
  Filter,
  User,
  Calendar,
  Clock,
  Edit,
  Trash2,
  Plus,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';

interface DataChangeHistoryProps {
  onBack?: () => void;
}

interface ChangeRecord {
  id: string;
  timestamp: string;
  date: string;
  time: string;
  adminName: string;
  adminSection: string;
  action: 'create' | 'edit' | 'delete';
  tableName: string;
  recordName: string;
  changes: {
    field: string;
    oldValue?: string;
    newValue?: string;
  }[];
}

export function DataChangeHistory({ onBack }: DataChangeHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterTable, setFilterTable] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<ChangeRecord | null>(null);

  // Sample change history data
  const changeHistory: ChangeRecord[] = [
    {
      id: '1',
      timestamp: '2026-02-10 14:35:22',
      date: '10 Feb 2026',
      time: '14:35',
      adminName: 'Ahmad Fauzi',
      adminSection: 'Admin Keuangan',
      action: 'edit',
      tableName: 'Pembayaran',
      recordName: 'Ahnaf Haidar - ID Card',
      changes: [
        { field: 'ID Card', oldValue: '**** 1234', newValue: '**** 3456' },
        { field: 'Status', oldValue: 'Inactive', newValue: 'Active' }
      ]
    },
    {
      id: '2',
      timestamp: '2026-02-10 13:20:15',
      date: '10 Feb 2026',
      time: '13:20',
      adminName: 'Siti Nurhaliza',
      adminSection: 'Admin Kedisiplinan',
      action: 'create',
      tableName: 'Kedisiplinan',
      recordName: 'Raihan Firdaus - Pelanggaran Ringan',
      changes: [
        { field: 'Jenis Pelanggaran', newValue: 'Ringan' },
        { field: 'Detail', newValue: 'Terlambat sholat berjamaah' },
        { field: 'Poin', newValue: '5' }
      ]
    },
    {
      id: '3',
      timestamp: '2026-02-10 11:15:40',
      date: '10 Feb 2026',
      time: '11:15',
      adminName: 'Muhammad Ridwan',
      adminSection: 'Admin Prestasi',
      action: 'edit',
      tableName: 'Prestasi',
      recordName: 'Zidny Huda Qonita - Nilai UTS',
      changes: [
        { field: 'Nilai Bahasa Arab', oldValue: '85', newValue: '90' },
        { field: 'Nilai Fiqih', oldValue: '88', newValue: '92' }
      ]
    },
    {
      id: '4',
      timestamp: '2026-02-10 09:45:30',
      date: '10 Feb 2026',
      time: '09:45',
      adminName: 'Fatimah Zahra',
      adminSection: 'Admin Absensi',
      action: 'create',
      tableName: 'Absensi',
      recordName: 'Ahnaf Haidar - Sholat Subuh',
      changes: [
        { field: 'Status', newValue: 'Hadir' },
        { field: 'Kegiatan', newValue: 'Sholat Subuh' },
        { field: 'Waktu', newValue: '04:30 WIB' }
      ]
    },
    {
      id: '5',
      timestamp: '2026-02-09 16:20:10',
      date: '9 Feb 2026',
      time: '16:20',
      adminName: 'Ahmad Fauzi',
      adminSection: 'Admin Keuangan',
      action: 'edit',
      tableName: 'Pembayaran',
      recordName: 'Raihan Firdaus - PIN',
      changes: [
        { field: 'PIN', oldValue: '****', newValue: '****' },
        { field: 'Status', oldValue: 'Pending', newValue: 'Verified' }
      ]
    },
    {
      id: '6',
      timestamp: '2026-02-09 14:10:25',
      date: '9 Feb 2026',
      time: '14:10',
      adminName: 'Admin Utama',
      adminSection: 'Super Admin',
      action: 'delete',
      tableName: 'Album',
      recordName: 'Foto Kegiatan Lama - 2025',
      changes: [
        { field: 'Status', oldValue: 'Active', newValue: 'Deleted' }
      ]
    },
    {
      id: '7',
      timestamp: '2026-02-09 10:30:15',
      date: '9 Feb 2026',
      time: '10:30',
      adminName: 'Siti Nurhaliza',
      adminSection: 'Admin Kedisiplinan',
      action: 'edit',
      tableName: 'Kedisiplinan',
      recordName: 'Ahnaf Haidar - Poin Pelanggaran',
      changes: [
        { field: 'Total Poin', oldValue: '15', newValue: '10' },
        { field: 'Catatan', oldValue: '', newValue: 'Pengurangan poin karena perbaikan' }
      ]
    }
  ];

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'create':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Tambah</Badge>;
      case 'edit':
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Edit</Badge>;
      case 'delete':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">Hapus</Badge>;
      default:
        return <Badge variant="secondary">{action}</Badge>;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <Plus className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'edit':
        return <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return <RefreshCw className="h-4 w-4" />;
    }
  };

  const filteredHistory = changeHistory.filter(record => {
    const matchesSearch = 
      record.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.recordName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.tableName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = filterAction === 'all' || record.action === filterAction;
    const matchesTable = filterTable === 'all' || record.tableName === filterTable;

    return matchesSearch && matchesAction && matchesTable;
  });

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b p-4">
        <div className="flex items-center gap-3 mb-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex-1">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <History className="h-5 w-5" />
              Riwayat Perubahan Data
            </h2>
            <p className="text-sm text-muted-foreground">
              Log aktivitas perubahan data oleh admin
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari admin, tabel, atau data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Aksi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Aksi</SelectItem>
                <SelectItem value="create">Tambah</SelectItem>
                <SelectItem value="edit">Edit</SelectItem>
                <SelectItem value="delete">Hapus</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterTable} onValueChange={setFilterTable}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Tabel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tabel</SelectItem>
                <SelectItem value="Pembayaran">Pembayaran</SelectItem>
                <SelectItem value="Kedisiplinan">Kedisiplinan</SelectItem>
                <SelectItem value="Prestasi">Prestasi</SelectItem>
                <SelectItem value="Absensi">Absensi</SelectItem>
                <SelectItem value="Album">Album</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-auto">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            {filteredHistory.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <History className="h-12 w-12 text-muted-foreground opacity-50 mb-3" />
                  <p className="text-sm text-muted-foreground">Tidak ada riwayat yang cocok</p>
                </CardContent>
              </Card>
            ) : (
              filteredHistory.map((record) => (
                <Card 
                  key={record.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedRecord(record)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Action Icon */}
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                        {getActionIcon(record.action)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{record.recordName}</h4>
                            <p className="text-xs text-muted-foreground">{record.tableName}</p>
                          </div>
                          {getActionBadge(record.action)}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{record.adminName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{record.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{record.time}</span>
                          </div>
                        </div>

                        {/* Change Summary */}
                        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                          <span className="text-muted-foreground">
                            {record.changes.length} perubahan field
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedRecord(null)}
        >
          <Card 
            className="max-w-lg w-full max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base">Detail Perubahan</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{selectedRecord.recordName}</p>
                </div>
                {getActionBadge(selectedRecord.action)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Admin Info */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Admin</p>
                <p className="font-medium text-sm">{selectedRecord.adminName}</p>
                <p className="text-xs text-muted-foreground">{selectedRecord.adminSection}</p>
              </div>

              {/* Time Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Tanggal</p>
                  <p className="font-medium text-sm">{selectedRecord.date}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Waktu</p>
                  <p className="font-medium text-sm">{selectedRecord.time}</p>
                </div>
              </div>

              {/* Changes */}
              <div>
                <p className="text-sm font-medium mb-2">Perubahan Data</p>
                <div className="space-y-2">
                  {selectedRecord.changes.map((change, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground mb-2">{change.field}</p>
                      {change.oldValue && (
                        <div className="mb-1">
                          <p className="text-xs text-red-600 dark:text-red-400">
                            <span className="opacity-70">Sebelum:</span> {change.oldValue}
                          </p>
                        </div>
                      )}
                      {change.newValue && (
                        <div>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            <span className="opacity-70">Sesudah:</span> {change.newValue}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setSelectedRecord(null)}
              >
                Tutup
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
