"use client";

import { SIDENAV_ITEMS } from "../../constants";
import Link from "next/link";
import { SideNavItem } from "../../types";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function Sidenav() {
    return (
        <div className="md:w-72 bg-white h-screen flex-1 fixed border-r border-zinc-200 hidden md:flex">
            <div className="flex flex-col space-y-6 w-full">
                <Link
                    href="/"
                    className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-zinc-200 h-[51px] w-full"
                >
                    <Icon icon="material-symbols:azm-rounded" color='#34d399' fontSize={30} />
                    <span className="font-bold text-xl hidden md:flex">
                        Finance Tracker
                    </span>
                </Link>

                <div className="flex flex-col space-y-2 md:px-6">
                    {SIDENAV_ITEMS.map((item, idx) => {
                        return <MenuItem key={idx} item={item} />;
                    })}
                </div>
            </div>
        </div>
    );
}

const MenuItem = ({ item }: { item: SideNavItem }) => {
    const pathname = usePathname();

    return (
        <div className="">
            <Link
                href={item.path}
                className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-emerald-100 ${
                    item.path === pathname ? "bg-emerald-100" : ""
                }`}
            >
                {item.icon}
                <span className="font-semibold text-xl flex">
                    {item.title}
                </span>
            </Link>
        </div>
    );
};
