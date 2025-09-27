export function Title({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="heading-title relative mx-auto pb-4 text-center text-2xl md:pb-8 md:text-3xl lg:text-4xl">
      <div className="relative mx-auto w-fit overflow-hidden sm:overflow-visible">
        <h2 className="font-bold">{title}</h2>
        <span className="right-line to-accent-main absolute top-[20px] -right-30 h-[1.5px] w-[100px] rounded bg-gradient-to-l from-transparent md:-right-50 md:w-[150px] lg:-right-60 lg:w-[200px]"></span>
        <span className="right-line to-accent-main absolute top-[20px] -left-30 h-[1.5px] w-[100px] rounded bg-gradient-to-r from-transparent md:-left-50 md:w-[150px] lg:-left-60 lg:w-[200px]"></span>
      </div>
      <p className="dark:text-medium-bg mx-auto mt-1.5 w-fit text-lg sm:text-base md:mt-2.5">
        {subtitle}
      </p>
    </div>
  );
}
