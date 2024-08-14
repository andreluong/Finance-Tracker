import ReactApexChart from 'react-apexcharts'

export default function NetIncomeLineChart({
    monthlyIncome,
    monthlyExpenses,
    dates
}: {
    monthlyIncome: number[],
    monthlyExpenses: number[],
    dates: string[]
}) {

    // Calculate cumulative net income
    const cumulativeNetIncome = [];
    let totalNetIncome = 0;

    const maxLength = Math.max(monthlyIncome.length, monthlyExpenses.length);

    for (let i = 0; i < maxLength; i++) {
        const incomeValue = monthlyIncome[i] || 0;
        const expenseValue = monthlyExpenses[i] || 0;
        const netIncome = incomeValue - expenseValue;
        totalNetIncome += netIncome;
        cumulativeNetIncome.push(totalNetIncome.toFixed(2));
    }

    const chartState = {
        series: [ 
            {
                name: "Net Income",
                data: cumulativeNetIncome
            },
        ],
        options: {
            colors: ["#00b0ff"],
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
            stroke: {
                curve: "smooth"
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
