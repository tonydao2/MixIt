import React from 'react';

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

interface TracksRemixProps {
  playlist: PlaylistItem | null;
  accessToken: string | undefined;
}

export default function TracksRemix({
  playlist,
  accessToken,
}: TracksRemixProps) {
  return (
    <div>
      <h1>TracksRemix</h1>
    </div>
  );
}
