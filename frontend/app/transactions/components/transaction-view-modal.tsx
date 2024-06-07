import { INCOME, EXPENSES } from '@/app/constants'
import { Button, Divider, ModalBody, ModalFooter, ModalHeader, Textarea } from '@nextui-org/react'
import CategoryChip from './category-chip'
import { Transaction } from '@/app/types';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { mutate } from 'swr';
import { useTransactionURL } from '@/app/lib/transction-url-context';

export default function TransactionViewModal({
    transaction,
    confirmDelete,
    setConfirmDelete,
    setEditMode,
    onOpenChange,
}: {
    transaction: Transaction;
    confirmDelete: boolean;
    setConfirmDelete: (value: boolean) => void;
    setEditMode: (value: boolean) => void;
    onOpenChange: () => void;
}) {
    const { getToken } = useAuth();
    const { URL } = useTransactionURL();
    
    const handleDelete = async () => {
        if (confirmDelete) {
            const token = await getToken();

            await axios
                .delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/${transaction.id}`,
                    { headers: { Authorization: `Bearer ${token}` }}
                )
                .then((res) => console.log(res.data))
                .catch((err) => console.log(err));

            mutate(URL);
            onOpenChange();
        }
    };

    return (
        <>
            <ModalHeader>
                <p className='text-2xl'>
                    {transaction.name}
                </p>
            </ModalHeader>
            <ModalBody className='mb-4'>
                <Divider />
                <div className='flex justify-between text-small'>
                    <div className='flex flex-row gap-1'>
                        <div className='my-auto'>
                            {transaction.type === "income" ? INCOME.icon : EXPENSES.icon}
                        </div>
                        <CategoryChip category={transaction.category} />
                    </div>
                    <Divider orientation="vertical" />
                    <div className='my-auto'>
                        <>Created:</> {new Date(transaction.created_at).toLocaleDateString("en-US")}
                    </div>
                </div>
                <Divider />
                <p>
                    <strong>Transaction Date:</strong> {new Date(transaction.date).toLocaleDateString("en-US")}
                </p>
                <p>
                    <strong>Amount:</strong> ${transaction.amount}
                </p>
                <div>
                    <strong>Description:</strong>
                    <Textarea
                        value={transaction.description}
                        isReadOnly
                        variant="faded"
                        minRows={5}
                    />
                </div>
            </ModalBody>
            <ModalFooter>
                <div className='flex flex-row items-center justify-start gap-2'>
                    {confirmDelete && (
                        <>
                            <p className='text-red-500 flex-shrink-0 mr-2'>
                                Confirm delete?
                            </p>
                            <Button
                                className='bg-red-400 font-sans font-bold hover:bg-red-300'
                                onPress={handleDelete}
                            >
                                Delete
                            </Button>
                            <Button 
                                className='font-sans font-bold'
                                onPress={() => setConfirmDelete(false)}
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                    {!confirmDelete && (
                        <>
                            <Button
                                className='bg-red-400 font-sans font-bold hover:bg-red-300'
                                onPress={() => setConfirmDelete(true)}
                            >
                                Delete
                            </Button>
                            <Button 
                                className='bg-emerald-400 font-sans font-bold hover:bg-emerald-300'
                                onPress={() => setEditMode(true)}
                            >
                                Edit
                            </Button>
                        </>
                    )}
                </div>
            </ModalFooter>
        </>
    )
}
