import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from '../components/Button';
import { Track, RemixTracks } from '../types/tracks';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { myLoader } from '../utils/loader';
import Remix from '../components/Remix';
import Tracks from '../components/Tracks';

// This is the interface for the remixes of a track and the track itself
interface TrackRemix {
  track: Track['track'];
  remixes: RemixTracks[];
}

interface TracksRemixProps {
  tracks: Track[];
  accessToken: string | undefined;
  playlistId: string | undefined;
}

export default function TracksRemix({
  tracks,
  accessToken,
  playlistId,
}: TracksRemixProps) {
  const [remixes, setRemixes] = useState<TrackRemix[]>([]);
  const [selectedRemixes, setSelectedRemixes] = useState<{
    [key: string]: RemixTracks | null;
  }>({});

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
  }, [tracks, accessToken, playlistId]);

  const handleChange =
    (trackId: string) => (event: SelectChangeEvent<string>) => {
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
              <Tracks tracks={tracks} />
            </div>
            {/* TODO: Use MUI for Select prop component */}
            {/* TODO: Move this to component too much code */}
            <div className='flex flex-col items-center w-3/5 ml-2'>
              {remixes.map((trackRemix) => (
                <Remix
                  key={trackRemix.track.id}
                  trackRemix={trackRemix}
                  playlistId={playlistId}
                  accessToken={accessToken}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
