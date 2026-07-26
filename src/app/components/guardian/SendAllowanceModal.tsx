import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Send, CheckCircle2, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { getPaymentService } from '../../services/PaymentService';

interface SendAllowanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  currentBalance: number;
  onSuccess: (amount: number) => void;
}

const QUICK_AMOUNTS = [25000, 50000, 100000, 200000, 500000];

const formatRp = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export function SendAllowanceModal({
  isOpen,
  onClose,
  studentId,
  studentName,
  currentBalance,
  onSuccess,
}: SendAllowanceModalProps) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const parsedAmount = parseInt(amount.replace(/\D/g, '') || '0');

  const handleAmountChange = (val: string) => {
    setAmount(val.replace(/[^0-9]/g, ''));
  };

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString());
  };

  const handleSend = async () => {
    if (parsedAmount < 5000) {
      toast.error('Minimum kirim Rp 5.000');
      return;
    }
    if (parsedAmount > currentBalance) {
      toast.error('Saldo tidak mencukupi');
      return;
    }
    setIsProcessing(true);
    try {
      const svc = getPaymentService();
      await svc.sendAllowance(
        studentId,
        parsedAmount,
        note || `Uang Saku untuk ${studentName}`
      );
      setIsDone(true);
      onSuccess(parsedAmount);
    } catch (e) {
      toast.error('Gagal mengirim uang saku');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setNote('');
    setIsDone(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) handleClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-green-600" />
            Kirim Uang Saku
          </DialogTitle>
        </DialogHeader>

        {isDone ? (
          /* Success state */
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-9 w-9 text-green-600" />
            </div>
            <p className="font-semibold text-lg">Berhasil Dikirim!</p>
            <p className="text-muted-foreground text-sm">
              {formatRp(parsedAmount)} telah ditambahkan ke Dompet Santri {studentName}.
            </p>
            <Button onClick={handleClose} className="w-full bg-green-600 hover:bg-green-700 mt-2">
              Selesai
            </Button>
          </div>
        ) : (
          <>
            {/* Saldo Guardian */}
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-green-700 dark:text-green-400" />
                  <span className="text-xs text-green-700 dark:text-green-300">Saldo Dompet</span>
                </div>
                <span className="font-bold text-sm text-green-800 dark:text-green-200">
                  {formatRp(currentBalance)}
                </span>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {/* Penerima */}
              <div>
                <Label className="text-xs text-muted-foreground">Penerima</Label>
                <p className="font-semibold mt-0.5">{studentName}</p>
              </div>

              {/* Nominal */}
              <div className="space-y-2">
                <Label htmlFor="sa-amount">Jumlah Uang Saku</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    id="sa-amount"
                    type="text"
                    inputMode="numeric"
                    value={amount ? parseInt(amount).toLocaleString('id-ID') : ''}
                    onChange={e => handleAmountChange(e.target.value)}
                    placeholder="0"
                    className="pl-10 text-lg font-semibold"
                  />
                </div>
              </div>

              {/* Quick amounts */}
              <div className="grid grid-cols-3 gap-2">
                {QUICK_AMOUNTS.map(v => (
                  <Button
                    key={v}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAmount(v)}
                    className={`text-xs ${parsedAmount === v ? 'border-green-500 bg-green-50 text-green-700' : ''}`}
                  >
                    {formatRp(v)}
                  </Button>
                ))}
              </div>

              {/* Catatan */}
              <div className="space-y-1">
                <Label htmlFor="sa-note" className="text-xs">Catatan (opsional)</Label>
                <Input
                  id="sa-note"
                  placeholder="cth: Uang jajan minggu ini"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  maxLength={80}
                />
              </div>
            </div>

            <DialogFooter className="gap-2 flex-col sm:flex-row">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Batal
              </Button>
              <Button
                onClick={handleSend}
                disabled={parsedAmount < 5000 || isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Kirim {parsedAmount >= 5000 ? formatRp(parsedAmount) : ''}
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
