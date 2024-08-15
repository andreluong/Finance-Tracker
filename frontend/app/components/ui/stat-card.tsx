import { Icon } from "@iconify/react/dist/iconify.js"

type StatCardItem = {
    title: string,
    amount: string | number,
    icon: string,
}

export default function StatCard({
    item,
    fontSize = ["text-lg", "text-2xl"],
}: {
    item: StatCardItem,
    fontSize?: string[]
}) {
    return (
        <div className="flex flex-row space-x-4">
            <div className="my-auto">
                <Icon icon={item?.icon} width="3rem" height="3rem" />
            </div>
            <div>
                <p className={`${fontSize[0]} pb-2`}>{item.title}</p>
                <p className={`${fontSize[1]} font-bold`}>{item.amount}</p>
            </div>
        </div>
    )
}
