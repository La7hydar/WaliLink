import { useState } from 'react';
import { KeyRound, MailCheck } from 'lucide-react';
import { getAuthService } from '../services/AuthService';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface PasswordResetActionProps {
  email: string;
}

export function PasswordResetAction({ email }: PasswordResetActionProps) {
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const sendVerificationEmail = async () => {
    setIsSending(true);
    setMessage('');
    setError('');

    try {
      await getAuthService().requestPasswordReset(email);
      setMessage('Jika email ini terdaftar, tautan verifikasi sudah dikirim. Buka tautan tersebut untuk membuat password baru.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Tautan verifikasi gagal dikirim.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Kami akan mengirim tautan verifikasi ke email akun. Password baru hanya dapat dibuat setelah tautan dibuka.
      </p>
      <Button type="button" variant="outline" onClick={sendVerificationEmail} disabled={isSending || !email.trim()}>
        <MailCheck className="mr-2 h-4 w-4" />
        {isSending ? 'Mengirim tautan...' : 'Kirim tautan verifikasi'}
      </Button>
      {message && <p role="status" className="text-sm text-emerald-700 dark:text-emerald-300">{message}</p>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

interface PasswordRecoveryScreenProps {
  onComplete: () => void;
}

export function PasswordRecoveryScreen({ onComplete }: PasswordRecoveryScreenProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const savePassword = async () => {
    setError('');
    setIsSaving(true);

    try {
      await getAuthService().updatePasswordAfterEmailVerification(password);
      onComplete();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Password gagal diperbarui.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="islamic-atmosphere flex h-full items-center justify-center overflow-y-auto bg-background p-5 safe-area-top safe-area-bottom">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Buat password baru
          </CardTitle>
          <CardDescription>
            Tautan email sudah memverifikasi permintaan Anda. Buat password baru untuk menyelesaikan proses.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recovery-password">Password baru</Label>
            <Input
              id="recovery-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recovery-password-confirm">Ulangi password baru</Label>
            <Input
              id="recovery-password-confirm"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button
            type="button"
            className="w-full"
            onClick={savePassword}
            disabled={isSaving || password.length < 8 || password !== confirmPassword}
          >
            {isSaving ? 'Menyimpan...' : 'Simpan password baru'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
