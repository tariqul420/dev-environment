"use client";

import Link from "next/link";
import projects from "../../../public/data.json";

export default function ProjectsPage() {
  return (
    <section id="projects" className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="mb-12 text-center text-5xl font-bold text-white">
          Featured Projects
        </h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group transform overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition-transform duration-300 hover:scale-105"
            >
              <div className="flex h-full flex-col">
                <div className="flex flex-1 items-center justify-center">
                  <img
                    src={project.imgUrl}
                    alt={project.title}
                    className="h-full rounded-lg object-cover"
                  />
                </div>
                <div className="bg-[#0a192f] p-6">
                  <h3 className="mb-2 text-xl font-bold text-white">
                    {project.title}
                  </h3>
                  <p className="mb-4 text-gray-300">
                    {project.description.slice(0, 70)}...
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-white/10 px-2 py-1 text-xs font-medium text-white"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
