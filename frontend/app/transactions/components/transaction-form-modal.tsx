import { Transaction } from '@/app/types';
import { Button, DatePicker, Input, Select, SelectItem, Textarea } from '@nextui-org/react';
import React from 'react'
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { parseAbsoluteToLocal } from "@internationalized/date";
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import CategorySelection from './category-selection';
import { useTransactionURL } from '@/app/lib/transction-url-context';
import { mutate } from 'swr';

export default function TransactionFormModal({
    transaction,
    setEditMode,
    onOpenChange
}: {
    transaction: Transaction;
    setEditMode: (editMode: boolean) => void;
    onOpenChange: () => void;
}) {
    const { getToken } = useAuth();
    const { URL } = useTransactionURL();

    const {
        control,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            name: transaction?.name || "",
            amount: transaction?.amount.toString() || "",
            date: parseAbsoluteToLocal(transaction?.date) || undefined,
            type: transaction?.type || "",
            category: transaction?.category?.id.toString() || "",
            description: transaction?.description || ""
        }
    })
    const watchType = watch("type");
        
    const onSubmit = async (data: FieldValues) => {
        const token = await getToken();
        
        // Convert CalendarDate to Date
        const { year, month, day } = data.date;
        data.date = new Date(year, month - 1, day);

        await axios
            .patch(
                `http://localhost:8080/api/transactions/update/${transaction.id}`,
                { ...data },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((response) => console.log(response.data))
            .catch((error) => console.error(error));

        mutate(URL);
        onOpenChange();
    };

    return (
        <form 
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col space-y-4"
        >
            <Controller 
                name="name"
                control={control}
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                    <Input
                        {...field}
                        label="Name"
                        type="text"
                        id="name"
                        className="w-full"
                        variant="faded"
                        isRequired
                        validate={() => {
                            if (errors.name) {
                                return errors.name.message;
                            }
                        }}
                    />
                )}
            />
            <Controller
                name="amount"
                control={control}
                rules={{
                    required: "Amount is required",
                    min: {
                        value: 0.01,
                        message: "Amount must be greater than 0",
                    },
                }}
                render={({ field }) => (
                    <Input
                        {...field}
                        label="Amount"
                        type="number"
                        id="amount"
                        step={0.01}
                        min={0.01}
                        variant="faded"
                        isRequired
                        validate={() => {
                            if (errors.amount) {
                                return errors.amount.message;
                            }
                        }}
                    />
                )}
            />
            <Controller
                name="date"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                    <DatePicker
                        {...field}
                        granularity='day'
                        label="Date"
                        variant="faded"
                        isRequired
                        validate={() => {
                            if (errors.date) {
                                return errors.date.message;
                            }
                        }}
                    />
                )}
            />
            <div className='flex flex-row gap-4'>
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            selectedKeys={[field.value]}
                            label="Type"
                            id="type"
                            className="w-2/5"
                            variant="faded"
                            isRequired
                        >
                            <SelectItem value="income" key="income">
                                Income
                            </SelectItem>
                            <SelectItem value="expense" key="expense">
                                Expense
                            </SelectItem>
                        </Select>
                    )}
                />
                <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                        <CategorySelection field={field} type={watchType} />
                    )}
                />
            </div>
            <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        label="Description"
                        id="description"
                        variant="faded"
                        maxRows={5}
                    />
                )}
            />
            <div className='flex flex-row justify-end gap-2 pt-5'>
                <Button
                    onClick={() => setEditMode(false)}
                    className="font-sans font-bold"
                >
                    Cancel
                </Button>
                <Button
                    disabled={isSubmitting}
                    type='submit'
                    className="bg-emerald-400 font-sans font-bold hover:bg-emerald-300"
                >
                    Save
                </Button>
            </div>
        </form>
    );
}
