import { useState, useEffect } from "react";

type RaveMode = "off" | "on";
type RaveIntensity = "low" | "medium" | "extreme";

export const useRaveMode = () => {
  const [raveMode, setRaveMode] = useState<RaveMode>("off");
  const [intensity, setIntensity] = useState<RaveIntensity>("medium");
  const [musicPlaying, setMusicPlaying] = useState(false);

  useEffect(() => {
    // Add rave-mode class to the document when rave mode is on
    if (raveMode === "on") {
      document.documentElement.classList.add("rave-mode");
      document.documentElement.classList.add(`rave-intensity-${intensity}`);
    } else {
      document.documentElement.classList.remove("rave-mode");
      document.documentElement.classList.remove(
        "rave-intensity-low",
        "rave-intensity-medium",
        "rave-intensity-extreme"
      );
    }
  }, [raveMode, intensity]);

  const toggleRaveMode = () => {
    setRaveMode((prev) => (prev === "on" ? "off" : "on"));
  };

  const toggleRaveMusic = () => {
    setMusicPlaying((prev) => !prev);
  };

  const increaseIntensity = () => {
    setIntensity((prev) => {
      if (prev === "low") return "medium";
      if (prev === "medium") return "extreme";
      return "extreme";
    });
  };

  const decreaseIntensity = () => {
    setIntensity((prev) => {
      if (prev === "extreme") return "medium";
      if (prev === "medium") return "low";
      return "low";
    });
  };

  const setRaveIntensity = (newIntensity: RaveIntensity) => {
    setIntensity(newIntensity);
  };

  return {
    raveMode,
    toggleRaveMode,
    musicPlaying,
    toggleRaveMusic,
    intensity,
    increaseIntensity,
    decreaseIntensity,
    setRaveIntensity,
  };
};
