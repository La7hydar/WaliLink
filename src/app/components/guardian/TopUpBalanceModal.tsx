import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Wallet, 
  CreditCard, 
  Building2, 
  Copy, 
  CheckCircle2,
  AlertCircle,
  Info,
  Smartphone,
  QrCode,
  ArrowRight,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { OfflinePaymentWarning } from '../OfflineModeIndicator';

interface TopUpBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onTopUpSuccess: (amount: number, method: string) => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank' | 'ewallet' | 'qris';
  icon: any;
  fee: number;
  minAmount: number;
  maxAmount: number;
  processingTime: string;
}

export function TopUpBalanceModal({ 
  isOpen, 
  onClose, 
  currentBalance,
  onTopUpSuccess 
}: TopUpBalanceModalProps) {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [step, setStep] = useState<'input' | 'method' | 'confirmation' | 'processing'>('input');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [copiedVA, setCopiedVA] = useState(false);

  // Payment methods configuration
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'bca',
      name: 'BCA Virtual Account',
      type: 'bank',
      icon: Building2,
      fee: 4000,
      minAmount: 10000,
      maxAmount: 50000000,
      processingTime: 'Instant'
    },
    {
      id: 'mandiri',
      name: 'Mandiri Virtual Account',
      type: 'bank',
      icon: Building2,
      fee: 4000,
      minAmount: 10000,
      maxAmount: 50000000,
      processingTime: 'Instant'
    },
    {
      id: 'bni',
      name: 'BNI Virtual Account',
      type: 'bank',
      icon: Building2,
      fee: 4000,
      minAmount: 10000,
      maxAmount: 50000000,
      processingTime: 'Instant'
    },
    {
      id: 'gopay',
      name: 'GoPay',
      type: 'ewallet',
      icon: Smartphone,
      fee: 2000,
      minAmount: 10000,
      maxAmount: 2000000,
      processingTime: 'Instant'
    },
    {
      id: 'ovo',
      name: 'OVO',
      type: 'ewallet',
      icon: Smartphone,
      fee: 2000,
      minAmount: 10000,
      maxAmount: 2000000,
      processingTime: 'Instant'
    },
    {
      id: 'dana',
      name: 'DANA',
      type: 'ewallet',
      icon: Smartphone,
      fee: 2000,
      minAmount: 10000,
      maxAmount: 2000000,
      processingTime: 'Instant'
    },
    {
      id: 'qris',
      name: 'QRIS (Semua Bank & E-Wallet)',
      type: 'qris',
      icon: QrCode,
      fee: 1500,
      minAmount: 10000,
      maxAmount: 10000000,
      processingTime: 'Instant'
    }
  ];

  // Quick amount buttons
  const quickAmounts = [50000, 100000, 200000, 500000, 1000000];

  // Generate virtual account number (mock)
  const generateVANumber = (methodId: string) => {
    const prefix = {
      'bca': '70012',
      'mandiri': '88808',
      'bni': '88881'
    }[methodId] || '88888';
    
    return `${prefix}${Date.now().toString().slice(-10)}`;
  };

  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);
  const totalAmount = selectedMethodData 
    ? parseInt(amount || '0') + selectedMethodData.fee 
    : parseInt(amount || '0');

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setAmount(numericValue);
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleContinue = () => {
    if (!amount || parseInt(amount) < 10000) {
      toast.error('Minimum top up Rp 10.000');
      return;
    }
    setStep('method');
  };

  const handleSelectMethod = (methodId: string) => {
    setSelectedMethod(methodId);
    setStep('confirmation');
  };

  const handleCopyVA = (vaNumber: string) => {
    navigator.clipboard.writeText(vaNumber);
    setCopiedVA(true);
    toast.success('Nomor VA disalin');
    setTimeout(() => setCopiedVA(false), 2000);
  };

  const handleConfirmPayment = () => {
    setStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      onTopUpSuccess(parseInt(amount), selectedMethod);
      toast.success('Top up berhasil! Saldo akan segera masuk.');
      onClose();
      resetForm();
    }, 2000);
  };

  const resetForm = () => {
    setAmount('');
    setSelectedMethod('');
    setStep('input');
    setBankAccountNumber('');
    setAccountHolderName('');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        resetForm();
      }
    }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Top Up Saldo
          </DialogTitle>
          <DialogDescription>
            Isi saldo untuk pembayaran SPP dan kebutuhan santri
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          {/* Offline Warning */}
          <OfflinePaymentWarning />

          {/* Step 1: Input Amount */}
          {step === 'input' && (
            <div className="space-y-4 py-4">
              {/* Current Balance */}
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200">
                <CardContent className="p-4">
                  <p className="text-sm text-green-700 dark:text-green-300 mb-1">
                    Saldo Saat Ini
                  </p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {formatCurrency(currentBalance)}
                  </p>
                </CardContent>
              </Card>

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount">Jumlah Top Up</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-sm text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    id="amount"
                    type="text"
                    value={amount ? parseInt(amount).toLocaleString('id-ID') : ''}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0"
                    className="pl-10 text-lg font-semibold"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum top up: Rp 10.000
                </p>
              </div>

              {/* Quick Amount Buttons */}
              <div className="space-y-2">
                <Label>Nominal Cepat</Label>
                <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map((value) => (
                    <Button
                      key={value}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAmount(value)}
                      className={amount === value.toString() ? 'border-green-500 bg-green-50' : ''}
                    >
                      {formatCurrency(value)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Info */}
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                <CardContent className="p-3 flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Saldo dapat digunakan untuk pembayaran SPP, syahriyah, dan kebutuhan santri lainnya. Biaya admin akan ditambahkan sesuai metode pembayaran yang dipilih.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Select Payment Method */}
          {step === 'method' && (
            <div className="space-y-4 py-4">
              <Card className="bg-gray-50 dark:bg-gray-800">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Jumlah Top Up</p>
                  <p className="text-xl font-bold">{formatCurrency(parseInt(amount))}</p>
                </CardContent>
              </Card>

              <Tabs defaultValue="bank" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="bank">Bank</TabsTrigger>
                  <TabsTrigger value="ewallet">E-Wallet</TabsTrigger>
                  <TabsTrigger value="qris">QRIS</TabsTrigger>
                </TabsList>

                <TabsContent value="bank" className="space-y-2 mt-4">
                  {paymentMethods.filter(m => m.type === 'bank').map((method) => {
                    const Icon = method.icon;
                    return (
                      <Card 
                        key={method.id}
                        className="cursor-pointer hover:border-green-500 transition-all"
                        onClick={() => handleSelectMethod(method.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{method.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {formatCurrency(method.fee)}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {method.processingTime}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </TabsContent>

                <TabsContent value="ewallet" className="space-y-2 mt-4">
                  {paymentMethods.filter(m => m.type === 'ewallet').map((method) => {
                    const Icon = method.icon;
                    return (
                      <Card 
                        key={method.id}
                        className="cursor-pointer hover:border-green-500 transition-all"
                        onClick={() => handleSelectMethod(method.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{method.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {formatCurrency(method.fee)}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {method.processingTime}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </TabsContent>

                <TabsContent value="qris" className="space-y-2 mt-4">
                  {paymentMethods.filter(m => m.type === 'qris').map((method) => {
                    const Icon = method.icon;
                    return (
                      <Card 
                        key={method.id}
                        className="cursor-pointer hover:border-green-500 transition-all"
                        onClick={() => handleSelectMethod(method.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{method.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {formatCurrency(method.fee)}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {method.processingTime}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 'confirmation' && selectedMethodData && (
            <div className="space-y-4 py-4">
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200">
                <CardContent className="p-4">
                  <p className="text-sm text-green-700 dark:text-green-300 mb-1">
                    Total Pembayaran
                  </p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {formatCurrency(totalAmount)}
                  </p>
                </CardContent>
              </Card>

              {/* Payment Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Detail Pembayaran</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nominal Top Up</span>
                    <span className="font-medium">{formatCurrency(parseInt(amount))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Biaya Admin</span>
                    <span className="font-medium">{formatCurrency(selectedMethodData.fee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Metode Pembayaran</span>
                    <span className="font-medium">{selectedMethodData.name}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Virtual Account Info (for bank transfers) */}
              {selectedMethodData.type === 'bank' && (
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <Label className="text-xs">Nomor Virtual Account</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 bg-white dark:bg-gray-800 p-2 rounded text-sm font-mono">
                          {generateVANumber(selectedMethod)}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyVA(generateVANumber(selectedMethod))}
                        >
                          {copiedVA ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Gunakan nomor VA ini untuk melakukan transfer melalui ATM, mobile banking, atau internet banking
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Instructions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Instruksi Pembayaran</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      1
                    </div>
                    <p className="text-muted-foreground">
                      {selectedMethodData.type === 'bank' 
                        ? 'Salin nomor Virtual Account di atas'
                        : 'Buka aplikasi e-wallet Anda'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      2
                    </div>
                    <p className="text-muted-foreground">
                      {selectedMethodData.type === 'bank'
                        ? 'Transfer sesuai total pembayaran'
                        : 'Scan QR Code atau masukkan nomor merchant'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      3
                    </div>
                    <p className="text-muted-foreground">
                      Konfirmasi pembayaran dan tunggu notifikasi
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      4
                    </div>
                    <p className="text-muted-foreground">
                      Saldo akan otomatis masuk ke akun Anda
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Processing */}
          {step === 'processing' && (
            <div className="py-8 text-center">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">Memproses Pembayaran...</p>
              <p className="text-sm text-muted-foreground">
                Mohon tunggu, kami sedang memverifikasi pembayaran Anda
              </p>
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="flex-shrink-0">
          {step === 'input' && (
            <>
              <Button variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button 
                onClick={handleContinue}
                className="bg-green-600 hover:bg-green-700"
                disabled={!amount || parseInt(amount) < 10000}
              >
                Lanjutkan
              </Button>
            </>
          )}
          {step === 'method' && (
            <Button variant="outline" onClick={() => setStep('input')}>
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Kembali
            </Button>
          )}
          {step === 'confirmation' && (
            <>
              <Button variant="outline" onClick={() => setStep('method')}>
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Kembali
              </Button>
              <Button 
                onClick={handleConfirmPayment}
                className="bg-green-600 hover:bg-green-700"
              >
                Bayar Sekarang
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}