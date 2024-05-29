import { CategoryStat } from "@/app/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";

export default function CategoryStatsTable({
    categoryStats,
}: {
    categoryStats: CategoryStat[];
}) {
    const [rowsLimit] = useState(6);
    const [rowsToShow, setRowsToShow] = useState<CategoryStat[]>(
        categoryStats.slice(0, rowsLimit)
    );
    const [totalPage, setTotalPage] = useState<number>(
        Math.ceil(
            (categoryStats.length === 0 ? 1 : categoryStats.length) / rowsLimit
        )
    );
    const [currentPage, setCurrentPage] = useState<number>(0);
    const lastPage = totalPage - 1;

    const renderNextPage = () => {
        const startIndex = rowsLimit * (currentPage + 1);
        const endIndex = startIndex + rowsLimit;
        const newArray = categoryStats.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        setCurrentPage(currentPage + 1);
    };

    const renderPreviousPage = () => {
        const startIndex = (currentPage - 1) * rowsLimit;
        const endIndex = startIndex + rowsLimit;
        const newArray = categoryStats.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        if (currentPage >= 1) {
            setCurrentPage(currentPage - 1);
        } else {
            setCurrentPage(0);
        }
    };

    useEffect(() => {
        setRowsToShow(categoryStats.slice(0, rowsLimit));
        setTotalPage(Math.ceil(
            (categoryStats.length === 0 ? 1 : categoryStats.length) / rowsLimit
        ))
        setCurrentPage(0);
    }, [categoryStats]);

    return (
        <div className="ml-16">
            <div className="flex justify-end">
                <table className="table-fixed w-full">
                    <thead>
                        <tr>
                            <th className="w-3/6 border border-zinc-300 px-6 py-2 text-left">
                                Category
                            </th>
                            <th className="w-1/6 border border-zinc-300 px-6 py-2 text-right">
                                Total
                            </th>
                            <th className="w-1/6 border border-zinc-300 px-6 py-2 text-right">
                                Percentage
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rowsToShow.map(
                            (category: CategoryStat, index: React.Key) => (
                                <tr key={index}>
                                    <td className="border border-zinc-300 px-6 py-2 text-left flex flex-row">
                                        <div className={`w-3 h-3 my-auto rounded-full`} style={{ backgroundColor: category.colour }} />
                                        &nbsp;{category.name}
                                    </td>
                                    <td className="border border-zinc-300 px-6 py-2 text-right">
                                        ${category.total}
                                    </td>
                                    <td className="border border-zinc-300 px-6 py-2 text-right">
                                        {category.percentage}%
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
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
                        onClick={renderPreviousPage}
                    >
                        <Icon 
                            icon="lucide:arrow-left" 
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
                        onClick={renderNextPage}
                    >
                        <Icon
                            icon="lucide:arrow-right"
                            width="24"
                            height="24"
                        />
                    </li>
                </ul>
            </div>
        </div>
    );
}
