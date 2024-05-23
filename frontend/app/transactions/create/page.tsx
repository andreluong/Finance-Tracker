'use client';

import { FormEvent, useState } from 'react'
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import RecentTransactions from './components/recent-transactions';
import CategorySelection from './components/category-selection';

export default function CreateTransaction() {
    const [selectedCategory, setSelectedCategory] = useState('' as string);
    const { isLoaded, isSignedIn, user } = useUser();

    function handleCategoryChange(category: string) {
        setSelectedCategory(category);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const name = formData.get('name');
        const amount = formData.get('amount');
        const description = formData.get('description');
        const type = formData.get('type');
        const category = selectedCategory;
        const date = formData.get('date');
        const user_id = user?.id;

        await axios.post('http://localhost:8080/api/transactions/create', {
            name,
            amount,
            description,
            type,
            category,
            date,
            user_id
        }).then(response => {
            console.log(response.data);
        }).catch(error => console.error(error));
    }

    if (!isLoaded || !isSignedIn) {
        return null;
    }

    return (
        <div>
            <h1 className='font-bold text-3xl pb-4'>Transaction</h1>

            <div className='flex flex-col items-center justify-center'>
                <form onSubmit={handleSubmit} className='w-3/4'>
                    <div className='mt-4'>
                        <label htmlFor='name' className='block'>Name</label>
                        <input type='text' name='name' id='name' className='w-full border border-gray-200 rounded p-2' placeholder='Name' />
                    </div>

                    <div className='flex mt-4'>
                        <div className='w-2/3 pr-4'>
                            <label htmlFor='amount' className='block'>Amount</label>
                            <input type='number' name='amount' id='amount' className='w-full border border-gray-200 rounded p-2' placeholder='Amount' step={.01} />
                        </div>

                        <div className='w-1/3'>
                            <label htmlFor='date' className='block'>Date</label>
                            <input type='date' name='date' id='date' className='w-full border border-gray-200 rounded p-2' />
                        </div>
                    </div>

                    <div className='flex mt-4'>
                        <div className='w-1/3 pr-4'>
                            <label htmlFor='type' className='block'>Type</label>
                            <select name='type' id='type' className='w-full border border-gray-200 bg-white rounded p-2'>
                                <option value='income' className='font-sans'>Income</option>
                                <option value='expense' className='font-sans'>Expense</option>
                            </select>
                        </div>

                        <div className='w-1/3 pr-4'>
                            <label htmlFor='category' className='block'>Category</label>
                            <CategorySelection onCategoryChange={handleCategoryChange} />
                        </div>                       
                    </div>

                    <div className='mt-4'>
                        <label htmlFor='description' className='block'>Description</label>
                        <textarea name='description' id='description' className='w-full border border-gray-200 rounded p-2' placeholder='Description' rows={4} />
                    </div>
                    
                    <div className='my-8'>
                        <button type='submit' className='bg-emerald-100 text-black font-bold py-2 px-4 rounded hover:bg-emerald-400'>Submit</button>
                    </div>
                </form>          
            </div>
            
            <RecentTransactions user_id={user.id} />
        </div>
    )
}
