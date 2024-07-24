'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Button from './components/Button';
import { useRouter } from 'next/navigation';

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/home');
    }
  }, [session, router]);

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-black text-white'>
      <header className='flex items-center justify-center w-full p-4 relative top-0'>
        <Image
          src='/spotifylogo.svg'
          alt='Spotify Logo'
          width={80}
          height={80}
        />
        <h1 className='font-bold text-5xl ml-2'>MixIt!</h1>
      </header>
      <div className='flex flex-col items-center mt-24'>
        {!session && (
          <>
            <h2 className='text-5xl font-bold mb-2'>Welcome to MixIt!</h2>
            <p className='text-xl mb-4'>Sign in to get started</p>
            {/* <button
              onClick={() => signIn('spotify', { callbackUrl: '/home' })}
              className="px-6 py-3 bg-white text-black font-bold text-lg rounded-full hover:bg-green-500 hover:text-white transition-colors duration-200"
            >
              Sign In
            </button> */}
            <Button onClick={() => signIn('spotify', { callbackUrl: '/home' })}>
              Sign In
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
