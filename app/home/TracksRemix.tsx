import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Track {
  track: {
    id: string;
    name: string;
    artists: {
      name: string;
    }[];
    album: {
      images: {
        url: string;
      }[];
    };
  };
}

// This is the interface for the remixes of a track
interface Remix {
  id: string;
  name: string;
  artists: {
    name: string;
  }[];
  album: {
    images: {
      url: string;
    }[];
  };
}

// This is the interface for the remixes of a track and the track itself
interface TrackRemix {
  track: Track['track'];
  remixes: Remix[];
}

interface TracksRemixProps {
  tracks: Track[];
  accessToken: string | undefined;
}

export default function TracksRemix({ tracks, accessToken }: TracksRemixProps) {
  const [remixes, setRemixes] = useState<TrackRemix[]>([]);

  const myLoader = ({ src, width, quality }: any) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };

  useEffect(() => {
    async function getRemixes() {
      try {
        const response = await fetch('/api/getRemixes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          // pass the tracks as the body of the request
          body: JSON.stringify({ tracks }),
        });
        const data = await response.json();
        setRemixes(data);
        console.log('remix', data);
      } catch (error) {
        console.error('Error fetching remixes', error);
      }
    }

    if (accessToken && tracks.length > 0) {
      getRemixes();
    }
  }, [tracks, accessToken]);

  // TODO: Include the picture of the playlist of the song in response

  return (
    <div className='justify-between flex flex-row w-full p-10 items-center'>
      {tracks.length > 0 && (
        <>
          <div className='flex flex-col w-full'>
            {tracks.map((track) => (
              <div
                key={track.track.id}
                className='flex items-center bg-blue-500 p-4 mb-4 rounded'
              >
                <Image
                  loader={myLoader}
                  src={track.track.album.images[0].url}
                  alt={track.track.name}
                  width={150}
                  height={150}
                />
                <p className='ml-10'>{track.track.name}</p>
              </div>
            ))}
          </div>
          {/* TODO: Use MUI for Select prop component */}
          <div className='flex flex-col w-full'>
            {remixes.map((trackRemix) => (
              <div
                key={trackRemix.track.id}
                className='flex items-center bg-blue-500 p-4 mb-4 rounded'
              >
                {trackRemix.remixes.length > 0 ? (
                  <select className='ml-4 p-2 rounded'>
                    {trackRemix.remixes.map((remix) => (
                      <option key={remix.id} value={remix.id}>
                        {remix.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className='text-white ml-4'>No remixes found</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
