"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  FaCss3Alt,
  FaGithub,
  FaHtml5,
  FaJs,
  FaNodeJs,
  FaReact,
} from "react-icons/fa";
import {
  SiExpress,
  SiFirebase,
  SiMongodb,
  SiTailwindcss,
} from "react-icons/si";

export function SkillsSection() {
  const [activeSkill, setActiveSkill] = useState(null);

  const skills = [
    {
      name: "HTML 5",
      icon: <FaHtml5 className="text-4xl text-orange-500" />,
      description: "Semantic markup, accessibility, modern HTML5 features",
      level: "Advanced",
      experience: "3+ years",
    },
    {
      name: "CSS 3",
      icon: <FaCss3Alt className="text-4xl text-blue-500" />,
      description: "Flexbox, Grid, animations, responsive design",
      level: "Advanced",
      experience: "3+ years",
    },
    {
      name: "Tailwind CSS",
      icon: <SiTailwindcss className="text-4xl text-teal-500" />,
      description: "Utility-first CSS framework, custom components",
      level: "Intermediate",
      experience: "2+ years",
    },
    {
      name: "JavaScript",
      icon: <FaJs className="text-4xl text-yellow-500" />,
      description: "ES6+, async/await, DOM manipulation, APIs",
      level: "Advanced",
      experience: "3+ years",
    },
    {
      name: "React",
      icon: <FaReact className="text-4xl text-blue-400" />,
      description: "Hooks, Context API, component architecture",
      level: "Advanced",
      experience: "2+ years",
    },
    {
      name: "Github",
      icon: <FaGithub className="text-4xl text-gray-700" />,
      description: "Version control, collaboration, CI/CD workflows",
      level: "Intermediate",
      experience: "2+ years",
    },
    {
      name: "Firebase",
      icon: <SiFirebase className="text-4xl text-yellow-400" />,
      description: "Authentication, Firestore, hosting, cloud functions",
      level: "Intermediate",
      experience: "1+ years",
    },
    {
      name: "MongoDB",
      icon: <SiMongodb className="text-4xl text-green-500" />,
      description: "NoSQL database, aggregation, indexing",
      level: "Intermediate",
      experience: "2+ years",
    },
    {
      name: "Node",
      icon: <FaNodeJs className="text-4xl text-green-400" />,
      description: "Server-side JavaScript, npm packages, APIs",
      level: "Intermediate",
      experience: "2+ years",
    },
    {
      name: "Express",
      icon: <SiExpress className="text-4xl text-gray-500" />,
      description: "RESTful APIs, middleware, routing, authentication",
      level: "Intermediate",
      experience: "2+ years",
    },
  ];

  const handleSkillClick = (index) => {
    setActiveSkill(activeSkill === index ? null : index);
  };

  const getGradientBorder = (index) => {
    const gradients = [
      "from-orange-400 via-red-500 to-pink-500",
      "from-blue-400 via-purple-500 to-indigo-600",
      "from-teal-400 via-cyan-500 to-blue-500",
      "from-yellow-400 via-orange-500 to-red-500",
      "from-blue-300 via-cyan-400 to-teal-500",
      "from-gray-400 via-gray-600 to-black",
      "from-yellow-300 via-amber-500 to-orange-600",
      "from-green-400 via-emerald-500 to-teal-600",
      "from-green-300 via-lime-500 to-emerald-600",
      "from-purple-400 via-pink-500 to-red-500",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <section
      id="skills"
      className="flex min-h-screen items-center justify-center py-20"
    >
      <div className="mx-auto max-w-7xl px-4 text-white">
        <h2 className="mb-16 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-center text-4xl font-bold text-transparent md:text-5xl">
          Skills & Expertise
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill, index) => (
            <div key={index} className="relative">
              {/* Gradient Border Container */}
              <div
                className={`rounded-2xl bg-gradient-to-r p-[2px] ${getGradientBorder(index)} transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25`}
              >
                <div
                  className="cursor-pointer rounded-2xl bg-gray-800/90 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/70"
                  onClick={() => handleSkillClick(index)}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="mr-4 text-3xl">{skill.icon}</span>
                      <h3 className="text-xl font-semibold">{skill.name}</h3>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-300 ${
                        activeSkill === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* Dropdown Content */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      activeSkill === index
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="border-t border-gray-600/50 pt-4">
                      <p className="mb-2 text-sm text-gray-300">
                        {skill.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="rounded-full bg-blue-500/20 px-2 py-1 text-blue-400">
                          {skill.level}
                        </span>
                        <span className="text-gray-400">
                          {skill.experience}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
