import { useState, useEffect } from 'react';
import { Track, RemixTracks } from '../types/tracks';
import { myLoader } from '../utils/loader';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import Image from 'next/image';
import Button from './Button';

interface RemixProps {
  trackRemix: {
    track: Track['track'];
    remixes: RemixTracks[];
  };
  accessToken: string | undefined;
  playlistId: string | undefined;
}

export default function Remix({
  trackRemix,
  accessToken,
  playlistId,
}: RemixProps) {
  const [selectedRemix, setSelectedRemix] = useState<RemixTracks | null>(null);
  const [isInPlaylist, setIsInPlaylist] = useState(false);

  // Check if the selected remix is already in the playlist
  console.log(setSelectedRemix);

  const handleChange = async (event: SelectChangeEvent<string>) => {
    const remixId = event.target.value;
    const selected =
      trackRemix.remixes.find((remix) => remix.id === remixId) || null;
    setSelectedRemix(selected);

    if (selected && accessToken && playlistId) {
      try {
        const response = await fetch(`/api/getTracks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ playlistId: playlistId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch playlist tracks');
        }

        const data = await response.json();
        const currentTrackUris = data.items.map((item: any) => item.track.uri);

        setIsInPlaylist(currentTrackUris.includes(selected.uri));
      } catch (error) {
        console.error('Error checking playlist tracks', error);
      }
    }
  };

  async function addToPlaylist() {
    console.log('Adding to playlist', selectedRemix?.uri);
    console.log('Playlist ID', playlistId);
    try {
      const response = await fetch('/api/addToPlaylist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          track: selectedRemix?.uri,
          playlist_id: playlistId,
        }),
      });
      const data = await response.json();
    } catch (error) {
      console.error('Error adding to playlist', error);
    }
  }

  async function removeFromPlaylist() {
    try {
      const response = await fetch('/api/removeFromPlaylist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          track: selectedRemix?.uri,
          playlist_id: playlistId,
        }),
      });
      const data = await response.json();
    } catch (error) {
      console.error('Error adding to playlist', error);
    }
  }

  return (
    <div
      key={trackRemix.track.id}
      className='flex items-center p-4 mb-4 rounded w-full h-48 '
    >
      {trackRemix.remixes.length > 0 ? (
        <div className='flex flex-row items-center'>
          <div className='flex-shrink-0'>
            {selectedRemix && (
              <Image
                loader={myLoader}
                src={selectedRemix.album.images[0].url || ''}
                alt={trackRemix.track.name}
                width={150}
                height={150}
              />
            )}
          </div>
          <div className='ml-4'>
            <FormControl variant='standard' className='ml-4 max-w-96'>
              <InputLabel
                id={`select-remix-label-${trackRemix.track.id}`}
                sx={{
                  color: 'white',
                  marginBottom: '0.5rem',
                }}
              >
                Select Remix
              </InputLabel>
              <Select
                labelId={`select-remix-label-${trackRemix.track.id}`}
                id={`select-remix-${trackRemix.track.id}`}
                value={selectedRemix?.id || ''}
                onChange={handleChange}
                label='Select Remix'
                sx={{
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '.MuiSvgIcon-root ': {
                    fill: 'white !important',
                  },
                  '.MuiSelect-select': {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'flex',
                    alignItems: 'center',
                    fontStyle: 'italic',
                  },
                }}
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                {trackRemix.remixes.map((remix) => (
                  <MenuItem
                    key={remix.id}
                    value={remix.id}
                    style={{
                      maxWidth: '300px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    <div className='flex items-center justify-between'>
                      {remix.name}
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedRemix && (
              <div className='text-white text-left max-w-xs truncate'>
                <h5 className='text-gray-400 text-sm font-medium italic truncate'>
                  {selectedRemix.artists
                    .map((artist) => artist.name)
                    .join(', ')}
                </h5>
                {/* If song is in playlist change button to remove else add */}
                {isInPlaylist ? (
                  <Button onClick={removeFromPlaylist}>
                    Remove from Playlist
                  </Button>
                ) : (
                  <Button onClick={addToPlaylist}>Add to Playlist</Button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className='text-white ml-4'>No alternate versions found</p>
      )}
    </div>
  );
}
