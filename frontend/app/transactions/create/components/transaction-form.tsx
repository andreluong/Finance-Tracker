import { fetcher } from "@/app/lib/utils";
import { Category } from "@/app/types";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import useSWR from "swr";

export default function TransactionForm() {
    const { getToken } = useAuth();

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            name: "",
            amount: "",
            date: "",
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
        console.log(data);

        await axios
            .post(
                "http://localhost:8080/api/transactions/create",
                { ...data },
                { headers: { Authorization: "Bearer " + token } }
            )
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => console.error(error));

        reset();
    };

    return (
        <div className="flex flex-col items-center justify-center">
            {isLoading && <p>Loading...</p>}
            {error && <p>Error</p>}
            {categories && (
                <form onSubmit={handleSubmit(onSubmit)} className="w-3/4">
                    <div className="mt-4">
                        <label htmlFor="name" className="block">
                            Name
                        </label>
                        <input
                            {...register("name", {
                                required: "Name is required",
                            })}
                            placeholder="Name"
                            type="text"
                            id="name"
                            className="w-full border border-gray-200 rounded p-2"
                        />
                        {errors.name && (
                            <p className="text-red-500">
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    <div className="flex mt-4">
                        <div className="w-2/3 pr-4">
                            <label htmlFor="amount" className="block">
                                Amount
                            </label>
                            <input
                                {...register("amount", {
                                    required: "Amount is required",
                                    valueAsNumber: true,
                                    min: {
                                        value: 0.01,
                                        message:
                                            "Amount must be greater than 0",
                                    },
                                })}
                                placeholder="Amount"
                                type="number"
                                id="amount"
                                step={0.01}
                                className="w-full border border-gray-200 rounded p-2"
                            />
                            {errors.amount && (
                                <p className="text-red-500">
                                    {errors.amount.message}
                                </p>
                            )}
                        </div>
                        <div className="w-1/3">
                            <label htmlFor="date" className="block">
                                Date
                            </label>
                            <input
                                {...register("date", {
                                    required: "Date is required",
                                })}
                                type="date"
                                id="date"
                                className="w-full border border-gray-200 rounded p-2"
                            />
                            {errors.date && (
                                <p className="text-red-500">
                                    {errors.date.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex mt-4">
                        <div className="w-1/3 pr-4">
                            <label htmlFor="type" className="block">
                                Type
                            </label>
                            <select
                                {...register("type", {
                                    required: "Type is required",
                                })}
                                id="type"
                                className="w-full border border-gray-200 bg-white rounded p-2"
                            >
                                <option value="income" className="font-sans">
                                    Income
                                </option>
                                <option value="expense" className="font-sans">
                                    Expense
                                </option>
                            </select>
                            {errors.type && (
                                <p className="text-red-500">
                                    {errors.type.message}
                                </p>
                            )}
                        </div>
                        <div className="w-1/3 pr-4">
                            <label htmlFor="category" className="block">
                                Category
                            </label>
                            <select
                                {...register("category", {
                                    required: "Category is required",
                                })}
                                id="category"
                                className="w-full border border-gray-200 bg-white rounded p-2"
                            >
                                {filterCategoriesByType().map(
                                    (category: Category) => (
                                        <option
                                            key={category.id}
                                            value={category.value}
                                            className="font-sans"
                                        >
                                            {category.name}
                                        </option>
                                    )
                                )}
                            </select>
                            {errors.category && (
                                <p className="text-red-500">
                                    {errors.category.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="description" className="block">
                            Description
                        </label>
                        <textarea
                            {...register("description")}
                            placeholder="Description"
                            id="description"
                            className="w-full border border-gray-200 rounded p-2"
                            rows={4}
                        />
                    </div>
                    <div className="my-8">
                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="bg-emerald-100 text-black font-bold py-2 px-4 rounded hover:bg-emerald-400"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
