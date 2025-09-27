'use client';
import { GraduationCap } from 'lucide-react';

const EducationSection = () => {
  return (
    <section id="experience" className="flex items-center justify-center py-20">
      <div className="max-w-7xl mx-auto px-4 text-white">
        <h1 className="text-5xl text-center mb-12">Education</h1>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="w-full">
            <div className="bg-white/10 space-y-1 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg hover:scale-105 hover:shadow-blue-500/20 transition-transform duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-cyan-500/20 rounded-lg">
                  <GraduationCap className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">SSC</h2>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Year:</span>
                <span className="text-white font-medium">2020</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Board:</span>
                <span className="text-white font-medium">Rajshahi</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">School:</span>
                <span className="text-white font-medium">Munshi Hazrat Ali High School</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">GPA:</span>
                <span className="text-cyan-400 font-bold text-lg">4.39</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Group:</span>
                <span className="text-white font-medium">Arts</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="w-full">
            <div className="bg-white/10 space-y-1 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg hover:scale-105 hover:shadow-blue-500/20 transition-transform duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-cyan-500/20 rounded-lg">
                  <GraduationCap className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Diploma in Engineering</h2>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Year:</span>
                <span className="text-white font-medium">2021-2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Technology:</span>
                <span className="text-white font-medium">Computer</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Institute:</span>
                <span className="text-white font-medium">Bangladesh Polytechnic Institute</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Board:</span>
                <span className="text-white font-medium">Technical</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">GPA:</span>
                <span className="text-cyan-400 font-bold text-lg">4.68</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
