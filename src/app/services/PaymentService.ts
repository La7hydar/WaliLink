// Payment Service
// Business logic untuk operasi pembayaran dan e-money

import { getDataProvider } from '../data-access/DataProviderFactory';
import { debugLog } from '../config/environment';
import type { Payment, EmoneyTransaction, WalletSummary } from '../types/api';

export class PaymentService {
  private dataProvider = getDataProvider();

  /**
   * Get semua pembayaran untuk student
   */
  async getPayments(studentId: string, status?: string): Promise<Payment[]> {
    debugLog('PaymentService.getPayments', studentId, status);
    return this.dataProvider.getPayments(studentId, status);
  }

  /**
   * Get pembayaran yang pending (belum dibayar)
   */
  async getPendingPayments(studentId: string): Promise<Payment[]> {
    return this.getPayments(studentId, 'pending');
  }

  /**
   * Get pembayaran yang sudah dibayar
   */
  async getPaidPayments(studentId: string): Promise<Payment[]> {
    return this.getPayments(studentId, 'paid');
  }

  /**
   * Save payment
   */
  async savePayment(payment: Payment): Promise<void> {
    debugLog('PaymentService.savePayment', payment);
    return this.dataProvider.savePayment(payment);
  }

  /**
   * Mark payment as paid
   */
  async markPaymentAsPaid(paymentId: string, method: string): Promise<void> {
    // Get all payments to find the one we want
    const allPayments = await this.dataProvider.getPayments(''); // TODO: Fix this
    const payment = allPayments.find(p => p.id === paymentId);

    if (!payment) {
      throw new Error(`Payment not found: ${paymentId}`);
    }

    payment.status = 'paid';
    payment.paidDate = new Date().toISOString().split('T')[0];
    payment.method = method;

    await this.savePayment(payment);
  }

  /**
   * Get saldo e-money
   */
  async getEmoneyBalance(studentId: string): Promise<number> {
    debugLog('PaymentService.getEmoneyBalance', studentId);
    return this.dataProvider.getEmoneyBalance(studentId);
  }

  /**
   * Get riwayat transaksi e-money
   */
  async getEmoneyTransactions(studentId: string): Promise<EmoneyTransaction[]> {
    debugLog('PaymentService.getEmoneyTransactions', studentId);
    return this.dataProvider.getEmoneyTransactions(studentId);
  }

  /**
   * Top up e-money
   */
  async topUpEmoney(studentId: string, amount: number, description: string): Promise<void> {
    const transaction: EmoneyTransaction = {
      id: `emoney_${Date.now()}`,
      studentId,
      type: 'topup',
      amount,
      description,
      category: 'Top Up',
      date: new Date().toISOString().split('T')[0],
    };

    await this.dataProvider.saveEmoneyTransaction(transaction);
    debugLog('E-money topped up:', transaction);
  }

  /**
   * Spend e-money (belanja)
   */
  async spendEmoney(
    studentId: string,
    amount: number,
    description: string,
    category: string,
    location?: string
  ): Promise<void> {
    const balance = await this.getEmoneyBalance(studentId);

    if (balance < amount) {
      throw new Error('Saldo tidak mencukupi');
    }

    const transaction: EmoneyTransaction = {
      id: `emoney_${Date.now()}`,
      studentId,
      type: 'spending',
      amount,
      description,
      category,
      date: new Date().toISOString().split('T')[0],
      location,
    };

    await this.dataProvider.saveEmoneyTransaction(transaction);
    debugLog('E-money spent:', transaction);
  }

  /**
   * Kirim uang saku ke santri (transfer dari wali)
   */
  async sendAllowance(
    studentId: string,
    amount: number,
    note: string
  ): Promise<void> {
    const transaction: EmoneyTransaction = {
      id: `emoney_${Date.now()}`,
      studentId,
      type: 'transfer_in',
      amount,
      description: note || 'Uang Saku dari Wali',
      category: 'uang_saku',
      date: new Date().toISOString().split('T')[0],
    };
    await this.dataProvider.saveEmoneyTransaction(transaction);
    debugLog('Allowance sent:', transaction);
  }

