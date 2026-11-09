import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, Calendar, History, Download, ArrowUpRight, ArrowDownRight, Filter, Search } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useEffect, useState } from 'react';
import { getGuardianPaymentData, type GuardianWalletTransaction } from '../../services/GuardianPortalService';

interface TransactionHistoryScreenProps {
  studentId: string;
  onBack: () => void;
  semester: 'current' | 'previous';
  onSemesterChange: (semester: 'current' | 'previous') => void;
}

export function TransactionHistoryScreen({ studentId, onBack, semester, onSemesterChange }: TransactionHistoryScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [allTransactions, setAllTransactions] = useState<GuardianWalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    setLoadError('');
    getGuardianPaymentData(studentId)
      .then((data) => {
        if (isCurrent) setAllTransactions(data.transactions);
      })
      .catch((error) => {
        if (isCurrent) setLoadError(error instanceof Error ? error.message : 'Riwayat transaksi gagal dimuat.');
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [studentId]);

  const periodTransactions = semester === 'current' ? allTransactions.slice(0, 10) : allTransactions.slice(10);
  const transactions = periodTransactions.map((transaction) => {
    const type = transaction.transaction_type.toLowerCase();
    const rawAmount = Number(transaction.amount);
    const amount = ['spending', 'transfer_out'].includes(type) ? -rawAmount : rawAmount;
    return {
      ...transaction,
      type,
      category: type.replace(/_/g, ' '),
      description: transaction.merchant_or_notes || type.replace(/_/g, ' '),
      amount,
    };
  });
  
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalIncome = filteredTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'topup': return <ArrowDownRight className="w-4 h-4 text-green-600" />;
      case 'refund': return <ArrowDownRight className="w-4 h-4 text-blue-600" />;
      default: return <ArrowUpRight className="w-4 h-4 text-red-600" />;
    }
  };

  const getTransactionColor = (amount: number) => {
    return amount > 0 ? 'text-green-600' : 'text-red-600';
  };
  const formatDate = (value: string) =>
    new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));

  return (
    <div className="size-full bg-background safe-area-top safe-area-bottom">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Riwayat Transaksi</h1>
            <p className="text-sm text-muted-foreground">
              {semester === 'current' ? '10 transaksi terbaru' : 'Transaksi sebelumnya'}
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
            <History className="w-4 h-4 mr-2" />
            Sebelumnya
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari transaksi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[120px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="topup">Top Up</SelectItem>
              <SelectItem value="spending">Belanja</SelectItem>
              <SelectItem value="transfer_in">Uang masuk</SelectItem>
              <SelectItem value="transfer_out">Uang keluar</SelectItem>
              <SelectItem value="refund">Refund</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Total Pemasukan</p>
                <p className="font-semibold text-green-600">Rp {totalIncome.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Total Pengeluaran</p>
                <p className="font-semibold text-red-600">Rp {totalExpense.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Daftar Transaksi ({filteredTransactions.length})
              </CardTitle>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[450px]">
              <div className="space-y-3">
                {isLoading ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">Memuat transaksi...</div>
                ) : loadError ? (
                  <div className="py-8 text-center text-sm text-destructive">{loadError}</div>
                ) : filteredTransactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Tidak ada transaksi ditemukan</p>
                  </div>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="font-medium text-sm">{transaction.description}</p>
                              <Badge variant="outline" className="text-xs">
                                {transaction.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {formatDate(transaction.created_at)}
                            </p>
                            <Badge 
                              variant="outline"
                              className="text-xs"
                            >
                              Tercatat
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${getTransactionColor(transaction.amount)}`}>
                            {transaction.amount > 0 ? '+' : ''}Rp {Math.abs(transaction.amount).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Summary Footer */}
        <Card className="bg-gray-50 dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Selisih (Pemasukan - Pengeluaran)</p>
              <p className={`font-bold text-lg ${(totalIncome - totalExpense) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(totalIncome - totalExpense) >= 0 ? '+' : ''}Rp {(totalIncome - totalExpense).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}