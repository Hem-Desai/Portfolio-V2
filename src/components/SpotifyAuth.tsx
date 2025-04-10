import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

// Get redirect URI from environment variables, fallback to current origin if not set
const REDIRECT_URI =
  import.meta.env.VITE_SPOTIFY_REDIRECT_URI ||
  window.location.origin + "/callback";

const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${
  import.meta.env.VITE_SPOTIFY_CLIENT_ID
}&response_type=code&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&scope=${encodeURIComponent(
  "user-read-currently-playing user-read-recently-played user-read-playback-state"
)}`;

export const SpotifyAuth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError(`Authentication failed: ${errorParam}`);
      return;
    }

    if (!code) return;

    const getToken = async () => {
      setIsLoading(true);
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
            redirect_uri: REDIRECT_URI,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error_description ||
              `Failed to get token: ${errorData.error || response.statusText}`
          );
        }

        const data = await response.json();

        // Save both tokens
        localStorage.setItem("spotifyRefreshToken", data.refresh_token);
        localStorage.setItem("spotifyAccessToken", data.access_token);
        localStorage.setItem(
          "spotifyTokenExpiry",
          String(Date.now() + data.expires_in * 1000)
        );

        // Navigate back to home
        navigate("/");
      } catch (err) {
        console.error("Error getting token:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to authenticate with Spotify"
        );
      } finally {
        setIsLoading(false);
      }
    };

    getToken();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          <p className="font-medium">Authentication Error</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Authenticating with Spotify...</span>
          </div>
        ) : (
          "Connecting to Spotify..."
        )}
      </div>
    </div>
  );
};
