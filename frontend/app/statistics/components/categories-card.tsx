import StatCard from '@/app/components/ui/stat-card'
import { CategoryStat } from '@/app/types'
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
                            <StatCard
                                item={{
                                    icon: category.icon,
                                    title: `${category.name} (${category.count})`,
                                    amount: category.total
                                }}
                                fontSize={["text-lg", "text-xl"]}
                            />
                        </div>
                    )
                )}
            </div>
        </div>
    )
}
