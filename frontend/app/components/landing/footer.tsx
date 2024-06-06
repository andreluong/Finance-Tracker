import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

export default function Footer() {
    return (
        <footer className='flex flex-col items-center bg-white border border-zinc-300 py-16 space-y-2'>
            <p>Finance Tracker | 2024</p>
            <a href='https://github.com/andreluong/Finance-Tracker'>
                <Icon icon='mdi:github' className='text-4xl' />
            </a>
        </footer>
    )
}
