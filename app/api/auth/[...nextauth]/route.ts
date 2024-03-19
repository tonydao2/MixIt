import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"

const scopes = [
    "user-read-email",
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-public",
    "playlist-modify-private"
].join(",") // Spotify scopes to access user data

const params = {
    scope: scopes
}

const LOGIN_URL = 'https://accounts.spotify.com/authorize?' + new URLSearchParams(params).toString() 

async function refreshAccessToken(token: any) {
    // refresh token
    const params = new URLSearchParams()
    params.append("grant_type", "refresh_token")
    params.append("refresh_token", token.refreshToken)
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
        }
    });
    const data = await response.json()
    return {
        accessToken: data.access_token,
        accessTokenExpires: Date.now() + data.expires_in * 1000,
        refreshToken: data.refreshToken ?? token.refreshToken
    }
}

export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID || "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
      authorization: LOGIN_URL,
    })
  ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async jwt({ token, account }: { token: any, account: any }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token
                token.accessTokenExpires = account.expires_at // 1 hour
                return token
            }

            // access token is still valid, return it
            if (Date.now() < token.accessTokenExpires * 1000) {
                return token
            }

            // access token is expired, refresh it
            return refreshAccessToken(token)
        },
        async session({ session, token, user }: { session: any, token: any, user: any }) {
            // Send properties to the client, like an access_token from a provider.
            session.accessToken = token.accessToken
            return session
        }
    }
}
export default NextAuth(authOptions)