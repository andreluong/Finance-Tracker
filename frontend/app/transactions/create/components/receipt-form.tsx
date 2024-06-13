import { useTransactionURL } from '@/app/lib/transction-url-context';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@nextui-org/react';
import axios from 'axios';
import { FieldValues, useForm } from 'react-hook-form';
import { mutate } from 'swr';

export default function ReceiptForm() {
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

    const parseReceipt = async (imageFile: File) => {
        const token = await getToken();

        const formData = new FormData();
        formData.append('image', imageFile);        

        await axios
            .post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/process/receipt`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            )
            .then((response) => {
                console.log(response.data)

            })
            .catch((error) => console.error(error));
        
        mutate(URL);
    };

    const onSubmit = async (data: FieldValues) => {
        await parseReceipt(data.file[0]);
        reset();
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className='w-full flex flex-col items-center justify-center bg-white p-4 space-y-8'
        >
            <div className='space-y-8'>
                <p className='font-bold'>Upload your Receipt</p>
                <p>Take a picture of your receipt and upload it here. We'll parse the receipt and create a transaction for you.</p>
                <p>Supported formats: JPG, PNG</p>
                <p>Max file size: 5MB</p>
                <div className='flex flex-col'>
                    <input 
                        {...register("file", { required: "File is required" })}
                        type="file" 
                        name="file"
                        accept=".jpg, .jpeg, .png"
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
