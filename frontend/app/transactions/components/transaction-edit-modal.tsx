import { Transaction } from '@/app/types';
import { ModalHeader, ModalBody } from '@nextui-org/react'
import React from 'react'
import TransactionFormModal from './transaction-form-modal';

export default function TransactionEditModal({
    transaction,
    setEditMode,
    onOpenChange
}: {
    transaction: Transaction;
    setEditMode: (editMode: boolean) => void;
    onOpenChange: () => void;
}) {
    return (
        <>
            <ModalHeader>
                <p className='text-2xl'>
                    Edit Transaction
                </p>
            </ModalHeader>
            <ModalBody className='mb-2'>
                <TransactionFormModal transaction={transaction} setEditMode={setEditMode} onOpenChange={onOpenChange} />
            </ModalBody>
        </>
    )
}
