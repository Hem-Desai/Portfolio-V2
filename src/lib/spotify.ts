import { SpotifyApi } from "@spotify/web-api-ts-sdk";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error("Missing Spotify credentials in environment variables");
}

async function getAccessToken() {
  const refreshToken = localStorage.getItem("spotifyRefreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

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
    throw new Error("Failed to refresh token");
  }

  const data = await response.json();
  return data.access_token;
}

// Create a custom Spotify client that handles token refresh
class CustomSpotifyClient {
  private api: SpotifyApi | null = null;

  private async getApi() {
    if (!this.api) {
      const accessToken = await getAccessToken();
      this.api = SpotifyApi.withAccessToken(clientId, {
        access_token: accessToken,
        token_type: "Bearer",
        expires_in: 3600,
      });
    }
    return this.api;
  }

  async getCurrentlyPlayingTrack() {
    try {
      const api = await this.getApi();
      return await api.player.getCurrentlyPlayingTrack();
    } catch (error) {
      console.error("Error in getCurrentlyPlayingTrack:", error);
      this.api = null; // Reset API instance on error
      throw error;
    }
  }

  async getRecentlyPlayedTracks() {
    try {
      const api = await this.getApi();
      return await api.player.getRecentlyPlayedTracks();
    } catch (error) {
      console.error("Error in getRecentlyPlayedTracks:", error);
      this.api = null; // Reset API instance on error
      throw error;
    }
  }

  async getAudioFeaturesForTrack(trackId: string) {
    try {
      const api = await this.getApi();
      return await api.tracks.audioFeatures(trackId);
    } catch (error) {
      console.error("Error in getAudioFeaturesForTrack:", error);
      this.api = null; // Reset API instance on error
      throw error;
    }
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

// Function to get current or recently played track
export async function getCurrentTrack(): Promise<SpotifyTrack | null> {
  try {
    const response = await spotify.getCurrentlyPlayingTrack();

    if (response && response.item && "name" in response.item) {
      return {
        id: response.item.id,
        name: response.item.name,
        artist: response.item.artists.map((a) => a.name).join(", "),
        album: response.item.album.name,
        albumArt: response.item.album.images[0]?.url,
        url: response.item.external_urls.spotify,
        isPlaying: response.is_playing,
      };
    }

    // If no current track, get most recently played
    const recent = await spotify.getRecentlyPlayedTracks();
    if (recent.items.length > 0) {
      const track = recent.items[0].track;
      return {
        id: track.id,
        name: track.name,
        artist: track.artists.map((a) => a.name).join(", "),
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
