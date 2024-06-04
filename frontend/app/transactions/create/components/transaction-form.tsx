import { fetcher } from "@/app/lib/utils";
import { Category } from "@/app/types";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import React from "react";
import { FieldValues, useForm, Controller } from "react-hook-form";
import useSWR, { useSWRConfig } from "swr";
import {
    Input,
    DatePicker,
    Select,
    SelectItem,
    Textarea,
    Button,
} from "@nextui-org/react";
import Loader from "@/app/components/loader";

export default function TransactionForm() {
    const { getToken } = useAuth();
    const { mutate } = useSWRConfig();

    const {
        control,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            name: "",
            amount: "",
            date: undefined,
            type: "",
            category: "",
            description: "",
        },
    });
    const watchType = watch("type");

    const {
        data: categories,
        error,
        isLoading,
    } = useSWR(`http://localhost:8080/api/categories`, fetcher);

    const filterCategoriesByType = () => {
        let x = categories.filter(
            (category: Category) => category.type === watchType
        );
        return x;
    };

    const onSubmit = async (data: FieldValues) => {
        const token = await getToken();

        // Convert CalendarDate to Date
        const { year, month, day } = data.date;
        data.date = new Date(year, month - 1, day);

        await axios
            .post(
                "http://localhost:8080/api/transactions/create",
                { ...data },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => console.error(error));

        reset();

        // Refresh the recent transactions
        mutate("http://localhost:8080/api/transactions/recent");
    };

    if (error) throw error;
    if (isLoading) return <Loader />;

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col flex-grow justify-center border border-zinc-200 rounded-lg bg-white p-4 space-y-4"
        >
            <div>
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
            </div>
            <div className="flex">
                <div className="w-2/3 pr-4">
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
                                className="w-full"
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
                </div>
                <div className="w-1/3">
                    <Controller
                        name="date"
                        control={control}
                        rules={{ required: "Date is required" }}
                        render={({ field }) => (
                            <DatePicker
                                {...field}
                                label="Date"
                                className="w-full"
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
                </div>
            </div>
            <div className="flex">
                <div className="w-1/3 pr-4">
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                label="Type"
                                id="type"
                                className="w-full"
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
                </div>
                <div className="w-1/3 pr-4">
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                label="Category"
                                id="category"
                                className="w-full"
                                variant="faded"
                                isRequired
                            >
                                {filterCategoriesByType().map(
                                    (category: Category) => (
                                        <SelectItem
                                            value={category.id}
                                            key={category.id}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    )
                                )}
                            </Select>
                        )}
                    />
                </div>
            </div>
            <div>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            {...field}
                            label="Description"
                            id="description"
                            className="w-full"
                            variant="faded"
                            maxRows={5}
                        />
                    )}
                />
            </div>
            <div>
                <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="bg-emerald-100 font-bold py-2 px-4 hover:bg-emerald-400"
                >
                    Submit
                </Button>
            </div>
        </form>
    );
}
