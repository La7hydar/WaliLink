import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
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
  Building2,
  RefreshCw,
  ChevronRight,
  ShoppingBag,
  BookOpen,
  Utensils,
  Shirt,
  Star,
  Package,
  BadgeDollarSign,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';
import type { EmoneyTransaction, WalletSummary } from '../../types/api';
import { getPaymentService } from '../../services/PaymentService';

interface DompetSantriScreenProps {
  studentId: string;
  studentName: string;
  onBack: () => void;
  onShowTopUp: () => void;
  onShowSendAllowance: () => void;
}

const CATEGORY_ICON: Record<string, React.ElementType> = {
  spp:          BadgeDollarSign,
  makan:        Utensils,
  laundry:      Shirt,
  kitab:        BookOpen,
  kegiatan:     Star,
  perlengkapan: Package,
  uang_saku:    Send,
  umum:         ShoppingBag,
};

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
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const [virtualAccounts, setVirtualAccounts] = useState<any[]>([]);
  const [copiedVA, setCopiedVA] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'transaksi' | 'va'>('transaksi');

  useEffect(() => {
    loadData();
  }, [studentId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const svc = getPaymentService();
      const [s, vas] = await Promise.all([
        svc.getWalletSummary(studentId),
        svc.getVirtualAccounts(studentId),
      ]);
      setSummary(s);
      setVirtualAccounts(vas);
    } catch (e) {
      console.error('Failed to load wallet data', e);
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

  const getTransactionIcon = (tx: EmoneyTransaction) => {
    if (tx.type === 'topup' || tx.type === 'transfer_in' || tx.type === 'refund') {
      return ArrowDownLeft;
    }
    const cat = tx.category;
    return CATEGORY_ICON[cat] ?? ArrowUpRight;
  };

  const isCredit = (tx: EmoneyTransaction) =>
    tx.type === 'topup' || tx.type === 'transfer_in' || tx.type === 'refund';

  const pendingTopups = summary?.recentTransactions.filter(
    t => t.type === 'topup' && t.verificationStatus === 'pending'
  ) ?? [];

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
              {summary ? formatRp(summary.balance) : 'Rp 0'}
            </p>
            {pendingTopups.length > 0 && (
              <div className="flex items-center justify-center gap-1 mt-2">
                <Clock className="h-3 w-3 text-yellow-300" />
                <p className="text-xs text-yellow-200">
                  +{formatRp(pendingTopups.reduce((s, t) => s + t.amount, 0))} menunggu verifikasi
                </p>
              </div>
            )}
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
        <Button
          variant="outline"
          className="flex items-center gap-2 px-3"
          size="sm"
          onClick={() => setActiveTab('va')}
        >
          <Building2 className="h-4 w-4" />
          VA
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">

          {/* Pending Top-Up Alert */}
          {pendingTopups.length > 0 && (
            <Card className="border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                      Top Up Menunggu Verifikasi
                    </p>
                    {pendingTopups.map(tx => (
                      <div key={tx.id} className="flex justify-between items-center mt-1">
                        <p className="text-xs text-yellow-700 dark:text-yellow-300">
                          {tx.description} · {formatDate(tx.date)}
                        </p>
                        <span className="text-xs font-bold text-yellow-800 dark:text-yellow-200">
                          +{formatRp(tx.amount)}
                        </span>
                      </div>
                    ))}
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                      Dana akan masuk otomatis setelah pembayaran terverifikasi oleh pesantren.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ringkasan Pengeluaran */}
          {summary && summary.spendingByCategory.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Ringkasan Pengeluaran</CardTitle>
                  <span className="text-xs text-muted-foreground">Bulan ini</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {summary.spendingByCategory.map(item => {
                  const pct = summary.totalSpending > 0
                    ? Math.round((item.amount / summary.totalSpending) * 100)
                    : 0;
                  const Icon = CATEGORY_ICON[item.category] ?? ShoppingBag;
                  return (
                    <div key={item.category}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: item.color + '22' }}
                          >
                            <Icon className="h-3 w-3" style={{ color: item.color }} />
                          </div>
                          <span className="text-xs font-medium">{item.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold">{formatRp(item.amount)}</span>
                          <span className="text-xs text-muted-foreground ml-1">({pct}%)</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="pt-2 border-t flex justify-between text-xs">
                  <span className="text-muted-foreground">Total Pengeluaran</span>
                  <span className="font-bold text-red-600">{formatRp(summary.totalSpending)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Total Top Up</span>
                  <span className="font-bold text-green-600">{formatRp(summary.totalTopup)}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs: Transaksi / Virtual Account */}
          <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'transaksi' | 'va')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transaksi">Riwayat Transaksi</TabsTrigger>
              <TabsTrigger value="va">Virtual Account</TabsTrigger>
            </TabsList>

            {/* Riwayat Transaksi */}
            <TabsContent value="transaksi" className="mt-3">
              <Card>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="py-8 text-center text-muted-foreground text-sm">Memuat...</div>
                  ) : !summary || summary.recentTransactions.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground text-sm">
                      <Wallet className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      <p>Belum ada transaksi</p>
                    </div>
                  ) : (
                    summary.recentTransactions.map((tx, i) => {
                      const Icon = getTransactionIcon(tx);
                      const credit = isCredit(tx);
                      const isPending = tx.verificationStatus === 'pending';
                      return (
                        <div
                          key={tx.id}
                          className={`flex items-center gap-3 px-4 py-3 ${
                            i < summary.recentTransactions.length - 1
                              ? 'border-b dark:border-gray-700'
                              : ''
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isPending
                                ? 'bg-yellow-100 dark:bg-yellow-900/30'
                                : credit
                                ? 'bg-green-100 dark:bg-green-900/30'
                                : 'bg-red-100 dark:bg-red-900/30'
                            }`}
                          >
                            {isPending ? (
                              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            ) : (
                              <Icon
                                className={`h-4 w-4 ${
                                  credit
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                                }`}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{tx.description}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs text-muted-foreground">{formatDate(tx.date)}</span>
                              {tx.location && (
                                <>
                                  <span className="text-xs text-muted-foreground">·</span>
                                  <span className="text-xs text-muted-foreground truncate">{tx.location}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p
                              className={`text-sm font-semibold ${
                                isPending
                                  ? 'text-yellow-600 dark:text-yellow-400'
                                  : credit
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {credit ? '+' : '-'}{formatRp(tx.amount)}
                            </p>
                            {isPending && (
                              <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-600 mt-0.5">
                                Pending
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Virtual Account */}
            <TabsContent value="va" className="mt-3 space-y-3">
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                    Transfer ke salah satu Virtual Account di bawah untuk isi saldo Dompet Santri.
                    Dana akan terverifikasi otomatis dan masuk ke saldo dalam beberapa menit.
                  </p>
                </CardContent>
              </Card>

              {virtualAccounts.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground text-sm">
                    <Building2 className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p>Belum ada Virtual Account terdaftar</p>
                  </CardContent>
                </Card>
              ) : (
                virtualAccounts.map((va, i) => (
                  <Card key={va.id ?? i} className="border-2 border-gray-100 dark:border-gray-700">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-green-700 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{va.bankName}</p>
                            <p className="text-xs text-muted-foreground">Virtual Account</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs text-green-700 border-green-300">
                          Aktif
                        </Badge>
                      </div>

                      {/* Nomor VA */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Nomor Virtual Account</p>
                        <div className="flex items-center justify-between">
                          <code className="text-base font-bold tracking-widest text-foreground">
                            {va.accountNumber}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => handleCopyVA(va.accountNumber)}
                          >
                            {copiedVA === va.accountNumber ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Atas Nama</p>
                          <p className="font-medium mt-0.5 leading-tight">{va.accountName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Keperluan</p>
                          <p className="font-medium mt-0.5 leading-tight">{va.purpose}</p>
                        </div>
                      </div>

                      <div className="border-t dark:border-gray-700 pt-2 space-y-1 text-xs text-muted-foreground">
                        <p>• Transfer sesuai jumlah yang ingin ditopup</p>
                        <p>• Saldo masuk otomatis setelah verifikasi</p>
                        <p>• Simpan bukti transfer sebagai konfirmasi</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>

          {/* Cara Penggunaan Saldo */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Cara Penggunaan Saldo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: BadgeDollarSign, label: 'Bayar SPP', color: 'text-red-600' },
                  { icon: Utensils,       label: 'Uang Makan', color: 'text-orange-600' },
                  { icon: Shirt,          label: 'Laundry',    color: 'text-purple-600' },
                  { icon: BookOpen,       label: 'Kitab',      color: 'text-blue-600' },
                  { icon: Star,           label: 'Kegiatan',   color: 'text-cyan-600' },
                  { icon: Package,        label: 'Perlengkapan', color: 'text-green-600' },
                ].map(({ icon: Icon, label, color }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <Icon className={`h-5 w-5 ${color}`} />
                    <span className="text-xs text-center leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </ScrollArea>
    </div>
  );
}
