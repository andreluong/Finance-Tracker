import { sendImportTransactionsRequest } from '@/app/lib/api';
import { useAuth } from '@clerk/nextjs';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@nextui-org/react';
import React from 'react'

export default function ImportButton({ url }: { url: string }) {
    const { getToken } = useAuth();

    const handleImport = () => {
        // Create an input element to trigger the file selection dialog
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".csv";
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const token = await getToken();
                sendImportTransactionsRequest(file, url, token);
            }
        };
        input.click();
    };

    return (
        <Button
            isIconOnly
            variant="faded"
            className="my-auto h-full"
            size="lg"
            onClick={handleImport}
        >
            <Icon icon="lucide:upload" className="h-5 w-5" />
        </Button>
    );
}
