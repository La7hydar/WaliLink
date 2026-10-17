import { useEffect, useState } from 'react';
import { ArrowLeft, Mail, UserRound } from 'lucide-react';
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
  initialEmail = 'haidarahnaf137@gmail.com',
  emailConfirmed: initialEmailConfirmed = false,
}: GuardianEmailRegistrationProps) {
  const [email, setEmail] = useState(initialEmail);
  const [childName, setChildName] = useState('Haidar Ahnaf');
  const [childBirthDate, setChildBirthDate] = useState('2010-04-12');
  const [password, setPassword] = useState('demo123');
  const [confirmPassword, setConfirmPassword] = useState('demo123');
  const [emailConfirmed, setEmailConfirmed] = useState(initialEmailConfirmed);
  const [waitingForConfirmation, setWaitingForConfirmation] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
    setEmailConfirmed(initialEmailConfirmed);
  }, [initialEmail, initialEmailConfirmed]);

  const completeRegistration = async () => {
    setError('');
    setIsBusy(true);

    try {
      const guardian = await getAuthService().completeGuardianEmailRegistration({
        email,
        childName,
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
        await completeRegistration();
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
    } catch (confirmationError) {
      setError(confirmationError instanceof Error ? confirmationError.message : 'Status email gagal diperiksa.');
    } finally {
      setIsBusy(false);
    }
  };

  const passwordsMatch = password.length >= 6 && password === confirmPassword;

  return (
    <div className="size-full overflow-y-auto bg-gradient-to-br from-green-50 to-emerald-50 p-5 safe-area-top safe-area-bottom dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto flex min-h-full max-w-lg flex-col justify-center gap-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} aria-label="Kembali">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Daftar Akun Wali</h1>
            <p className="text-sm text-muted-foreground">
              {waitingForConfirmation ? 'Konfirmasi email untuk melanjutkan' : 'Verifikasi data yang sudah disetujui'}
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
                Tautan verifikasi dikirim ke {email}. Buka tautan itu, kembali ke aplikasi, lalu lanjutkan aktivasi.
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
              <div className="space-y-2">
                <Label htmlFor="child-name">Nama lengkap anak</Label>
                <Input
                  id="child-name"
                  autoComplete="off"
                  value={childName}
                  onChange={(event) => setChildName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="child-birth-date">Tanggal lahir anak</Label>
                <Input
                  id="child-birth-date"
                  type="date"
                  value={childBirthDate}
                  onChange={(event) => setChildBirthDate(event.target.value)}
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
              <p className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
                Data demo: wali Ahnaf Haidar, anak Haidar Ahnaf. Tanggal lahir masih dummy.
                Password uji yang disarankan: demo123.
              </p>
              {emailConfirmed && (
                <p className="rounded-md bg-emerald-50 p-3 text-xs text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200">
                  Email terverifikasi. Lanjutkan pencocokan data untuk mengaktifkan akun.
                </p>
              )}
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <Button
                className="w-full"
                onClick={emailConfirmed ? completeRegistration : register}
                disabled={isBusy || !email.trim() || !childName.trim() || !childBirthDate || (!emailConfirmed && !passwordsMatch)}
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