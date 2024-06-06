"use client";

import { useAuth } from "@clerk/nextjs";
import useSWR from "swr";
import TransactionsTable from "../components/transactions-table";
import { fetcherWithToken } from "@/app/lib/utils";
import TransactionForm from "./components/transaction-form";
import Loader from "@/app/components/loader";
import CSVForm from "./components/csv-file-form";
import TransactionURLProvider from "@/app/lib/transction-url-context";

export default function CreateTransaction() {
    const { getToken } = useAuth();
    const transctionsURL = `http://localhost:8080/api/transactions/recent`;

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

    return (
        <TransactionURLProvider defaultURL={transctionsURL}>
            <div className="flex flex-row pb-4 gap-8">
                <div className="w-3/4 flex flex-col">
                    <h1 className="font-bold text-3xl pb-4">Create Transaction</h1>
                    <TransactionForm />
                </div>
                <div className="w-1/4 flex flex-col"> 
                    <h1 className="font-bold text-3xl pb-4">Import CSV</h1>
                    <CSVForm />
                </div>
            </div>
            <div>
                <h2 className="font-bold text-2xl pb-4">Recently Created</h2>
                <TransactionsTable transactions={recentTransactions} />
            </div>
        </TransactionURLProvider>
    );
}