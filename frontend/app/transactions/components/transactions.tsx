import React, { useEffect, useState } from "react";
import { Transaction } from "@/app/types";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function Transactions({
    transactions,
}: {
    transactions: Transaction[];
}) {
    const [rowsLimit] = useState<number>(10);
    const [rowsToShow, setRowsToShow] = useState<Transaction[]>(
        transactions.slice(0, rowsLimit)
    );
    const [totalPage] = useState<number>(
        Math.ceil(
            (transactions.length === 0 ? 1 : transactions.length) / rowsLimit
        )
    );
    const [currentPage, setCurrentPage] = useState<number>(0);
    const lastPage = totalPage - 1;

    const renderFirstPage = () => {
        const newArray = transactions.slice(0, rowsLimit);
        setRowsToShow(newArray);
        setCurrentPage(0);
    };

    const renderNextPage = () => {
        const startIndex = rowsLimit * (currentPage + 1);
        const endIndex = startIndex + rowsLimit;
        const newArray = transactions.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        setCurrentPage(currentPage + 1);
    };

    const renderPreviousPage = () => {
        const startIndex = (currentPage - 1) * rowsLimit;
        const endIndex = startIndex + rowsLimit;
        const newArray = transactions.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        if (currentPage >= 1) {
            setCurrentPage(currentPage - 1);
        } else {
            setCurrentPage(0);
        }
    };

    const renderLastPage = () => {
        const startIndex = lastPage * rowsLimit;
        const endIndex = startIndex + rowsLimit;
        const newArray = transactions.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        setCurrentPage(lastPage);
    };

    useEffect(() => {
        setRowsToShow(transactions.slice(0, rowsLimit));
    }, [transactions]);

    return (
        <>
            <table className="table-fixed w-full">
                <thead>
                    <tr>
                        <th className="w-1/6 border border-zinc-300 px-6 py-4 text-left">
                            Date
                        </th>
                        <th className="w-2/6 border border-zinc-300 px-6 py-4 text-left">
                            Transaction
                        </th>
                        <th className="w-1/6 border border-zinc-300 px-6 py-4 text-right">
                            Amount
                        </th>
                        <th className="w-1/6 border border-zinc-300 px-6 py-4 text-left">
                            Type
                        </th>
                        <th className="w-1/6 border border-zinc-300 px-6 py-4 text-left">
                            Category
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rowsToShow.map((transaction: Transaction) => (
                        <tr key={transaction.id} className="hover:bg-white">
                            <td className="border border-zinc-300 px-6 py-4 text-left">
                                {new Date(transaction.date).toLocaleDateString(
                                    "en-US"
                                )}
                            </td>
                            <td className="border border-zinc-300 px-6 py-4 text-left">
                                {transaction.name}
                            </td>
                            <td className="border border-zinc-300 px-6 py-4 text-right">
                                $ {transaction.amount}
                            </td>
                            <td className="border border-zinc-300 px-6 py-4 text-left">
                                {transaction.type}
                            </td>
                            <td className="border border-zinc-300 px-6 py-4 text-left">
                                {transaction.category}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center my-5">
                <ul className="flex border-zinc-300">
                    <li
                        className={`border border-zinc-300 px-4 py-2 hover:bg-white cursor-pointer
                            ${
                                currentPage === 0
                                    ? "pointer-events-none bg-gray-300"
                                    : ""
                            }
                        `}
                        onClick={renderFirstPage}
                    >
                        <Icon
                            icon="lucide:arrow-left-to-line"
                            width="24"
                            height="24"
                        />
                    </li>
                    <li
                        className={`border border-zinc-300 px-4 py-2 hover:bg-white cursor-pointer ${
                            currentPage === 0
                                ? "pointer-events-none bg-gray-300"
                                : ""
                        }
                        `}
                        onClick={renderPreviousPage}
                    >
                        <Icon icon="lucide:arrow-left" width="24" height="24" />
                    </li>
                    <li className="border border-zinc-300 px-4 py-2 font-sans">
                        Page{" "}
                        <span className="font-bold">{currentPage + 1}</span> of{" "}
                        <span className="font-bold">{totalPage}</span>
                    </li>
                    <li
                        className={`border border-zinc-300 px-4 py-2 hover:bg-white cursor-pointer
                            ${
                                currentPage === lastPage
                                    ? "pointer-events-none bg-gray-300"
                                    : ""
                            }
                        `}
                        onClick={renderNextPage}
                    >
                        <Icon
                            icon="lucide:arrow-right"
                            width="24"
                            height="24"
                        />
                    </li>
                    <li
                        className={`border border-zinc-300 px-4 py-2 hover:bg-white cursor-pointer
                            ${
                                currentPage === lastPage
                                    ? "pointer-events-none bg-gray-300"
                                    : ""
                            }
                        `}
                        onClick={renderLastPage}
                    >
                        <Icon
                            icon="lucide:arrow-right-to-line"
                            width="24"
                            height="24"
                        />
                    </li>
                </ul>
            </div>
        </>
    );
}
