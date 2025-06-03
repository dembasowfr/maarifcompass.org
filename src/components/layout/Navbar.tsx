// src/components/layout/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Facebook, Twitter, Youtube, Instagram, Send, HelpCircle, Sparkles, Compass, LogIn, LogOut, UserCircle, Loader2 } from 'lucide-react';
// Removed Logo import as it's directly implemented
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/client';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  lng: string;
}

export default function Navbar({ lng }: NavbarProps) {
  const { t } = useTranslation(lng, 'common');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { currentUser, signInWithGoogle, signOutUser, loading: authLoading } = useAuth();

  const navLinks = [
    { href: `/${lng}`, label: t('navbar.home') },
    { href: `/${lng}/about`, label: t('navbar.about') },
    { href: `/${lng}/haberler`, label: t('navbar.haberler') },
    { href: `/${lng}/etkinlikler`, label: t('navbar.etkinlikler') },
    { href: `/${lng}/duyurular`, label: t('navbar.duyurular') },
    { href: `/${lng}/opportunities`, label: t('navbar.opportunities') },
    { href: `/${lng}/document-center`, label: t('navbar.documentCenter') },
    { href: `/${lng}/contact`, label: t('navbar.contact') },
  ];

  const socialMediaLinks = [
    { label: 'Facebook', href: '#', Icon: Facebook, ariaLabelKey: 'footer.links.facebook' },
    { label: 'Twitter', href: '#', Icon: Twitter, ariaLabelKey: 'footer.links.twitter' },
    { label: 'YouTube', href: '#', Icon: Youtube, ariaLabelKey: 'footer.links.youtube' },
    { label: 'Instagram', href: '#', Icon: Instagram, ariaLabelKey: 'footer.links.instagram' },
    { label: 'Telegram', href: '#', Icon: Send, ariaLabelKey: 'footer.links.telegram' },
  ];

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname, currentUser]);

  const AuthButton = () => {
    if (authLoading) {
      return (
        <Button variant="ghost" size="icon" disabled className="text-[hsl(var(--pure-white))] hover:bg-transparent">
          <Loader2 className="h-5 w-5 animate-spin" />
        </Button>
      );
    }

    if (currentUser) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 text-[hsl(var(--pure-white))] hover:bg-[hsla(var(--pure-white),0.1)] focus-visible:ring-0 focus-visible:ring-offset-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || t('navbar.user')} />
                <AvatarFallback className="bg-[hsl(var(--maarif-turquoise))] text-[hsl(var(--pure-white))]">
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <UserCircle size={20}/>}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{currentUser.displayName || t('navbar.user')}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={`/${lng}/ai-assistant`}>
                <Sparkles className="mr-2 h-4 w-4 text-[hsl(var(--maarif-turquoise))]" />
                <span>{t('navbar.aiAssistant')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOutUser} className="cursor-pointer text-destructive focus:text-destructive-foreground focus:bg-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('navbar.signOut')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Button
        onClick={signInWithGoogle}
        variant="default" // Changed to default for solid primary button
        size="sm"
        // className is simplified as variant="default" handles main styling
      >
        <LogIn className="mr-2 h-4 w-4" />
        {t('navbar.signIn')}
      </Button>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[hsl(var(--compass-navy))] text-[hsl(var(--pure-white))] shadow-sm">
      {/* Top Bar */}
      <div className="bg-[hsl(var(--compass-navy))] border-b border-[hsla(var(--pure-white),0.1)] hidden md:block">
        <div className="container mx-auto flex h-10 items-center justify-between text-xs px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-x-4">
            <Link href={`/${lng}/sss`} className="hover:text-[hsl(var(--soft-turquoise))] flex items-center gap-1">
              <HelpCircle size={14} />
              {t('navbar.sss')}
            </Link>
            <span className="flex items-center gap-1">
              <Phone size={14} />
              +90 536 594 98 84
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {socialMediaLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t(social.ariaLabelKey)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--maarif-turquoise))] text-[hsl(var(--pure-white))] hover:bg-[hsl(var(--soft-turquoise))] transition-colors"
              >
                <social.Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={`/${lng}`} className="flex items-center space-x-2 text-[hsl(var(--pure-white))] hover:opacity-80 transition-opacity">
          <Compass className="h-7 w-7 text-[hsl(var(--maarif-turquoise))]" />
          <span className="text-xl font-bold md:hidden">MaarifCompass</span> {/* Static text, not from appName */}
        </Link>
        
        <nav className="hidden md:flex items-center space-x-3 lg:space-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-[hsl(var(--soft-turquoise))] ${pathname === link.href ? 'text-[hsl(var(--soft-turquoise))] underline underline-offset-4 decoration-[hsl(var(--maarif-turquoise))]' : 'text-[hsl(var(--pure-white))]'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="hidden md:flex">
            <AuthButton />
          </div>
          <LanguageSwitcher lng={lng} /> {/* LanguageSwitcher will style its own button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={t('navbar.toggleMenu')}
              className="text-[hsl(var(--pure-white))] hover:bg-[hsla(var(--pure-white),0.1)] focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[hsl(var(--compass-navy))] shadow-lg p-4 border-t border-[hsla(var(--pure-white),0.1)]">
           <div className="flex flex-col space-y-3 mb-4">
             <div className="mb-2"> {/* Auth button for mobile */}
               <AuthButton />
             </div>
             {currentUser && (
                <Button 
                  asChild 
                  size="sm" 
                  className="w-full bg-[hsl(var(--maarif-turquoise))] text-[hsl(var(--pure-white))] hover:bg-[hsl(var(--soft-turquoise))] flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
               >
                  <Link href={`/${lng}/ai-assistant`}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t('navbar.aiAssistant')}
                  </Link>
                </Button>
             )}
             <Link href={`/${lng}/sss`} className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-[hsl(var(--soft-turquoise))] hover:text-[hsl(var(--compass-navy))] flex items-center gap-2 ${pathname === `/${lng}/sss` ? 'bg-[hsl(var(--soft-turquoise))] text-[hsl(var(--compass-navy))]' : 'text-[hsl(var(--pure-white))]'}`} onClick={() => setIsMobileMenuOpen(false)}>
              <HelpCircle size={18} />{t('navbar.sss')}
            </Link>
            <div className="px-3 py-2 text-base font-medium text-[hsl(var(--pure-white))] flex items-center gap-2">
              <Phone size={18} /> +90 536 594 98 84
            </div>
            <div className="flex justify-center items-center gap-3 py-2">
              {socialMediaLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(social.ariaLabelKey)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--maarif-turquoise))] text-[hsl(var(--pure-white))] hover:bg-[hsl(var(--soft-turquoise))] transition-colors"
                >
                  <social.Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-[hsl(var(--soft-turquoise))] hover:text-[hsl(var(--compass-navy))] ${pathname === link.href ? 'bg-[hsl(var(--soft-turquoise))] text-[hsl(var(--compass-navy))]' : 'text-[hsl(var(--pure-white))]'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
