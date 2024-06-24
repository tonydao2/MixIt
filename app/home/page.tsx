"use client";

import React, { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

type PlaylistItem = {
  id: string;
  name: string;
};

export default function Home() {
  const { data: session } = useSession();
  const [x, setX] = useState("");
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);

  useEffect(() => {
    async function fetchPlaylist() {
      if (session && session.accessToken) {
        setX(session.accessToken);
      }
      const resposne = await fetch("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      const data = await resposne.json();
      if (data.items) {
        setPlaylist(data.items);
      } else {
        console.error("Playlist items not found in the response", data);
      }
    }
    
    if (session) {
      fetchPlaylist();
    }
  }, [session]);

  return (
    <div>
      <h1>Home</h1>
      <p>{x}</p>
      {session && <button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>} {/* Sign out button if logged in */}
      <div>
        {playlist.map((item) => 
          <div key={item.id}>
            <p>{item.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
