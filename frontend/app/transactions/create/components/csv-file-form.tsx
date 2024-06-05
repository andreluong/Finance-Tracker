import { sendImportTransactionsRequest } from '@/app/lib/api';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@nextui-org/react'
import axios from 'axios';
import React from 'react'
import { FieldValues, useForm } from 'react-hook-form';
import { useSWRConfig } from 'swr';

export default function CSVForm() {
    const { getToken } = useAuth();
    const { mutate } = useSWRConfig();

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
        sendImportTransactionsRequest(data.file[0], "http://localhost:8080/api/transactions/recent", token);
        reset();

        // const formData = new FormData();
        // formData.append('file', data.file[0]);

        // await axios
        //     .post("http://localhost:8080/api/transactions/import", formData, {
        //         headers: {
        //             Authorization: `Bearer ${token}`,
        //             "Content-Type": "multipart/form-data"
        //         },
        //     })
        //     .then((response) => console.log(response.data))
        //     .catch((error) => console.error(error));

        // reset();
        
        // // Refresh the recent transactions
        // mutate("http://localhost:8080/api/transactions/recent");
    }

    return (
        <form 
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="w-full flex flex-col flex-grow justify-center border border-zinc-200 rounded-lg bg-white p-4 space-y-8"
        >
            <p>Import your transactions from a CSV file</p>
            <div>
                <p>Format:</p>
                <ul className="list-disc ml-4">
                    <li>name</li>
                    <li>amount</li>
                    <li>description</li>
                    <li>type</li>
                    <li>category</li>
                    <li>date</li>
                </ul>
            </div>
            <div>
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

            <div className="pt-4">
                <Button type="submit" className="bg-emerald-100 font-bold py-2 px-4 hover:bg-emerald-400">Upload</Button>
            </div>
        </form>
    )
}
