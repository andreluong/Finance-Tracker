import { EXPENSES, INCOME } from '@/app/constants';
import ReactApexChart from 'react-apexcharts'

export default function MonthlyTransactionsLineChart({
    monthlyIncome,
    monthlyExpenses,
    dates
}: {
    monthlyIncome: number[],
    monthlyExpenses: number[],
    dates: string[]
}) {    
    const chartState = {
        series: [ 
            {
                name: "Monthly Income",
                data: monthlyIncome
            },
            {
                name: "Monthly Spending",
                data: monthlyExpenses
            }
        ],
        options: {
            colors: [INCOME.colour, EXPENSES.colour, "#ffbb44"],
            labels: dates,
            chart: {
                zoom: {
                    enabled: false
                },
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                tickAmount: 10
            },
            annotations: {
                yaxis: [
                    {
                        y: 0,
                        borderColor: 'black'
                    }
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
                    type="line"
                    height={350}
                />
            }
        </>
    )
}