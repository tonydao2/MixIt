import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { fetchTracks } from '../utils/fetchTracks';
import { PlaylistItem, SelectPlaylistProps } from '../types/playlist';

export default function SelectPlaylist({
  playlist,
  accessToken,
  tracks,
}: SelectPlaylistProps) {
  // const [tracks, setTracks] = useState<any[]>([]);

  const myLoader = ({ src, width, quality }: any) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };

  if (!playlist) {
    return <div>No playlist selected</div>;
  }

  return (
    <div className='flex flex-col justify-center items-center'>
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
    </div>
  );
}
