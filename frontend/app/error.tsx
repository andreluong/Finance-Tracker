'use client';

import { Button } from '@nextui-org/react'
import React, { useEffect } from 'react'

export default function Error({
    error,
    reset
}: {
    error: any;
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        // center the error message
        <div className="flex flex-col items-center justify-center my-auto">
            <p className="text-3xl font-bold pb-4">Something went wrong!</p>
            <p className="text-md pb-4">Error: {error.message}</p>
            <Button onClick={() => reset()}>Try Again</Button>
        </div>
    )
}
