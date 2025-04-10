import { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Github, Mail, Download, Trophy, Music, Linkedin } from "lucide-react";
import { AmbientPlayer } from "./components/AmbientPlayer";
import { SkillTree } from "./components/SkillTree";
import { KudosButton } from "./components/KudosButton";
import { SpotifyWidget } from "./components/SpotifyWidget";
import { SpotifyAuth } from "./components/SpotifyAuth";
import { ThemeToggle } from "./components/ThemeToggle";
import { ProjectCarousel } from "./components/ProjectCarousel";
import { StarBackground } from "./components/StarBackground";
import { Confetti } from "./components/Confetti";
import { ImageViewer } from "./components/ImageViewer";

// Achievement definitions
const ACHIEVEMENTS = {
  THEME_TOGGLE: {
    id: "theme_toggle",
    title: "Light & Dark",
    description: "Explored both sides of the force",
  },
  NAME_CLICK: {
    id: "name_click",
    title: "Identity Crisis",
    description: "Clicked on my name",
  },
  ALL_SOCIALS: {
    id: "all_socials",
    title: "Social Butterfly",
    description: "Checked out all social links",
  },
  RESUME: {
    id: "resume",
    title: "Paper Trail",
    description: "Downloaded my resume",
  },
  SPOTIFY_CONNECT: {
    id: "spotify_connect",
    title: "Music Enthusiast",
    description: "Checked out what I'm listening to",
  },
  KUDOS_FIRST: {
    id: "kudos_first",
    title: "First Impression",
    description: "Left your first kudos",
  },
  KUDOS_ALL: {
    id: "kudos_all",
    title: "Emoji Master",
    description: "Used all kudos reactions",
  },
  AMBIENT_SOUNDS: {
    id: "ambient_sounds",
    title: "Sound Explorer",
    description: "Tried all ambient sound options",
  },
  NIGHT_OWL: {
    id: "night_owl",
    title: "Night Owl",
    description: "Visited between 12 AM and 5 AM",
  },
  SKILL_EXPLORER: {
    id: "skill_explorer",
    title: "Tech Curious",
    description: "Explored the skill tree",
  },
  PROFILE_HOVER: {
    id: "profile_hover",
    title: "Curious Observer",
    description: "Hovered over my profile for suspiciously long time",
  },
};

