"use client";

import { useAuth } from "@clerk/nextjs";
import useSWR from "swr";
import TransactionsTable from "../components/transactions-table";
import { fetcherWithToken } from "@/app/lib/utils";
import TransactionForm from "./components/transaction-form";
import Loader from "@/app/components/dashboard/loader";
import CsvForm from "./components/csv-file-form";
import TransactionURLProvider from "@/app/lib/transction-url-context";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import ReceiptForm from "./components/receipt-form";

export default function CreateTransaction() {
    const { getToken } = useAuth();
    const transctionsURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/recent`;

    const {
        data: recentTransactions,
        error,
        isLoading,
    } = useSWR(
        transctionsURL,
        async (url: string) => fetcherWithToken(url, await getToken())
    );

    if (error) throw error || new Error("An error occurred while fetching recent transactions");
    if (isLoading) return <Loader />;

    const tabs = [
        {
            id: "form",
            label: "Form",
            content: <TransactionForm />
        },
        {
            id: "receipt",
            label: "Receipt",
            content: <ReceiptForm />
        },
        {
            id: "csv",
            label: "CSV",
            content: <CsvForm />
        }
    ];

    return (
        <TransactionURLProvider defaultURL={transctionsURL}>
            <h1 className="font-bold text-3xl pb-4">Create Transaction</h1>
            <Tabs 
                radius="sm"
                items={tabs}
            >
                {(item) => (
                    <Tab key={item.id} title={item.label}>
                        <Card>
                            <CardBody>
                                {item.content}
                            </CardBody>
                        </Card>  
                    </Tab>
                )}
            </Tabs>
            <div>
                <h2 className="font-bold text-2xl pb-4">Recently Created</h2>
                <TransactionsTable transactions={recentTransactions} />
            </div>
        </TransactionURLProvider>
    );
}