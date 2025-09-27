"use client";

function Footer() {
  const navLinks = [
    { name: "Features", href: "#" },
    { name: "Solution", href: "#" },
    { name: "Customers", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Help", href: "#" },
    { name: "About", href: "#" },
  ];

  const socialIcons = [
    {
      name: "TikTok",
      href: "#",
      svg: (
        <svg
          width="800px"
          height="800px"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          data-name="Layer 1"
        >
          <path d="M12,2.2467A10.00042,10.00042,0,0,0,8.83752,21.73419c.5.08752.6875-.21247.6875-.475,0-.23749-.01251-1.025-.01251-1.86249C7,19.85919,6.35,18.78423,6.15,18.22173A3.636,3.636,0,0,0,5.125,16.8092c-.35-.1875-.85-.65-.01251-.66248A2.00117,2.00117,0,0,1,6.65,17.17169a2.13742,2.13742,0,0,0,2.91248.825A2.10376,2.10376,0,0,1,10.2,16.65923c-2.225-.25-4.55-1.11254-4.55-4.9375a3.89187,3.89187,0,0,1,1.025-2.6875,3.59373,3.59373,0,0,1,.1-2.65s.83747-.26251,2.75,1.025a9.42747,9.42747,0,0,1,5,0c1.91248-1.3,2.75-1.025,2.75-1.025a3.59323,3.59323,0,0,1,.1,2.65,3.869,3.869,0,0,1,1.025,2.6875c0,3.83747-2.33752,4.6875-4.5625,4.9375a2.36814,2.36814,0,0,1,.675,1.85c0,1.33752-.01251,2.41248-.01251,2.75,0,.26251.1875.575.6875.475A10.0053,10.0053,0,0,0,12,2.2467Z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "#",
      svg: (
        <svg
          className="size-6 transition-transform duration-200 hover:scale-110"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
          ></path>
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "#",
      svg: (
        <svg
          className="size-6 transition-transform duration-200 hover:scale-110"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"
          ></path>
        </svg>
      ),
    },
    {
      name: "X",
      href: "#",
      svg: (
        <svg
          className="size-6 transition-transform duration-200 hover:scale-110"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <footer className="py-10 px-4 sm:px-6 lg:px-8 font-inter relative overflow-hidden ">
      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
        <div className="mb-6 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 200 200"
            width="48"
            height="48"
            className="coolshapes flower-3 mr-3 drop-shadow-lg"
          >
            <g clipPath="url(#cs_clip_1_flower-3)">
              <mask
                id="cs_mask_1_flower-3"
                style={{ maskType: "alpha" }}
                width="200"
                height="200"
                x="0"
                y="0"
                maskUnits="userSpaceOnUse"
              >
                <path
                  fill="#fff"
                  d="M200 50c0-27.614-22.386-50-50-50s-50 22.386-50 50c0-27.614-22.386-50-50-50S0 22.386 0 50s22.386 50 50 50c-27.614 0-50 22.386-50 50s22.386 50 50 50 50-22.386 50-50c0 27.614 22.386 50 50 50s50-22.386 50-50c0-27.608-22.375-49.989-49.98-50C177.625 99.99 200 77.608 200 50z"
                ></path>
              </mask>
              <g mask="url(#cs_mask_1_flower-3)">
                <path fill="#fff" d="M200 0H0v200h200V0z"></path>
                <path
                  fill="url(#paint0_linear_748_4691)"
                  fillOpacity="0.55"
                  d="M200 0H0v200h200V0z"
                ></path>
                <g filter="url(#filter0_f_748_4691)">
                  <path fill="#18A0FB" d="M131 3H-12v108h143V3z"></path>
                  <path fill="#FF58E4" d="M190 109H0v116h190V109z"></path>
                  <ellipse
                    cx="153.682"
                    cy="64.587"
                    fill="#FFD749"
                    rx="83"
                    ry="57"
                    transform="rotate(-33.875 153.682 64.587)"
                  ></ellipse>
                </g>
              </g>
            </g>
            <defs>
              <filter
                id="filter0_f_748_4691"
                width="361.583"
                height="346.593"
                x="-72"
                y="-61.593"
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                <feGaussianBlur
                  result="effect1_foregroundBlur_748_4691"
                  stdDeviation="30"
                ></feGaussianBlur>
              </filter>
              <linearGradient
                id="paint0_linear_748_4691"
                x1="200"
                x2="0"
                y1="0"
                y2="200"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FF1F00"></stop>
                <stop offset="1" stopColor="#FFD600"></stop>
              </linearGradient>
              <clipPath id="cs_clip_1_flower-3">
                <path fill="#fff" d="M0 0H200V200H0z"></path>
              </clipPath>
            </defs>
            <g style={{ mixBlendMode: "overlay" }} mask="url(#cs_mask_1_flower-3)">
              <path
                fill="gray"
                stroke="transparent"
                d="M200 0H0v200h200V0z"
                filter="url(#cs_noise_1_flower-3)"
              ></path>
            </g>
            <defs>
              <filter
                id="cs_noise_1_flower-3"
                width="100%"
                height="100%"
                x="0%"
                y="0%"
                filterUnits="objectBoundingBox"
              >
                <feTurbulence
                  baseFrequency="0.6"
                  numOctaves="5"
                  result="out1"
                  seed="4"
                ></feTurbulence>
                <feComposite
                  in="out1"
                  in2="SourceGraphic"
                  operator="in"
                  result="out2"
                ></feComposite>
                <feBlend in="SourceGraphic" in2="out2" mode="overlay" result="out3"></feBlend>
              </filter>
            </defs>
          </svg>
          <span className="text-gray-900 dark:text-white text-3xl font-extrabold tracking-wide">
            Sera UI
          </span>
        </div>

        <nav className="mb-6 w-full">
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-base font-medium">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300 relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-gray-900 dark:after:bg-white after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="my-6 flex flex-wrap justify-center gap-4 text-sm">
          {socialIcons.map((icon) => (
            <a
              key={icon.name}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={icon.name}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
              href={icon.href}
            >
              {icon.svg}
            </a>
          ))}
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-4">
          &copy; {new Date().getFullYear()} seraui. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
