import { API_URL } from "@/app/constants/url";

export async function GET(req: Request) {
    const playlistId = req.headers.get('Playlist'); 
    const authorization = req.headers.get('authorization');

    if (!playlistId) {
        return Response.json({ error: 'No playlist with ID'}, {status: 401})
    }

    if (!authorization) {
        return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const accessToken = authorization.split(' ')[1];


    try {
        const response = await fetch(`${API_URL}/playlists/${playlistId}/tracks`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await response.json();

        if (response.ok) {
            return new Response(JSON.stringify(data.items), {status: 200});
        } else {
            return new Response(JSON.stringify({ error: data }), { status: response.status });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}