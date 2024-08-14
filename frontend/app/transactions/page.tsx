"use client";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import CategoryStats from "./components/category-stats";
import TransactionsTable from "./components/transactions-table";
import { Category, KeyValueProp, Transaction } from "@/app/types";
import useSWR from "swr";
import { fetcher, fetcherWithToken } from "@/app/lib/utils";
import { Input, Select, SelectItem } from "@nextui-org/react";
import Loader from "../components/dashboard/loader";
import ImportButton from "./components/import-button";
import TransactionURLProvider from "../lib/transction-url-context";
import dynamic from "next/dynamic";

const DynamicExportButton = dynamic(() => import("./components/export-button"), { ssr: false });

export default function AllTransactions() {
    const { getToken } = useAuth();
    const [type, setType] = useState<string>("all");
    const [categoryName, setCategoryName] = useState<string>("All");
    const [categoryId, setCategoryId] = useState<number>(-1);
    const [period, setPeriod] = useState<string>("allTime");
    const [search, setSearch] = useState<string>("");
    const transactionsURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/all?period=${period}`;

    const {
        data: transactions,
        error: fetchTransactionsError,
        isLoading: fetchTransactionsLoading,
    } = useSWR(
        transactionsURL,
        async (url: string) => fetcherWithToken(url, await getToken())
    );

    const getCategories = () => {
        // Default value for all categories
        const defaultValues: Category[] = [{ id: -1, name: "All", value: "all", colour: "", type: "" }]
        
        const {
            data: categories,
            error: fetchCategoriesError,
            isLoading: fetchCategoriesLoading,
        } = useSWR<Category[], Error, any>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories/unique?type=${type}`,
            fetcher
        );
        
        return {
            categories: categories ? [...defaultValues, ...categories] : defaultValues,
            fetchCategoriesError,
            fetchCategoriesLoading
        }
    }

    const { categories, fetchCategoriesError, fetchCategoriesLoading } = getCategories();

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategory = categories.find(category => category.name == e.target.value);
        setCategoryName(selectedCategory?.name || "All")
        setCategoryId(selectedCategory?.id || -1)
    };

    const getYears = () => {
        const defaultValues: KeyValueProp<string, string>[] = [
            { label: "All Time", value: "allTime" },
            { label: "Last 7 days", value: "last7Days" },
            { label: "Last 30 days", value: "last30Days" }
        ];

        const {
            data: years,
            error: fetchYearsError,
            isLoading: fetchYearsLoading,
        } = useSWR<KeyValueProp<string, string>[], Error, any>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/years`,
            async (url: string) => fetcherWithToken(url, await getToken())
        );

        return {
            years: years ? [...defaultValues, ...years] : defaultValues,
            fetchYearsError,
            fetchYearsLoading
        }
    }

    const { years, fetchYearsError, fetchYearsLoading } = getYears();

    if (fetchYearsError || fetchCategoriesError || fetchTransactionsError) {
        throw fetchYearsError || fetchCategoriesError || fetchTransactionsError || new Error("Failed to fetch data");
    }

    if (fetchYearsLoading || fetchCategoriesLoading || fetchTransactionsLoading) {
        return <Loader />
    }

    // Filter transactions
    const filteredTransactions = transactions.filter((transaction: Transaction) => 
        transaction.name.toLowerCase().includes(search.toLowerCase())
        && (type === "all" || transaction.type === type)
        && (categoryId === -1 || transaction.category.id === Number(categoryId))
    );

    return (
        <div>
            <h1 className="font-bold text-3xl pb-4">Transactions</h1>
            <div className="flex justify-between w-full mb-4">
                <div className="flex flex-row gap-4 w-1/2">
                    <Select
                        items={years}
                        selectedKeys={[period]}
                        onChange={(e) => setPeriod(e.target.value)}
                        label="Period"
                        variant="faded"
                        className="w-8/12"
                        style={{
                            backgroundColor: "white"
                        }}
                    >
                        {(year: KeyValueProp<string, string>) => (
                            <SelectItem key={year.value} value={year.value}>
                                {year.label}
                            </SelectItem>
                        )}
                    </Select>
                    <Select
                        selectedKeys={[type]}
                        onChange={(e) => {
                            setType(e.target.value);
                            setCategoryName("All");
                            setCategoryId(-1);
                        }}
                        label="Type"
                        variant="faded"
                        className="w-8/12"
                        style={{
                            backgroundColor: "white"
                        }}
                    >
                        <SelectItem key="all" value="all">All</SelectItem>
                        <SelectItem key="income" value="income">Income</SelectItem>
                        <SelectItem key="expense" value="expense">Expenses</SelectItem>
                    </Select>
                    <Select
                        items={categories}
                        selectedKeys={[categoryName]}
                        onChange={handleCategoryChange}
                        label="Category"
                        variant="faded"
                        style={{
                            backgroundColor: "white"
                        }}
                    >
                        {(category: Category) => (
                            <SelectItem key={category.name}>
                                {category.name}
                            </SelectItem>
                        )}
                    </Select>
                    <Input 
                        type="search" 
                        label="Search" 
                        variant="faded" 
                        isClearable
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onClear={() => setSearch("")}
                        classNames={{
                            input: [
                                "bg-white"
                            ],
                            inputWrapper: [
                                "bg-white"
                            ]
                        }}
                    />
                </div>
                <div className="flex flex-row gap-2">
                    <ImportButton url={transactionsURL} />              
                    <DynamicExportButton transactions={filteredTransactions} />
                </div>
            </div>
            <div className="flex flex-wrap mb-4">
                <CategoryStats type={type} period={period} />
            </div>
            <TransactionURLProvider defaultURL={transactionsURL}>
                <TransactionsTable transactions={filteredTransactions} />
            </TransactionURLProvider>
        </div>
    );
}
