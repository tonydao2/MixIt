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
    const remixes = await Promise.all(
      tracks.map(async (track: any) => {
        const query = `${track.track.name}`;
        const response = await fetch(
          `${API_URL}/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        const data = await response.json();
        console.log(data);

        const filteredRemixes = data.tracks.items.filter((item: any) => {
          const title = item.name.toLowerCase();
          const keywords = ['remix', 'rework', 'cover', 'version', 'sped up'];
          return keywords.some((keyword) => title.includes(keyword));
        });

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
