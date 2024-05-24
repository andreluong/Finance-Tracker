'use client'

import React, { useEffect, useState } from 'react'
import Transactions from '../components/transactions'
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import CategoryStats from '../components/category-stats';

export default function Expenses() {
    const [transactions, setTransactions] = useState([]);
    const { isLoaded, isSignedIn, user } = useUser();

    const getTransactions = async () => {
        await axios.get(`http://localhost:8080/api/transactions/expenses/${user?.id}`)
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

    if (!isLoaded || !isSignedIn) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1 className='font-bold text-3xl pb-4'>Expenses</h1>

            <div className='border border-zinc-300 mb-4'>
                <ul className='flex flex-nowrap'>
                    <li className='pr-8'>
                        <div className='flex flex-nowrap'>
                            <p>Period:&nbsp;</p>
                            <select>
                                <option>All Time</option>
                                <option>This Week</option>
                                <option>Last Month</option>
                                <option>This Year</option>
                            </select>
                        </div>
                    </li>
                    <li className='pr-8'>
                        <div className='flex flex-nowrap'>
                            <p>Category:&nbsp;</p>
                            <select>
                                <option>Restaurants</option>
                                <option>Groceries</option>
                                <option>Miscellaneous</option>
                                <option>Transfers</option>
                                <option>Recreation</option>
                            </select>
                        </div>
                    </li>
                </ul>
            </div>
            <CategoryStats type="expenses" user_id={user.id} />
            <Transactions transactions={transactions} />
        </div>
    )
}
