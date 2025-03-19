import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../hooks/useTheme";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  angle: number;
  originalX: number;
  originalY: number;
  twinkleSpeed: number;
  twinklePhase: number;
  velocityX: number;
  velocityY: number;
  hue: number;
}

export const StarBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number>();
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      const stars: Star[] = [];
      const numStars = Math.floor(
        (window.innerWidth * window.innerHeight) / 8000
      );

      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1.5, // Slightly larger base size
          opacity: Math.random() * 0.3 + 0.5, // Higher base opacity
          speed: Math.random() * 0.3 + 0.1,
          angle: Math.random() * Math.PI * 2,
          originalX: 0,
          originalY: 0,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
          velocityX: 0,
          velocityY: 0,
          hue: Math.random() * 40 + 230, // Slightly narrower range for more consistent colors
        });
      }

      starsRef.current = stars.map((star) => ({
        ...star,
        originalX: star.x,
        originalY: star.y,
      }));
    };

    const updateStar = (star: Star, deltaTime: number) => {
      // Apply velocity with damping
      star.velocityX *= 0.95;
      star.velocityY *= 0.95;
      star.x += star.velocityX;
      star.y += star.velocityY;

      // Random movement
      star.angle += (Math.random() - 0.5) * 0.1;
      star.x += Math.cos(star.angle) * star.speed;
      star.y += Math.sin(star.angle) * star.speed;

      // Keep stars within bounds with wrapping
      if (star.x < 0) star.x = canvas.width;
      if (star.x > canvas.width) star.x = 0;
      if (star.y < 0) star.y = canvas.height;
      if (star.y > canvas.height) star.y = 0;

      // Update original position for mouse interaction reference
      star.originalX = star.x;
      star.originalY = star.y;

      // Twinkle effect
      star.twinklePhase += star.twinkleSpeed * deltaTime;
      const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;

      // Update hue for color cycling in light mode
      if (theme === "light") {
        star.hue = ((star.hue + 0.1) % 60) + 220;
      }

      return twinkle;
    };

    const draw = (timestamp: number) => {
      if (!canvas || !ctx) return;

      const deltaTime = timestamp - timeRef.current;
      timeRef.current = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const stars = starsRef.current;
      const mouseX = mousePosition.x;
      const mouseY = mousePosition.y;

      stars.forEach((star) => {
        const twinkle = updateStar(star, deltaTime);

        // Mouse interaction
        const dx = mouseX - star.x;
        const dy = mouseY - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 120;
        const repulsionStrength = 15;

        let influence = Math.max(0, 1 - distance / maxDistance);
        influence = influence * influence * influence;

        if (influence > 0) {
          const angle = Math.atan2(dy, dx);
          const force = repulsionStrength * influence;

          star.velocityX -= Math.cos(angle) * force;
          star.velocityY -= Math.sin(angle) * force;
          star.x -= Math.cos(angle) * force * 0.5;
          star.y -= Math.sin(angle) * force * 0.5;
        }

        // Draw star with enhanced glow and theme-appropriate colors
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * (1 + influence), 0, Math.PI * 2);

        let color;
        const finalOpacity = star.opacity * twinkle * (1 + influence * 2);

        if (theme === "dark") {
          color = "255, 255, 255";
          ctx.fillStyle = `rgba(${color}, ${finalOpacity})`;
        } else {
          // Medium grey colors for better visibility in both modes
          ctx.fillStyle = `rgba(130, 130, 130, ${finalOpacity * 1.5})`; // Medium grey with increased opacity
        }
        ctx.fill();

        // Enhanced glow effect
        if (influence > 0) {
          ctx.beginPath();
          ctx.arc(
            star.x,
            star.y,
            star.size * (2 + influence * 3),
            0,
            Math.PI * 2
          );
          if (theme === "dark") {
            ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity * 0.3})`;
          } else {
            ctx.fillStyle = `rgba(130, 130, 130, ${finalOpacity * 0.6})`; // Medium grey glow with higher opacity
          }
          ctx.fill();
        }
      });

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
};
