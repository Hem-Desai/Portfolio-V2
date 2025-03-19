import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${
  import.meta.env.VITE_SPOTIFY_CLIENT_ID
}&response_type=code&redirect_uri=${encodeURIComponent(
  "http://localhost:5173/callback"
)}&scope=${encodeURIComponent(
  "user-read-currently-playing user-read-recently-played"
)}`;

export const SpotifyAuth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    const getToken = async () => {
      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa(
              `${import.meta.env.VITE_SPOTIFY_CLIENT_ID}:${
                import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
              }`
            )}`,
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: "http://localhost:5173/callback",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get token");
        }

        const data = await response.json();

        // Save the refresh token
        localStorage.setItem("spotifyRefreshToken", data.refresh_token);

        // Navigate back to home
        navigate("/");
      } catch (err) {
        console.error("Error getting token:", err);
        setError("Failed to authenticate with Spotify");
      }
    };

    getToken();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
        Authenticating with Spotify...
      </div>
    </div>
  );
};
