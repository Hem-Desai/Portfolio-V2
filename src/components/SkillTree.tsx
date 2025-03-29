import React, { useEffect, useRef, useState } from "react";
import {
  Code2,
  Boxes,
  Brain,
  Globe,
  Database,
  Wrench,
  Workflow,
  Terminal,
  FileType,
  FileJson,
  Cpu,
  Table2,
  Layout,
  Smartphone,
  Wind,
  Box,
  Beaker,
  Zap,
  Server,
  CircuitBoard,
  GitBranch,
  Container,
  Gamepad,
  Send,
  Bot,
  Network,
  Blocks,
  Clock,
} from "lucide-react";

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
    connections: ["flask", "fastapi", "langchain"],
    icon: <Terminal className="w-5 h-5 text-yellow-400" />,
  },
  {
    id: "typescript",
    name: "TypeScript",
    level: 5,
    category: "languages",
    connections: ["react", "react_native"],
    icon: <FileType className="w-5 h-5 text-blue-500" />,
  },
  {
    id: "javascript",
    name: "JavaScript",
    level: 5,
    category: "languages",
    connections: ["nodejs"],
    icon: <FileJson className="w-5 h-5 text-yellow-400" />,
  },
  {
    id: "cpp",
    name: "C++",
    level: 4,
    category: "languages",
    connections: ["unity"],
    icon: <Terminal className="w-5 h-5 text-blue-600" />,
  },
  {
    id: "sql",
    name: "SQL",
    level: 4,
    category: "languages",
    connections: ["postgresql"],
    icon: <Database className="w-5 h-5 text-blue-400" />,
  },

  // Frontend
  {
    id: "react",
    name: "React",
    level: 5,
    category: "frontend",
    connections: ["context", "react_native"],
    icon: <Box className="w-5 h-5 text-cyan-400" />,
  },
  {
    id: "react_native",
    name: "React Native",
    level: 4,
    category: "frontend",
    connections: [],
    icon: <Smartphone className="w-5 h-5 text-cyan-400" />,
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    level: 5,
    category: "frontend",
    connections: ["flexbox"],
    icon: <Wind className="w-5 h-5 text-cyan-500" />,
  },
  {
    id: "context",
    name: "Context API",
    level: 4,
    category: "frontend",
    connections: [],
    icon: <Box className="w-5 h-5 text-cyan-400" />,
  },
  {
    id: "flexbox",
    name: "Flexbox",
    level: 4,
    category: "frontend",
    connections: [],
    icon: <Layout className="w-5 h-5 text-blue-400" />,
  },

  // Backend
  {
    id: "flask",
    name: "Flask",
    level: 4,
    category: "backend",
    connections: ["postgresql"],
    icon: <Beaker className="w-5 h-5 text-gray-400" />,
  },
  {
    id: "fastapi",
    name: "FastAPI",
    level: 4,
    category: "backend",
    connections: ["postgresql"],
    icon: <Zap className="w-5 h-5 text-teal-500" />,
  },
  {
    id: "nodejs",
    name: "Node.js",
    level: 4,
    category: "backend",
    connections: ["temporal"],
    icon: <Server className="w-5 h-5 text-green-600" />,
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    level: 4,
    category: "backend",
    connections: ["supabase"],
    icon: <Database className="w-5 h-5 text-blue-500" />,
  },
  {
    id: "mongodb",
    name: "MongoDB",
    level: 4,
    category: "backend",
    connections: [],
    icon: <Database className="w-5 h-5 text-green-600" />,
  },
  {
    id: "supabase",
    name: "Supabase",
    level: 4,
    category: "backend",
    connections: [],
    icon: <Database className="w-5 h-5 text-emerald-500" />,
  },

  // AI/ML
  {
    id: "ai",
    name: "AI/ML",
    level: 5,
    category: "ai",
    connections: ["langchain", "llm"],
    icon: <Brain className="w-5 h-5 text-purple-500" />,
  },
  {
    id: "langchain",
    name: "LangChain",
    level: 5,
    category: "ai",
    connections: ["langgraph"],
    icon: <Network className="w-5 h-5 text-emerald-500" />,
  },
  {
    id: "langgraph",
    name: "LangGraph",
    level: 4,
    category: "ai",
    connections: [],
    icon: <Network className="w-5 h-5 text-emerald-500" />,
  },
  {
    id: "llm",
    name: "Local LLMs",
    level: 4,
    category: "ai",
    connections: ["lmstudio"],
    icon: <Brain className="w-5 h-5 text-violet-500" />,
  },

  // DevOps & Tools
  {
    id: "docker",
    name: "Docker",
    level: 4,
    category: "devops",
    connections: [],
    icon: <Container className="w-5 h-5 text-sky-500" />,
  },
  {
    id: "git",
    name: "Git",
    level: 5,
    category: "devops",
    connections: [],
    icon: <GitBranch className="w-5 h-5 text-orange-500" />,
  },
  {
    id: "temporal",
    name: "Temporal.io",
    level: 4,
    category: "tools",
    connections: ["workflows"],
    icon: <Clock className="w-5 h-5 text-blue-500" />,
  },
  {
    id: "unity",
    name: "Unity",
    level: 4,
    category: "tools",
    connections: [],
    icon: <Gamepad className="w-5 h-5 text-zinc-700" />,
  },
  {
    id: "postman",
    name: "Postman",
    level: 4,
    category: "tools",
    connections: [],
    icon: <Send className="w-5 h-5 text-orange-500" />,
  },
  {
    id: "lmstudio",
    name: "LM Studio",
    level: 4,
    category: "tools",
    connections: [],
    icon: <Bot className="w-5 h-5 text-purple-500" />,
  },
  {
    id: "workflows",
    name: "Workflows",
    level: 4,
    category: "tools",
    connections: [],
    icon: <Workflow className="w-5 h-5 text-blue-400" />,
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

  // Calculate positions for skills
  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;

    const padding = 40;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const maxRadius = Math.min(centerX - padding, centerY - padding);

    // Keep track of used positions to avoid overlap
    const usedPositions: { x: number; y: number }[] = [];
    const minDistance = 200; // Much larger minimum distance
    const maxAttempts = 500; // Many more attempts to find good positions

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
  }, [dimensions]);

  // Draw connections between skills
  useEffect(() => {
    if (!canvasRef.current || !skills[0].x) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections with curved lines
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

        ctx.beginPath();

        // Calculate control point for curve
        const midX = (skill.x + connectedSkill.x) / 2;
        const midY = (skill.y + connectedSkill.y) / 2;
        const dx = connectedSkill.x - skill.x;
        const dy = connectedSkill.y - skill.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Add slight curve to the connection line
        const curveOffset = distance * 0.2;
        const controlX = midX + (Math.random() - 0.5) * curveOffset;
        const controlY = midY + (Math.random() - 0.5) * curveOffset;

        ctx.moveTo(skill.x, skill.y);
        ctx.quadraticCurveTo(
          controlX,
          controlY,
          connectedSkill.x,
          connectedSkill.y
        );

        // Use theme-appropriate colors for connections
        const baseColor = isDarkMode ? "150, 150, 150" : "100, 100, 100";
        const hoverColor = isDarkMode ? "200, 200, 200" : "75, 75, 75";

        if (hoveredSkill === skill.id || hoveredSkill === connectedId) {
          ctx.strokeStyle = `rgba(${hoverColor}, 0.4)`;
          ctx.lineWidth = 2;
          // Add glow effect to the connection
          ctx.shadowColor = isDarkMode
            ? "rgba(255, 255, 255, 0.2)"
            : "rgba(99, 102, 241, 0.2)"; // Indigo color for light mode
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
      <div className="grid grid-cols-3 gap-4 text-sm text-black dark:text-white mb-6">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4" /> Languages
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4" /> Frontend
        </div>
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4" /> Backend
        </div>
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4" /> AI/ML
        </div>
        <div className="flex items-center gap-2">
          <Boxes className="w-4 h-4" /> DevOps
        </div>
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4" /> Tools
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative w-full h-[450px] overflow-hidden"
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0">
          {skills.map((skill) => (
            <div
              key={skill.id}
              style={{
                position: "absolute",
                left: skill.x ? `${skill.x}px` : "0",
                top: skill.y ? `${skill.y}px` : "0",
                transform: "translate(-50%, -50%)",
              }}
              className="group"
            >
              <div
                className={`p-2 rounded-full relative
                  ${
                    hoveredSkill === skill.id ||
                    hoveredConnections.includes(skill.id)
                      ? "bg-zinc-200/30 dark:bg-zinc-700/30 scale-110 shadow-lg shadow-indigo-500/20 dark:shadow-zinc-300/10 ring-1 ring-indigo-500/10 dark:ring-white/10"
                      : "bg-zinc-100/20 hover:bg-zinc-200/20 dark:bg-zinc-800/20 dark:hover:bg-zinc-700/20"
                  }
                  after:absolute after:inset-0 after:rounded-full after:blur-sm after:bg-inherit after:opacity-50
                  border border-zinc-200/20 dark:border-zinc-700/20
                  transition-all duration-300
                `}
                onMouseEnter={() => handleSkillHover(skill.id)}
                onMouseLeave={() => {
                  setHoveredSkill(null);
                  setHoveredConnections([]);
                }}
              >
                <div className="text-black dark:text-white relative z-10">
                  {skill.icon}
                </div>
                <div
                  className="absolute bottom-0 left-0 h-0.5 rounded-full bg-black/50 dark:bg-white/50 transition-[width] duration-300"
                  style={{ width: `${(skill.level / 5) * 100}%` }}
                />
              </div>
              <div
                className={`absolute left-1/2 -translate-x-1/2 -bottom-6 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white text-xs rounded 
                  ${
                    hoveredSkill === skill.id ||
                    hoveredConnections.includes(skill.id)
                      ? "opacity-100"
                      : "opacity-0"
                  }
                  transition-[opacity,transform] duration-300 whitespace-nowrap pointer-events-none z-10 shadow-lg`}
              >
                {skill.name}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-zinc-100 dark:border-b-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
