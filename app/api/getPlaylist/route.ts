export async function GET(req: Request) {
  const authorization = req.headers.get('authorization');

  if (!authorization) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const accessToken = authorization.split(' ')[1];

  try {
    const response = await fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return Response.json(data.items, { status: 200 });
    } else {
      return Response.json({ error: data }, { status: response.status });
    }
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
