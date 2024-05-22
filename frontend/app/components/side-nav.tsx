"use client";

import React, { useState } from "react";
import { SIDENAV_ITEMS } from "../constants";
import Link from "next/link";
import { SideNavItem } from "../types";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

export default function Sidenav() {
    return (
        <div className="md:w-72 bg-white h-screen flex-1 fixed border-r border-zinc-200 hidden md:flex">
            <div className="flex flex-col space-y-6 w-full">
                <Link
                    href="/"
                    className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-zinc-200 h-[51px] w-full"
                >
                    {/* TODO: Logo */}
                    <span className="h-7 w-7 bg-emerald-400 rounded-lg" />
                    <span className="font-bold text-xl hidden md:flex">
                        Finance Tracker
                    </span>
                </Link>

                <div className="flex flex-col space-y-2 md:px-6 ">
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
    const [subMenuOpen, setSubMenuOpen] = useState(false);
    const toggleSubMenu = () => {
        setSubMenuOpen(!subMenuOpen);
    };

    return (
        <div className="">
            {item.submenu ? (
                <>
                    <button
                        onClick={toggleSubMenu}
                        className={`flex flex-row items-center p-2 rounded-lg hover-bg-emerald-100 w-full justify-between hover:bg-emerald-100 ${
                            pathname.includes(item.path) ? "bg-emerald-100" : ""
                        }`}
                    >
                        <div className="flex flex-row space-x-4 items-center">
                            {item.icon}
                            <span className="font-semibold text-xl flex">
                                {item.title}
                            </span>
                        </div>

                        <div
                            className={`${
                                subMenuOpen ? "rotate-180" : ""
                            } flex`}
                        >
                            <Icon
                                icon="lucide:chevron-down"
                                width="24"
                                height="24"
                            />
                        </div>
                    </button>

                    {subMenuOpen && (
                        <div className="my-2 ml-12 flex flex-col space-y-4">
                            {item.subMenuItems?.map((subItem, idx) => {
                                return (
                                    <Link
                                        key={idx}
                                        href={subItem.path}
                                        className={`${
                                            subItem.path === pathname
                                                ? "font-bold hover:underline"
                                                : "hover:underline"
                                        }`}
                                    >
                                        <span>{subItem.title}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </>
            ) : (
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
            )}
        </div>
    );
};
