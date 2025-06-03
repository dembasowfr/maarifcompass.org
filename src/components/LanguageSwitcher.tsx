
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { languages } from '@/lib/i18n/settings';
import { useTranslation } from '@/lib/i18n/client';

interface LanguageSwitcherProps {
  lng: string;
}

export default function LanguageSwitcher({ lng }: LanguageSwitcherProps) {
  const { t } = useTranslation(lng, 'common');
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (newLocale: string) => {
    if (pathname) {
      const segments = pathname.split('/');
      segments[1] = newLocale;
      router.push(segments.join('/'));
    } else {
      router.push(`/${newLocale}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          aria-label={t('navbar.language')}
          className="bg-[hsl(var(--calm-blue))] text-primary-foreground hover:bg-[hsl(var(--calm-blue-hover))] focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => changeLanguage(loc)}
            disabled={lng === loc}
          >
            {loc.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
