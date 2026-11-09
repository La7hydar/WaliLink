import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import {
  Wallet,
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { getGuardianPaymentData, type GuardianWalletTransaction } from '../../services/GuardianPortalService';

interface DompetSantriScreenProps {
  studentId: string;
  studentName: string;
  onBack: () => void;
  onShowTopUp: () => void;
  onShowSendAllowance: () => void;
}

const formatRp = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

export function DompetSantriScreen({
  studentId,
  studentName,
  onBack,
  onShowTopUp,
  onShowSendAllowance,
}: DompetSantriScreenProps) {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<GuardianWalletTransaction[]>([]);
  const [copiedVA, setCopiedVA] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    loadData();
  }, [studentId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      setLoadError('');
      const data = await getGuardianPaymentData(studentId);
      setBalance(data.balance);
      setTransactions(data.transactions);
    } catch (e) {
      console.error('Failed to load wallet data', e);
      setLoadError(e instanceof Error ? e.message : 'Data dompet gagal dimuat.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyVA = (number: string) => {
    navigator.clipboard.writeText(number).catch(() => {});
    setCopiedVA(number);
    toast.success('Nomor VA disalin');
    setTimeout(() => setCopiedVA(null), 2000);
  };

  const getTransactionIcon = (transaction: GuardianWalletTransaction) => {
    const type = transaction.transaction_type.toLowerCase();
    if (['topup', 'transfer_in', 'refund'].includes(type)) {
      return ArrowDownLeft;
    }
    return ArrowUpRight;
  };

  const isCredit = (transaction: GuardianWalletTransaction) =>
    ['topup', 'transfer_in', 'refund'].includes(transaction.transaction_type.toLowerCase());

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 pt-4 pb-6 shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20 p-2 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="font-semibold text-lg">Dompet Santri</h2>
            <p className="text-xs text-green-100">{studentName}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadData}
            className="ml-auto text-white hover:bg-white/20 p-2 rounded-full"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Saldo Card */}
        {isLoading ? (
          <div className="h-20 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="text-center pb-2">
            <p className="text-green-100 text-sm mb-1">Saldo Dompet Santri</p>
            <p className="text-4xl font-bold tracking-tight">
              {balance === null ? '-' : formatRp(balance)}
            </p>
            {loadError && <p className="mt-2 text-xs text-yellow-100">{loadError}</p>}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 px-4 py-3 flex gap-3 border-b dark:border-gray-700 shrink-0">
        <Button
          onClick={onShowTopUp}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          Top Up
        </Button>
        <Button
          onClick={onShowSendAllowance}
          variant="outline"
          className="flex-1 flex items-center gap-2"
          size="sm"
        >
          <Send className="h-4 w-4" />
          Uang Saku
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {isLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Memuat transaksi...</div>
          ) : loadError ? (
            <div className="py-8 text-center text-sm text-destructive">{loadError}</div>
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Transaksi Dompet Santri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0 p-0">
                {transactions.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">Belum ada transaksi.</p>
                ) : transactions.map((transaction, index) => {
                  const Icon = getTransactionIcon(transaction);
                  const credit = isCredit(transaction);
                  const amount = Number(transaction.amount);
                  return (
                    <div key={transaction.id} className={`flex items-center gap-3 px-4 py-3 ${index < transactions.length - 1 ? 'border-b dark:border-gray-700' : ''}`}>
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${credit ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                        <Icon className={`h-4 w-4 ${credit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{transaction.merchant_or_notes || transaction.transaction_type}</p>
                        <span className="text-xs text-muted-foreground">{formatDate(transaction.created_at)}</span>
                      </div>
                      <p className={`shrink-0 text-sm font-semibold ${credit ? 'text-green-600' : 'text-red-600'}`}>
                        {credit ? '+' : '-'}{formatRp(amount)}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-4">
              <p className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Transaksi tercatat</span>
                <span className="font-semibold text-foreground">{transactions.length}</span>
              </p>
            </CardContent>
          </Card>

        </div>
      </ScrollArea>
    </div>
  );
}
