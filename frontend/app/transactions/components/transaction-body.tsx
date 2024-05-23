import { Transaction } from '@/app/types'
import React from 'react'

export default function TransactionBody({transactions}: {transactions: Transaction[]}) {
    const rows = transactions.map((transaction: Transaction) => {
        return (
            <tr key={transaction.id} className='hover:bg-white'>
                <td className='border border-zinc-300 px-6 py-4 text-left'>{transaction.date}</td>
                <td className='border border-zinc-300 px-6 py-4 text-left'>{transaction.name}</td>
                <td className='border border-zinc-300 px-6 py-4 text-right'>{transaction.amount}</td>
                <td className='border border-zinc-300 px-6 py-4 text-left'>{transaction.type}</td>
                <td className='border border-zinc-300 px-6 py-4 text-left'>{transaction.category}</td>
            </tr>
        )
    });

    return (
        <tbody>
            {rows}
        </tbody>
    );
}
