/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { AlignLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import AnimationContainer from '../global/animation-container';
import { ModeToggle } from '../mode-toggle';

export const ResumeBtn = () => {
  return (
    <a href="https://drive.google.com/file/d/1UheF68g8pawYs2GEvXXS0mSJTonplz7U/view?usp=sharing" target="_blank" rel="noopener noreferrer">
      <Button className="hidden sm:block font-semibold rounded-lg cursor-pointer">Resume</Button>
    </a>
  );
};

const Navbar = () => {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState('');
  const [isShrunk, setIsShrunk] = useState(false);

  useEffect(() => {
    setActiveHash(window.location.hash || '#');

    // IntersectionObserver for active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            const href = sectionId ? `#${sectionId}` : '#';
            setActiveHash(href);
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0.2,
      },
    );

    // Function to observe sections
    const observeSections = () => {
      const sections = navLinks
        .map((link) => {
          const sectionId = link.href.replace('#', '');
          const section = document.getElementById(sectionId);
          return section;
        })
        .filter(Boolean);

      if (sections.length === 0) {
        setTimeout(observeSections, 500);
        return;
      }
      sections.forEach((section) => {
        if (section) observer.observe(section);
      });
    };

    // Initial observation attempt
    observeSections();

    // Handle scroll for navbar shrinking
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsShrunk(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      const sections = navLinks.map((link) => document.getElementById(link.href.replace('#', ''))).filter(Boolean);
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  // Function to check if a link is active
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // Navigation links data with proper typing
  type NavLink = { href: string; label: string } | false;

  const handleLinkClick = (href: string) => {
    setActiveHash(href);
  };

  const navLinks: NavLink[] = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/blogs', label: 'Blogs' },
  ];

  return (
    <header className="sticky top-4 z-50 ">
      <AnimationContainer direction="top" delay={0.1} className="size-full">
        <nav
          className={cn(
            'mx-auto py-3 px-4 rounded-xl dark:bg-dark-lite/80 bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-between transition-all duration-300 max-w-7xl',
            isShrunk ? 'w-[90vw] md:max-w-4xl' : 'w-[90vw]',
          )}>
          <div>
            <Link href="/" onClick={() => handleLinkClick('/')}>
              <p className="text-2xl font-bold">
                <AnimatedShinyText>
                  <span>&lt;</span>Tariqul<span>/&gt;</span>
                </AnimatedShinyText>
              </p>
            </Link>
          </div>

          <ul className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className={`relative text-base font-medium dark:text-white/80 text-dark-deep/80 dark:hover:text-white hover:text-dark-deep transition-colors ${
                    isActive(link.href) ? 'dark:text-white text-dark-deep' : ''
                  }`}>
                  {link.label}
                  {isActive(link.href) && <span className="absolute -bottom-1 left-0 h-[2px] w-full dark:bg-white bg-dark-deep rounded-full" />}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <ResumeBtn />
            <Sheet>
              <SheetTrigger className="lg:hidden p-2 rounded-md transition-colors" aria-label="Open menu">
                <AlignLeft size={24} />
              </SheetTrigger>
              <SheetContent side="left" className="border-none p-4">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="#" onClick={() => handleLinkClick('#')}>
                      <p className="text-2xl font-bold text-white">
                        <AnimatedShinyText>
                          <span>&lt;</span>Tariqul<span>/&gt;</span>
                        </AnimatedShinyText>
                      </p>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <ul className="flex flex-col gap-4 mt-6">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <SheetClose asChild>
                        <Link
                          href={link.href}
                          onClick={() => handleLinkClick(link.href)}
                          className={`relative text-base font-medium dark:text-white/80 text-dark-deep/80 dark:hover:text-white hover:text-dark-deep transition-colors ${
                            isActive(link.href) ? 'dark:text-white text-dark-deep' : ''
                          }`}>
                          {link.label}
                          {isActive(link.href) && <span className="absolute -bottom-1 left-0 h-[2px] w-full dark:bg-white bg-dark-deep rounded-full" />}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
                <ResumeBtn />
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </AnimationContainer>
    </header>
  );
};

export default Navbar;
