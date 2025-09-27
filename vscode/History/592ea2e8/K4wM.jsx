"use client";
import { GraduationCap } from "lucide-react";

const EducationSection = () => {
  return (
    <section id="experience" className="flex items-center justify-center py-20">
      <div className="mx-auto max-w-7xl px-4 text-white">
        <h2 className="mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-center text-4xl font-bold text-transparent md:text-5xl">
          Education
        </h2>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 gap-8 pt-8 md:grid-cols-2">
          {/* Card 1 */}
          <div className="w-full">
            <div className="space-y-1 rounded-2xl border border-white/20 bg-white/10 p-8 shadow-lg backdrop-blur-md transition-transform duration-500 hover:scale-105 hover:shadow-blue-500/20">
              <div className="mb-6 flex items-center gap-4">
                <div className="rounded-lg bg-cyan-500/20 p-3">
                  <GraduationCap className="h-8 w-8 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">SSC</h2>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Year:</span>
                <span className="font-medium text-white">2020</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Board:</span>
                <span className="font-medium text-white">Rajshahi</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">School:</span>
                <span className="font-medium text-white">
                  Munshi Hazrat Ali High School
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">GPA:</span>
                <span className="text-lg font-bold text-cyan-400">4.39</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Group:</span>
                <span className="font-medium text-white">Arts</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="w-full">
            <div className="space-y-1 rounded-2xl border border-white/20 bg-white/10 p-8 shadow-lg backdrop-blur-md transition-transform duration-500 hover:scale-105 hover:shadow-blue-500/20">
              <div className="mb-6 flex items-center gap-4">
                <div className="rounded-lg bg-cyan-500/20 p-3">
                  <GraduationCap className="h-8 w-8 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">
                  Diploma in Engineering
                </h2>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Year:</span>
                <span className="font-medium text-white">2021-2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Technology:</span>
                <span className="font-medium text-white">Computer</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Institute:</span>
                <span className="font-medium text-white">
                  Bangladesh Polytechnic Institute
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Board:</span>
                <span className="font-medium text-white">Technical</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">GPA:</span>
                <span className="text-lg font-bold text-cyan-400">4.68</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
