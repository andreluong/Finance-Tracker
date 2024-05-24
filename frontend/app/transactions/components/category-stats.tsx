import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DonutChart from './donut-chart';
import { CategoryStat } from '@/app/types';

export default function CategoryStats({type, user_id}: {type: string | null, user_id: string}) {
    const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
    const [total, setTotal] = useState<number>(0);

    const getCategoryStats = async () => {
        const url = type 
            ? `http://localhost:8080/api/transactions/category/stats/${type}/${user_id}`
            : `http://localhost:8080/api/transactions/category/stats/${user_id}`; 

        await axios.get(url)
            .then(response => {
                setCategoryStats(response.data.stats);
                setTotal(response.data.sumTotal);
            })
            .catch(error => {
                console.error("Error fetching category stats: ", error.message);
            });
    }

    useEffect(() => {
        getCategoryStats();
    }, [])

    console.log(categoryStats)

    return (
        <div className='flex flex-wrap mb-4'>
            <div className='flex items-center justify-center w-1/2'>
                <DonutChart 
                    series={categoryStats.map(category => Number(category.total))} 
                    labels={categoryStats.map(category => category.name)} 
                    total={total}
                />
            </div>
            
            <div className='w-1/2'>
                <div className='flex justify-end'>
                    <table className='table-fixed w-full ml-16'>
                        <thead>
                            <tr>
                                <th className='w-3/6 border border-zinc-300 px-6 py-1 text-left'>Category</th>
                                <th className='w-1/6 border border-zinc-300 px-6 py-1 text-right'>Total</th>
                                <th className='w-1/6 border border-zinc-300 px-6 py-1 text-right'>Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categoryStats.map((category, index) => (
                                <tr key={index}>
                                    <td className='border border-zinc-300 px-6 py-1 text-left'>{category.name}</td>
                                    <td className='border border-zinc-300 px-6 py-1 text-right'>${category.total}</td>
                                    <td className='border border-zinc-300 px-6 py-1 text-right'>{category.percentage}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
