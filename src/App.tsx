import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Github, Mail, Download, Trophy, Music, Paperclip } from "lucide-react";
import { AmbientPlayer } from "./components/AmbientPlayer";
import { SkillTree } from "./components/SkillTree";
import { KudosButton } from "./components/KudosButton";
import { SpotifyWidget } from "./components/SpotifyWidget";
import { SpotifyAuth } from "./components/SpotifyAuth";
import { ThemeToggle } from "./components/ThemeToggle";
import { ProjectCarousel } from "./components/ProjectCarousel";
import { StarBackground } from "./components/StarBackground";
import { Confetti } from "./components/Confetti";

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
};

const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${
  import.meta.env.VITE_SPOTIFY_CLIENT_ID
}&response_type=code&redirect_uri=${encodeURIComponent(
  "http://localhost:5173/callback"
)}&scope=${encodeURIComponent(
  "user-read-currently-playing user-read-recently-played"
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
  const [mounted, setMounted] = useState(false);
  const [achievements, setAchievements] = useState<Set<string>>(new Set());
  const [showAchievementsPanel, setShowAchievementsPanel] = useState(false);
  const [socialsVisible, setSocialsVisible] = useState(false);
  const [socialClicks, setSocialClicks] = useState<Set<string>>(new Set());
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [readStartTime, setReadStartTime] = useState<number | null>(null);
  const [visitedSections, setVisitedSections] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    setMounted(true);
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

    if (newSocialClicks.size === 3) {
      // Changed to 3 to include all social links
      unlockAchievement(ACHIEVEMENTS.ALL_SOCIALS);
    }
  };

  const handleNameClick = () => {
    unlockAchievement(ACHIEVEMENTS.NAME_CLICK);
  };

  const handleResumeDownload = () => {
    unlockAchievement(ACHIEVEMENTS.RESUME);
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
        transition-all duration-300"
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
          transition-all duration-300 transform"
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
          <div className="mb-6">
            <span
              onClick={handleNameClick}
              className="text-4xl font-normal hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300 cursor-pointer inline-block"
            >
              Hem Desai.
            </span>
            <p className="text-lg text-black/80 dark:text-white/80 mt-2">
              Software developer based in Ahmedabad, focused on building minimal
              and functional web applications.
            </p>
          </div>

          {/* Social Links */}
          <div className="relative inline-block mb-1">
            <button
              onClick={() => setSocialsVisible(!socialsVisible)}
              className="p-2 rounded-full hover:bg-indigo-500/10 hover:ring-2 hover:ring-indigo-500/20 transition-all duration-300 group"
              aria-label="Toggle social links"
            >
              <Paperclip className="w-5 h-5 text-black dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-300" />
            </button>

            <div
              className={`absolute left-full ml-4 top-0 flex items-center gap-4 pl-2
              transition-all duration-500 ease-out
              ${
                socialsVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4 pointer-events-none"
              }`}
            >
              <a
                href="mailto:hemniraldesai@gmail.com"
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm 
                  hover:text-indigo-500 dark:hover:text-indigo-400
                  flex items-center gap-2 text-black dark:text-white 
                  transition-colors duration-300"
                onClick={() => handleSocialClick("email")}
              >
                <Mail size={16} />
              </a>
              <a
                href="https://github.com/Hem-Desai"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm 
                  hover:text-indigo-500 dark:hover:text-indigo-400
                  flex items-center gap-2 text-black dark:text-white 
                  transition-colors duration-300"
                onClick={() => handleSocialClick("github")}
              >
                <Github size={16} />
              </a>
              <button
                onClick={() => {
                  handleResumeDownload();
                  handleSocialClick("resume");
                }}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm 
                  hover:text-indigo-500 dark:hover:text-indigo-400
                  flex items-center gap-2 text-black dark:text-white 
                  transition-colors duration-300"
              >
                <Download size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Work Experience */}
        <section className="animate-fade-in animation-delay-200">
          <h2 className="text-2xl font-medium text-black dark:text-white mb-5">
            Work Experience
          </h2>
          <div className="space-y-6">
            <div className="block group">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-normal text-black dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300">
                  AIVOA
                </h3>
                <span className="text-sm font-normal text-black dark:text-white">
                  Jan 2025 - Present
                </span>
              </div>
              <p className="text-black dark:text-white text-sm font-normal mb-2">
                Software Developer Intern
              </p>
              <ul className="text-black dark:text-white text-sm font-normal space-y-1">
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
                <span className="text-sm font-normal text-black dark:text-white">
                  June 2022 - July 2024
                </span>
              </div>
              <p className="text-black dark:text-white text-sm font-normal mb-2">
                Vice President
              </p>
              <ul className="text-black dark:text-white text-sm font-normal space-y-1">
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
          <h2 className="text-2xl font-medium text-black dark:text-white mb-8">
            Projects
          </h2>
          <ProjectCarousel projects={PROJECTS} />
        </section>

        {/* Skills */}
        <section className="animate-fade-in animation-delay-400">
          <h2 className="text-2xl font-medium text-black dark:text-white mb-8">
            Skills
          </h2>
          <SkillTree onInteraction={handleSkillInteraction} />
        </section>

        {/* About */}
        <section className="animate-fade-in animation-delay-500">
          <h2 className="text-2xl font-medium text-black dark:text-white mb-8">
            About
          </h2>
          <p className="text-black dark:text-white font-normal">
            Currently working as a Software Developer Intern at AIVOA, focusing
            on AI-driven solutions and backend development. Previously led
            technical initiatives at Synergy Technical Club. Passionate about
            AI/ML, minimal design, and building functional web applications.
          </p>
        </section>
      </main>
      <div className="relative min-h-screen">
        <ThemeToggle onThemeToggle={handleThemeToggle} />
        {localStorage.getItem("spotifyRefreshToken") ? (
          <SpotifyWidget
            onTrackClick={() => unlockAchievement(ACHIEVEMENTS.SPOTIFY_CONNECT)}
          />
        ) : (
          <a
            href={SPOTIFY_AUTH_URL}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 
              bg-white/10 backdrop-blur-sm rounded-lg border border-zinc-200/20 dark:border-zinc-700/20 
              text-black dark:text-white hover:bg-white/20 transition-all duration-300"
          >
            <Music className="w-4 h-4" />
            Connect Spotify
          </a>
        )}
        <KudosButton
          onFirstKudos={() => unlockAchievement(ACHIEVEMENTS.KUDOS_FIRST)}
          onAllKudos={() => unlockAchievement(ACHIEVEMENTS.KUDOS_ALL)}
        />
        <AmbientPlayer onAllSoundsPlayed={handleAmbientSoundComplete} />
      </div>
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
