'use client'

import { RedirectToUserProfile } from '@clerk/nextjs'
import React from 'react'

export default function page() {
    return (
        <RedirectToUserProfile />
    )
}
