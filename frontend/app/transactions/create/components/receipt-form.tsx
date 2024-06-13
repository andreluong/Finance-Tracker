import Loader from '@/app/components/dashboard/loader';
import { sendProcessReceiptRequest } from '@/app/lib/api';
import { useTransactionURL } from '@/app/lib/transction-url-context';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@nextui-org/react';
import { FieldValues, useForm } from 'react-hook-form';

export default function ReceiptForm() {
    const { getToken } = useAuth();
    const { URL } = useTransactionURL();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        defaultValues: {
            file: null
        }
    })

    const onSubmit = async (data: FieldValues) => {
        const token = await getToken();
        sendProcessReceiptRequest(data.file[0], URL, token)
        reset();
    }

    if (isSubmitting) return <Loader />;

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className='w-full flex flex-col items-center justify-center bg-white p-4 space-y-8'
        >
            <div className='space-y-8'>
                <p className='font-bold'>Upload your Receipt</p>
                <p>Take a picture of your receipt and upload it here. We'll process the receipt and create a transaction for you.</p>
                <p>Supported formats: JPG, PNG</p>
                <p>Max file size: 1MB</p>
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
