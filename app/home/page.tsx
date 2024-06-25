"use client";

import React, { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

type PlaylistItem = {
  id: string;
  name: string;
  images: {
    imageUrl: string;
  }
};

export default function Home() {
  const { data: session } = useSession();
  // const [x, setX] = useState(""); // Test authorization token
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);

  useEffect(() => { // Fetch all user's playlist data when logged in
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
          setPlaylist(data);
        } catch (error) {
          console.error("Error fetching playlist data", error);
        }
      }
    }

    if (session) {
      fetchPlaylist();
    }

  }, [session]);

  return (
    <main className="flex flex-col items-center justify-center bg-black text-white">
      <div>
        <h1>Home</h1>
        {session && 
          <button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>
        } {/* Sign out button if logged in */}
        <div>
          {playlist.map((item) => 
            <div key={item.id}>
              <p>{item.name}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
