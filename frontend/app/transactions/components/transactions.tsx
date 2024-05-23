import React from 'react'
import TransactionBody from './transaction-body';
import { Transaction } from '@/app/types';

export default function Transactions({transactions}: {transactions: Transaction[]}){
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
            <TransactionBody transactions={transactions} />
        </table>
    )
}
