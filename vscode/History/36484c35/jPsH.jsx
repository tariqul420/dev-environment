"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle active section highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "home",
        "about",
        "skills",
        "projects",
        "experience",
        "contact",
      ];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "about", label: "About", icon: "👨‍💻" },
    { id: "skills", label: "Skills", icon: "⚡" },
    { id: "experience", label: "Education", icon: "🚀" },
    { id: "projects", label: "Projects", icon: "💼" },
    { id: "contact", label: "Contact", icon: "📧" },
  ];
  if (!pathname.includes("admin")) {
    return (
      <nav
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${isScrolled ? "border-b border-gray-700/50 bg-gray-900/95 shadow-lg backdrop-blur-lg" : "bg-transparent"}`}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex-shrink-0">
              <button
                onClick={() => scrollToSection("home")}
                className="group flex items-center space-x-2 text-white transition-colors duration-300 hover:text-blue-400"
              >
                <span className="text-xl font-bold">Jishanul Haque</span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`group relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      activeSection === item.id
                        ? "bg-blue-500/10 text-blue-400"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      {/* <span className="text-xs">{item.icon}</span> */}
                      <span>{item.label}</span>
                    </span>

                    {/* Active indicator */}
                    {activeSection === item.id && (
                      <div className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full bg-blue-400"></div>
                    )}

                    {/* Hover effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 to-purple-500/0 transition-all duration-300 group-hover:from-blue-500/5 group-hover:to-purple-500/5"></div>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button
                onClick={() => scrollToSection("contact")}
                className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                <span className="relative z-10">Hire me</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="relative h-10 w-10 text-white transition-colors duration-300 hover:text-blue-400 focus:text-blue-400 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                  <span
                    className={`absolute h-0.5 w-6 transform bg-current transition duration-300 ease-in-out ${isMenuOpen ? "rotate-45" : "-translate-y-1.5"}`}
                  ></span>
                  <span
                    className={`absolute h-0.5 w-6 transform bg-current transition duration-300 ease-in-out ${isMenuOpen ? "opacity-0" : ""}`}
                  ></span>
                  <span
                    className={`absolute h-0.5 w-6 transform bg-current transition duration-300 ease-in-out ${isMenuOpen ? "-rotate-45" : "translate-y-1.5"}`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`transition-all duration-300 ease-in-out md:hidden ${isMenuOpen ? "max-h-96 opacity-100" : "pointer-events-none max-h-0 opacity-0"}`}
        >
          <div className="border-t border-gray-700/50 bg-gray-900/95 backdrop-blur-lg">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`group w-full rounded-lg px-3 py-3 text-left text-base font-medium transition-all duration-300 ${
                    activeSection === item.id
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: isMenuOpen
                      ? "slideInFromRight 0.3s ease-out forwards"
                      : "none",
                  }}
                >
                  <span className="flex items-center space-x-3">
                    {/* <span className="text-lg">{item.icon}</span> */}
                    <span>{item.label}</span>
                  </span>
                </button>
              ))}

              {/* Mobile CTA */}
              <div className="pt-4 pb-2">
                <button
                  onClick={() => scrollToSection("contact")}
                  className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 font-medium text-white transition-all duration-300 hover:scale-105"
                >
                  Hire me
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes slideInFromRight {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </nav>
    );
  } else {
    <></>;
  }
}
