import { Category } from '@/app/types'
import { Chip } from '@nextui-org/react'
import React from 'react'

export default function CategoryChip({ category }: { category: Category }) {
    return (
        <Chip
            style={{
                backgroundColor: category.colour,
            }}
        >
            {category.name}
        </Chip>
    )
}
