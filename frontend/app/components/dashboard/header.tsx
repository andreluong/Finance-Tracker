'use client'

import React from 'react'
import useScroll from '../../hooks/use-scroll'
import { useSelectedLayoutSegment } from 'next/navigation';
import Link from 'next/link';
import { cn } from '../../lib/utils';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { Icon } from '@iconify/react/dist/iconify.js';

export default function Header() {
    const scrolled = useScroll(5);
    const selectedLayout = useSelectedLayoutSegment();

    return (
        <div
            className={cn(
                `sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200`,
                {
                    'border-b border-gray-200 bg-white/75 backdrop-blur-lg': scrolled,
                    'border-b border-gray-200 bg-white': selectedLayout,
                },
            )}
            >
            <div className="flex h-[50px] items-center justify-between px-4">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/"
                        className="flex flex-row space-x-3 items-center justify-center md:hidden"
                    >
                        <Icon icon="material-symbols:azm-rounded" color='#34d399' fontSize={30} />
                        <span className="font-bold text-xl flex ">Finance Tracker</span>
                    </Link>
                </div>

                <div className="hidden md:block">
                    <div className="h-8 w-8 rounded-full bg-zinc-300 flex items-center justify-center text-center">
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </div>
    );
}
