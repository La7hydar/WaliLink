import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { useLanguage } from '../../hooks/useLanguage';
import {
  CreditCard,
  DollarSign,
  Send,
  History,
  CheckCircle,
  AlertCircle,
  Calendar,
  Receipt,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  ChevronRight,
  Plus,
} from 'lucide-react';

interface PaymentSectionProps {
  studentData: {
    name: string;
    emoneyBalance: number;
    sppStatus: string;
    lastPayment: string;
  };
  onShowSPPDetail: () => void;
  onShowTransactionHistory: () => void;
  /** Buka layar Dompet Santri */
  onShowDompetSantri?: () => void;
  /** Buka modal Top Up */
  onShowTopUp?: () => void;
}

export function PaymentSection({
  studentData,
  onShowSPPDetail,
  onShowTransactionHistory,
  onShowDompetSantri,
  onShowTopUp,
}: PaymentSectionProps) {
  const { t } = useLanguage();
  const [sendAmount, setSendAmount] = useState('');
  const [showSendMoney, setShowSendMoney] = useState(false);

  const sppBills = [
    { month: 'Januari 2025', amount: 500000, status: 'pending', dueDate: '10 Jan 2025' },
    { month: 'Desember 2024', amount: 500000, status: 'paid', paidDate: '15 Des 2024' },
    { month: 'November 2024', amount: 500000, status: 'paid', paidDate: '10 Nov 2024' },
  ];

  const transactionHistory = [
    { 
      id: 1, 
      type: 'spp', 
      description: 'Pembayaran SPP Desember 2024', 
      amount: -500000, 
      date: '15 Des 2024',
      status: 'success'
    },
    { 
      id: 2, 
      type: 'topup', 
      description: 'Top Up E-Money', 
      amount: 200000, 
      date: '12 Des 2024',
      status: 'success'
    },
    { 
      id: 3, 
      type: 'spending', 
      description: 'Pembelian di Kantin', 
      amount: -25000, 
      date: '11 Des 2024',
      status: 'success'
    },
    { 
      id: 4, 
      type: 'topup', 
      description: 'Top Up E-Money', 
      amount: 100000, 
      date: '8 Des 2024',
      status: 'success'
    },
  ];

  const handleSendMoney = () => {
    if (sendAmount) {
      // Simulate sending money
      alert(`Berhasil mengirim Rp ${parseInt(sendAmount).toLocaleString()} ke ${studentData.name}`);
      setSendAmount('');
      setShowSendMoney(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* ── Dompet Santri Card (NEW) ── */}
      <Card
        className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white cursor-pointer active:opacity-90 transition-opacity"
        onClick={onShowDompetSantri}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-green-100">Dompet Santri</p>
                <p className="text-sm font-medium">{studentData.name}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-white/60 mt-1" />
          </div>
          <p className="text-3xl font-bold mb-4">
            Rp {studentData.emoneyBalance.toLocaleString()}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 flex-1"
              onClick={e => { e.stopPropagation(); onShowTopUp?.(); }}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Top Up
            </Button>
            <Button
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 flex-1"
              onClick={e => { e.stopPropagation(); setShowSendMoney(true); }}
            >
              <Send className="h-3.5 w-3.5 mr-1" />
              Uang Saku
            </Button>
            <Button
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={e => { e.stopPropagation(); onShowDompetSantri?.(); }}
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* E-Money Balance — disembunyikan karena sudah diganti Dompet Santri card di atas */}
      {false && (
      <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Saldo E-Money</CardTitle>
            <Wallet className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold mb-3">
            Rp {studentData.emoneyBalance.toLocaleString()}
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSendMoney(true)}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <Send className="h-4 w-4 mr-2" />
            Kirim Uang
          </Button>
        </CardContent>
      </Card>
      )}

      {/* Send Money Form */}
      {showSendMoney && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Kirim Uang ke {studentData.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Jumlah (Rp)</label>
              <Input
                type="number"
                placeholder="Masukkan jumlah"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[50000, 100000, 200000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setSendAmount(amount.toString())}
                >
                  {amount.toLocaleString()}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowSendMoney(false)}
              >
                Batal
              </Button>
              <Button 
                onClick={handleSendMoney}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                disabled={!sendAmount}
              >
                Kirim
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SPP Bills */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{t('payment.spp_bills')}</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onShowSPPDetail}
            >
              <Eye className="h-4 w-4 mr-1" />
              {t('common.view_all')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {sppBills.map((bill, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  bill.status === 'paid' ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  {bill.status === 'paid' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{bill.month}</p>
                  <p className="text-xs text-muted-foreground">
                    Rp {bill.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {bill.status === 'paid' 
                      ? `Dibayar: ${bill.paidDate}` 
                      : `Jatuh tempo: ${bill.dueDate}`
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={bill.status === 'paid' ? 'default' : 'destructive'}>
                  {bill.status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                </Badge>
                {bill.status === 'pending' && (
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    Bayar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{t('payment.transaction_history')}</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onShowTransactionHistory}
            >
              <History className="h-4 w-4 mr-1" />
              {t('common.view_all')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {transactionHistory.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.amount > 0 ? (
                    <ArrowDownRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium text-sm ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}Rp {Math.abs(transaction.amount).toLocaleString()}
                </p>
                <Badge variant="outline" className="text-xs">
                  {transaction.status === 'success' ? 'Berhasil' : 'Gagal'}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}