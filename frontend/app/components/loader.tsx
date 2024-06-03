import { CircularProgress } from '@nextui-org/react'
import React from 'react'

export default function Loader() {
    return (
        <div className="flex justify-center my-auto">
            <CircularProgress size="lg" aria-label="Loading..." label="Loading..." className="p-40 scale-150" />
        </div>
    )
}
