import { API_URL } from '@/app/constants/url';

export async function POST(req: Request) {
  const authorization = req.headers.get('authorization');
  const { track, playlist_id } = await req.json();
  console.log(track);

  if (!authorization) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const accessToken = authorization.split(' ')[1];

  // Need to get playlist id from the user
  try {
    const response = await fetch(`${API_URL}/playlists/${playlist_id}/tracks`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        tracks: [{ uri: track }],
      }),
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      return new Response(JSON.stringify(data), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: data }), {
        status: response.status,
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
