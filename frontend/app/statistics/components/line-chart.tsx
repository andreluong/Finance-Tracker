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
            xaxis: {
                tickAmount: 10,
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
                    height={360}
                />
            }
        </>
    )
}
