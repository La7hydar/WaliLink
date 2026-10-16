import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, Calendar, Receipt, Download, Eye } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface SPPDetailScreenProps {
  onBack: () => void;
  semester: 'current' | 'previous';
  onSemesterChange: (semester: 'current' | 'previous') => void;
}

export function SPPDetailScreen({ onBack, semester, onSemesterChange }: SPPDetailScreenProps) {
  const currentSemesterData = [
    { no: 1, keterangan: 'SPP Januari 2025', jumlahSPP: 500000, jumlahDibayar: 500000, sisaTagihan: 0, status: 'paid', tanggalBayar: '15 Jan 2025' },
    { no: 2, keterangan: 'SPP Februari 2025', jumlahSPP: 500000, jumlahDibayar: 0, sisaTagihan: 500000, status: 'pending', jatuhTempo: '10 Feb 2025' },
    { no: 3, keterangan: 'SPP Maret 2025', jumlahSPP: 500000, jumlahDibayar: 0, sisaTagihan: 500000, status: 'pending', jatuhTempo: '10 Mar 2025' },
    { no: 4, keterangan: 'SPP April 2025', jumlahSPP: 500000, jumlahDibayar: 0, sisaTagihan: 500000, status: 'pending', jatuhTempo: '10 Apr 2025' },
    { no: 5, keterangan: 'SPP Mei 2025', jumlahSPP: 500000, jumlahDibayar: 0, sisaTagihan: 500000, status: 'pending', jatuhTempo: '10 Mei 2025' },
    { no: 6, keterangan: 'SPP Juni 2025', jumlahSPP: 500000, jumlahDibayar: 0, sisaTagihan: 500000, status: 'pending', jatuhTempo: '10 Jun 2025' },
  ];

  const previousSemesterData = [
    { no: 1, keterangan: 'SPP Juli 2024', jumlahSPP: 450000, jumlahDibayar: 450000, sisaTagihan: 0, status: 'paid', tanggalBayar: '12 Jul 2024' },
    { no: 2, keterangan: 'SPP Agustus 2024', jumlahSPP: 450000, jumlahDibayar: 450000, sisaTagihan: 0, status: 'paid', tanggalBayar: '15 Agu 2024' },
    { no: 3, keterangan: 'SPP September 2024', jumlahSPP: 450000, jumlahDibayar: 450000, sisaTagihan: 0, status: 'paid', tanggalBayar: '10 Sep 2024' },
    { no: 4, keterangan: 'SPP Oktober 2024', jumlahSPP: 450000, jumlahDibayar: 450000, sisaTagihan: 0, status: 'paid', tanggalBayar: '8 Okt 2024' },
    { no: 5, keterangan: 'SPP November 2024', jumlahSPP: 450000, jumlahDibayar: 450000, sisaTagihan: 0, status: 'paid', tanggalBayar: '10 Nov 2024' },
    { no: 6, keterangan: 'SPP Desember 2024', jumlahSPP: 450000, jumlahDibayar: 450000, sisaTagihan: 0, status: 'paid', tanggalBayar: '15 Des 2024' },
  ];

  const data = semester === 'current' ? currentSemesterData : previousSemesterData;
  const totalSPP = data.reduce((sum, item) => sum + item.jumlahSPP, 0);
  const totalDibayar = data.reduce((sum, item) => sum + item.jumlahDibayar, 0);
  const totalSisa = data.reduce((sum, item) => sum + item.sisaTagihan, 0);

  return (
    <div className="size-full bg-background safe-area-top safe-area-bottom">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Detail SPP</h1>
            <p className="text-sm text-muted-foreground">
              {semester === 'current' ? 'Semester Ganjil 2024/2025' : 'Semester Genap 2023/2024'}
            </p>
          </div>
        </div>

        {/* Semester Toggle */}
        <div className="flex space-x-2">
          <Button
            variant={semester === 'current' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSemesterChange('current')}
            className="flex-1"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Semester Ini
          </Button>
          <Button
            variant={semester === 'previous' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSemesterChange('previous')}
            className="flex-1"
          >
            <Receipt className="w-4 h-4 mr-2" />
            Semester Sebelumnya
          </Button>
        </div>

        {/* Summary Card */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Ringkasan SPP</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total SPP</p>
                <p className="font-semibold text-sm">Rp {totalSPP.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Sudah Dibayar</p>
                <p className="font-semibold text-sm text-green-600">Rp {totalDibayar.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Sisa Tagihan</p>
                <p className="font-semibold text-sm text-red-600">Rp {totalSisa.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SPP Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Detail Pembayaran SPP</CardTitle>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {data.map((item) => (
                  <div key={item.no} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                          {item.no}
                        </span>
                        <span className="font-medium text-sm">{item.keterangan}</span>
                      </div>
                      <Badge variant={item.status === 'paid' ? 'default' : 'destructive'}>
                        {item.status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-muted-foreground mb-1">Jumlah SPP</p>
                        <p className="font-medium">Rp {item.jumlahSPP.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Sudah Dibayar</p>
                        <p className="font-medium text-green-600">Rp {item.jumlahDibayar.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Sisa Tagihan</p>
                        <p className="font-medium text-red-600">Rp {item.sisaTagihan.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">
                          {item.status === 'paid' ? 'Tanggal Bayar' : 'Jatuh Tempo'}
                        </p>
                        <p className="font-medium">
                          {item.status === 'paid' ? item.tanggalBayar : item.jatuhTempo}
                        </p>
                      </div>
                    </div>

                    {item.status === 'pending' && (
                      <div className="mt-3 pt-3 border-t">
                        <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">
                          Bayar Sekarang
                        </Button>
                      </div>
                    )}

                    {item.status === 'paid' && (
                      <div className="mt-3 pt-3 border-t">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          Lihat Bukti Bayar
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Total Summary */}
        <Card className="bg-gray-50 dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Keseluruhan</p>
                <p className="font-bold">Rp {totalSPP.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Dibayar</p>
                <p className="font-bold text-green-600">Rp {totalDibayar.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Sisa</p>
                <p className="font-bold text-red-600">Rp {totalSisa.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}