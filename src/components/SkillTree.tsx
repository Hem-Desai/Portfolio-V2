import React, { useEffect, useRef, useState } from "react";
import {
  FaPython,
  FaReact,
  FaNode,
  FaDatabase,
  FaGitAlt,
  FaUnity,
  FaDocker,
} from "react-icons/fa";
import {
  SiTypescript,
  SiJavascript,
  SiCplusplus,
  SiPostgresql,
  SiMongodb,
  SiTailwindcss,
  SiFlask,
  SiFastapi,
  SiPostman,
  SiSupabase,
  SiNextdotjs,
  SiPandas,
  SiNumpy,
} from "react-icons/si";
import {
  TbBrain,
  TbBrandReactNative,
  TbWorldWww,
  TbBox,
  TbBoxMultiple,
  TbTerminal,
  TbCode,
  TbTools,
  TbSend,
  TbRobot,
  TbNetwork,
  TbAlignCenter,
  TbClock,
  TbArrowsRandom,
} from "react-icons/tb";

interface Skill {
  id: string;
  name: string;
  level: number;
  category: "languages" | "frontend" | "backend" | "ai" | "devops" | "tools";
  connections: string[];
  icon: React.ReactNode;
  x?: number;
  y?: number;
}

const SKILLS: Skill[] = [
  // Programming Languages
  {
    id: "python",
    name: "Python",
    level: 5,
    category: "languages",
    connections: ["flask", "fastapi", "langchain", "pandas", "numpy"],
    icon: <FaPython className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />,
  },
  {
    id: "typescript",
    name: "TypeScript",
    level: 5,
    category: "languages",
    connections: ["react", "react_native", "nextjs"],
    icon: (
      <SiTypescript className="w-5 h-5 text-indigo-600 dark:text-indigo-500" />
    ),
  },
  {
    id: "javascript",
    name: "JavaScript",
    level: 5,
    category: "languages",
    connections: ["nodejs"],
    icon: (
      <SiJavascript className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
    ),
  },
  {
    id: "cpp",
    name: "C++",
    level: 4,
    category: "languages",
    connections: ["unity"],
    icon: (
      <SiCplusplus className="w-5 h-5 text-indigo-600 dark:text-indigo-500" />
    ),
  },
  {
    id: "sql",
    name: "SQL",
    level: 4,
    category: "languages",
    connections: ["postgresql"],
    icon: (
      <FaDatabase className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
    ),
  },
  {
    id: "pandas",
    name: "Pandas",
    level: 4,
    category: "languages",
    connections: ["numpy", "ai", "python"],
    icon: <SiPandas className="w-5 h-5 text-indigo-600 dark:text-indigo-500" />,
  },
  {
    id: "numpy",
    name: "NumPy",
    level: 4,
    category: "languages",
    connections: [],
    icon: <SiNumpy className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />,
  },

  // Frontend
  {
    id: "react",
    name: "React",
    level: 5,
    category: "frontend",
    connections: ["context", "react_native", "nextjs"],
    icon: <FaReact className="w-5 h-5 text-sky-500 dark:text-sky-400" />,
  },
  {
    id: "nextjs",
    name: "Next.js",
    level: 4,
    category: "frontend",
    connections: ["typescript"],
    icon: <SiNextdotjs className="w-5 h-5 text-sky-600 dark:text-sky-500" />,
  },
  {
    id: "react_native",
    name: "React Native",
    level: 4,
    category: "frontend",
    connections: [],
    icon: (
      <TbBrandReactNative className="w-5 h-5 text-sky-500 dark:text-sky-400" />
    ),
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    level: 5,
    category: "frontend",
    connections: ["flexbox"],
    icon: <SiTailwindcss className="w-5 h-5 text-sky-600 dark:text-sky-500" />,
  },
  {
    id: "context",
    name: "Context API",
    level: 4,
    category: "frontend",
    connections: [],
    icon: <TbBox className="w-5 h-5 text-sky-500 dark:text-sky-400" />,
  },
  {
    id: "flexbox",
    name: "Flexbox",
    level: 4,
    category: "frontend",
    connections: [],
    icon: <TbAlignCenter className="w-5 h-5 text-sky-600 dark:text-sky-500" />,
  },

  // Backend
  {
    id: "flask",
    name: "Flask",
    level: 4,
    category: "backend",
    connections: ["postgresql"],
    icon: (
      <SiFlask className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
    ),
  },
  {
    id: "fastapi",
    name: "FastAPI",
    level: 4,
    category: "backend",
    connections: ["postgresql"],
    icon: (
      <SiFastapi className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
    ),
  },
  {
    id: "nodejs",
    name: "Node.js",
    level: 4,
    category: "backend",
    connections: ["temporal"],
    icon: <FaNode className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />,
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    level: 4,
    category: "backend",
    connections: ["supabase"],
    icon: (
      <SiPostgresql className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
    ),
  },
  {
    id: "mongodb",
    name: "MongoDB",
    level: 4,
    category: "backend",
    connections: [],
    icon: (
      <SiMongodb className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
    ),
  },
  {
    id: "supabase",
    name: "Supabase",
    level: 4,
    category: "backend",
    connections: [],
    icon: (
      <SiSupabase className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
    ),
  },

  // AI/ML
  {
    id: "ai",
    name: "AI/ML",
    level: 5,
    category: "ai",
    connections: ["langchain", "llm"],
    icon: <TbBrain className="w-5 h-5 text-violet-500 dark:text-violet-400" />,
  },
  {
    id: "langchain",
    name: "LangChain",
    level: 5,
    category: "ai",
    connections: ["langgraph"],
    icon: (
      <TbNetwork className="w-5 h-5 text-violet-600 dark:text-violet-500" />
    ),
  },
  {
    id: "langgraph",
    name: "LangGraph",
    level: 4,
    category: "ai",
    connections: [],
    icon: (
      <TbNetwork className="w-5 h-5 text-violet-500 dark:text-violet-400" />
    ),
  },
  {
    id: "llm",
    name: "Local LLMs",
    level: 4,
    category: "ai",
    connections: ["lmstudio"],
    icon: <TbBrain className="w-5 h-5 text-violet-600 dark:text-violet-500" />,
  },

  // DevOps & Tools
  {
    id: "docker",
    name: "Docker",
    level: 4,
    category: "devops",
    connections: ["postman"],
    icon: <FaDocker className="w-5 h-5 text-amber-500 dark:text-amber-400" />,
  },
  {
    id: "git",
    name: "Git",
    level: 5,
    category: "devops",
    connections: [],
    icon: <FaGitAlt className="w-5 h-5 text-amber-600 dark:text-amber-500" />,
  },
  {
    id: "temporal",
    name: "Temporal.io",
    level: 4,
    category: "tools",
    connections: ["workflows"],
    icon: <TbClock className="w-5 h-5 text-rose-500 dark:text-rose-400" />,
  },
  {
    id: "unity",
    name: "Unity",
    level: 4,
    category: "tools",
    connections: [],
    icon: <FaUnity className="w-5 h-5 text-rose-600 dark:text-rose-500" />,
  },
  {
    id: "postman",
    name: "Postman",
    level: 4,
    category: "tools",
    connections: [],
    icon: <SiPostman className="w-5 h-5 text-rose-500 dark:text-rose-400" />,
  },
  {
    id: "lmstudio",
    name: "LM Studio",
    level: 4,
    category: "tools",
    connections: [],
    icon: <TbRobot className="w-5 h-5 text-rose-600 dark:text-rose-500" />,
  },
  {
    id: "workflows",
    name: "Workflows",
    level: 4,
    category: "tools",
    connections: [],
    icon: (
      <TbArrowsRandom className="w-5 h-5 text-rose-500 dark:text-rose-400" />
    ),
  },
];

