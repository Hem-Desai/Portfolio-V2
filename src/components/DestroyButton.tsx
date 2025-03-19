import React, { useState, useEffect, useCallback } from "react";
import { Bomb } from "lucide-react";
import { PhysicsSimulation } from "../utils/physics";

export const DestroyButton: React.FC = () => {
  const [isDestroying, setIsDestroying] = useState(false);
  const [physics, setPhysics] = useState<PhysicsSimulation | null>(null);

  useEffect(() => {
    setPhysics(new PhysicsSimulation());
  }, []);

  const restoreElements = useCallback(() => {
    const elements = document.querySelectorAll(".physics-element");
    console.log("Restoring elements:", elements.length);
    elements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.transform = "";
        element.style.transition = "transform 0.5s ease-out";
      }
    });

    setTimeout(() => {
      elements.forEach((element) => {
        if (element instanceof HTMLElement) {
          element.style.transition = "";
          element.classList.remove("physics-element");
        }
      });
      setIsDestroying(false);
    }, 500);
  }, []);

  const handleDestroy = useCallback(() => {
    if (isDestroying || !physics) return;
    setIsDestroying(true);

    // Target all main content sections and elements
    const mainContent = document.querySelector("main");
    if (!mainContent) {
      console.error("Main content not found");
      return;
    }

    // Get all direct children of main that are sections or divs
    const elements = mainContent.querySelectorAll("section, div");
    console.log("Found elements to destroy:", elements.length);

    elements.forEach((element) => {
      if (
        element instanceof HTMLElement &&
        !element.classList.contains("no-physics") &&
        !element.closest(".no-physics") && // Don't affect children of no-physics elements
        element.parentElement === mainContent // Only affect direct children of main
      ) {
        console.log("Adding physics to:", element.tagName, element.className);
        element.classList.add("physics-element");
        const body = physics.addElement(element);
        element.dataset.originalTransform = element.style.transform || "";
      }
    });

    // Start the simulation with more dramatic forces
    physics.start();
    setTimeout(() => {
      physics.addRandomForces();
    }, 100); // Slight delay before adding forces

    // Restore after 3 seconds
    setTimeout(() => {
      physics.stop();
      restoreElements();
    }, 3000);
  }, [isDestroying, physics, restoreElements]);

  return (
    <button
      onClick={handleDestroy}
      disabled={isDestroying}
      className={`fixed bottom-20 right-4 p-2 rounded-full
        bg-white/10 backdrop-blur-sm hover:bg-white/20 
        border border-zinc-200/20 dark:border-zinc-700/20
        transition-all duration-300 group no-physics z-50
        ${isDestroying ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}
      `}
      aria-label="Destroy website temporarily"
    >
      <div className="relative">
        <Bomb
          className={`w-5 h-5 text-black dark:text-white ${
            isDestroying ? "animate-bounce" : ""
          }`}
        />
        <div
          className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 
          bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white text-xs rounded 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300 
          whitespace-nowrap pointer-events-none"
        >
          {isDestroying ? "Restoring..." : "Destroy this website"}
        </div>
      </div>
    </button>
  );
};
