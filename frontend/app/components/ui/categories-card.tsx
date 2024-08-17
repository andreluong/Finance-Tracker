import StatCard from '@/app/components/ui/stat-card'
import { CategoryStat } from '@/app/types'
import { Tooltip } from '@nextui-org/react'

export default function CategoriesCard({
    title,
    categories,
    columns = 3
}: {
    title: string,
    categories: CategoryStat[],
    columns?: number
}) {
    const trunacteTitle = (title: string) => {
        return title.length > 15 && columns === 3 
            ? `${title.substring(0, 12)}...` 
            : title
    }

    return (
        <div className="bg-white border border-zinc-200 rounded-lg p-4 w-full">
            <p className="text-2xl pb-4">{title}</p>
            <div className={`grid grid-cols-${columns} gap-4`}>
                {categories.map((category: CategoryStat, index) => (
                    <Tooltip
                        content={category.name}
                        placement="bottom"
                        size='lg'
                        shadow='sm'
                    >
                        <div
                            key={index}
                            className="rounded-lg p-4 w-full"
                            style={{ backgroundColor: category.colour }}
                        >
                            
                            <StatCard
                                    item={{
                                        icon: category.icon || "carbon:unknown",
                                        title: `${trunacteTitle(category.name)} (${category.count})`,
                                        amount: category.total
                                    }}
                                />
                        </div>
                    </Tooltip>

                ))}
            </div>
        </div>
    )
}
