import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

interface Project {
  title: string;
  description: string;
  link: string;
  technologies: string[];
}

interface ProjectCarouselProps {
  projects: Project[];
}

export const ProjectCarousel: React.FC<ProjectCarouselProps> = ({
  projects,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= projects.length ? 0 : nextIndex;
    });
  };

  const previousSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - 1;
      return nextIndex < 0 ? projects.length - 1 : nextIndex;
    });
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  // Create a circular array for smooth infinite scrolling
  const getVisibleProjects = () => {
    const items = [...projects];
    const firstItem = items[0];
    const lastItem = items[items.length - 1];

    // Add last item to beginning and first item to end for smooth transition
    return [lastItem, ...items, firstItem];
  };

  const visibleProjects = getVisibleProjects();

  return (
    <div className="relative mx-16">
      <div className="overflow-hidden">
        <div
          className="flex gap-8 transition-all duration-500 ease-in-out"
          style={{
            transform: `translateX(calc(-${(currentIndex + 1) * 100}% - ${
              (currentIndex + 1) * 2
            }rem))`,
          }}
        >
          {visibleProjects.map((project, index) => (
            <div
              key={`${project.title}-${index}`}
              className="w-full flex-shrink-0 bg-white/5 backdrop-blur-sm rounded-xl p-8 
                border border-zinc-200/10 dark:border-zinc-700/10 
                hover:border-zinc-200/20 dark:hover:border-zinc-700/20 
                transition-all duration-300 group hover:translate-y-[-2px]
                transform-gpu flex flex-col min-h-[300px]"
            >
              <div className="flex items-start justify-between mb-6 gap-4">
                <h3 className="text-xl font-normal text-black dark:text-white group-hover:translate-x-2 transition-transform duration-300">
                  {project.title}
                </h3>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-normal text-black/60 dark:text-white/60 hover:text-indigo-500 dark:hover:text-indigo-400 flex items-center gap-1 flex-shrink-0 hover:scale-105 transition-transform"
                >
                  View <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <p className="text-black/80 dark:text-white/80 text-sm font-normal mb-6 line-clamp-4 flex-grow">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-normal bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={previousSlide}
        disabled={isAnimating}
        className="absolute -left-16 top-1/2 -translate-y-1/2 p-3 rounded-full 
          bg-white/5 backdrop-blur-sm border border-zinc-200/10 dark:border-zinc-700/10 
          hover:bg-white/10 transition-all duration-300 text-black dark:text-white
          opacity-100 cursor-pointer
          hover:scale-110 active:scale-95 shadow-lg"
        aria-label="Previous projects"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isAnimating}
        className="absolute -right-16 top-1/2 -translate-y-1/2 p-3 rounded-full 
          bg-white/5 backdrop-blur-sm border border-zinc-200/10 dark:border-zinc-700/10 
          hover:bg-white/10 transition-all duration-300 text-black dark:text-white
          opacity-100 cursor-pointer
          hover:scale-110 active:scale-95 shadow-lg"
        aria-label="Next projects"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};
