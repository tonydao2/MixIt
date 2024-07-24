import { API_URL } from '@/app/constants/url';

export async function GET(req: Request) {
  const authorization = req.headers.get('authorization');

  if (!authorization) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
    });
  }

  const accessToken = authorization.split(' ')[1];

  try {
    const response = await fetch(`${API_URL}/me/playlists`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return new Response(JSON.stringify(data.items), { status: 200 });
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
