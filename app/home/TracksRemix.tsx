import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from '../components/Button';
import { Track, Remix } from '../types/tracks';

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
  const [selectedRemixes, setSelectedRemixes] = useState<{
    [key: string]: Remix | null;
  }>({});

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
  const handleChange =
    (trackId: string) => (event: React.ChangeEvent<HTMLSelectElement>) => {
      const remixId = event.target.value;
      const selectedRemix =
        remixes
          .find((trackRemix) => trackRemix.track.id === trackId)
          ?.remixes.find((remix) => remix.id === remixId) || null;

      setSelectedRemixes((prev) => ({
        ...prev,
        [trackId]: selectedRemix,
      }));
    };

  return (
    <div className='flex flex-col justify-center w-full p-10'>
      {tracks.length > 0 && (
        <>
          <div className='flex flex-row justify-between'>
            <div className='flex flex-col w-3/5 mr-2'>
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
                    <h5 className='font-semibold text-lg  '>
                      {track.track.name}
                    </h5>
                    <h5 className='text-gray text-sm font-medium italic'>
                      {track.track.artists
                        .map((artist) => artist.name)
                        .join(', ')}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
            {/* TODO: Use MUI for Select prop component */}
            <div className='flex flex-col items-center w-3/5 ml-2'>
              {remixes.map((trackRemix) => (
                <div
                  key={trackRemix.track.id}
                  className='flex items-center p-4 mb-4 rounded w-full h-48'
                >
                  {trackRemix.remixes.length > 0 ? (
                    <div className='flex flex-row items-center'>
                      <div className='flex-shrink-0'>
                        {selectedRemixes[trackRemix.track.id] && (
                          <Image
                            loader={myLoader}
                            src={
                              selectedRemixes[trackRemix.track.id]?.album
                                .images[0].url || ''
                            }
                            alt={trackRemix.track.name}
                            width={150}
                            height={150}
                          />
                        )}
                      </div>
                      <div className='ml-4'>
                        <select
                          className='p-2 rounded mb-2'
                          onChange={handleChange(trackRemix.track.id)}
                          value={selectedRemixes[trackRemix.track.id]?.id || ''}
                          style={{ width: '100px', height: '40px' }}
                        >
                          <option value=''>None</option>
                          {trackRemix.remixes.map((remix) => (
                            <option key={remix.id} value={remix.id}>
                              {remix.name}
                            </option>
                          ))}
                        </select>
                        {selectedRemixes[trackRemix.track.id] && (
                          <div className='text-white text-left max-w-xs'>
                            <h5 className='font-semibold text-lg truncate'>
                              {selectedRemixes[trackRemix.track.id]?.name}
                            </h5>
                            <h5 className='text-gray-400 text-sm font-medium italic truncate'>
                              {selectedRemixes[trackRemix.track.id]?.artists
                                .map((artist) => artist.name)
                                .join(', ')}
                            </h5>
                          </div>
                        )}
                      </div>
                    </div>
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
