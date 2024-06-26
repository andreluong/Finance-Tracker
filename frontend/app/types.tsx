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
    category: Category;
    date: string;
    user_id: string;
};

export type Category = {
    id: number;
    name: string;
    value: string;
    icon?: string;
    colour: string;
    type: string;
}

export type CategoryStat = {
    name: string;
    count: string;
    total: string;
    percentage?: string;
    colour: string;
    type: string;
}

export type KeyValueProp<T, U> = {
    label: T;
    value: U;
};