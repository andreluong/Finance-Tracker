import { sendProcessCSVRequest } from '@/app/lib/api';
import { useTransactionURL } from '@/app/lib/transction-url-context';
import { useAuth } from '@clerk/nextjs';
import { Button, Code } from '@nextui-org/react'
import React from 'react'
import { FieldValues, useForm } from 'react-hook-form';

export default function CSVForm() {
    const { getToken } = useAuth();
    const { URL } = useTransactionURL();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            file: null
        }
    })

    const onSubmit = async (data: FieldValues) => {
        const token = await getToken();
        sendProcessCSVRequest(data.file[0], URL, token);
        reset();
    }

    return (
        <form 
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="w-full flex items-center justify-center bg-white p-4 space-y-8"
        >
            <div className='space-y-8'>
                <p className='font-bold'>Import your transactions from a CSV file</p>
                <div className='flex flex-row gap-8'>
                    <div>
                        <p>Format:</p>
                        <ul className="list-disc ml-4">
                            <li>date (mm/dd/yy)</li>
                            <li>name</li>
                            <li>amount</li>
                            <li>type</li>
                            <li>category</li>
                            <li>description</li>
                        </ul>
                    </div>
                    <div>
                        <p>Example File:</p>
                        <Code className='p-4'>
                            Date,Name,Amount,Type,Category,Description<br />
                            5/12/2024,McDonalds,13.99,expense,Food & Drink,Lunch<br />
                            4/19/2024,Paycheck,1900,income,Payroll,Bi-weekly paycheck<br />
                            11/21/2024,Headphones,129.99,expense,Shopping,New headphones from Amazon<br />
                            8/31/2024,Electric Bill,183.45,expense,Bills & Utilities,BC Hydro electric bill for August<br />
                            6/1/2023,GIC Interest,50,income,Investments & Savings,Interest from GIC account<br />
                        </Code>
                    </div>
                </div>
                <div className='flex flex-col'>
                    <input 
                        {...register("file", { required: "File is required" })}
                        type="file" 
                        name="file"
                        accept=".csv"
                    />
                    {errors.file && (
                        <p className="text-red-500">{errors.file.message}</p>
                    )}
                </div>
                <div className="flex justify-end pt-4">
                    <Button 
                        type="submit" 
                        className="bg-emerald-100 font-bold py-2 px-4 hover:bg-emerald-400"
                    >
                        Upload
                    </Button>
                </div>
            </div>
        </form>
    )
}
