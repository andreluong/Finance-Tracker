"use client";

import { useUser } from "@clerk/nextjs";
import useSWR from "swr";
import Transactions from "../components/transactions";
import { fetcher } from "@/app/lib/utils";
import TransactionForm from "./components/transaction-form";

export default function CreateTransaction() {
    const { isLoaded, isSignedIn, user } = useUser();
    const {
        data: recentTransactions,
        error,
        isLoading,
    } = useSWR(
        `http://localhost:8080/api/transactions/recent/${user?.id}`,
        fetcher,
        { refreshInterval: 5000 }
    );

    // User
    if (!isLoaded || !isSignedIn) {
        return null;
    }

    return (
        <div>
            <section>
                <h1 className="font-bold text-3xl pb-4">Transaction</h1>
                <TransactionForm user_id={user?.id} />
            </section>
            <section>
                <h2 className="font-bold text-2xl pb-4">Recently Created</h2>
                {error && <div>Error loading recent transactions</div>}
                {isLoading && <div>Loading...</div>}
                {recentTransactions && (
                    <Transactions transactions={recentTransactions} />
                )}
            </section>
        </div>
    );
}
