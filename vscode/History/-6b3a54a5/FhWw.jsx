'use client';

import { motion } from 'framer-motion';
import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';
import { Typewriter } from 'react-simple-typewriter';
import ResumeDownload from '../resume-download';

export function HeroSection() {
  return (
    <section id="home" className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-10 py-10">
      <div className="text-center lg:text-left text-white max-w-4xl mx-auto px-4">
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

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex gap-6 mt-8 justify-center lg:justify-start">
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white text-3xl transition duration-300">
              <FaGithub />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-500 text-3xl transition duration-300">
              <FaFacebook />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 text-3xl transition duration-300">
              <FaLinkedin />
            </a>
          </motion.div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
            {/* <button id="contact" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-300">
            Contact me
          </button> */}
            {/* <button className="border-2 border-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-300">
              Download CV
            </button> */}
            <ResumeDownload />
          </div>
        </div>
      </div>

      {/* Lottie Animation */}
      <div className="w-full lg:w-auto max-w-xs sm:max-w-sm md:max-w-md">{/* <LottieAnimation /> */}</div>
    </section>
  );
}
