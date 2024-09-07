import { useAuth } from "@clerk/nextjs";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { UseFormReturn, FieldValues, useFormContext } from "react-hook-form";
import { mutate } from "swr";

// CardHeader component to display the budget type and edit button
export default function CardHeader({ 
    type,
    editMode,
    setEditMode,
    methods,
    month,
    year
 }: { 
    type: string;
    editMode: boolean;
    setEditMode: (editMode: boolean) => void;
    methods: UseFormReturn<FieldValues, any, undefined>;
    month: number;
    year: string;
 }) {
    const { getToken } = useAuth();
    const { 
        formState: {
            isSubmitting, 
            isValid, 
            isDirty
        } 
    } = useFormContext();

    const onSubmit = async (data: FieldValues) => {
        const token = await getToken();
        
        await axios
            .post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/budget/modify?month=${month}&year=${year}`,
                { ...data },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((response) => console.log(response.data))
            .catch((error) => console.error(error.message));

        mutate(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/budget/data?month=${month}&year=${year}`);
    };

    return (
        <div className="flex justify-between mb-2">
            <h2 className="font-bold text-2xl">{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
            <div className="space-x-2">
                <Button 
                    isIconOnly 
                    variant="light"
                    size="sm"
                    onPress={() => setEditMode(!editMode)}
                >
                    {editMode 
                        ? <Icon icon="lucide:x" width="2rem" height="2rem" color="red" />
                        : <Icon icon="lucide:edit" width="2rem" height="2rem" color="black" />    
                    }
                </Button>
                {editMode && (
                    <Button
                        isIconOnly 
                        variant="light"
                        size="sm"
                        onClick={() => {
                            setEditMode(false)
                            methods.handleSubmit(onSubmit)()
                        }}
                        disabled={isSubmitting || !isValid || !isDirty}
                    >
                        {isSubmitting ? (
                            <Icon icon="lucide:loader" width="2rem" height="2rem" color="black" />
                        ): (
                            <Icon icon="lucide:check" width="2rem" height="2rem" color="green" />
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
};
