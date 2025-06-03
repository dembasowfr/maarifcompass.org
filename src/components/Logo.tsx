
import Link from 'next/link';
import type { FC } from 'react';
import { Compass } from 'lucide-react';

interface LogoProps {
  locale: string;
  text: string; 
}

const Logo: FC<LogoProps> = ({ locale, text }) => {
  // This component is now largely superseded by the direct implementation in Navbar.tsx for color control
  // Keeping it for potential future use or if Navbar's direct implementation is reverted.
  // For the new theme, Navbar directly handles logo colors.
  return (
    <Link href={`/${locale}`} className="flex items-center space-x-2 text-[hsl(var(--pure-white))] hover:opacity-80 transition-opacity">
      <Compass className="h-7 w-7 text-[hsl(var(--maarif-turquoise))]" /> 
      <span className="text-xl font-bold md:hidden">{text}</span>
    </Link>
  );
};

export default Logo;
