import { Facebook, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';
import AnimationContainer from '../global/animation-container';
import { AnimatedShinyText } from '../magicui/animated-shiny-text';
import { Separator } from '../ui/separator';

export const quickLinks = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Projects',
    path: '/projects',
  },
  {
    name: 'Skills',
    path: '#skills',
  },

  {
    name: 'Contact Me',
    path: '#contact-me',
  },
];

export const latestProject = [
  {
    name: 'Natural Sefa',
    path: 'https://naturalsefaa.com',
  },
  {
    name: 'Edu Genius',
    path: 'https://edu-genius.vercel.app',
  },
  {
    name: 'Projoss - Web Development',
    path: 'https://projoss.com/web_development/',
  },

  {
    name: 'Pixoranest',
    path: 'http://pixoranest.com/',
  },
];

export default function Footer() {
  return (
    <footer className="py-8 px-4">
      <AnimationContainer delay={0.6} className="w-11/12 py-4 px-12 border-b-2 border dark:bg-dark-lite rounded-md max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex flex-col">
            {/* Website logo here */}
            <Link href="/">
              <p className="text-2xl font-bold">
                <AnimatedShinyText>
                  <span>&lt;</span>Tariqul<span>/&gt;</span>
                </AnimatedShinyText>
              </p>
            </Link>
            <p className="mt-4">Pabna, Bangladesh</p>
            <p className="mt-2">+8801743-892058</p>
            <div className="mt-4 flex space-x-4">
              <Link target="_blank" href="https://github.com/tariqul420" className="text-red transition-all duration-300 hover:-translate-y-1" aria-label="Visit our Facebook page ">
                <Github />
              </Link>
              <Link target="_blank" href="https://www.linkedin.com/in/tariqul-dev" className="text-red transition-all duration-300 hover:-translate-y-1" aria-label="Visit our youtube page">
                <Linkedin />
              </Link>
              <Link target="_blank" href="https://www.facebook.com/tariquldev" className="text-red transition-all duration-300 hover:-translate-y-1" aria-label="Visit our youtube page">
                <Facebook />
              </Link>
              <Link href="https://chat.whatsapp.com/G62FiyRWJnN8zSvNhfmMhY" aria-label="Visit our whatsapp group">
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" viewBox="0 0 16 16" className="text-red transition-all duration-300 hover:-translate-y-1">
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="flex flex-col">
            <h5 className="text-light text-lg font-semibold">Latest Project</h5>
            <ul className="space-y-1">
              {latestProject.map((link, index) => (
                <li key={index}>
                  <Link target="_blank" className="hover:text-light py-1 transition-colors" href={link.path}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col">
            <h5 className="text-light text-lg font-semibold">Quick Links</h5>
            <ul className="space-y-1">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link className="hover:text-light py-1 transition-colors" href={link.path}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Separator className="my-4" />
        <div>
          <p className="text-center">
            Copyright &copy; {new Date().getFullYear()} All Rights Reserved to{' '}
            <Link className="text-light" href={'/'}>
              Tariqul Islam
            </Link>
          </p>
        </div>
      </AnimationContainer>
    </footer>
  );
}
