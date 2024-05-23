import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function CategoryStats({user_id}: {user_id: string}) {
    const [categoryStats, setCategoryStats] = useState<any[]>([]);

    const getCategoryStats = async () => {
        await axios.get(`http://localhost:8080/api/transactions/category/stats/${user_id}`)
            .then(response => {
                console.log(response.data);
                setCategoryStats(response.data);
            })
            .catch(error => {
                console.error("Error fetching category stats: ", error.message);
            });
    }

    useEffect(() => {
        getCategoryStats();
    }, [])
    
    return (
        <div className='flex flex-wrap mb-4'>
            <div className='flex items-center justify-center w-1/2'>
                <img src='/assets/images/graph.png' alt='Graph'/>
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
