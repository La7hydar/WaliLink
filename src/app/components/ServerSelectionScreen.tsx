import { useMemo, useState } from 'react';
import { Building2, CheckCircle2, ChevronRight, MapPin, Search } from 'lucide-react';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

interface ServerSelectionScreenProps {
  onServerSelected: (serverData: {
    serverId: string;
    serverName: string;
    isMainServer: boolean;
  }) => void;
}

const availableSchools = [
  {
    id: 'main-almunawwarah',
    name: 'Pondok Almunawwarah',
    location: 'Layanan wali santri',
    isMainServer: true,
  },
];

export function ServerSelectionScreen({ onServerSelected }: ServerSelectionScreenProps) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLocaleLowerCase('id-ID');
  const filteredSchools = useMemo(
    () => availableSchools.filter((school) =>
      `${school.name} ${school.location}`.toLocaleLowerCase('id-ID').includes(normalizedQuery),
    ),
    [normalizedQuery],
  );

  return (
    <div className="islamic-atmosphere size-full bg-background safe-area-top safe-area-bottom">
      <ScrollArea className="h-full">
        <div className="mx-auto flex min-h-full w-full max-w-xl flex-col px-5 pb-8 pt-5">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/40 bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-[0_8px_32px_rgba(16,185,129,0.28)]">
              <Building2 className="h-7 w-7" />
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">
              WaliLink
            </p>
            <h1 className="text-2xl font-semibold text-foreground">
              Pilih pondok atau sekolah
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Temukan institusi untuk melanjutkan ke layanan wali santri.
            </p>
          </div>

          <label htmlFor="school-search" className="sr-only">
            Cari nama pondok atau sekolah
          </label>
          <div className="relative mb-6">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-700 dark:text-emerald-300" />
            <Input
              id="school-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama pondok atau sekolah"
              className="h-12 rounded-2xl border-emerald-700/15 bg-card pl-11 shadow-sm ring-emerald-500/10 focus-visible:ring-emerald-500/30 dark:border-emerald-300/20"
            />
          </div>

          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Institusi tersedia</h2>
            <span className="text-xs text-muted-foreground">{filteredSchools.length} hasil</span>
          </div>

          <div className="space-y-3">
            {filteredSchools.map((school) => (
              <button
                key={school.id}
                type="button"
                onClick={() => onServerSelected({
                  serverId: school.id,
                  serverName: `${school.name} - Server Utama`,
                  isMainServer: school.isMainServer,
                })}
                className="islamic-panel group flex w-full items-center gap-4 rounded-2xl border border-emerald-700/15 bg-card p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-[0_12px_36px_rgba(16,185,129,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-emerald-300/20"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/15 to-amber-400/15 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300">
                  <Building2 className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 font-semibold text-foreground">
                    {school.name}
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
                  </span>
                  <span className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {school.location}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-600/30 text-emerald-700 dark:text-emerald-300"
                >
                  <ChevronRight className="h-4 w-4" />
                </span>
              </button>
            ))}

            {filteredSchools.length === 0 && (
              <div className="islamic-panel rounded-2xl border border-dashed border-emerald-700/25 bg-card/70 px-5 py-10 text-center dark:border-emerald-300/25">
                <Search className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
                <p className="font-medium text-foreground">Belum ada institusi yang cocok</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Periksa kembali ejaan nama pondok atau sekolah.
                </p>
              </div>
            )}
          </div>

          <p className="mt-auto pt-8 text-center text-xs text-muted-foreground">
            Institusi lain akan ditampilkan setelah layanan mereka tersedia.
          </p>
        </div>
      </ScrollArea>
    </div>
  );
}
