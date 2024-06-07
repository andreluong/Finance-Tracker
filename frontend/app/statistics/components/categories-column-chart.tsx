import { CategoryStat } from '@/app/types'
import React from 'react'
import ReactApexChart from 'react-apexcharts'

export default function CategoriesColumnChart({
    categoryData,
    dataKey
}: {
    categoryData: CategoryStat[]
    dataKey: 'total' | 'count';
}) {
    const series: number[] = categoryData.map((category) => Number(category[dataKey]));
    const labels = categoryData.map((category) => category.name);
    const colours = categoryData.map((category) => category.colour);

    console.log("cokrs", colours)

    const chartState = {
        series: [{ name: 'Amount', data: series }],
        options: {
            colors: colours,
            labels: labels,
            legend: {
                show: true
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',
                    distributed: true
                },
            },
            dataLabels: {
                enabled: false
            },
            chart: {
                toolbar: {
                    show: false
                }
            }
        },
    }

    return (
        <ReactApexChart
            options={chartState.options}
            series={chartState.series}
            type="bar"
            height={400}
        />
    )
}
