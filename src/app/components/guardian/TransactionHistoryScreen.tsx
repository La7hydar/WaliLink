import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, Calendar, History, Download, ArrowUpRight, ArrowDownRight, Filter, Search } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useState } from 'react';

interface TransactionHistoryScreenProps {
  onBack: () => void;
  semester: 'current' | 'previous';
  onSemesterChange: (semester: 'current' | 'previous') => void;
}

export function TransactionHistoryScreen({ onBack, semester, onSemesterChange }: TransactionHistoryScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const currentSemesterTransactions = [
    { id: 1, date: '15 Jan 2025', type: 'spp', category: 'Pembayaran', description: 'Pembayaran SPP Januari 2025', amount: -500000, status: 'success', reference: 'TRX001' },
    { id: 2, date: '10 Jan 2025', type: 'topup', category: 'Top Up', description: 'Top Up E-Money dari Bank BCA', amount: 200000, status: 'success', reference: 'TRX002' },
    { id: 3, date: '5 Jan 2025', type: 'spending', category: 'Pengeluaran', description: 'Pembelian buku di Koperasi', amount: -75000, status: 'success', reference: 'TRX003' },
    { id: 4, date: '3 Jan 2025', type: 'spending', category: 'Pengeluaran', description: 'Makan di Kantin', amount: -25000, status: 'success', reference: 'TRX004' },
    { id: 5, date: '2 Jan 2025', type: 'topup', category: 'Top Up', description: 'Transfer dari Wali', amount: 150000, status: 'success', reference: 'TRX005' },
  ];

  const previousSemesterTransactions = [
    { id: 6, date: '15 Des 2024', type: 'spp', category: 'Pembayaran', description: 'Pembayaran SPP Desember 2024', amount: -450000, status: 'success', reference: 'TRX006' },
    { id: 7, date: '12 Des 2024', type: 'topup', category: 'Top Up', description: 'Top Up E-Money', amount: 200000, status: 'success', reference: 'TRX007' },
    { id: 8, date: '10 Des 2024', type: 'spending', category: 'Pengeluaran', description: 'Pembelian seragam', amount: -150000, status: 'success', reference: 'TRX008' },
    { id: 9, date: '8 Des 2024', type: 'spending', category: 'Pengeluaran', description: 'Laundry bulanan', amount: -30000, status: 'success', reference: 'TRX009' },
    { id: 10, date: '5 Des 2024', type: 'refund', category: 'Pengembalian', description: 'Refund pembayaran kantin', amount: 15000, status: 'success', reference: 'TRX010' },
  ];

  const transactions = semester === 'current' ? currentSemesterTransactions : previousSemesterTransactions;
  
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
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
              {semester === 'current' ? 'Semester Ini' : 'Semester Sebelumnya'}
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
            <History className="w-4 h-4 mr-2" />
            Semester Sebelumnya
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
              <SelectItem value="spp">SPP</SelectItem>
              <SelectItem value="topup">Top Up</SelectItem>
              <SelectItem value="spending">Belanja</SelectItem>
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
                {filteredTransactions.length === 0 ? (
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
                              {transaction.date} • {transaction.reference}
                            </p>
                            <Badge 
                              variant={transaction.status === 'success' ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {transaction.status === 'success' ? 'Berhasil' : 'Gagal'}
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