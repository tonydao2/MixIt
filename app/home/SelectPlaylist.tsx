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

  // useEffect(() => {
  //   async function getTracks() {
  //     try {
  //       const data = await fetchTracks(playlist, accessToken);

  //       setTracks(data);
  //     } catch (error) {
  //       console.error('Error fetching tracks', error);
  //     }
  //   }
  //   getTracks();
  // }, [playlist, accessToken]);

  // if (!playlist) {
  //   return <div>No playlist selected</div>;
  // }

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
      {/* {tracks.length > 0 && (
        <div>
          {tracks.map((item) => (
            <p key={item.track.id}>{item.track.name}</p>
          ))}
        </div>
      )} */}
    </div>
  );
}
