import { EXPENSES, INCOME } from '@/app/constants';
import React, { useEffect, useState } from 'react'
import ReactApexChart from "react-apexcharts";

type MonthlyTransactionsChartProps = {
    month: string;
    total_amount: string;
    type: string;
}

export default function MonthlyTransactionsChart({
    data
}: {
    data: MonthlyTransactionsChartProps[];
}) {
    const [monthlyIncomeData, setMonthlyIncomeData] = useState<number[]>(Array(12).fill(0));
    const [monthlyExpenseData, setMonthlyExpenseData] = useState<number[]>(Array(12).fill(0));

    const chartState = {
        series: [{
            name: INCOME.title,
            data: monthlyIncomeData
        }, {
            name: EXPENSES.title,
            data: monthlyExpenseData
        }],
        options: {
            colors: [INCOME.colour, EXPENSES.colour],
            labels: [INCOME.title, EXPENSES.title],
            legend: {
                show: false,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: "55%",
                    endingShape: "rounded",
                }
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            chart: {
                toolbar: {
                    show: false
                }
            }
        }
    }

    useEffect(() => {
        if (data) {
            const incomeData = Array(12).fill(0);
            const expenseData = Array(12).fill(0);

            data.forEach((transaction) => {
                const month = Number(transaction.month) - 1;
                if (transaction.type === "income") {
                    incomeData[month] += Number(transaction.total_amount);
                } else {
                    expenseData[month] += Number(transaction.total_amount);
                }
            });
            setMonthlyIncomeData(incomeData);
            setMonthlyExpenseData(expenseData);
        }
    }, [data])

    return (
        <ReactApexChart 
            options={chartState.options}
            series={chartState.series}
            type="bar"
            height={400}
        />
    )
}
