import { Transaction } from '@/app/types';
import { Modal, ModalContent } from '@nextui-org/react';
import React, { useEffect, useState } from 'react'
import TransactionEditModal from './transaction-edit-modal';
import TransactionViewModal from './transaction-view-modal';

export default function TransactionModal({
    transaction,
    isOpen,
    onOpenChange
}: {
    transaction: Transaction | undefined;
    isOpen: boolean;
    onOpenChange: () => void;
}) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setConfirmDelete(false);
            setEditMode(false);
        }
    }, [isOpen])
    
    if (!transaction) return null;

    const transactionHandlers = {
        confirmDelete,
        setConfirmDelete,
        editMode,
        setEditMode,
        onOpenChange
    }

    return (
        <Modal 
            size='xl'
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
        >
            <ModalContent>
                {editMode ? (
                    <TransactionEditModal 
                        transaction={transaction} 
                        {...transactionHandlers}
                    />
                ) : (
                    <TransactionViewModal 
                        transaction={transaction} 
                        {...transactionHandlers}
                    />
                )}
            </ModalContent>
        </Modal>
    );
}
