import { ReactNode } from 'react';

export default function PageWrapper({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col pt-6 px-6 space-y-2 bg-zinc-100 flex-grow pb-4">
            {children}
        </div>
    );
}