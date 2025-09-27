"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="max-w-7xl overflow-x-hidden px-4 py-10 font-sans text-white lg:py-20"
    >
      <h2 className="mb-16 text-center text-4xl font-bold md:text-5xl">
        About Me
      </h2>

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row">
        {/* Text Section */}
        <div className="flex-1 space-y-4 text-left">
          <motion.h1
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold lg:text-5xl"
          >
            <span className="text-purple-400">Hello, I'm</span>
            <br />
            <span>Md. Jishanul Haque</span>
          </motion.h1>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-base leading-relaxed text-gray-300"
          >
            I’m a web developer from Bangladesh with a passion for building
            dynamic, responsive, and user-friendly web applications.
          </motion.p>
        </div>

        {/* Animated Image with Rings */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] md:h-[350px] md:w-[350px] lg:h-[400px] lg:w-[400px]"
        >
          {/* Rings */}
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent"
            style={{
              background:
                "conic-gradient(from 0deg, #00FFFF, #0000FF, #FF00FF, #00FFFF)",
              maskImage:
                "radial-gradient(farthest-side, transparent calc(100% - 6px), white calc(100% - 4px))",
              WebkitMaskImage:
                "radial-gradient(farthest-side, transparent calc(100% - 6px), white calc(100% - 4px))",
              animation: "spinClockwise 5s linear infinite",
            }}
          />
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent"
            style={{
              background:
                "conic-gradient(from 0deg, #FF00FF, #0000FF, #00FFFF, #FF00FF)",
              maskImage:
                "radial-gradient(farthest-side, transparent calc(100% - 12px), white calc(100% - 10px))",
              WebkitMaskImage:
                "radial-gradient(farthest-side, transparent calc(100% - 12px), white calc(100% - 10px))",
              animation: "spinCounterClockwise 8s linear infinite",
            }}
          />

          {/* Profile Image */}
          <motion.div
            whileHover={{
              scale: 1.05,
              rotate: -2,
              filter: "brightness(1.2) contrast(1.1)",
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="h-full w-full overflow-hidden rounded-full border-4 border-[#0EA5E9] shadow-xl"
          >
            <Image
              src={"/jishanul-haque.jpg"}
              alt="Md. Jishanul Haque"
              width={500}
              height={700}
              priority
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
