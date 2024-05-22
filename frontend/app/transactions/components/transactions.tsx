import React from 'react'

export default function Transactions() {
    // TODO: add type prop for income/expenses separation
    
    return (
        <table className='table-fixed w-full'>
            <thead>
                <tr>
                    <th className='w-1/6 border border-zinc-300 px-6 py-4 text-left'>Date</th>
                    <th className='w-2/6 border border-zinc-300 px-6 py-4 text-left'>Transaction</th>
                    <th className='w-1/6 border border-zinc-300 px-6 py-4 text-right'>Amount</th>
                    <th className='w-1/6 border border-zinc-300 px-6 py-4 text-left'>Type</th>
                    <th className='w-1/6 border border-zinc-300 px-6 py-4 text-left'>Category</th>
                </tr>
            </thead>
            <tbody>
                <tr className='hover:bg-white'>
                    <td className='border border-zinc-300 px-6 py-4 text-left'>2021-09-01</td>
                    <td className='border border-zinc-300 px-6 py-4 text-left'>Dinner</td>
                    <td className='border border-zinc-300 px-6 py-4 text-right'>1000</td>
                    <td className='border border-zinc-300 px-6 py-4 text-left'>Expense</td>
                    <td className='border border-zinc-300 px-6 py-4 text-left'>Restaurants</td>
                </tr>
                <tr className='hover:bg-white'>
                    <td className='border border-zinc-300 px-6 py-4 text-left'>2021-09-02</td>
                    <td className='border border-zinc-300 px-6 py-4 text-left'>Groceries</td>
                    <td className='border border-zinc-300 px-6 py-4 text-right'>400</td>
                    <td className='border border-zinc-300 px-6 py-4 text-left'>Expense</td>
                    <td className='border border-zinc-300 px-6 py-4 text-left'>Groceries</td>
                </tr>
                <tr className='hover:bg-white'>
                    <td className='border border-zinc-300 px-6 py-4 text-left'>2021-09-03</td>
                    <td className='border border-zinc-300 px-6 py-4 text-left'>Shirt</td>
                    <td className='border border-zinc-300 px-6 py-4 text-right'>600</td>
                    <td className='border border-zinc-300 px-6 py-4 text-left'>Expense</td>
                    <td className='border border-zinc-300 px-6 py-4 text-left'>Clothing</td>
                </tr>
            </tbody>
        </table>
    )
}
