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
  authors: {
    url: "https://github.com/andreluong",
    name: "Andre Luong"
  },
  keywords: ["finance", "tracker", "budget"],
  openGraph: {
    title: "Finance Tracker",
    description: "Track your finances",
    url: "https://finance-tracker-weld-gamma.vercel.app",
    type: "website",
    images: [
      {
        url: "/assets/images/android-chrome-512x512.png",
        width: 800,
        height: 600,
        alt: "Finance Tracker Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Finance Tracker",
    description: "Track your finances",
    images: ["/assets/images/android-chrome-512x512.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  }
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
