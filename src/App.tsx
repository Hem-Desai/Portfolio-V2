import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Github, Mail, Download, Trophy, Music, Paperclip } from "lucide-react";
import { AmbientPlayer } from "./components/AmbientPlayer";
import { SkillTree } from "./components/SkillTree";
import { DestroyButton } from "./components/DestroyButton";
import { KudosButton } from "./components/KudosButton";
import { SpotifyWidget } from "./components/SpotifyWidget";
import { SpotifyAuth } from "./components/SpotifyAuth";
import { ThemeToggle } from "./components/ThemeToggle";
import { ProjectCarousel } from "./components/ProjectCarousel";
import { StarBackground } from "./components/StarBackground";

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
  DESTROY_WEBSITE: {
    id: "destroy_website",
    title: "Chaos Agent",
    description: "Unleashed destruction upon the website",
  },
  SPOTIFY_CONNECT: {
    id: "spotify_connect",
    title: "Music Enthusiast",
    description: "Connected your Spotify account",
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
  SCROLL_BOTTOM: {
    id: "scroll_bottom",
    title: "Deep Diver",
    description: "Scrolled all the way to the bottom",
  },
  AMBIENT_SOUNDS: {
    id: "ambient_sounds",
    title: "Sound Explorer",
    description: "Tried all ambient sound options",
  },
  QUICK_READER: {
    id: "quick_reader",
    title: "Speed Reader",
    description: "Read through all sections in under 30 seconds",
  },
  NIGHT_OWL: {
    id: "night_owl",
    title: "Night Owl",
    description: "Visited between 12 AM and 5 AM",
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
  const [showNotification, setShowNotification] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [socialClicks, setSocialClicks] = useState<Set<string>>(new Set());
  const [showAchievements, setShowAchievements] = useState(false);
  const [ribbons, setRibbons] = useState<
    { id: number; color: string; left: string }[]
  >([]);
  const [showAchievementsPanel, setShowAchievementsPanel] = useState(false);
  const [socialsVisible, setSocialsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load achievements from localStorage
    const savedAchievements = localStorage.getItem("achievements");
    if (savedAchievements) {
      setAchievements(new Set(JSON.parse(savedAchievements)));
      setShowAchievements(true);
    }
  }, []);

  const createRibbons = () => {
    const colors = [
      "#FF0000",
      "#00FF00",
      "#0000FF",
      "#FFFF00",
      "#FF00FF",
      "#00FFFF",
    ];
    const newRibbons = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      color: colors[Math.floor(Math.random() * colors.length)],
      left: `${Math.random() * 100}%`,
    }));
    setRibbons(newRibbons);
    setTimeout(() => setRibbons([]), 1500);
  };

  const unlockAchievement = (
    achievement: (typeof ACHIEVEMENTS)[keyof typeof ACHIEVEMENTS]
  ) => {
    if (!achievements.has(achievement.id)) {
      const newAchievements = new Set(achievements).add(achievement.id);
      setAchievements(newAchievements);
      localStorage.setItem(
        "achievements",
        JSON.stringify([...newAchievements])
      );

      if (!showAchievements) {
        setShowAchievements(true);
        createRibbons();
      }

      setCurrentAchievement(achievement);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const handleSocialClick = (platform: string) => {
    const newSocialClicks = new Set(socialClicks).add(platform);
    setSocialClicks(newSocialClicks);

    if (newSocialClicks.size === 2) {
      unlockAchievement(ACHIEVEMENTS.ALL_SOCIALS);
    }
  };

  const handleNameClick = () => {
    unlockAchievement(ACHIEVEMENTS.NAME_CLICK);
  };

  const handleResumeDownload = () => {
    unlockAchievement(ACHIEVEMENTS.RESUME);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white">
      <StarBackground />
      {/* Celebration Ribbons */}
      {ribbons.map((ribbon) => (
        <div
          key={ribbon.id}
          className="ribbon"
          style={{
            backgroundColor: ribbon.color,
            left: ribbon.left,
            top: "50%",
          }}
        />
      ))}

      {/* Achievement Notification */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-full flex items-center gap-2 transition-transform duration-300 ${
          showNotification
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform -translate-y-full"
        }`}
      >
        <Trophy size={20} />
        <div>
          <p className="font-medium">{currentAchievement?.title}</p>
          <p className="text-sm opacity-90">
            {currentAchievement?.description}
          </p>
        </div>
      </div>

      {/* Achievements Panel - Now toggleable */}
      {showAchievements && (
        <div
          className={`fixed bottom-6 left-6 bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg shadow-lg 
            transition-all duration-300 ${
              showAchievementsPanel
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-full pointer-events-none"
            }`}
        >
          <button
            onClick={() => setShowAchievementsPanel(!showAchievementsPanel)}
            className="absolute -top-10 left-0 flex items-center gap-2 text-sm text-black dark:text-white 
              bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-t-lg"
          >
            <Trophy size={16} />
            {achievements.size}/{Object.keys(ACHIEVEMENTS).length}
          </button>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2 text-black dark:text-white">
            <Trophy size={16} />
            Achievements
          </h3>
          <div className="space-y-2">
            {Object.values(ACHIEVEMENTS).map((achievement) => (
              <div
                key={achievement.id}
                className={`text-xs ${
                  achievements.has(achievement.id)
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                {achievement.title}
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
          <SkillTree />
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
        <ThemeToggle />
        {localStorage.getItem("spotifyRefreshToken") ? (
          <SpotifyWidget />
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
        <KudosButton />
        <DestroyButton />
        <AmbientPlayer />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/callback" element={<SpotifyAuth />} />
        <Route path="/" element={<MainContent />} />
      </Routes>
    </Router>
  );
}

export default App;
