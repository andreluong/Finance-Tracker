import React from 'react'
import ReactApexChart from 'react-apexcharts'

export default function DonutChart() {
    // Example data
    const series = [1393, 953, 700, 430, 210.92, 153.87, 122.02, 90, 45];
    const labels = ["Shopping", "Education", "Travel", "Grocery", "Fees & Charges", "Entertainment", "Food & Drink", "Auto & Transport", "Miscellaneous Expense"];
    const colors = ["#d8b4fe", "#eab308", "#fda4af", "#4ade80", "#db2777", "#f97316", "#fdba74", "#60a5fa", "#f5d0fe"];
    const total = series.reduce((a, b) => a + b, 0);

    const chartState = {
        series: series,
        toolbar: {
            show: false,
        },
        options: {
            colors: colors,
            labels: labels,
            legend: {
                show: false,
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            value: {
                                show: true,
                                fontFamily: "sans-serif",
                                fontSize: "24px",
                                color: "#000000",
                                formatter: (val: number | string) => `$${val}`,
                            },
                            total: {
                                show: true,
                                fontFamily: "sans-serif",
                                fontWeight: "bold",
                                fontSize: "20px",
                                label: 'Total',
                                color: "#000000",
                                formatter: () => `$${total.toFixed(2)}`,
                            },
                        },
                        size: "70%"
                    },
                },
            }
        }
    }

    return (
        <>
            {(typeof window !== 'undefined') &&
                <ReactApexChart
                    options={chartState.options}
                    series={chartState.series}
                    type="donut"
                    height={400}
                    width={400}
                />
            }
        </>
    )
}
