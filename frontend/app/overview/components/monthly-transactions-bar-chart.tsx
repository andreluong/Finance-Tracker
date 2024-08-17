import { EXPENSES, INCOME, MONTHS_SHORT } from '@/app/constants';
import { FinancialType } from '@/app/types';
import ReactApexChart from "react-apexcharts";

type MonthlyTransactionData = {
    month: string;
    amount: string;
    type: string;
}

type MonthlyTransactionsChartProps = {
    monthlyTransactions: MonthlyTransactionData[];
    avg: string;
}

const avgDottedLine = (avg: string, type: FinancialType) => {
    return {
        y: Number(avg) || 0,
        borderColor: type.colour,
        borderWidth: 2,
        strokeDashArray: 8
    }
}

export default function MonthlyTransactionsBarChart({
    incomeData,
    expenseData
}: {
    incomeData: MonthlyTransactionsChartProps;
    expenseData: MonthlyTransactionsChartProps;
}) {
    const chartState = {
        series: [{
            name: INCOME.title,
            data: incomeData.monthlyTransactions.map((t: MonthlyTransactionData) => Number(t.amount))
        }, {
            name: EXPENSES.title,
            data: expenseData.monthlyTransactions.map((t: MonthlyTransactionData) => Number(t.amount))
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
                categories: MONTHS_SHORT,
                labels: {
                    style: {
                        fontSize: '14px'
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        fontSize: '14px'
                    }
                }
            },
            chart: {
                toolbar: {
                    show: false
                }
            },
            annotations: {
                yaxis: [
                    avgDottedLine(incomeData.avg, INCOME),
                    avgDottedLine(expenseData.avg, EXPENSES),
                ]
            }
        }
    }

    return (
        <>
            {(typeof window !== "undefined") && 
                <ReactApexChart 
                    options={chartState.options}
                    series={chartState.series}
                    type="bar"
                    height={350}
                />
            }
        </>
    )
}
