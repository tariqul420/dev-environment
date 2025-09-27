import Link from 'next/link';
import { AnimatedShinyText } from './magicui/animated-shiny-text';

export default function Logo() {
  return (
    <Link href="/">
      <p className="text-2xl font-bold">
        <AnimatedShinyText>
          <span>&lt;</span>Tariqul<span>/&gt;</span>
        </AnimatedShinyText>
      </p>
    </Link>
  );
}
