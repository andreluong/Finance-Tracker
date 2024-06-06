import { CategoryStat } from "@/app/types";
import { Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import React, { useMemo, useState } from "react";

type HeaderColumn = {
    key: string;
    name: string;
    alignment?: "text-right";
};

export default function CategoryStatsTable({
    categoryStats,
}: {
    categoryStats: CategoryStat[];
}) {
    const [page, setPage] = useState(1);
    const rowsPerPage = 6;
    const totalPages = Math.ceil(categoryStats.length / rowsPerPage);
  
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
    
        return categoryStats.slice(start, end);
    }, [page, categoryStats]);

    const columns: HeaderColumn[] = [
        {
            key: "category",
            name: "Category"
        },
        {
            key: "total",
            name: "Total",
            alignment: "text-right"
        },
        {
            key: "percentage",
            name: "Percentage",
            alignment: "text-right"
        },
    ]

    return (
        <div className="flex justify-end">
            <Table
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
                <TableBody items={items}>
                    {(category: CategoryStat) => (
                        <TableRow key={category.name}>
                            <TableCell>
                                <div className="flex flex-row">
                                    <div
                                        className={`w-3 h-3 my-auto rounded-full`}
                                        style={{
                                            backgroundColor:
                                                category.colour,
                                        }}
                                    />
                                    &nbsp;{category.name}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                ${category.total}
                            </TableCell>
                            <TableCell className="text-right">
                                {category.percentage}%
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
