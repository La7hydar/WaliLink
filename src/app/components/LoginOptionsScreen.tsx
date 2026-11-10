import { useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  CircleHelp,
  Languages,
  LogIn,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface LoginOptionsScreenProps {
  serverName: string;
  onBack: () => void;
  onLogin: () => void;
  onCreateGuardianAccount: () => void;
  onAdminLogin: () => void;
  onAdminSectionLogin?: () => void;
  onTutorial?: () => void;
  onLanguageSettings?: () => void;
}

export function LoginOptionsScreen({
  serverName,
  onBack,
  onLogin,
  onCreateGuardianAccount,
  onAdminLogin,
  onAdminSectionLogin,
  onTutorial,
  onLanguageSettings,
}: LoginOptionsScreenProps) {
  const [showOtherOptions, setShowOtherOptions] = useState(false);

  return (
    <div className="islamic-atmosphere size-full bg-background safe-area-top safe-area-bottom">
      <ScrollArea className="h-full">
        <div className="mx-auto flex min-h-full w-full max-w-xl flex-col px-5 pb-8 pt-5">
          <div className="mb-8 flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              aria-label="Kembali ke pilihan pondok atau sekolah"
              className="rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                WaliLink
              </p>
              <h1 className="truncate text-lg font-semibold text-foreground">{serverName}</h1>
            </div>
          </div>

          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-amber-400/20 text-emerald-700 ring-1 ring-emerald-500/25 dark:text-emerald-300">
              <LogIn className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Selamat datang</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Silakan masuk untuk melihat informasi putra-putri Anda.
            </p>
          </div>

          <button
            type="button"
            onClick={onLogin}
            className="group mb-4 flex min-h-24 w-full items-center gap-4 rounded-2xl border border-emerald-400/50 bg-gradient-to-r from-emerald-700 to-teal-700 p-5 text-left text-white shadow-[0_12px_36px_rgba(16,185,129,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_44px_rgba(16,185,129,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/10">
              <LogIn className="h-6 w-6" />
            </span>
            <span className="flex-1">
              <span className="block text-lg font-semibold">Masuk sebagai Wali Santri</span>
              <span className="mt-1 block text-sm text-emerald-50/85">
                Pantau perkembangan dan kebutuhan putra-putri Anda
              </span>
            </span>
            <span aria-hidden="true" className="text-2xl transition-transform group-hover:translate-x-1">›</span>
          </button>

          <button
            type="button"
            onClick={onCreateGuardianAccount}
            className="mb-4 flex min-h-20 w-full items-center gap-4 rounded-2xl border border-emerald-700/25 bg-card/85 p-4 text-left text-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-[0_12px_36px_rgba(16,185,129,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/15 to-amber-400/15 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300">
              <UserPlus className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block font-semibold">Daftar sebagai Wali Santri</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                Untuk wali dengan data santri yang sudah disetujui pondok
              </span>
            </span>
            <span aria-hidden="true" className="text-xl text-emerald-700 dark:text-emerald-300">›</span>
          </button>

          <button
            type="button"
            onClick={() => setShowOtherOptions((shown) => !shown)}
            aria-expanded={showOtherOptions}
            aria-controls="other-login-options"
            className="flex w-full items-center justify-between rounded-xl border border-border bg-card/80 px-4 py-3 text-sm font-medium text-foreground transition hover:border-emerald-500/40 hover:bg-emerald-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <span>Lainnya</span>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showOtherOptions ? 'rotate-180' : ''}`} />
          </button>

          {showOtherOptions && (
            <div id="other-login-options" className="islamic-panel mt-3 space-y-3 rounded-2xl border border-emerald-700/15 bg-card p-4 dark:border-emerald-300/20">
              <p className="text-sm text-muted-foreground">
                Pilihan akses untuk pengelola institusi dan bantuan aplikasi.
              </p>

              <Button
                type="button"
                variant="outline"
                onClick={onAdminLogin}
                className="h-auto w-full justify-start gap-3 rounded-xl border-amber-500/30 py-3 text-left"
              >
                <ShieldCheck className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300" />
                <span>
                  <span className="block font-medium">Portal Administrasi</span>
                  <span className="block text-xs font-normal text-muted-foreground">Akses khusus pengelola dan administrator institusi</span>
                </span>
              </Button>

              {onAdminSectionLogin && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onAdminSectionLogin}
                  className="h-auto w-full justify-start gap-3 rounded-xl py-3 text-left"
                >
                  <ShieldCheck className="h-4 w-4 shrink-0 text-teal-700 dark:text-teal-300" />
                  <span>
                    <span className="block font-medium">Login Admin Bagian</span>
                    <span className="block text-xs font-normal text-muted-foreground">Untuk petugas dengan akses operasional terbatas</span>
                  </span>
                </Button>
              )}

              <div className="flex flex-wrap gap-2 border-t border-border pt-3">
                {onTutorial && (
                  <Button type="button" variant="ghost" size="sm" onClick={onTutorial} className="gap-2">
                    <CircleHelp className="h-4 w-4" />
                    Panduan
                  </Button>
                )}
                {onLanguageSettings && (
                  <Button type="button" variant="ghost" size="sm" onClick={onLanguageSettings} className="gap-2">
                    <Languages className="h-4 w-4" />
                    Bahasa
                  </Button>
                )}
              </div>
            </div>
          )}

          <p className="mt-auto pt-8 text-center text-xs text-muted-foreground">
            Dengan masuk, Anda menggunakan layanan institusi yang dipilih.
          </p>
        </div>
      </ScrollArea>
    </div>
  );
}
