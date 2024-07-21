import { API_URL } from '@/app/constants/url';

export async function POST(req: Request) {
  const authorization = req.headers.get('authorization');

  if (!authorization) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
    });
  }

  const accessToken = authorization.split(' ')[1];

  // tracks is an array of tracks
  const { tracks } = await req.json();

  if (!tracks) {
    return new Response(JSON.stringify({ error: 'No tracks provided' }), {
      status: 400,
    });
  }
  try {
    // Promise.all will wait for all the promises to resolve and
    // for all the data to be fetched before returning the response
    const remixes = await Promise.all(
      // For each track, fetch the remixes
      tracks.map(async (track: any) => {
        // const artistName = track.track.artists[0].name;
        const query = `${track.track.name} remix`;
        const response = await fetch(
          `${API_URL}/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        const data = await response.json();
        // Filter out songs that have the word 'remix' in the title
        const filteredRemixes = data.tracks.items.filter((item: any) =>
          item.name.toLowerCase().includes('remix'),
        );

        // Return the original track and the remixes
        return {
          track: track.track, // original track
          remixes: filteredRemixes.map((item: any) => ({
            id: item.id,
            name: item.name,
            artists: item.artists,
          })),
        };
      }),
    );

    return new Response(JSON.stringify(remixes), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
