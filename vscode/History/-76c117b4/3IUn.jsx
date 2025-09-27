'use client';

import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Typewriter } from 'react-simple-typewriter';
import ResumeDownload from '../../resume-download';

export function HeroSection() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center py-10 relative">
      {/* Fixed Social Icons on the left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        viewport={{ once: true }}
        className="fixed left-4 top-1/2 transform -translate-y-1/2 z-10 hidden lg:flex flex-col gap-4"
      >
        <a
          href="https://www.instagram.com/your-profile"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
        <a
          href="https://x.com/your-profile"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a
          href="https://linkedin.com/in/your-profile"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
        >
          <FaLinkedin className="text-xl" />
        </a>
        <a
          href="https://github.com/your-username"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
        >
          <FaGithub className="text-xl" />
        </a>
        <a
          href="mailto:your-email@example.com"
          className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </a>
      </motion.div>

      <div className="text-center lg:text-left text-white max-w-4xl mx-auto px-4 lg:ml-20">
        <div className="mb-8 mt-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-left">Hello I'm</h1>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent text-left">
            <Typewriter words={['Md. Jishanul Haque']} loop={true} cursor cursorStyle="_" typeSpeed={100} deleteSpeed={100} delaySpeed={2000} />
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-6 text-left">Frontend Developer</p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto lg:mx-0 text-left">
            I'm a Web developer passionate about building scalable and efficient web applications. I focus on creating seamless user experiences with optimized performance, clean architecture, and
            modern technologies.
          </p>

          {/* Tech Stack */}
          <motion.div custom={3} className="pt-4">
            <ul className="flex flex-wrap gap-3 justify-center lg:justify-start text-sm font-medium">
              {[
                {
                  text: 'JavaScript',
                  color: 'text-yellow-400',
                  border: 'border-yellow-400',
                },
                {
                  text: 'React',
                  color: 'text-blue-400',
                  border: 'border-blue-400',
                },
                { text: 'Next.js', color: 'text-white', border: 'border-white' },
                { text: 'Tailwind', color: 'text-blue-800', border: 'border-white' },
                {
                  text: 'Express.js',
                  color: 'text-gray-400',
                  border: 'border-gray-400',
                },
                {
                  text: 'Node.js',
                  color: 'text-blue-400',
                  border: 'border-blue-400',
                },
                {
                  text: 'MongoDB',
                  color: 'text-green-400',
                  border: 'border-green-400',
                },
              ].map(({ text, color, border }, i) => (
                <motion.li
                  whileHover={{ scale: 1.2, rotate: 3 }}
                  whileTap={{ scale: 0.95 }}
                  key={i}
                  className={`px-4 py-1.5 ${color} ${border} border rounded-full bg-transparent hover:bg-white/10 transition`}>
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
            className="flex gap-4 mt-8 justify-center lg:hidden"
          >
            <a
              href="https://www.instagram.com/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="https://x.com/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
            >
              <FaLinkedin className="text-lg" />
            </a>
            <a
              href="https://github.com/your-username"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
            >
              <FaGithub className="text-lg" />
            </a>
            <a
              href="mailto:your-email@example.com"
              className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>
          </motion.div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
           
            <button className="border-2 border-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-300">
              Download CV
            </button>
            <ResumeDownload />
          </div>
        </div>
      </div>

      {/* Lottie Animation */}
      <div className="w-full lg:w-auto max-w-xs sm:max-w-sm md:max-w-md">{/* <LottieAnimation /> */}</div>
    </section>
  );
}