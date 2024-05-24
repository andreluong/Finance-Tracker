export type SideNavItem = {
    title: string;
    path: string;
    icon?: JSX.Element;
    submenu?: boolean;
    subMenuItems?: SideNavItem[];
};

export type MenuItemWithSubMenuProps = {
    item: SideNavItem;
    onToggle: () => void;
};

export type Transaction = {
    id: number;
    created_at: Date;
    amount: number;
    name: string;
    description: string;
    type: string;
    category: string;
    category_value: string;
    date: string;
    user_id: string;
};

export type Category = {
    id: number;
    name: string;
    value: string;
    icon?: JSX.Element;
}

export type CategoryStat = {
    name: string;
    count: string;
    total: string;
    percentage: string;
}