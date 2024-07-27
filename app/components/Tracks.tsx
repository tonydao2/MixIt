import React from 'react';
import { Track } from '../types/tracks';
import Image from 'next/image';
import { myLoader } from '../utils/loader';

interface TracksProps {
  tracks: Track[];
}

export default function Tracks({ tracks }: TracksProps) {
  return (
    <div>
      {tracks.map((track) => (
        <div
          key={track.track.id}
          className='flex items-center p-4 mb-4 rounded flex-grow'
        >
          <Image
            loader={myLoader}
            src={track.track.album.images[0].url}
            alt={track.track.name}
            width={150}
            height={150}
          />
          <div className='ml-8 text-white text-left'>
            <h5 className='font-semibold text-lg  '>{track.track.name}</h5>
            <h5 className='text-gray text-sm font-medium italic'>
              {track.track.artists.map((artist) => artist.name).join(', ')}
            </h5>
          </div>
        </div>
      ))}
    </div>
  );
}
