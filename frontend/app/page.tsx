'use client';

import { SignInButton, SignUpButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const { isSignedIn } = useUser();

    if (isSignedIn) {
        router.push('/dashboard')
    }
    
    return (
        <>
            <SignedOut>
                <div>
                    <h1>Finance Tracker</h1>
                    <p>
                        Finance Tracker is a simple web application that helps you track
                        your expenses and income.
                    </p>
                    <SignInButton />
                    <SignUpButton />
                </div>
            </SignedOut>

            <SignedIn>
                <p>Loading...</p>
            </SignedIn>
        </>
    );
}
