import React, { useMemo, useState } from "react";
import { Transaction } from "@/app/types";
import { INCOME, EXPENSES } from "@/app/constants";
import { Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import TransactionModal from "./transaction-modal";
import CategoryChip from "./category-chip";

type HeaderColumn = {
    key: string;
    name: string;
    alignment?: "text-right"
};

export default function TransactionsTable({
    transactions,
}: {
    transactions: Transaction[];
}) {
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction>();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    const totalPages = Math.ceil(transactions.length / rowsPerPage);
  
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
    
        return transactions.slice(start, end);
    }, [page, transactions]);
    
    const columns: HeaderColumn[] = [
        {
            key: "date",
            name: "Date"
        },
        {
            key: "transaction",
            name: "Transaction"
        },
        {
            key: "amount",
            name: "Amount",
            alignment: "text-right"
        },
        {
            key: "type",
            name: "Type"
        },
        {
            key: "category",
            name: "Category"
        },
    ];

    return (
        <>
            <Table
                selectionMode="single"
                onRowAction={(key) => {
                    const transaction = transactions.find((transaction) => transaction.id === key);
                    setSelectedTransaction(transaction);
                    onOpen();
                }}   
                bottomContent={
                    items.length > 0 && (
                        <div className="flex justify-center">
                            <Pagination
                                isCompact
                                showControls
                                color="primary"
                                page={page}
                                total={totalPages}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                    )
                }
            >
                <TableHeader columns={columns}>
                    {(column: HeaderColumn) => (
                        <TableColumn
                            key={column.key}
                            className={column.alignment}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    items={items}
                    emptyContent={"No transactions to display."}
                >
                    {(transaction: Transaction) => (
                        <TableRow
                            key={transaction.id}
                            className="hover:bg-white"
                        >
                            <TableCell>
                                {new Date(transaction.date).toLocaleDateString("en-US")}
                            </TableCell>
                            <TableCell>{transaction.name}</TableCell>
                            <TableCell className="font-bold text-right">
                                {transaction.type === "income" ? (
                                    <p className="text-green-700">
                                        ${transaction.amount}
                                    </p>
                                ) : (
                                    <p className="text-red-700">
                                        -${transaction.amount}
                                    </p>
                                )}
                            </TableCell>
                            <TableCell>
                                {transaction.type === "income"
                                    ? INCOME.icon
                                    : EXPENSES.icon}
                            </TableCell>
                            <TableCell>
                                <CategoryChip category={transaction.category} />
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {selectedTransaction && (
                <TransactionModal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    transaction={selectedTransaction}
                />
            )}
        </>
    );
}
