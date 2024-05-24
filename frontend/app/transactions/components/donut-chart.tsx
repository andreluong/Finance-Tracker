import React from 'react'
import ReactApexChart from 'react-apexcharts';

export default function DonutChart({series, labels, total}: {series: number[], labels: string[], total: number}) {
    const chartState = {
        series: series,
        options: {
            colors: ['#FF1654', '#247BA0', '#70C1B3', '#B2DBBF', '#F3FFBD', '#FF1654', '#247BA0', '#70C1B3'],
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