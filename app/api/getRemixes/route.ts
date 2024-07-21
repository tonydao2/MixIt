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
    const response = await fetch(
      `${API_URL}/search?q=remix&type=track&limit=5`,
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

    if (response.ok) {
      return new Response(JSON.stringify(data.tracks.items), { status: 200 });
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
