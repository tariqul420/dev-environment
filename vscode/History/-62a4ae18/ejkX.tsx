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
import Logo from '../logo';
import { ModeToggle } from '../mode-toggle';

export const ResumeBtn = () => {
  return (
    <a href="https://tariqul.dev/resume/tariqul-islam-resume.pdf" target="_blank" rel="noopener noreferrer">
      <Button className="hidden sm:block font-semibold rounded-lg cursor-pointer">Resume</Button>
    </a>
  );
};

const Navbar = () => {
  const pathname = usePathname();
  const [isShrunk, setIsShrunk] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsShrunk(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  type NavLink = { href: string; label: string } | false;

  const navLinks: NavLink[] = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/blogs', label: 'Blogs' },
  ];

  const filteredNavLinks = navLinks.filter((link): link is { href: string; label: string } => link !== false);

  return (
    <header className="sticky top-4 z-50">
      <AnimationContainer direction="top" delay={0.1} className="size-full">
        <nav
          className={cn(
            // Use shadcn tokens & transparency for blur effect
            'mx-auto py-3 px-4 rounded-xl bg-background/80 backdrop-blur-sm shadow-lg flex items-center justify-between transition-all duration-300 max-w-7xl border border-border',
            isShrunk ? 'w-[90vw] md:max-w-4xl' : 'w-[90vw]',
          )}>
          <div>
            <Logo />
          </div>

          <ul className="hidden lg:flex items-center gap-6">
            {filteredNavLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link href={link.href} className={cn('relative text-base font-medium transition-colors', active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')}>
                    {link.label}
                    {active && <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-current rounded-full" />}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <ResumeBtn />

            <Sheet>
              <SheetTrigger className="lg:hidden p-2 rounded-md transition-colors text-muted-foreground hover:text-foreground" aria-label="Open menu">
                <AlignLeft size={24} />
              </SheetTrigger>

              <SheetContent side="left" className="border-none p-4 bg-background">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/">
                      <p className="text-2xl font-bold text-foreground">
                        <AnimatedShinyText>
                          <span>&lt;</span>Tariqul<span>/&gt;</span>
                        </AnimatedShinyText>
                      </p>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <ul className="flex flex-col gap-4 mt-6">
                  {filteredNavLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <li key={link.href}>
                        <SheetClose asChild>
                          <Link href={link.href} className={cn('relative text-base font-medium transition-colors', active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')}>
                            {link.label}
                            {active && <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-current rounded-full" />}
                          </Link>
                        </SheetClose>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-6">
                  <ResumeBtn />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </AnimationContainer>
    </header>
  );
};

export default Navbar;
