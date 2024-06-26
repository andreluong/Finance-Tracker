'use client';

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Landing from "./components/landing";
import Loader from "./components/dashboard/loader";

export default function Home() {
    const router = useRouter();
    const { isSignedIn } = useUser();

    useEffect(() => {
        if (isSignedIn) {
            router.push('/overview');
        }
    }, [isSignedIn, router]);
    
    return (
        <>
            <SignedOut>
                <Landing />
            </SignedOut>
            <SignedIn>
                <Loader />
            </SignedIn>
        </>
    );
}