const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${
  import.meta.env.VITE_SPOTIFY_CLIENT_ID
}&response_type=code&redirect_uri=${encodeURIComponent(
  "http://localhost:5173/callback"
)}&scope=${encodeURIComponent(
  "user-read-currently-playing user-read-recently-played user-read-playback-state"
)}`;

// Add this before the MainContent function
const PROJECTS = [
  {
    title: "MediWrite",
    description:
      "Developed a medical automation system, streamlining emergency procedures for accident cases by automating documentation, patient registration, and data management using Python and Flask.",
    link: "https://github.com/Hem-Desai/MediWrite",
    technologies: ["React", "Flask", "Python"],
  },
  {
    title: "Local LLM based Assistant",
    description:
      "Designed and developed a local LLM-based AI assistant, providing conversational AI capabilities without relying on external APIs, ensuring data privacy and faster response times.",
    link: "https://github.com/Hem-Desai/local-ollama-assistant",
    technologies: ["Python", "Ollama"],
  },
  {
    title: "Doctor Website",
    description:
      "Developed a web application enabling doctors to connect with patients for consultations and follow-ups. Implemented secure messaging, appointment scheduling, and patient record management.",
    link: "https://dr-anupama-desai.vercel.app/",
    technologies: ["React Native", "TailwindCSS", "TypeScript", "Supabase"],
  },
  {
    title: "StreamPlay Assistant",
    description:
      "Developed StreamPlay Assistant, a cloud-based gaming bot enabling viewers to control gameplay via chat commands on Twitch, enhancing audience engagement and stream interactivity.",
    link: "https://github.com/Hem-Desai/StreamPlay-Assistant",
    technologies: ["Python", "AutoHotKey"],
  },
  {
    title: "Sign Language Translator",
    description: "App translating from English into US sign language.",
    link: "https://github.com/Hem-Desai/Sign-Language-Translator",
    technologies: ["JavaScript", "React", "Context API", "Flexbox"],
  },
];

function MainContent() {
  const [achievements, setAchievements] = useState<Set<string>>(new Set());
  const [showAchievementsPanel, setShowAchievementsPanel] = useState(false);
  const [socialClicks, setSocialClicks] = useState<Set<string>>(new Set());
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [profileHoverProgress, setProfileHoverProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    localStorage.removeItem("achievements");
    setAchievements(new Set());

    // Check for night owl achievement
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 5) {
      unlockAchievement(ACHIEVEMENTS.NIGHT_OWL);
    }

    const handleAchievement = (e: CustomEvent) => {
      unlockAchievement(e.detail);
    };

    window.addEventListener(
      "unlockAchievement",
      handleAchievement as EventListener
    );

    return () => {
      window.removeEventListener(
        "unlockAchievement",
        handleAchievement as EventListener
      );
    };
  }, []);

  const unlockAchievement = (
    achievement: (typeof ACHIEVEMENTS)[keyof typeof ACHIEVEMENTS]
  ) => {
    if (!achievements.has(achievement.id)) {
      const newAchievements = new Set(achievements).add(achievement.id);
      setAchievements(newAchievements);
      setConfettiTrigger((prev) => !prev);
    }
  };

  const handleSocialClick = (platform: string) => {
    const newSocialClicks = new Set(socialClicks).add(platform);
    setSocialClicks(newSocialClicks);

    if (newSocialClicks.size === 4) {
      // Changed to 4 to include all social links (email, GitHub, LinkedIn, resume)
      unlockAchievement(ACHIEVEMENTS.ALL_SOCIALS);
    }
  };

  const handleNameClick = () => {
    unlockAchievement(ACHIEVEMENTS.NAME_CLICK);
  };

  const handleResumeDownload = () => {
    unlockAchievement(ACHIEVEMENTS.RESUME);
  };

  const copyEmailToClipboard = () => {
    const email = "hemniraldesai@gmail.com";
    navigator.clipboard
      .writeText(email)
      .then(() => {
        // Create toast container if it doesn't exist
        let toastContainer = document.getElementById("toast-container");
        if (!toastContainer) {
          toastContainer = document.createElement("div");
          toastContainer.id = "toast-container";
          toastContainer.className =
            "fixed bottom-16 left-0 right-0 flex justify-center items-center z-50 pointer-events-none";
          document.body.appendChild(toastContainer);
        }

        // Create the toast notification
        const toast = document.createElement("div");
        toast.className =
          "bg-white/90 dark:bg-zinc-800/90 text-black dark:text-white px-4 py-2 rounded-lg shadow-lg animate-fade-up flex items-center gap-2 border border-zinc-200/20 dark:border-zinc-700/20 pointer-events-auto";
        toast.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Email copied to clipboard!</span>';

        toastContainer.appendChild(toast);

        // Remove the toast after 2 seconds
        setTimeout(() => {
          toast.classList.add(
            "opacity-0",
            "transition-opacity",
            "duration-300"
          );
          setTimeout(() => {
            if (toast.parentNode === toastContainer) {
              toastContainer.removeChild(toast);
            }
            // Remove container if empty
            if (toastContainer.children.length === 0) {
              document.body.removeChild(toastContainer);
            }
          }, 300);
        }, 2000);

        handleSocialClick("email");
      })
      .catch((err) => {
        console.error("Could not copy email: ", err);
      });
  };

  // Add handlers for other achievements
  const handleThemeToggle = () => {
    unlockAchievement(ACHIEVEMENTS.THEME_TOGGLE);
  };

  const handleAmbientSoundComplete = () => {
    unlockAchievement(ACHIEVEMENTS.AMBIENT_SOUNDS);
  };

  const handleSkillInteraction = () => {
    unlockAchievement(ACHIEVEMENTS.SKILL_EXPLORER);
  };

  // Add new handler for profile hover achievement
  const handleProfileHoverStart = () => {
    setIsHovering(true);
    setProfileHoverProgress(0);

    // Clear any existing timer
    if (hoverTimerRef.current) {
      clearInterval(hoverTimerRef.current);
    }

    // Set up a timer to increment progress
    const startTime = Date.now();
    const duration = 4000; // 4 seconds

    hoverTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setProfileHoverProgress(progress);

      if (progress >= 1) {
        // Achievement unlocked!
        unlockAchievement(ACHIEVEMENTS.PROFILE_HOVER);
        clearInterval(hoverTimerRef.current!);
      }
    }, 50);
  };

  const handleProfileHoverEnd = () => {
    setIsHovering(false);
    setProfileHoverProgress(0);

    if (hoverTimerRef.current) {
      clearInterval(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white">
      <StarBackground />
      <Confetti trigger={confettiTrigger} />

      {/* Achievements Counter */}
      <button
        onClick={() => setShowAchievementsPanel(!showAchievementsPanel)}
        className="fixed bottom-4 left-4 flex items-center gap-2 px-3 py-2 
        bg-white/10 dark:bg-zinc-800/90 backdrop-blur-sm
        rounded-lg shadow-lg border border-white/20 dark:border-zinc-700/50
        text-black dark:text-white hover:bg-white/20 dark:hover:bg-zinc-700/90
        transition-all duration-300 z-50"
      >
        <Trophy className="w-4 h-4 text-emerald-500" />
        <span className="font-medium text-emerald-500">
          {achievements.size}
        </span>
        <span className="text-black/60 dark:text-white/60">
          / {Object.keys(ACHIEVEMENTS).length}
        </span>
      </button>

      {/* Achievements List Panel */}
      {showAchievementsPanel && (
        <div
          className="fixed bottom-16 left-4 w-72 bg-white/10 dark:bg-zinc-800/90 backdrop-blur-sm p-4 
          rounded-lg shadow-lg border border-white/20 dark:border-zinc-700/50
          transition-all duration-300 transform z-50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-black dark:text-white">
              Achievements
            </h3>
            <button
              onClick={() => setShowAchievementsPanel(false)}
              className="p-1 hover:bg-white/10 dark:hover:bg-zinc-700/50 rounded-full
              transition-all duration-300"
            >
              ×
            </button>
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {Object.values(ACHIEVEMENTS).map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-start gap-3 p-2 rounded-lg transition-all duration-300
                ${
                  achievements.has(achievement.id)
                    ? "bg-emerald-500/10 dark:bg-emerald-500/20"
                    : "bg-white/5 dark:bg-zinc-700/30"
                }`}
              >
                <div
                  className={`p-1.5 rounded-full flex-shrink-0
                  ${
                    achievements.has(achievement.id)
                      ? "bg-emerald-500/20 text-emerald-500"
                      : "bg-zinc-200/20 dark:bg-zinc-700/50 text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  <Trophy className="w-3 h-3" />
                </div>
                <div>
                  <p
                    className={`text-sm font-medium
                    ${
                      achievements.has(achievement.id)
                        ? "text-emerald-500 dark:text-emerald-400"
                        : "text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    {achievement.title}
                  </p>
                  <p className="text-xs text-black/60 dark:text-white/60">
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <main className="max-w-2xl mx-auto space-y-8 p-6 md:p-12 py-24">
        {/* Intro */}
        <section className="animate-fade-in">
          <div className="mb-12 flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Picture with Progress Ring */}
            <div
              className="relative w-28 h-28 md:w-36 md:h-36 flex-shrink-0"
              onMouseEnter={handleProfileHoverStart}
              onMouseLeave={handleProfileHoverEnd}
              onTouchStart={handleProfileHoverStart}
              onTouchEnd={handleProfileHoverEnd}
            >
              {/* Circular Progress Indicator - Only visible during hover */}
              {isHovering && (
                <svg
                  className="absolute inset-0 w-full h-full rotate-[-90deg] z-10"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="#A5B4FC" /* Pastel indigo color */
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${profileHoverProgress * 301.6} 301.6`}
                    style={{ transition: "stroke-dasharray 50ms linear" }}
                  />
                </svg>
              )}

              {/* Profile Image */}
              <div className="absolute inset-[2px] rounded-full overflow-hidden border border-zinc-800/50 dark:border-zinc-800/50 shadow-xl">
                <img
                  src="/images/profile.jpg"
                  alt="Hem Desai"
                  className="w-full h-full object-cover"
                  onClick={() => setShowImageViewer(true)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>

            <div className="text-center md:text-left">
              <h1
                onClick={handleNameClick}
                className="text-3xl md:text-5xl font-medium text-black dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300 cursor-pointer tracking-tight"
              >
                Hem Desai.
              </h1>
              <p className="text-lg text-black/80 dark:text-white/80 mt-2 font-light tracking-wide">
                Software developer from Ahmedabad, building stuff, and
                occasionally questioning my life choices after a late-night
                gaming session.
              </p>

              {/* Social Links */}
              <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                <button
                  onClick={copyEmailToClipboard}
                  className="p-2 rounded-full bg-zinc-800/80 backdrop-blur-sm 
                    hover:text-indigo-400 hover:bg-zinc-700/80
                    flex items-center gap-2 text-white 
                    transition-all duration-300 hover:scale-110"
                  aria-label="Copy email address"
                  title="Copy email: hemniraldesai@gmail.com"
                >
                  <Mail size={18} />
                </button>
                <a
                  href="https://github.com/Hem-Desai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-zinc-800/80 backdrop-blur-sm 
                    hover:text-indigo-400 hover:bg-zinc-700/80
                    flex items-center gap-2 text-white 
                    transition-all duration-300 hover:scale-110"
                  onClick={() => handleSocialClick("github")}
                  aria-label="Visit my GitHub"
                  title="GitHub: @Hem-Desai"
                >
                  <Github size={18} />
                </a>
                <a
                  href="https://www.linkedin.com/in/hem-desai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-zinc-800/80 backdrop-blur-sm 
                    hover:text-indigo-400 hover:bg-zinc-700/80
                    flex items-center gap-2 text-white 
                    transition-all duration-300 hover:scale-110"
                  onClick={() => handleSocialClick("linkedin")}
                  aria-label="Visit my LinkedIn profile"
                  title="LinkedIn: @hem-desai"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-zinc-800/80 backdrop-blur-sm 
                    hover:text-indigo-400 hover:bg-zinc-700/80
                    flex items-center gap-2 text-white 
                    transition-all duration-300 hover:scale-110"
                  onClick={() => {
                    handleResumeDownload();
                    handleSocialClick("resume");
                  }}
                  aria-label="View my resume"
                  title="View resume"
                >
                  <Download size={18} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Work Experience */}
        <section className="animate-fade-in animation-delay-200">
          <h2 className="text-2xl font-medium text-black dark:text-white mb-5 tracking-tight">
            Work Experience
          </h2>
          <div className="space-y-6">
            <div className="block group">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-normal text-black dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300">
                  AIVOA
                </h3>
                <span className="text-sm font-light text-black dark:text-white">
                  Jan 2025 - Present
                </span>
              </div>
              <p className="text-black dark:text-white text-sm font-medium mb-2">
                Software Developer Intern
              </p>
              <ul className="text-black dark:text-white text-sm font-light space-y-1">
                <li>• Developing Pharma CRM API</li>
                <li>• AI-Driven Content Generation</li>
                <li>• Backend Development & Database Management</li>
                <li>• Workflow Automation using Temporal</li>
              </ul>
            </div>

            <div className="block group">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-normal text-black dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300">
                  Synergy Technical Club
                </h3>
                <span className="text-sm font-light text-black dark:text-white">
                  June 2022 - July 2024
                </span>
              </div>
              <p className="text-black dark:text-white text-sm font-medium mb-2">
                Vice President
              </p>
              <ul className="text-black dark:text-white text-sm font-light space-y-1">
                <li>• Mentored and Guided Members</li>
                <li>• Led and Managed Club Activities</li>
                <li>• Organized Technical Events</li>
                <li>• Managed Club Operations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="animate-fade-in animation-delay-300">
          <h2 className="text-2xl font-medium text-black dark:text-white mb-8 tracking-tight">
            Projects
          </h2>
          <ProjectCarousel projects={PROJECTS} />
        </section>

        {/* Skills */}
        <section className="animate-fade-in animation-delay-400">
          <h2 className="text-2xl font-medium text-black dark:text-white mb-8 tracking-tight">
            Skills
          </h2>
          <SkillTree onInteraction={handleSkillInteraction} />
        </section>

        {/* About */}
        <section className="animate-fade-in animation-delay-500">
          <h2 className="text-2xl font-medium text-black dark:text-white mb-8 tracking-tight">
            About
          </h2>
          <div>
            <p className="text-black dark:text-white font-light leading-relaxed tracking-wide mb-5">
              Hey there, I'm Hem. Welcome to my little corner of the internet,
              where I turn caffeine and curiosity into AI-driven software,
              backend systems, and things that (hopefully) don't break in
              production.
            </p>
            <p className="text-black dark:text-white font-light leading-relaxed tracking-wide">
              When I'm not coding, I'm either grinding through a FIFA career
              mode, watching football, or dissecting films. I like functional
              software, clean interfaces, and tech that doesn't need a manual to
              use. Whether it's an AI model, an automation tool, or a side
              project I started at 2 AM, I believe in building things that
              actually work—unlike EA servers.
            </p>
          </div>
        </section>
      </main>

      {/* Footer section with controls and Spotify */}
      <footer className="pb-28 relative z-40">
        <ThemeToggle onThemeToggle={handleThemeToggle} />
        <KudosButton
          onFirstKudos={() => unlockAchievement(ACHIEVEMENTS.KUDOS_FIRST)}
          onAllKudos={() => unlockAchievement(ACHIEVEMENTS.KUDOS_ALL)}
        />
        <AmbientPlayer onAllSoundsPlayed={handleAmbientSoundComplete} />

        {/* Centered Spotify widget at the bottom */}
        <div className="flex justify-center items-center w-full mt-10 mb-6">
          {localStorage.getItem("spotifyRefreshToken") ? (
            <div className="relative w-56 mx-auto">
              <SpotifyWidget
                onTrackClick={() =>
                  unlockAchievement(ACHIEVEMENTS.SPOTIFY_CONNECT)
                }
              />
            </div>
          ) : (
            <a
              href={SPOTIFY_AUTH_URL}
              className="flex items-center gap-2 px-3 py-1.5
                bg-white/10 backdrop-blur-sm rounded-lg border border-zinc-200/20 dark:border-zinc-700/20 
                text-black dark:text-white hover:bg-white/20 transition-all duration-300 text-sm"
            >
              <Music className="w-3.5 h-3.5" />
              Connect Spotify
            </a>
          )}
        </div>
      </footer>

      {showImageViewer && (
        <ImageViewer
          src="/images/profile.jpg"
          alt="Hem Desai"
          onClose={() => setShowImageViewer(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/callback" element={<SpotifyAuth />} />
      </Routes>
    </Router>
  );
}

export default App;
