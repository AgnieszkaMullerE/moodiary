'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function NavItem({
  href,
  active,
  label,
  children,
}: {
  href: string;
  active: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`flex-1 flex flex-col items-center gap-1.5 transition-colors ${
        active ? 'text-[#1C1C1E]' : 'text-gray-300'
      }`}
    >
      {children}
      <div className={`size-1 rounded-full transition-colors ${active ? 'bg-[#1C1C1E]' : 'bg-transparent'}`} />
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const isToday = pathname === '/';
  const isSearch = pathname === '/search';
  const isEntries = pathname.startsWith('/entries');

  return (
    <nav className="w-full bg-white border-t border-gray-100 flex items-center px-8 py-3 pb-5">

      <NavItem href="/" active={isToday} label="Dzisiaj">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 2.5V4M12 20v1.5M4.22 4.22l1.06 1.06M18.72 18.72l1.06 1.06M2.5 12H4M20 12h1.5M4.22 19.78l1.06-1.06M18.72 5.28l1.06-1.06"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </NavItem>

      <NavItem href="/search" active={isSearch} label="Szukaj">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </NavItem>

      <NavItem href="/entries" active={isEntries} label="Wpisy">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M3 11h18M3 16h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </NavItem>

    </nav>
  );
}
