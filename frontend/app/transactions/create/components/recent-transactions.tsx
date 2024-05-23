import React, { useEffect, useState } from 'react'
import axios from 'axios';
import TransactionBody from '../../components/transaction-body';

export default function RecentTransactions({user_id}: {user_id: string}) {
    const [recentTransactions, setRecentTransactions] = useState([]);

    const getRecentTransactions = async () => {
        await axios.get(`http://localhost:8080/api/transactions/recent/${user_id}`)
            .then(response => {
                setRecentTransactions(response.data);
            })
            .catch(error => {
                console.error("Error fetching recent transactions: ", error.message);
            });
    };

    useEffect(() => {
        getRecentTransactions();
    }, []);

    return (
        <div>
            <h2 className='font-bold text-2xl pb-4'>Recent</h2>
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
                <TransactionBody transactions={recentTransactions} />
            </table>
        </div>
    )
}
