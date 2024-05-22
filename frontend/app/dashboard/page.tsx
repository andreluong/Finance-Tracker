'use client'

import { useUser } from '@clerk/nextjs';
import React from 'react'

export default function Dashboard() {
    const { isLoaded, isSignedIn, user } = useUser();

    if (!isLoaded || !isSignedIn) {
        return null;
    }


    // Get all transactions for the user

    return (
        <div>
            <h1 className='font-bold text-4xl pb-4'>Dashboard</h1>
            <p>Welcome {user?.firstName}</p>

            <div className="border-dashed border border-zinc-500 w-full h-12 rounded-lg"></div>
            <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
            <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
            <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
            <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
            <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
            <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
        </div>
    )
}
