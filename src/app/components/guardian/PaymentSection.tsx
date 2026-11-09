import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../hooks/useLanguage';
import { getGuardianPaymentData, type GuardianSppBill, type GuardianWalletTransaction } from '../../services/GuardianPortalService';
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
  studentId: string;
  studentData: {
    name: string;
    emoneyBalance: number | null;
    sppStatus: string;
    lastPayment: string;
  };
  onShowSPPDetail: () => void;
  onShowTransactionHistory: () => void;
  /** Buka layar Dompet Santri */
  onShowDompetSantri?: () => void;
  /** Buka modal Top Up */
  onShowTopUp?: () => void;
  onShowSendAllowance?: () => void;
}

export function PaymentSection({
  studentId,
  studentData,
  onShowSPPDetail,
  onShowTransactionHistory,
  onShowDompetSantri,
  onShowTopUp,
  onShowSendAllowance,
}: PaymentSectionProps) {
  const { t } = useLanguage();
  const [bills, setBills] = useState<GuardianSppBill[]>([]);
  const [transactions, setTransactions] = useState<GuardianWalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    setLoadError('');
    getGuardianPaymentData(studentId)
      .then((data) => {
        if (!isCurrent) return;
        setBills(data.bills);
        setTransactions(data.transactions);
      })
      .catch((error) => {
        if (isCurrent) setLoadError(error instanceof Error ? error.message : 'Data pembayaran gagal dimuat.');
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [studentId]);

  const formatBillMonth = (bill: GuardianSppBill) =>
    new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date(bill.year, bill.month - 1));
  const formatDate = (value: string | null) => value
    ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
    : '-';
  const getTransactionAmount = (transaction: GuardianWalletTransaction) => {
    const amount = Number(transaction.amount);
    return ['spending', 'transfer_out'].includes(transaction.transaction_type.toLowerCase()) ? -amount : amount;
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
            {studentData.emoneyBalance === null
              ? 'Dompet belum tersedia'
              : `Rp ${studentData.emoneyBalance.toLocaleString('id-ID')}`}
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
              onClick={e => { e.stopPropagation(); onShowSendAllowance?.(); }}
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
          {isLoading ? <p className="text-sm text-muted-foreground">Memuat tagihan...</p> : loadError ? (
            <p className="text-sm text-destructive">{loadError}</p>
          ) : bills.length === 0 ? <p className="text-sm text-muted-foreground">Belum ada tagihan SPP.</p> : bills.slice(0, 3).map((bill) => {
            const isPaid = bill.status.toLowerCase() === 'paid';
            return <div key={bill.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isPaid ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  {isPaid ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{formatBillMonth(bill)}</p>
                  <p className="text-xs text-muted-foreground">
                    Rp {Number(bill.amount).toLocaleString('id-ID')}
                  </p>
                  {bill.payment_date && <p className="text-xs text-muted-foreground">Dibayar: {formatDate(bill.payment_date)}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={isPaid ? 'default' : 'destructive'}>
                  {isPaid ? 'Lunas' : bill.status}
                </Badge>
              </div>
            </div>;
          })}
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
          {isLoading ? <p className="text-sm text-muted-foreground">Memuat transaksi...</p> : loadError ? null : transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada transaksi.</p>
          ) : transactions.slice(0, 4).map((transaction) => {
            const amount = getTransactionAmount(transaction);
            return <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  amount > 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {amount > 0 ? (
                    <ArrowDownRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{transaction.merchant_or_notes || transaction.transaction_type}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(transaction.created_at)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium text-sm ${
                  amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {amount > 0 ? '+' : ''}Rp {Math.abs(amount).toLocaleString('id-ID')}
                </p>
                <Badge variant="outline" className="text-xs">
                  Tercatat
                </Badge>
              </div>
            </div>
            ;
          })}
        </CardContent>
      </Card>
    </div>
  );
}