import React, { useEffect, useState, useRef } from "react";
import { Music2, ExternalLink, Pause, Play, RefreshCw } from "lucide-react";
import {
  getCurrentTrack,
  getTrackFeatures,
  type SpotifyTrack,
} from "../lib/spotify";

const UPDATE_INTERVAL = 30000; // 30 seconds

interface SpotifyWidgetProps {
  onTrackClick?: () => void;
}

export const SpotifyWidget: React.FC<SpotifyWidgetProps> = ({
  onTrackClick,
}) => {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const fetchTrack = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      const data = await getCurrentTrack();
      setTrack(data);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to load track data");
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchTrack();

    // Poll for updates
    const interval = setInterval(() => fetchTrack(), UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Visualizer effect
  useEffect(() => {
    if (!canvasRef.current || !track?.id) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let hue = 0;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      hue: number;
    }> = [];

    const createParticles = () => {
      while (particles.length < 50) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 2,
          speedY: (Math.random() - 0.5) * 2,
          hue: hue,
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.hue = hue;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 50%, 0.8)`;
        ctx.fill();
      }

      hue = (hue + 0.5) % 360;
      animationRef.current = requestAnimationFrame(animate);
    };

    const startVisualizer = async () => {
      const features = await getTrackFeatures(track.id);
      if (features) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        createParticles();
        animate();
      }
    };

    startVisualizer();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [track?.id]);

  // Add effect to check dimensions
  useEffect(() => {
    const checkDimensions = () => {
      console.log("Viewport:", {
        width: window.innerWidth,
        height: window.innerHeight,
      });
      console.log("Document:", {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      });
    };

    checkDimensions();
    window.addEventListener("resize", checkDimensions);
    return () => window.removeEventListener("resize", checkDimensions);
  }, []);

  if (error) {
    return (
      <div className="w-full rounded-lg p-3 bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300">
        <div className="flex items-center gap-2">
          <Music2 className="w-4 h-4" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 120) return "1 minute ago";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 7200) return "1 hour ago";
    return `${Math.floor(seconds / 3600)} hours ago`;
  };

  return (
    <div
      className="w-full rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm 
      border border-zinc-200/20 dark:border-zinc-700/20 group transition-all duration-300
      hover:bg-white/20 dark:hover:bg-zinc-800/50 z-30 animate-fade-up text-sm"
    >
      {/* Canvas for visualizer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-30"
      />

      {/* Content */}
      <div className="relative p-2">
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={() => fetchTrack(true)}
            disabled={isRefreshing}
            className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white 
              transition-colors p-1 rounded-full hover:bg-white/10 disabled:opacity-50"
            title="Refresh now"
          >
            <RefreshCw
              className={`w-2.5 h-2.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
          {lastUpdated && (
            <span className="text-[8px] text-black/40 dark:text-white/40">
              Updated {formatLastUpdated(lastUpdated)}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-1.5 text-black dark:text-white text-xs py-1.5">
            <Music2 className="w-3 h-3 animate-pulse" />
            <span>Loading Spotify data...</span>
          </div>
        ) : track ? (
          <div className="flex items-center gap-2">
            {/* Album Art */}
            <div
              className="relative w-10 h-10 rounded overflow-hidden 
              shadow-lg transition-transform duration-300 group-hover:scale-105 flex-shrink-0"
            >
              <img
                src={track.albumArt}
                alt={`${track.album} cover`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
              {track.isPlaying ? (
                <Pause className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 text-white drop-shadow-lg" />
              ) : (
                <Play className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 text-white drop-shadow-lg" />
              )}
            </div>

            {/* Track Info */}
            <div className="min-w-0 flex-1">
              <a
                href={track.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onTrackClick}
                className="flex items-center gap-1 text-[11px] font-medium text-black dark:text-white 
                  hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors truncate"
              >
                {track.name}
                <ExternalLink className="w-2 h-2 flex-shrink-0" />
              </a>
              <p className="text-[9px] text-black/60 dark:text-white/60 truncate">
                {track.artist}
              </p>
              <p className="text-[8px] text-black/40 dark:text-white/40">
                {track.isPlaying ? "Now playing" : "Last played"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1.5 text-black dark:text-white text-xs py-1.5">
            <Music2 className="w-3 h-3" />
            <span>No track data available</span>
          </div>
        )}
      </div>
    </div>
  );
};
