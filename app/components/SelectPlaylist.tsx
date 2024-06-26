import React, { useState } from 'react'
import Image from 'next/image'

interface PlaylistItem {
    id: string;
    name: string;
    images: {
        url: string;
    }[];
}

interface SelectPlaylistProps {
    playlists: PlaylistItem[];
}

export default function SelectPlaylist({ playlists }: SelectPlaylistProps ) {
    const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistItem | null>(null);

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.target.value;
        const playlist = playlists.find(p => p.id === selectedId) || null;
        setSelectedPlaylist(playlist);
    };

  const myLoader = ({ src }: { src: string }) => { // Custom loader for Image component
    return src;
  }

    return (
        <div>
            <select onChange={handleSelectChange} className="mb-4 p-2 bg-gray-800 text-white">
            <option value="">Select a Playlist</option>
            {playlists.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>
                {playlist.name}
                </option>
            ))}
            </select>
            {selectedPlaylist && (
            <div className="flex flex-col justify-center items-center">
                <h2>{selectedPlaylist.name}</h2>
                {selectedPlaylist.images.length > 0 && (
                <Image 
                    loader={myLoader}
                    src={selectedPlaylist.images[0].url} 
                    alt={selectedPlaylist.name} 
                    width={200} 
                    height={200}
                />
                )}
            </div>
            )}
      </div>
     )
}