interface SkillTreeProps {
  onInteraction?: () => void;
}

export const SkillTree: React.FC<SkillTreeProps> = ({ onInteraction }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [hoveredConnections, setHoveredConnections] = useState<string[]>([]);
  const [skills, setSkills] = useState<Skill[]>(SKILLS);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );
  const [hasInteracted, setHasInteracted] = useState(false);

  // Update dimensions on resize
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);
    updateDimensions();

    return () => resizeObserver.disconnect();
  }, []);

  // Watch for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.target === document.documentElement &&
          mutation.attributeName === "class"
        ) {
          setIsDarkMode(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Calculate positions for skills - add useMemo for position calculation
  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;

    // Debounce the position calculation to avoid excessive layout computation
    const calculatePositions = () => {
      const padding = 40;
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      const maxRadius = Math.min(centerX - padding, centerY - padding);

      // Keep track of used positions to avoid overlap
      const usedPositions: { x: number; y: number }[] = [];
      const minDistance = 200;
      const maxAttempts = 500;

      const getRandomPosition = () => {
        let attempts = 0;
        let bestPosition: { x: number; y: number } | null = null;
        let maxDistanceFound = 0;

        // Try multiple positions and pick the one with maximum distance to other nodes
        while (attempts < maxAttempts) {
          const angle = Math.random() * Math.PI * 2;
          // Use more of the available space
          const radius = maxRadius * (0.15 + Math.random() * 0.8);

          const position = {
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
          };

          // Smaller random variation to maintain spacing better
          position.x += (Math.random() - 0.5) * 30;
          position.y += (Math.random() - 0.5) * 30;

          // Ensure position is within bounds
          if (
            position.x < padding ||
            position.x > dimensions.width - padding ||
            position.y < padding ||
            position.y > dimensions.height - padding
          ) {
            attempts++;
            continue;
          }

          // Find minimum distance to any existing node
          let minDistanceToOthers = Infinity;
          for (const pos of usedPositions) {
            const dx = pos.x - position.x;
            const dy = pos.y - position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            minDistanceToOthers = Math.min(minDistanceToOthers, distance);
          }

          // If this position is better than what we've found so far, keep it
          if (minDistanceToOthers > maxDistanceFound) {
            maxDistanceFound = minDistanceToOthers;
            bestPosition = position;
          }

          // If we found a position that satisfies our minimum distance, use it immediately
          if (minDistanceToOthers >= minDistance) {
            usedPositions.push(position);
            return position;
          }

          attempts++;
        }

        // If we found a position with at least 90% of desired distance, use it
        if (bestPosition && maxDistanceFound > minDistance * 0.9) {
          usedPositions.push(bestPosition);
          return bestPosition;
        }

        // If we still haven't found a good position, try one final time with slightly reduced distance
        const finalAttempts = 100;
        const finalMinDistance = minDistance * 0.85; // Only accept 85% of desired distance

        for (let i = 0; i < finalAttempts; i++) {
          const angle = Math.random() * Math.PI * 2;
          const radius = maxRadius * (0.15 + Math.random() * 0.8);

          const position = {
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
          };

          position.x += (Math.random() - 0.5) * 30;
          position.y += (Math.random() - 0.5) * 30;

          if (
            position.x < padding ||
            position.x > dimensions.width - padding ||
            position.y < padding ||
            position.y > dimensions.height - padding
          ) {
            continue;
          }

          const isFarEnough = usedPositions.every((pos) => {
            const dx = pos.x - position.x;
            const dy = pos.y - position.y;
            return Math.sqrt(dx * dx + dy * dy) > finalMinDistance;
          });

          if (isFarEnough) {
            usedPositions.push(position);
            return position;
          }
        }

        // If all else fails, use the best position we found
        if (bestPosition) {
          usedPositions.push(bestPosition);
          return bestPosition;
        }

        // Absolute last resort - should rarely happen
        return {
          x: centerX + (Math.random() - 0.5) * maxRadius,
          y: centerY + (Math.random() - 0.5) * maxRadius,
        };
      };

      // Randomize skills completely
      const shuffledSkills = [...skills].sort(() => Math.random() - 0.5);

      const updatedSkills = shuffledSkills.map((skill) => {
        const position = getRandomPosition();
        return { ...skill, x: position.x, y: position.y };
      });

      setSkills(updatedSkills);
    };

    // Use requestAnimationFrame to ensure position calculation happens during idle frames
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(calculatePositions);
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [dimensions]);

  // Draw connections between skills
  useEffect(() => {
    if (!canvasRef.current || !skills[0].x) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Set canvas size with device pixel ratio for sharper rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Keep track of drawn connections to avoid duplicates
    const drawnConnections = new Set();

    // Use requestAnimationFrame for smoother drawing
    requestAnimationFrame(() => {
      // Draw connections with straight lines
      skills.forEach((skill) => {
        skill.connections.forEach((connectedId) => {
          const connectedSkill = skills.find((s) => s.id === connectedId);
          if (
            !connectedSkill ||
            !skill.x ||
            !skill.y ||
            !connectedSkill.x ||
            !connectedSkill.y
          )
            return;

          // Create a unique identifier for the connection (ordered alphabetically to ensure consistency)
          const connectionId = [skill.id, connectedId].sort().join("-");
          if (drawnConnections.has(connectionId)) return;
          drawnConnections.add(connectionId);

          ctx.beginPath();
          ctx.moveTo(skill.x, skill.y);
          ctx.lineTo(connectedSkill.x, connectedSkill.y);

          // Use theme-appropriate colors for connections
          const baseColor = isDarkMode ? "150, 150, 150" : "100, 100, 100";
          const hoverColor = isDarkMode ? "200, 200, 200" : "75, 75, 75";

          const isConnectionHovered =
            hoveredSkill === skill.id || hoveredSkill === connectedId;

          if (isConnectionHovered) {
            ctx.strokeStyle = `rgba(${hoverColor}, 0.4)`;
            ctx.lineWidth = 2;
            ctx.shadowColor = isDarkMode
              ? "rgba(255, 255, 255, 0.2)"
              : "rgba(99, 102, 241, 0.2)";
            ctx.shadowBlur = 8;
          } else {
            ctx.strokeStyle = `rgba(${baseColor}, 0.15)`;
            ctx.lineWidth = 1;
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
          }

          ctx.stroke();
        });
      });
    });
  }, [skills, hoveredSkill, isDarkMode]);

  const handleSkillHover = (skillId: string) => {
    setHoveredSkill(skillId);
    // Get both outgoing and incoming connections
    const skill = skills.find((s) => s.id === skillId);
    if (skill) {
      const outgoingConnections = skill.connections;
      const incomingConnections = skills
        .filter((s) => s.connections.includes(skillId))
        .map((s) => s.id);
      setHoveredConnections([...outgoingConnections, ...incomingConnections]);
    }

    // Trigger the achievement only once
    if (!hasInteracted) {
      setHasInteracted(true);
      onInteraction?.();
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-4 text-sm mb-6 bg-white/80 dark:bg-zinc-900/80 p-3 rounded-lg backdrop-blur-sm">
        <div className="flex items-center gap-2 font-medium">
          <TbCode className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />{" "}
          Languages
        </div>
        <div className="flex items-center gap-2 font-medium">
          <TbWorldWww className="w-4 h-4 text-sky-500 dark:text-sky-400" />{" "}
          Frontend
        </div>
        <div className="flex items-center gap-2 font-medium">
          <FaDatabase className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />{" "}
          Backend
        </div>
        <div className="flex items-center gap-2 font-medium">
          <TbBrain className="w-4 h-4 text-violet-500 dark:text-violet-400" />{" "}
          AI/ML
        </div>
        <div className="flex items-center gap-2 font-medium">
          <TbBoxMultiple className="w-4 h-4 text-amber-500 dark:text-amber-400" />{" "}
          DevOps
        </div>
        <div className="flex items-center gap-2 font-medium">
          <TbTools className="w-4 h-4 text-rose-500 dark:text-rose-400" /> Tools
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative w-full h-[450px] overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        <div className="absolute inset-0">
          {skills.map((skill) => (
            <div
              key={skill.id}
              style={{
                position: "absolute",
                left: skill.x ? `${skill.x}px` : "0",
                top: skill.y ? `${skill.y}px` : "0",
                transform: "translate(-50%, -50%)",
                zIndex:
                  hoveredSkill === skill.id ||
                  hoveredConnections.includes(skill.id)
                    ? 50
                    : 10,
              }}
              className="group"
            >
              <div
                className={`p-2 rounded-full relative z-20
                  ${
                    hoveredSkill === skill.id ||
                    hoveredConnections.includes(skill.id)
                      ? "bg-white/90 dark:bg-zinc-800/90 scale-110 shadow-lg shadow-indigo-500/30 dark:shadow-zinc-300/20 ring-1 ring-indigo-500/20 dark:ring-white/20"
                      : "bg-white/70 hover:bg-white/80 dark:bg-zinc-800/70 dark:hover:bg-zinc-800/80"
                  }
                  after:absolute after:inset-0 after:rounded-full after:blur-sm after:bg-inherit after:opacity-50
                  border border-zinc-200/40 dark:border-zinc-700/40
                  transition-all duration-300 ease-out will-change-transform
                `}
                onMouseEnter={() => handleSkillHover(skill.id)}
                onMouseLeave={() => {
                  setHoveredSkill(null);
                  setHoveredConnections([]);
                }}
              >
                <div className="text-black dark:text-white relative z-30">
                  {skill.icon}
                </div>
                <div
                  className="absolute bottom-0 left-0 h-0.5 rounded-full bg-black/60 dark:bg-white/60 transition-[width] duration-200 ease-out"
                  style={{ width: `${(skill.level / 5) * 100}%` }}
                />
              </div>
              <div
                className={`absolute left-1/2 -translate-x-1/2 -bottom-10 px-3 py-1.5 z-40
                  bg-white/95 dark:bg-zinc-900/95 text-black dark:text-white text-xs font-medium rounded-md
                  backdrop-blur-sm pointer-events-none
                  ${
                    hoveredSkill === skill.id ||
                    hoveredConnections.includes(skill.id)
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-3"
                  }
                  transition-all duration-300 ease-out
                  shadow-lg border border-zinc-200/50 dark:border-zinc-700/50`}
              >
                {skill.name}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 border-[5px] border-transparent border-b-white/95 dark:border-b-zinc-900/95" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
