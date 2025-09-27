'use client';

import { FaCss3Alt, FaGithub, FaHtml5, FaJs, FaNodeJs, FaReact } from 'react-icons/fa';
import { SiExpress, SiFirebase, SiMongodb, SiTailwindcss } from 'react-icons/si';

export function SkillsSection() {
  const skills = [
    // { name: "HTML", level: 95, icon: "📄" },
    // { name: "CSS", level: 90, icon: "🎨" },
    // { name: "Bootstrap", level: 85, icon: "🅱️" },
    // { name: "Tailwind CSS", level: 90, icon: "🌬️" },
    // { name: "JavaScript", level: 92, icon: "🟨" },
    // { name: "React.js", level: 94, icon: "⚛️" },
    // { name: "Next.js", level: 90, icon: "⏭️" },
    // { name: "Node.js", level: 88, icon: "🟢" },
    // { name: "Express.js", level: 85, icon: "🚂" },
    // { name: "MongoDB", level: 87, icon: "🍃" },
    { name: 'HTML 5', icon: <FaHtml5 className="text-orange-500 text-4xl" /> },
    { name: 'CSS 3', icon: <FaCss3Alt className="text-blue-500 text-4xl" /> },
    { name: 'Tailwind CSS', icon: <SiTailwindcss className="text-teal-500 text-4xl" /> },
    { name: 'JavaScript', icon: <FaJs className="text-yellow-500 text-4xl" /> },
    { name: 'React', icon: <FaReact className="text-blue-400 text-4xl" /> },
    { name: 'Github', icon: <FaGithub className="text-gray-700 text-4xl" /> },
    { name: 'Firebase', icon: <SiFirebase className="text-yellow-400 text-4xl" /> },
    { name: 'MongoDB', icon: <SiMongodb className="text-green-500 text-4xl" /> },
    { name: 'Node', icon: <FaNodeJs className="text-green-400 text-4xl" /> },
    { name: 'Express', icon: <SiExpress className="text-gray-500 text-4xl" /> },
  ];

  return (
    <section id="skills" className="min-h-screen flex items-center justify-center  py-20">
      <div className="max-w-7xl mx-auto px-4 text-white">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Skills & Expertise</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {skills.map((skill, index) => (
            <div key={index} className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm shadow-md transition transform hover:scale-105">
              <div className="flex justify-center items-center mb-4">
                <span className="text-3xl mr-4">{skill.icon}</span>
                <h3 className="text-xl font-semibold">{skill.name}</h3>
              </div>
              {/* <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${skill.level}%` }}></div>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
