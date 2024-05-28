import React from 'react'
import ReactApexChart from 'react-apexcharts';

export default function DonutChart(
    {series, colours, labels, total}: {series: number[], colours: string[], labels: string[], total: number}
) {
    const chartState = {
        series: series,
        options: {
            colors: colours,
            labels: labels,
            legend: {
                show: false
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            value: {
                                show: true,
                                fontFamily: 'sans-serif',
                                fontSize: '24px',
                                color: '#000000',
                                formatter: (val: number | string) => `$${val}`
                            },
                            total: {
                                show: true,
                                fontFamily: 'sans-serif',
                                fontWeight: 'bold',
                                fontSize: '24px',
                                label: `Total`,
                                color: '#000000',
                                formatter: () => `$${total}`
                            }
                        }
                    }
                }
            },
            responsive: [{
                breakpoint: 490,
                options: {
                    chart: {
                        width: 400
                    },
                }
            }]
        }
    };

    return (
        <ReactApexChart
            options={chartState.options}
            series={chartState.series}
            type="donut"
            width="500"
        />
    )
}