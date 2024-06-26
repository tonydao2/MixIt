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
          setPlaylists(data);
        } catch (error) {
          console.error("Error fetching playlist data", error);
        }
      }
    }

    if (session) {
      fetchPlaylist();
    }

  }, [session]);

  if (selectedPlaylist) {
    console.log(selectedPlaylist);
  }

  return (
    <div className="flex flex-col items-center justify-center text-white space-y-3">
      <nav>
        <h1>Home</h1>
        {session && 
          <button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>
        }
      </nav>
      <SelectPlaylist playlists={playlists} />
    </div>
  );
}