  /**
   * Top Up via Virtual Account (simulasi — dalam production akan ada webhook verifikasi)
   */
  async topUpViaVA(
    studentId: string,
    amount: number,
    bankName: string,
    vaNumber: string
  ): Promise<void> {
    const transaction: EmoneyTransaction = {
      id: `emoney_${Date.now()}`,
      studentId,
      type: 'topup',
      amount,
      description: `Top Up via ${bankName} Virtual Account`,
      category: 'Top Up',
      date: new Date().toISOString().split('T')[0],
      verificationStatus: 'pending',
      vaReference: vaNumber,
    };
    await this.dataProvider.saveEmoneyTransaction(transaction);
    debugLog('VA top-up requested:', transaction);
  }

  /**
   * Konfirmasi top-up (simulasi verifikasi dari admin/backend)
   */
  async confirmTopUp(transactionId: string): Promise<void> {
    const transactions = await this.dataProvider.getEmoneyTransactions('');
    const tx = transactions.find(t => t.id === transactionId);
    if (tx) {
      tx.verificationStatus = 'verified';
      await this.dataProvider.saveEmoneyTransaction(tx);
    }
  }

  /**
   * Get ringkasan dompet santri (saldo, total, per-kategori)
   */
  async getWalletSummary(studentId: string): Promise<WalletSummary> {
    const transactions = await this.getEmoneyTransactions(studentId);

    const CATEGORY_META: Record<string, { label: string; color: string }> = {
      spp:          { label: 'SPP / Syahriyah', color: '#dc2626' },
      makan:        { label: 'Uang Makan',       color: '#ea580c' },
      laundry:      { label: 'Laundry',           color: '#9333ea' },
      kitab:        { label: 'Kitab & Buku',      color: '#2563eb' },
      kegiatan:     { label: 'Kegiatan',          color: '#0891b2' },
      perlengkapan: { label: 'Perlengkapan',      color: '#16a34a' },
      uang_saku:    { label: 'Uang Saku',         color: '#ca8a04' },
      umum:         { label: 'Lain-lain',         color: '#6b7280' },
    };

    let balance = 0;
    let totalTopup = 0;
    let totalSpending = 0;
    const spendMap: Record<string, number> = {};

    transactions.forEach(t => {
      const isIn = t.type === 'topup' || t.type === 'transfer_in' || t.type === 'refund';
      const isOut = t.type === 'spending' || t.type === 'transfer_out';
      const isPendingTopup = isIn && t.verificationStatus === 'pending';

      if (isIn && !isPendingTopup) {
        balance += t.amount;
        totalTopup += t.amount;
      } else if (isOut) {
        balance -= t.amount;
        totalSpending += t.amount;
        const cat = t.category in CATEGORY_META ? t.category : 'umum';
        spendMap[cat] = (spendMap[cat] || 0) + t.amount;
      }
    });

    const spendingByCategory = Object.entries(spendMap).map(([cat, amount]) => ({
      category: cat,
      label: CATEGORY_META[cat]?.label ?? cat,
      amount,
      color: CATEGORY_META[cat]?.color ?? '#6b7280',
    })).sort((a, b) => b.amount - a.amount);

    const recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    return { balance, totalTopup, totalSpending, spendingByCategory, recentTransactions };
  }

  /**
   * Get virtual accounts milik santri
   */
  async getVirtualAccounts(studentId: string): Promise<any[]> {
    return this.dataProvider.getVirtualAccounts ?
      await this.dataProvider.getVirtualAccounts(studentId) :
      [(await this.dataProvider.getVirtualAccount(studentId))].filter(Boolean);
  }

  /**
   * Get summary pembayaran
   */
  async getPaymentSummary(studentId: string): Promise<{
    totalPending: number;
    totalPaid: number;
    pendingCount: number;
    paidCount: number;
  }> {
    const [pending, paid] = await Promise.all([
      this.getPendingPayments(studentId),
      this.getPaidPayments(studentId),
    ]);

    return {
      totalPending: pending.reduce((sum, p) => sum + p.amount, 0),
      totalPaid: paid.reduce((sum, p) => sum + p.amount, 0),
      pendingCount: pending.length,
      paidCount: paid.length,
    };
  }
}

// Singleton instance
let paymentServiceInstance: PaymentService | null = null;

export const getPaymentService = (): PaymentService => {
  if (!paymentServiceInstance) {
    paymentServiceInstance = new PaymentService();
  }
  return paymentServiceInstance;
};
