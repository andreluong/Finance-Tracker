import React, { ChangeEvent, FC, useEffect, useState } from 'react'
import axios from 'axios';
import { Category } from '@/app/types';

interface CategorySelectionProps {
    onCategoryChange: (category: string) => void;
}

const CategorySelection: FC<CategorySelectionProps> = ({onCategoryChange}) => {
    const [categories, setCategories] = useState([] as Category[]);

    const getCategories = async () => {
        await axios.get('http://localhost:8080/api/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => console.error(error));
    };

    useEffect(() => {
        getCategories();
    }, [])

    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        onCategoryChange(event.target.value);
    }

    return (
        <select name='category' id='category' className='w-full border border-gray-200 bg-white rounded p-2' onChange={handleSelectChange}>
            {categories.map((category: Category) => (
                <option key={category.id} value={category.value} className='font-sans'>{category.name}</option>
            ))}
        </select>
    )
}

export default CategorySelection;