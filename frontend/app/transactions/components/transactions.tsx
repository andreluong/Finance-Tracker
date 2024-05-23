'use client'

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import TransactionBody from './transaction-body';

export default function Transactions({type, user_id}: {type: string, user_id: string}){
    const [transactions, setTransactions] = useState([]);
    
    const getTransactions = async () => {
        await axios.get(`http://localhost:8080/api/transactions/${type}/${user_id}`)
            .then(response => {
                setTransactions(response.data);
            })
            .catch(error => {
                console.error("Error fetching transactions: ", error.message);
            });
    }

    useEffect(() => {
        getTransactions();
    }, []);
    
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
