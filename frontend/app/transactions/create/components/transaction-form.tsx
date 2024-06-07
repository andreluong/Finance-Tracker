import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import React from "react";
import { FieldValues, useForm, Controller } from "react-hook-form";
import { useSWRConfig } from "swr";
import {
    Input,
    DatePicker,
    Select,
    SelectItem,
    Textarea,
    Button,
} from "@nextui-org/react";
import CategorySelection from "../../components/category-selection";
import { useTransactionURL } from "@/app/lib/transction-url-context";

export default function TransactionForm() {
    const { getToken } = useAuth();
    const { mutate } = useSWRConfig();
    const { URL } = useTransactionURL();

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
            date: null,
            type: "",
            category: "",
            description: "",
        },
    });
    const watchType = watch("type");

    const onSubmit = async (data: FieldValues) => {
        const token = await getToken();

        // Convert CalendarDate to Date
        const { year, month, day } = data.date;
        data.date = new Date(year, month - 1, day);

        await axios
            .post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/create`,
                { ...data },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((response) => console.log(response.data))
            .catch((error) => console.error(error));

        reset();
        mutate(URL);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col flex-grow justify-center border border-zinc-200 rounded-lg bg-white p-4 space-y-4"
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
            <div className="flex">
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
                            className="w-2/3 pr-4"
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
                            label="Date"
                            className="w-1/3"
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
            <div className="flex">
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            label="Type"
                            id="type"
                            className="w-1/3 pr-4"
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
                <div className="w-1/3 pr-4">
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <CategorySelection field={field} type={watchType} />
                        )}
                    />
                </div>
            </div>
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
            <div className="flex justify-end">
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
