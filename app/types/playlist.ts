export interface PlaylistItem {
    id: string;
    name: string;
    images: {
        url: string;
    }[];
}

export interface SelectPlaylistProps {
    playlist: PlaylistItem | null;
    accessToken: string | undefined;
}