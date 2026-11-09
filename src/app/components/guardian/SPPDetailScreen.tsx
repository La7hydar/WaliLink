import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, Calendar, Receipt, Download, Eye } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { getGuardianPaymentData, type GuardianSppBill } from '../../services/GuardianPortalService';

interface SPPDetailScreenProps {
  studentId: string;
  onBack: () => void;
  semester: 'current' | 'previous';
  onSemesterChange: (semester: 'current' | 'previous') => void;
}

export function SPPDetailScreen({ studentId, onBack, semester, onSemesterChange }: SPPDetailScreenProps) {
  const [bills, setBills] = useState<GuardianSppBill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    getGuardianPaymentData(studentId)
      .then((data) => {
        if (isCurrent) setBills(data.bills);
      })
      .catch((error) => {
        if (isCurrent) setLoadError(error instanceof Error ? error.message : 'Data SPP gagal dimuat.');
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [studentId]);

  const data = semester === 'current' ? bills.slice(0, 6) : bills.slice(6);
  const totalSPP = data.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalDibayar = data.reduce((sum, item) => sum + (item.status.toLowerCase() === 'paid' ? Number(item.amount) : 0), 0);
  const totalSisa = totalSPP - totalDibayar;
  const formatBillMonth = (bill: GuardianSppBill) =>
    new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date(bill.year, bill.month - 1));
  const formatDate = (value: string | null) => value
    ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
    : '-';

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
              {semester === 'current' ? 'Enam tagihan terbaru' : 'Tagihan sebelumnya'}
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
            Terbaru
          </Button>
          <Button
            variant={semester === 'previous' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSemesterChange('previous')}
            className="flex-1"
          >
            <Receipt className="w-4 h-4 mr-2" />
            Sebelumnya
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
                {isLoading ? <p className="py-6 text-center text-sm text-muted-foreground">Memuat tagihan...</p> : loadError ? (
                  <p className="py-6 text-center text-sm text-destructive">{loadError}</p>
                ) : data.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">Tidak ada tagihan pada periode ini.</p>
                ) : data.map((item) => {
                  const isPaid = item.status.toLowerCase() === 'paid';
                  return <div key={item.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                          {item.month}
                        </span>
                        <span className="font-medium text-sm">SPP {formatBillMonth(item)}</span>
                      </div>
                      <Badge variant={isPaid ? 'default' : 'destructive'}>
                        {isPaid ? 'Lunas' : item.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-muted-foreground mb-1">Jumlah SPP</p>
                        <p className="font-medium">Rp {Number(item.amount).toLocaleString('id-ID')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Sudah Dibayar</p>
                        <p className="font-medium text-green-600">Rp {isPaid ? Number(item.amount).toLocaleString('id-ID') : '0'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Sisa Tagihan</p>
                        <p className="font-medium text-red-600">Rp {isPaid ? '0' : Number(item.amount).toLocaleString('id-ID')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">
                          {isPaid ? 'Tanggal Bayar' : 'Status'}
                        </p>
                        <p className="font-medium">
                          {isPaid ? formatDate(item.payment_date) : item.status}
                        </p>
                      </div>
                    </div>

                    {isPaid && item.proof_of_payment_url && (
                      <div className="mt-3 pt-3 border-t">
                        <a href={item.proof_of_payment_url} target="_blank" rel="noreferrer" className="flex w-full items-center justify-center rounded-md border px-3 py-2 text-sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Lihat Bukti Bayar
                        </a>
                      </div>
                    )}
                  </div>;
                })}
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