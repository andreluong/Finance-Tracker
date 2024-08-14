import { CategoryStat } from '@/app/types'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

export default function CategoriesCard({
    title,
    categories
}: {
    title: string
    categories: CategoryStat[]
}) {
    return (
        <div className="border border-zinc-200 rounded-lg p-4 bg-white">
            <h2 className="font-bold text-2xl pb-4">{title}</h2>

            <div className="grid grid-cols-4 gap-4">
                {categories.map(
                    (category: any) => (
                        <div
                            className="rounded-lg p-4 w-full"
                            style={{ backgroundColor: category.colour }}
                        >
                            <div className="flex flex-row space-x-4">
                                <div className="my-auto">
                                    <Icon icon={category.icon} width="3rem" height="3rem" />
                                </div>
                                <div>
                                    <p className="text-lg pb-2">{category.name} ({category.count})</p>
                                    <p className="text-xl font-bold">${category.total}</p>
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}
