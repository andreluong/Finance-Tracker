import { Transaction } from '@/app/types';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from '@nextui-org/react';
import React, { useEffect, useState } from 'react'
import CategoryChip from './category-chip';
import { EXPENSES, INCOME } from '@/app/constants';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';

export default function TransactionModal({
    transaction,
    isOpen,
    onOpenChange,
}: {
    transaction: Transaction | undefined;
    isOpen: boolean;
    onOpenChange: () => void;
}) {
    const { getToken } = useAuth();
    const [confirmDelete, setConfirmDelete] = useState(false);

    if (!transaction) return null;

    const handleDelete = async () => {
        if (confirmDelete) {
            const token = await getToken();

            // Delete transaction
            console.log("Deleting transaction");

            await axios
                .delete(`http://localhost:8080/api/transactions/${transaction.id}`,
                    { headers: { Authorization: `Bearer ${token}` }}
                )
                .then((res) => console.log(res.data))
                .catch((err) => console.log(err));

            // Close modal
            setConfirmDelete(false);
            onOpenChange();
        }
    };

    const handleEdit = () => {
        // Edit transaction
        console.log("Edit transaction");

        // move to next page in modal
    };

    useEffect(() => {
        if (!isOpen) {
            setConfirmDelete(false);
        }
    }, [isOpen])

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            <p className='text-2xl'>
                                {transaction.name}
                            </p>
                        </ModalHeader>
                        <ModalBody className='mb-4'>
                            <p>
                                <strong>Created on:</strong> {new Date(transaction.created_at).toLocaleDateString("en-US")}
                            </p>
                            <p>
                                <strong>Transaction Date:</strong> {new Date(transaction.date).toLocaleDateString("en-US")}
                            </p>
                            <p>
                                <strong>Amount:</strong> ${transaction.amount}
                            </p>
                            <p className='flex items-center'>
                                <strong>Type:</strong>
                                <span className="ml-1">{transaction.type}</span>
                                <span className="flex items-center ml-1">
                                    {transaction.type === "income" ? INCOME.icon : EXPENSES.icon}
                                </span>
                            </p>
                            <div>
                                <strong>Category:</strong> <CategoryChip category={transaction.category} />
                            </div>
                            <div>
                                <strong>Description:</strong>
                                <br />
                                <Textarea
                                    value={transaction.description}
                                    isReadOnly
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
                                            onPress={handleEdit}
                                        >
                                            Edit
                                        </Button>
                                    </>
                                )}
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
