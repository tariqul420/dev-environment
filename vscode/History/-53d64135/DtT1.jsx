export default function ExperienceSection() {
  const experiences = [
    {
      period: "(Jan 2022 - Present)",
      title: "SOFTWARE ENGINEER I",
      company: "Teton Private Ltd.",
      icon: "👤",
    },
    {
      period: "(Jun 2021 - Jan 2022)",
      title: "FULLSTACK DEVELOPER",
      company: "Fiverr (freelance)",
      icon: "👤",
    },
    {
      period: "(Jan 2018 - Present)",
      title: "SELF EMPLOYED",
      company: "Code and build something in everyday.",
      icon: "👤",
    },
  ];

  return (
    <section id="experience" className="relative px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left side - 3D Laptop Illustration */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              {/* Laptop base/shadow */}
              <div className="absolute right-4 -bottom-8 left-4 h-4 rounded-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent blur-lg"></div>

              {/* Laptop body */}
              <div className="relative rotate-12 transform transition-transform duration-500 hover:rotate-6">
                {/* Laptop screen */}
                <div className="rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 p-1 shadow-2xl">
                  <div className="h-52 w-80 rounded-md bg-slate-900 p-6">
                    {/* Code lines */}
                    <div className="space-y-2 font-mono text-sm">
                      <div className="text-pink-400">
                        {'<div className="app">'}
                      </div>
                      <div className="ml-4 text-purple-300">{"<header>"}</div>
                      <div className="ml-8 text-cyan-300">
                        {"<h1>Welcome</h1>"}
                      </div>
                      <div className="ml-4 text-purple-300">{"</header>"}</div>
                      <div className="text-pink-400">{"</div>"}</div>
                    </div>
                  </div>
                </div>

                {/* Laptop keyboard */}
                <div className="relative mt-1 h-4 rounded-b-lg bg-gradient-to-br from-purple-600 to-pink-600">
                  <div className="absolute inset-1 rounded-b-md bg-slate-800"></div>
                </div>
              </div>

              {/* Coffee cup */}
              <div className="absolute top-8 -right-16">
                <div className="relative h-16 w-12 rounded-b-full bg-gradient-to-br from-purple-500 to-pink-500">
                  <div className="absolute top-1 right-1 left-1 h-2 rounded-full bg-slate-800"></div>
                  <div className="absolute top-4 -right-2 h-6 w-3 rounded-r-lg border-2 border-purple-400"></div>
                  {/* Steam */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                    <div className="h-6 w-1 animate-pulse rounded-full bg-gradient-to-t from-purple-400 to-transparent opacity-60"></div>
                  </div>
                </div>
              </div>

              {/* Cables */}
              <svg
                className="absolute -bottom-6 left-12 h-12 w-32 opacity-60"
                viewBox="0 0 128 48"
              >
                <path
                  d="M10 24 Q30 10, 50 24 T90 24 Q110 38, 118 24"
                  stroke="url(#cableGradient)"
                  strokeWidth="3"
                  fill="none"
                  className="animate-pulse"
                />
                <defs>
                  <linearGradient
                    id="cableGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Right side - Experience Cards */}
          <div className="space-y-6">
            <div className="mb-12 text-center lg:text-left">
              <h2 className="mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                Experiences
              </h2>
            </div>

            <div className="space-y-4">
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-purple-500/20 bg-slate-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:transform hover:border-purple-400/40 hover:shadow-2xl hover:shadow-purple-500/10"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-800">
                        <svg
                          className="h-5 w-5 text-purple-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 text-sm font-medium text-cyan-400">
                        {exp.period}
                      </div>
                      <h3 className="mb-2 text-xl font-bold tracking-wide text-white">
                        {exp.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-300">
                        {exp.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
