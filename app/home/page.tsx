"use client";

import React, { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import SelectPlaylist from "../components/SelectPlaylist";

interface PlaylistItem {
  id: string;
  name: string;
  images: {
    url: string;
  }[];
};

export default function Home() {
  const { data: session } = useSession();
  // const [x, setX] = useState(""); // Test authorization token
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistItem | null>(null);
  // # TODO - use selectedPlaylist to get tracks on the playlist

  useEffect(() => {
    async function fetchPlaylist() {
      if (session?.accessToken) {
        try {
          const response = await fetch("/api/getPlaylist", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          const data = await response.json();
          if (Array.isArray(data)) {
            setPlaylists(data);
          } else {
            console.error("Expected an array but got:", data);
          }
        } catch (error) {
          console.error("Error fetching playlist data", error);
        }
      }
    }

    if (session) {
      fetchPlaylist();
    }

  }, [session]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.target.value;
        const playlist = playlists.find(p => p.id === selectedId) || null;
        setSelectedPlaylist(playlist);
  };

  return (
    <div className="flex flex-col items-center justify-center text-white space-y-3">
      <nav>
        <h1>Home</h1>
        {session && 
          <button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>
        }
      </nav>
      {/* uses an event change to select a playlist */}
      <select onChange={handleSelectChange} className="mb-4 p-2 bg-gray-800 text-white">
            <option value="">Select a Playlist</option>
            {playlists.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>
                {playlist.name}
                </option>
            ))}
      </select>
      <SelectPlaylist playlist={selectedPlaylist} accessToken={session?.accessToken} />
      
    </div>
  );
}
