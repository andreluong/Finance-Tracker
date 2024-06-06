import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import Header from "./components/dashboard/header";
import Sidenav from "./components/dashboard/side-nav";
import PageWrapper from "./components/dashboard/page-wrapper";
import MarginWidthWrapper from "./components/dashboard/margin-width-wrapper";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "Track your finances",
};

if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  throw 'Missing Publishable Key'
}

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <html lang="en">
        <body className={`bg-white ${inter.className}`}>
          <Providers>
            <SignedOut>
              {children}
            </SignedOut>

            <SignedIn>
              <div className="flex">
                <Sidenav />
                <main className="flex-1">
                  <MarginWidthWrapper>
                    <Header />
                    <PageWrapper>
                      {children}
                    </PageWrapper>
                  </MarginWidthWrapper>
                </main>
              </div>
            </SignedIn>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
