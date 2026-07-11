'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/prepare', label: 'Prepare' },
  { href: '/community', label: 'Community' },
  { href: '/family', label: 'Family' },
  { href: '/architecture', label: 'Architecture' },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-brand" aria-label="Monsoon Prep home">
          <span className="site-brand__badge">☔</span>
          <span>Monsoon Prep</span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          <ul>
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link href={link.href} className={`nav-link${isActive ? ' active' : ''}`}>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
