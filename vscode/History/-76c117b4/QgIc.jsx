"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";

const skills = [
  "JavaScript",
  "React",
  "Next.js",
  "Tailwind",
  "Express.js",
  "Node.js",
  "MongoDB",
];
export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center py-10"
    >
      {/* Fixed Social Icons on the left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        viewport={{ once: true }}
        className="fixed top-1/2 left-4 z-10 hidden -translate-y-1/2 transform flex-col gap-4 lg:flex"
      >
        <a
          href="https://www.instagram.com/your-profile"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white transition-transform duration-300 hover:scale-110"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
        <a
          href="https://x.com/your-profile"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 hover:scale-110"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <a
          href="https://linkedin.com/in/your-profile"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white transition-transform duration-300 hover:scale-110"
        >
          <FaLinkedin className="text-xl" />
        </a>
        <a
          href="https://github.com/your-username"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-white transition-transform duration-300 hover:scale-110"
        >
          <FaGithub className="text-xl" />
        </a>
        <a
          href="mailto:your-email@example.com"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white transition-transform duration-300 hover:scale-110"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        </a>
      </motion.div>

      <div className="mx-auto max-w-4xl px-4 text-center text-white lg:ml-20 lg:text-left">
        <div className="mt-8 mb-8">
          <h1 className="text-left text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
            Hello I'm
          </h1>
          <h1 className="mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-left text-5xl font-bold text-transparent md:text-7xl">
            <Typewriter
              words={["Md. Jishanul Haque"]}
              loop={true}
              cursor
              cursorStyle="_"
              typeSpeed={100}
              deleteSpeed={100}
              delaySpeed={2000}
            />
          </h1>
          <p className="mb-6 text-left text-xl text-gray-300 md:text-2xl">
            Frontend Developer
          </p>
          <p className="mx-auto max-w-2xl text-left text-lg text-gray-400 lg:mx-0">
            I'm a Web developer passionate about building scalable and efficient
            web applications. I focus on creating seamless user experiences with
            optimized performance, clean architecture, and modern technologies.
          </p>

          {/* Tech Stack */}
          <motion.div custom={3} className="pt-4">
            <ul className="flex flex-wrap justify-center gap-3 text-sm font-medium lg:justify-start">
              {[
                {
                  text: "JavaScript",
                  color: "text-yellow-400",
                  border: "border-yellow-400",
                },
                {
                  text: "React",
                  color: "text-blue-400",
                  border: "border-blue-400",
                },
                {
                  text: "Next.js",
                  color: "text-white",
                  border: "border-white",
                },
                {
                  text: "Tailwind",
                  color: "text-blue-800",
                  border: "border-white",
                },
                {
                  text: "Express.js",
                  color: "text-gray-400",
                  border: "border-gray-400",
                },
                {
                  text: "Node.js",
                  color: "text-blue-400",
                  border: "border-blue-400",
                },
                {
                  text: "MongoDB",
                  color: "text-green-400",
                  border: "border-green-400",
                },
              ].map(({ text, color, border }, i) => (
                <motion.li
                  whileHover={{ scale: 1.2, rotate: 3 }}
                  whileTap={{ scale: 0.95 }}
                  key={i}
                  className={`px-4 py-1.5 ${color} ${border} rounded-full border bg-transparent transition hover:bg-white/10`}
                >
                  {text}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Mobile Social Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-8 flex justify-center gap-4 lg:hidden"
          >
            <a
              href="https://www.instagram.com/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white transition-transform duration-300 hover:scale-110"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://x.com/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 hover:scale-110"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition-transform duration-300 hover:scale-110"
            >
              <FaLinkedin className="text-lg" />
            </a>
            <a
              href="https://github.com/your-username"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-white transition-transform duration-300 hover:scale-110"
            >
              <FaGithub className="text-lg" />
            </a>
            <a
              href="mailto:your-email@example.com"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white transition-transform duration-300 hover:scale-110"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </a>
          </motion.div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <button className="rounded-lg border-2 border-white/20 px-8 py-3 font-semibold text-white transition-colors duration-300 hover:bg-white/10">
              Download CV
            </button>
            <ResumeDownload />
          </div>
        </div>
      </div>

      {/* Lottie Animation */}
      <div className="relative mx-auto inline-block w-full max-w-sm overflow-visible rounded-full p-3 lg:mx-0 lg:w-auto">
        {/* Rotating dashed border */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute inset-0 rounded-full border-4 border-dashed border-white"
        />

        {/* Skills orbiting */}
        <motion.ul
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="pointer-events-none absolute top-1/2 left-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        >
          {skills.map((skill, index) => {
            // Calculate angle per skill
            const angle = (360 / skills.length) * index;
            const radius = 180; // radius for orbit in px (half of container width)

            // Calculate position (circle coordinates)
            const radian = (angle * Math.PI) / 180;
            const x = radius * Math.cos(radian);
            const y = radius * Math.sin(radian);

            return (
              <li
                key={skill}
                className="bg-opacity-20 absolute rounded-full bg-white px-3 py-1 text-xs font-semibold text-white shadow-lg"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                  whiteSpace: "nowrap",
                }}
              >
                {skill}
              </li>
            );
          })}
        </motion.ul>

        {/* Static image */}
        <Image
          src="/resume/jishan.png"
          alt="Md. Jishanul Haque"
          width={360}
          height={360}
          className="relative z-10 rounded-full object-cover"
          priority
        />
      </div>
    </section>
  );
}
