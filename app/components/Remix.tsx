import { useState } from 'react';
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

interface RemixProps {
  trackRemix: {
    track: Track['track'];
    remixes: RemixTracks[];
  };
  accessToken: string | undefined;
}

export default function Remix({ trackRemix, accessToken }: RemixProps) {
  // const [selectedRemix, setSelectedRemix] = useState<RemixTracks | null>(null);
  const [selectedRemixes, setSelectedRemixes] = useState<{
    [key: string]: RemixTracks | null;
  }>({});

  const handleChange = (trackId: string) => (event: SelectChangeEvent<string>) => {
    const remixId = event.target.value;
    const selectedRemix = trackRemix.remixes.find((remix) => remix.id === remixId) || null;
    setSelectedRemixes((prev) => ({
      ...prev,
      [trackId]: selectedRemix,
    }));
  };

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
