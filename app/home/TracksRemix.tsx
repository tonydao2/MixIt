import React from 'react';

interface Track {
  track: {
    id: string;
    name: string;
    artists: {
      name: string;
    }[];
  };
}

interface TracksRemixProps {
  tracks: Track[];
  accessToken: string | undefined;
}

export default function TracksRemix({ tracks, accessToken }: TracksRemixProps) {
  console.log(tracks[0]?.track.artists[0].name);

  // TODO Add a remix useEffect to fetch remixes for each track and display them with old on left side and new on right side

  return (
    <div>
      {tracks.length > 0 && (
        <div>
          {tracks.map((track) => (
            <p key={track.track.id}>{track.track.name}</p>
          ))}
        </div>
      )}
    </div>
  );
}
