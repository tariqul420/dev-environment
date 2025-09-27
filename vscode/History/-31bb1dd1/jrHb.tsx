import { ArrowRight, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BorderBeam } from "../../magicui/border-beam";

function HeroSection() {
  return (
    <section className="relative min-h-[550px] overflow-hidden">
      <div className="relative container mx-auto flex h-full flex-col items-center justify-between overflow-hidden py-5 md:gap-5 lg:max-w-6xl lg:flex-row">
        {/* Text Content */}
        <div className="z-[5] w-full text-center lg:w-1/2 lg:text-left">
          <div className="dark:text-light-bg to-light-theme dark:from-accent-main dark:to-accent-main/80 relative mx-auto w-fit rounded-md border bg-gradient-to-b from-green-100 px-3 py-2 text-sm font-medium shadow lg:mx-0">
            সীমিত সময়ের অফার: আজকেই ফ্রি হোম ডেলিভারি!
            <Image
              className="absolute right-0 bottom-0 left-0 mx-auto"
              src="/assets/star-blaze.gif"
              alt="Animated star effect for offer banner"
              unoptimized
              width={100}
              height={100}
            />
            <BorderBeam colorFrom="#16a34a" colorTo="#4ade80" size={70} />
          </div>

          <h2 className="py-2 text-5xl leading-13 font-bold md:py-5 md:leading-16 lg:text-5xl">
            প্রাকৃতিকভাবে{" "}
            <span className="from-accent-main to-accent-hover relative -top-1 overflow-hidden bg-gradient-to-r bg-clip-text text-transparent md:top-0">
              সুস্থ থাকুন{" "}
            </span>
            Natural Sefa-র সাথে!
          </h2>
          <p className="dark:text-medium-bg text-sm md:pr-10 md:text-base">
            Methi Mix Plus, Kalojira Tel, Diabetes Cha, Allergy Binash, Joytuner
            Tel, এবং Arjun Heart Care দিয়ে গ্যাস্ট্রিক, ডায়াবেটিস, এলার্জি, এবং
            হৃদরোগের সমাধান পান। আজই অর্ডার করুন!
          </p>
          <div className="mt-5 mb-5 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
            <Link
              href="/products"
              className="group border-accent-main bg-accent-main hover:border-accent-hover hover:bg-accent-hover text-light focus:ring-accent-main relative flex cursor-pointer items-center gap-2 rounded border px-4 py-2.5 duration-200 focus:ring-2 focus:ring-offset-2 md:px-6"
            >
              <Image
                src="/assets/star-blaze.gif"
                alt="Animated star effect for order button"
                fill
                unoptimized
                className="object-cover"
              />
              এখন অর্ডার করুন{" "}
              <ArrowRight
                size={20}
                className="transition-all duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/contact-us"
              className="hover:bg-light-bg bg-light dark:bg-dark-lite focus:ring-accent-main flex cursor-pointer items-center gap-2 rounded border px-4 py-2.5 shadow duration-200 focus:ring-2 focus:ring-offset-2 md:px-6"
            >
              <LinkIcon size={18} /> আমাদের সাথে যোগাযোগ
            </Link>
          </div>
        </div>
        {/* Image Section with New Banner */}
        <div className="mt-5 w-full px-3 sm:px-0 md:w-[600px] lg:w-1/2">
          <div className="relative h-[400px] w-full md:h-[450px]">
            <Image
              src="/assets/hero-banner-1.png" // Replace with the actual uploaded image path
              alt="Natural Sefa special offer with free home delivery and 50% off on organic skincare products"
              fill
              fetchPriority="high"
              className="rounded-lg object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
