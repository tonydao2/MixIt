import React from 'react'
import { useSession } from 'next-auth/react'

export default function Home() {
  const {data:session} = useSession()
  console.log(session.user.accessToken)

  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}