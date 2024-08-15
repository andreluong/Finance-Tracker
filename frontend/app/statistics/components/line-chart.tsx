import React from 'react'
import ReactApexChart from 'react-apexcharts'

type ChartSeriesProps = {
    name: string,
    data: number[]
}

export default function LineChart({
    series,
    colors,
    dates
}: {
    series: ChartSeriesProps[],
    colors: string[],
    dates: string[]
}) {

    const chartState = {
        series,
        options: {
            colors,
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
