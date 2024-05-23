'use client'

import React, { useEffect, useState } from 'react'
import Transactions from '../components/transactions'
import { useUser } from '@clerk/nextjs';
import axios from 'axios';

export default function Income() {
    const [transactions, setTransactions] = useState([]);
    const { isLoaded, isSignedIn, user } = useUser();

    if (!isLoaded || !isSignedIn) {
        return <div>Loading...</div>;
    }

    const getTransactions = async () => {
        await axios.get(`http://localhost:8080/api/transactions/income/${user.id}`)
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
        <div>
            <h1 className='font-bold text-3xl pb-4'>Income</h1>

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

            <div className='flex flex-wrap mb-4'>
                <div className='flex items-center justify-center w-1/2'>
                    <img src='/assets/images/graph.png' alt='Graph'/>
                </div>

                <div className='w-1/2'>
                    <div className='flex justify-end'>
                        <table className='table-fixed w-full'>
                            <thead>
                                <tr>
                                    <th className='w-3/6 border border-zinc-300 px-6 py-2 text-left'>Category</th>
                                    <th className='w-2/6 border border-zinc-300 px-6 py-2 text-right'>Total</th>
                                    <th className='w-1/6 border border-zinc-300 px-6 py-2 text-right'>Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='border border-zinc-300 px-6 py-2 text-left'>Restaurants</td>
                                    <td className='border border-zinc-300 px-6 py-2 text-right'>1000</td>
                                    <td className='border border-zinc-300 px-6 py-2 text-right'>50%</td>
                                </tr>
                                <tr>
                                    <td className='border border-zinc-300 px-6 py-2 text-left'>Groceries</td>
                                    <td className='border border-zinc-300 px-6 py-2 text-right'>400</td>
                                    <td className='border border-zinc-300 px-6 py-2 text-right'>10%</td>
                                </tr>
                                <tr>
                                    <td className='border border-zinc-300 px-6 py-2 text-left'>Clothing</td>
                                    <td className='border border-zinc-300 px-6 py-2 text-right'>600</td>
                                    <td className='border border-zinc-300 px-6 py-2 text-right'>20%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Transactions transactions={transactions} />
        </div>
    )
}
