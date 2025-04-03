import { SpotifyApi, AccessToken } from "@spotify/web-api-ts-sdk";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error("Missing Spotify credentials in environment variables");
}

async function getAccessToken() {
  // Check if we have a valid access token
  const accessToken = localStorage.getItem("spotifyAccessToken");
  const tokenExpiry = localStorage.getItem("spotifyTokenExpiry");

  if (accessToken && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
    return accessToken;
  }

  // If not, refresh the token
  const refreshToken = localStorage.getItem("spotifyRefreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error_description || "Failed to refresh token");
    }

    const data = await response.json();

    // Update stored tokens
    localStorage.setItem("spotifyAccessToken", data.access_token);
    localStorage.setItem(
      "spotifyTokenExpiry",
      String(Date.now() + data.expires_in * 1000)
    );
    if (data.refresh_token) {
      localStorage.setItem("spotifyRefreshToken", data.refresh_token);
    }

    return data.access_token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    // Clear invalid tokens
    localStorage.removeItem("spotifyAccessToken");
    localStorage.removeItem("spotifyTokenExpiry");
    localStorage.removeItem("spotifyRefreshToken");
    throw error;
  }
}

// Create a custom Spotify client that handles token refresh
class CustomSpotifyClient {
  private api: SpotifyApi | null = null;
  private lastError: Error | null = null;
  private retryCount: number = 0;
  private readonly MAX_RETRIES = 3;

  private async getApi() {
    try {
      if (!this.api || this.lastError) {
        const accessToken = await getAccessToken();
        this.api = SpotifyApi.withAccessToken(clientId, {
          access_token: accessToken,
          token_type: "Bearer",
          expires_in: 3600,
          refresh_token: localStorage.getItem("spotifyRefreshToken") || "",
        } as AccessToken);
        this.lastError = null;
        this.retryCount = 0;
      }
      return this.api;
    } catch (error) {
      this.lastError =
        error instanceof Error ? error : new Error("Failed to get Spotify API");
      throw this.lastError;
    }
  }

  private async retryOperation<T>(operation: () => Promise<T>): Promise<T> {
    try {
      const result = await operation();
      this.retryCount = 0;
      return result;
    } catch (error) {
      this.lastError =
        error instanceof Error ? error : new Error("Unknown error");

      if (this.retryCount < this.MAX_RETRIES) {
        this.retryCount++;
        this.api = null; // Force new token on retry
        return this.retryOperation(operation);
      }

      throw error;
    }
  }

  async getCurrentlyPlayingTrack() {
    return this.retryOperation(async () => {
      const api = await this.getApi();
      return api.player.getCurrentlyPlayingTrack();
    });
  }

  async getRecentlyPlayedTracks() {
    return this.retryOperation(async () => {
      const api = await this.getApi();
      return api.player.getRecentlyPlayedTracks();
    });
  }

  async getAudioFeaturesForTrack(trackId: string) {
    return this.retryOperation(async () => {
      const api = await this.getApi();
      return api.tracks.audioFeatures(trackId);
    });
  }
}

export const spotify = new CustomSpotifyClient();

export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  url: string;
  isPlaying: boolean;
  timestamp?: string;
}

interface SpotifyTrackItem {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  external_urls: {
    spotify: string;
  };
}

// Function to get current or recently played track
export async function getCurrentTrack(): Promise<SpotifyTrack | null> {
  try {
    const response = await spotify.getCurrentlyPlayingTrack();

    if (response && response.item && "artists" in response.item) {
      const track = response.item as SpotifyTrackItem;
      return {
        id: track.id,
        name: track.name,
        artist: track.artists.map((artist) => artist.name).join(", "),
        album: track.album.name,
        albumArt: track.album.images[0]?.url,
        url: track.external_urls.spotify,
        isPlaying: response.is_playing,
      };
    }

    // If no current track, get most recently played
    const recent = await spotify.getRecentlyPlayedTracks();
    if (recent.items.length > 0) {
      const track = recent.items[0].track as SpotifyTrackItem;
      return {
        id: track.id,
        name: track.name,
        artist: track.artists.map((artist) => artist.name).join(", "),
        album: track.album.name,
        albumArt: track.album.images[0]?.url,
        url: track.external_urls.spotify,
        isPlaying: false,
        timestamp: recent.items[0].played_at,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
    return null;
  }
}

// Function to get audio features for visualizer
export async function getTrackFeatures(trackId: string) {
  try {
    return await spotify.getAudioFeaturesForTrack(trackId);
  } catch (error) {
    console.error("Error fetching track features:", error);
    return null;
  }
}
