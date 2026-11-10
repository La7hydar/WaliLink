import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ClipboardCheck, Mail, UserRound } from 'lucide-react';
import { getAuthService } from '../services/AuthService';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface GuardianEmailRegistrationProps {
  onBack: () => void;
  onAccountCreated: (guardianData: any) => void;
  initialEmail?: string;
  emailConfirmed?: boolean;
}

export function GuardianEmailRegistration({
  onBack,
  onAccountCreated,
  initialEmail = '',
  emailConfirmed: initialEmailConfirmed = false,
}: GuardianEmailRegistrationProps) {
  const [showRegistrationForm, setShowRegistrationForm] = useState(initialEmailConfirmed);
  const [email, setEmail] = useState(initialEmail);
  const [childName, setChildName] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [children, setChildren] = useState<Array<{ id: string; fullName: string }>>([]);
  const [childBirthDate, setChildBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailConfirmed, setEmailConfirmed] = useState(initialEmailConfirmed);
  const [waitingForConfirmation, setWaitingForConfirmation] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);
  const [showChildSuggestions, setShowChildSuggestions] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
    setEmailConfirmed(initialEmailConfirmed);
    if (initialEmailConfirmed) setShowRegistrationForm(true);
  }, [initialEmail, initialEmailConfirmed]);

  useEffect(() => {
    if (!emailConfirmed || !showRegistrationForm) return;

    let isActive = true;
    setIsLoadingChildren(true);
    setError('');

    getAuthService()
      .getGuardianRegistrationChildren()
      .then((registeredChildren) => {
        if (isActive) setChildren(registeredChildren);
      })
      .catch((childrenError) => {
        if (isActive) {
          setError(childrenError instanceof Error ? childrenError.message : 'Daftar anak gagal dimuat.');
        }
      })
      .finally(() => {
        if (isActive) setIsLoadingChildren(false);
      });

    return () => {
      isActive = false;
    };
  }, [emailConfirmed, showRegistrationForm]);

  const filteredChildren = useMemo(() => {
    const search = childName.trim().toLocaleLowerCase('id');
    return children.filter((child) =>
      child.fullName.toLocaleLowerCase('id').includes(search),
    );
  }, [children, childName]);

  const completeRegistration = async () => {
    setError('');
    setIsBusy(true);

    try {
      const guardian = await getAuthService().completeGuardianEmailRegistration({
        email,
        studentId: selectedStudentId,
        childBirthDate,
      });
      onAccountCreated(guardian);
    } catch (registrationError) {
      setError(registrationError instanceof Error ? registrationError.message : 'Aktivasi akun gagal.');
    } finally {
      setIsBusy(false);
    }
  };

  const register = async () => {
    setError('');
    setIsBusy(true);

    try {
      const result = await getAuthService().startGuardianEmailRegistration(email, password);
      setEmail(result.email);
      if (result.confirmationRequired) {
        setWaitingForConfirmation(true);
      } else {
        setEmailConfirmed(true);
        setShowRegistrationForm(true);
      }
    } catch (registrationError) {
      setError(registrationError instanceof Error ? registrationError.message : 'Pendaftaran gagal.');
    } finally {
      setIsBusy(false);
    }
  };

  const checkEmailConfirmation = async () => {
    setError('');
    setIsBusy(true);

    try {
      const pendingEmail = await getAuthService().getPendingGuardianRegistrationEmail();
      if (!pendingEmail) {
        setError('Konfirmasi belum terdeteksi. Buka tautan konfirmasi di email, lalu coba lagi.');
        return;
      }
      setEmail(pendingEmail);
      setEmailConfirmed(true);
      setWaitingForConfirmation(false);
      setShowRegistrationForm(true);
    } catch (confirmationError) {
      setError(confirmationError instanceof Error ? confirmationError.message : 'Status email gagal diperiksa.');
    } finally {
      setIsBusy(false);
    }
  };

  const passwordsMatch = password.length >= 6 && password === confirmPassword;

  if (!showRegistrationForm) {
    return (
      <div className="islamic-atmosphere size-full overflow-y-auto bg-background p-5 safe-area-top safe-area-bottom">
        <div className="mx-auto flex min-h-full max-w-lg flex-col justify-center gap-5">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} aria-label="Kembali">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Sebelum membuat akun wali</h1>
              <p className="text-sm text-muted-foreground">Pastikan data santri sudah terdaftar dan disetujui pondok.</p>
            </div>
          </div>

          <Card className="islamic-panel border-emerald-700/20 dark:border-emerald-300/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                Alur pendaftaran wali
              </CardTitle>
              <CardDescription>
                Akun WaliLink ditautkan hanya ke data santri dan wali yang telah diperiksa pondok. Email diverifikasi sebelum data anak ditampilkan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal space-y-3 pl-5 text-sm text-foreground">
                <li>
                  Daftarkan santri melalui admin pondok secara langsung atau melalui website resmi pondok.
                </li>
                <li>
                  Admin Data akan memeriksa informasi pendaftaran, menyetujui data, lalu mencatatnya di database pondok.
                </li>
                <li>
                  Setelah disetujui, buat akun di sini menggunakan email wali yang tercatat serta nama lengkap dan tanggal lahir anak sesuai data pondok.
                </li>
              </ol>
              <p className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3 text-xs text-muted-foreground">
                WaliLink belum menerima permohonan pendaftaran santri melalui aplikasi ini. Jika data belum terdaftar atau tidak cocok, hubungi admin pondok; jangan gunakan data anak lain.
              </p>
              <Button className="w-full" onClick={() => setShowRegistrationForm(true)}>
                Data santri sudah disetujui, lanjut daftar akun
              </Button>
              <Button variant="outline" className="w-full" onClick={onBack}>
                Belum terdaftar, kembali
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="islamic-atmosphere size-full overflow-y-auto bg-background p-5 safe-area-top safe-area-bottom">
      <div className="mx-auto flex min-h-full max-w-lg flex-col justify-center gap-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} aria-label="Kembali">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Daftar Akun Wali</h1>
            <p className="text-sm text-muted-foreground">
              {waitingForConfirmation
                ? 'Konfirmasi email untuk melanjutkan'
                : emailConfirmed
                  ? 'Pilih anak dari data yang terdaftar'
                  : 'Verifikasi email wali terlebih dahulu'}
            </p>
          </div>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div className={`h-full bg-primary transition-all ${waitingForConfirmation ? 'w-1/2' : 'w-full'}`} />
        </div>

        {waitingForConfirmation ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" /> Periksa email Anda
              </CardTitle>
              <CardDescription>
                Tautan verifikasi dikirim ke {email}. Buka tautan itu; setelah kembali ke WaliLink, pendaftaran akan dilanjutkan otomatis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <Button className="w-full" onClick={checkEmailConfirmation} disabled={isBusy}>
                {isBusy ? 'Memeriksa...' : 'Saya sudah verifikasi email'}
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setWaitingForConfirmation(false)} disabled={isBusy}>
                Kembali ke data pendaftaran
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-5 w-5" /> Data Wali dan Anak
              </CardTitle>
              <CardDescription>
                Email harus sama dengan yang dicatat administrator pada data wali yang sudah disetujui.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="guardian-email">Email wali</Label>
                <Input
                  id="guardian-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={emailConfirmed}
                />
              </div>
              {!emailConfirmed && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="guardian-password">Password akun</Label>
                    <Input
                      id="guardian-password"
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guardian-password-confirm">Ulangi password</Label>
                    <Input
                      id="guardian-password-confirm"
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                    {password && password.length < 6 && (
                      <p className="text-xs text-destructive">Password minimal 6 karakter.</p>
                    )}
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-destructive">Password belum cocok.</p>
                    )}
                  </div>
                </>
              )}
              {emailConfirmed && (
                <>
                  <p className="rounded-md bg-emerald-50 p-3 text-xs text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200">
                    Email terverifikasi. Demi menjaga privasi, saran hanya memuat anak yang terkait dengan email wali ini.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="child-name">Cari dan pilih nama lengkap anak</Label>
                    <Input
                      id="child-name"
                      autoComplete="off"
                      role="combobox"
                      aria-autocomplete="list"
                      aria-expanded={showChildSuggestions && filteredChildren.length > 0}
                      aria-controls="guardian-child-suggestions"
                      placeholder={isLoadingChildren ? 'Memuat data anak...' : 'Ketik nama anak untuk mencari'}
                      value={childName}
                      disabled={isLoadingChildren || children.length === 0}
                      onFocus={() => setShowChildSuggestions(true)}
                      onChange={(event) => {
                        setChildName(event.target.value);
                        setSelectedStudentId('');
                        setChildBirthDate('');
                        setShowChildSuggestions(true);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Escape') setShowChildSuggestions(false);
                      }}
                    />
                    {showChildSuggestions && filteredChildren.length > 0 && (
                      <div
                        id="guardian-child-suggestions"
                        role="listbox"
                        aria-label="Saran nama anak terdaftar"
                        className="max-h-48 overflow-y-auto rounded-md border bg-background p-1 shadow-md"
                      >
                        {filteredChildren.map((child) => (
                          <button
                            key={child.id}
                            type="button"
                            role="option"
                            aria-selected={selectedStudentId === child.id}
                            className="w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                            onClick={() => {
                              if (selectedStudentId !== child.id) setChildBirthDate('');
                              setChildName(child.fullName);
                              setSelectedStudentId(child.id);
                              setShowChildSuggestions(false);
                              setError('');
                            }}
                          >
                            {child.fullName}
                          </button>
                        ))}
                      </div>
                    )}
                    {!isLoadingChildren && children.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        Belum ada data anak yang terhubung dengan email ini. Pastikan admin pondok sudah mencatat email wali dan menyetujui data anak.
                      </p>
                    )}
                    {childName && !selectedStudentId && filteredChildren.length === 0 && (
                      <p className="text-xs text-muted-foreground">Nama tidak ditemukan. Pilih nama dari saran yang tersedia.</p>
                    )}
                  </div>
                  {selectedStudentId && (
                    <div className="space-y-2">
                      <Label htmlFor="child-birth-date">Tanggal lahir anak</Label>
                      <Input
                        id="child-birth-date"
                        type="date"
                        value={childBirthDate}
                        onChange={(event) => setChildBirthDate(event.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Tanggal lahir dicocokkan dengan data pondok sebagai pemeriksaan tambahan.
                      </p>
                    </div>
                  )}
                </>
              )}
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <Button
                className="w-full"
                onClick={emailConfirmed ? completeRegistration : register}
                disabled={
                  isBusy
                  || !email.trim()
                  || (emailConfirmed
                    ? !selectedStudentId || !childBirthDate
                    : !passwordsMatch)
                }
              >
                {isBusy
                  ? 'Memproses...'
                  : emailConfirmed
                    ? 'Cocokkan data dan aktifkan akun'
                    : 'Kirim verifikasi email'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}