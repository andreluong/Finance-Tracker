import { Category } from '@/app/types'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Chip } from '@nextui-org/react'
import React from 'react'

export default function CategoryChip({ category }: { category: Category }) {
    return (
        <Chip
            startContent={
                <Icon
                    icon={category.icon || ''}
                    fontSize={'1.25rem'}
                    className='ml-1'
                />
            }
            style={{
                backgroundColor: category.colour,
            }}
        >
            {category.name}
        </Chip>
    )
}
