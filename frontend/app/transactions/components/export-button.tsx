import { Transaction } from '@/app/types';
import { Icon } from '@iconify/react/dist/iconify.js'
import { Button } from '@nextui-org/react'
import React from 'react'

export default function ExportButton({
    transactions,
}: {
    transactions: Transaction[];
}) {
    const handleExport = () => {
        const headers = "Date,Name,Amount,Type,Category,Description\n";
        const csv =headers + transactions
            .map((transaction: Transaction) => {
                return `${new Date(transaction.date).toLocaleDateString("en-US")},`
                + `${transaction.name},` 
                + `${transaction.amount},`
                + `${transaction.type},`
                + `${transaction.category.name},`
                + `${transaction.description}`
            })
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "transactions.csv";
        a.click();
    };

    return (
        <Button
            isIconOnly
            variant="faded"
            className="my-auto h-full w-full px-4 hover:border-zinc-500 bg-white"
            size="lg"
            onClick={handleExport}
            endContent={<Icon icon="lucide:download" className="h-5 w-5" />}
        >
            Export&nbsp;
        </Button>
    );
}
