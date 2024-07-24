import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from '../components/Button';

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

  function addPlaylist() {
    return false;
  }

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
    <div className='flex flex-col justify-center w-full p-10'>
      {tracks.length > 0 && (
        <>
          <div className='flex flex-row justify-between'>
            <div className='flex flex-col w-3/5 mr-2'>
              {tracks.map((track) => (
                <div
                  key={track.track.id}
                  className='flex items-center bg-blue-500 p-4 mb-4 rounded flex-grow'
                >
                  <Image
                    loader={myLoader}
                    src={track.track.album.images[0].url}
                    alt={track.track.name}
                    width={150}
                    height={150}
                  />
                  <div className='ml-10 text-white text-left'>
                    <p>{track.track.name}</p>
                    <p>
                      {track.track.artists
                        .map((artist) => artist.name)
                        .join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* TODO: Use MUI for Select prop component */}
            <div className='flex flex-col items-center w-3/5 ml-2'>
              {remixes.map((trackRemix) => (
                <div
                  key={trackRemix.track.id}
                  className='flex items-center bg-blue-500 p-4 mb-4 rounded w-full h-48'
                >
                  {trackRemix.remixes.length > 0 ? (
                    <select className='ml-4 p-2 rounded'>
                      {trackRemix.remixes.map((remix) => (
                        <option key={remix.id} value={remix.id}>
                          {remix.name}
                        </option>
                        // TODO: Add plus sign here to add remix to add to list to call add to playlist
                        // Then change to minus sign to remove from list
                      ))}
                    </select>
                  ) : (
                    <p className='text-white ml-4'>
                      No alternate versions found
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* <Button onClick={addPlaylist}>Add remixes to playlist</Button> */}
        </>
      )}
    </div>
  );
}
