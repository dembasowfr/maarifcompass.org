
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, ArrowUpCircle, Compass } from 'lucide-react'; // Added Compass

interface FooterProps {
  lng: string;
}

// Placeholder for BackToTopButton functionality
// In a real app, this would be a client component with window.scrollTo
const BackToTopButton = async ({ lng }: { lng: string }) => {
  const { t } = await useTranslation(lng, 'common');
  return (
    <a
      href="#top" // Simple anchor link, JS needed for smooth scroll
      aria-label={t('footer.backToTop')}
      className="absolute bottom-6 right-6 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/80 transition-colors"
    >
      <ArrowUpCircle className="h-6 w-6" />
    </a>
  );
};


export default async function Footer({ lng }: FooterProps) {
  const { t } = await useTranslation(lng, 'common');
  const currentYear = new Date().getFullYear();

  const linkSections = [
    {
      titleKey: 'footer.aboutUs',
      links: [
        { labelKey: 'footer.links.turkishMaarifFoundation', href: `/${lng}/about` },
        { labelKey: 'footer.links.areasOfWork', href: '#' },
        { labelKey: 'footer.links.corporateIdentity', href: '#' },
        { labelKey: 'footer.links.management', href: '#' },
      ],
    },
    {
      titleKey: 'footer.publications',
      links: [
        { labelKey: 'footer.links.internationalMaarifMagazine', href: '#' },
        { labelKey: 'footer.links.maarifPublications', href: '#' },
        { labelKey: 'footer.links.books', href: '#' },
        { labelKey: 'footer.links.activityReports', href: '#' },
        { labelKey: 'footer.links.domesticPublications', href: '#' },
      ],
    },
    {
      titleKey: 'footer.media',
      links: [
        { labelKey: 'footer.links.news', href: `/${lng}/haberler` },
        { labelKey: 'footer.links.announcement', href: `/${lng}/duyurular` },
        { labelKey: 'footer.links.photos', href: '#' },
        { labelKey: 'footer.links.videos', href: '#' },
      ],
    },
    {
      titleKey: 'footer.policies',
      links: [
        { labelKey: 'footer.privacyPolicy', href: `/${lng}/privacy-policy` },
        { labelKey: 'footer.links.dataProtectionPolicy', href: `/${lng}/data-protection-policy` },
      ],
    },
  ];

  const socialMediaLinks = [
    { labelKey: 'footer.links.facebook', href: 'https://facebook.com', Icon: Facebook },
    { labelKey: 'footer.links.twitter', href: 'https://twitter.com', Icon: Twitter },
    { labelKey: 'footer.links.instagram', href: 'https://instagram.com', Icon: Instagram },
    { labelKey: 'footer.links.youtube', href: 'https://youtube.com', Icon: Youtube },
    { labelKey: 'footer.links.linkedin', href: 'https://linkedin.com', Icon: Linkedin },
  ];

  const copyrightInfo = t('footer.copyright', { returnObjects: true, year: currentYear }) as { text: string; author: string; link: string; message: string };


  return (
    <footer className="border-t relative" id="page-footer">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-footer-foreground/10 rounded-full mb-3">
            <Compass className="h-10 w-10 text-primary" /> {/* Maarif Compass Logo icon */}
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {t('footer.tmvLogoText')} {/* Should now render "MaarifCompass" */}
          </h2>
        </div>

        {/* Link Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
          {linkSections.map((section) => (
            <div key={section.titleKey}>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                {t(section.titleKey)}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link href={link.href} className="text-sm hover:underline transition-colors">
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {/* Social Media Section */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              {t('footer.socialMedia')}
            </h3>
            <ul className="space-y-3">
              {socialMediaLinks.map(({ labelKey, href, Icon }) => (
                <li key={labelKey}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline transition-colors flex items-center group">
                    <Icon className="h-5 w-5 mr-2 text-footer-muted-foreground group-hover:text-primary transition-colors" />
                    {t(labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-footer-muted-foreground border-t border-footer-border pt-8">
          <p>
            {copyrightInfo.text}
            <a href={copyrightInfo.link} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">
              {copyrightInfo.author}
            </a>
            . {copyrightInfo.message}
          </p>
        </div>
      </div>
      <BackToTopButton lng={lng} />
    </footer>
  );
}

    