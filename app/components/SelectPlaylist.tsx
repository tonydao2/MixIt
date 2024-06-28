import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface PlaylistItem {
  id: string;
  name: string;
  images: {
    url: string;
  }[];
}

interface Track {
    id: string;
    name: string;
    artist: string;
}

interface SelectPlaylistProps {
  playlist: PlaylistItem | null;
  accessToken: string | undefined;
}

export default function SelectPlaylist({ playlist, accessToken }: SelectPlaylistProps) {
    const [tracks, setTracks] = useState<any[]>([]);

    const myLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
        return `${src}?w=${width}&q=${quality || 75}`;
    };


    useEffect(() => {
        async function fetchTracks() {
            if (playlist) {
            try {
                const response = await fetch('/api/getTracks', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                    Playlist: playlist.id,
                },
                });
                const data = await response.json();
                setTracks(data);
            } catch (error) {
                console.error("Error fetching tracks", error);
            }
            }
        }
        fetchTracks();
    }, [playlist, accessToken]);

  if (!playlist) {
    return <div>No playlist selected</div>;
  }

  console.log(tracks);


  return (
    <div className="flex flex-col justify-center items-center">
      <h2>{playlist.name}</h2>
      {playlist.images.length > 0 && (
        <Image
          loader={myLoader}
          src={playlist.images[0].url}
          alt={playlist.name}
          width={200}
          height={200}
        />
      )}
      {tracks.length > 0 && (
        <div>
            {tracks.map((item) => (
            <p key={item.track.id}>
                {item.track.name}
            </p>
            ))}
        </div>
        )}
    </div>
  );
}
