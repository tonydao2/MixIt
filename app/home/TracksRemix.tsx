import React, { useState, useEffect } from 'react';

interface Track {
  track: {
    id: string;
    name: string;
    artists: {
      name: string;
    }[];
  };
}

interface Remix {
  id: string;
  name: string;
  artists: {
    name: string;
  }[];
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
  console.log(tracks);

  useEffect(() => {
    async function getRemixes() {
      try {
        const response = await fetch('/api/getRemixes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ tracks, accessToken }),
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error fetching remixes', error);
      }
    }

    // if (accessToken && tracks.length > 0) {
    //   getRemixes();
    // }
  }, [tracks, accessToken]);

  async function handleClick() {
    console.log('clicked');
    try {
      const response = await fetch(`/api/getRemixes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setRemixes(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching remixes', error);
    }
  }

  return (
    <div>
      {tracks.length > 0 && (
        <div>
          {tracks.map((track) => (
            <p key={track.track.id}>{track.track.name}</p>
          ))}
        </div>
      )}

      <button onClick={handleClick}>Test </button>
    </div>
  );
}
