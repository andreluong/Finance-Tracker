import StatCard from '@/app/components/ui/stat-card'
import { CategoryStat } from '@/app/types'

export default function CategoriesCard({
    title,
    categories,
    columns = 3
}: {
    title: string,
    categories: CategoryStat[],
    columns?: number
}) {
    return (
        <div className="bg-white border border-zinc-200 rounded-lg p-4 w-full">
            <p className="text-2xl pb-4">{title}</p>
            <div className={`grid grid-cols-${columns} gap-4`}>
                {categories.map(
                    (category: CategoryStat) => (
                        <div
                            className="rounded-lg p-4 w-full"
                            style={{ backgroundColor: category.colour }}
                        >
                            <StatCard
                                item={{
                                    icon: category.icon || "carbon:unknown",
                                    title: `${category.name} (${category.count})`,
                                    amount: category.total
                                }}
                            />
                        </div>
                    )
                )}
            </div>
        </div>
    )
}
