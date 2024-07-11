export async function fetchTracks(playlist: any, accessToken: any) {
    if (playlist) {
        try {
            const response = await fetch('/api/getTracks', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                    Playlist: playlist.id,
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching tracks", error);
            throw error;
        }
    }
}