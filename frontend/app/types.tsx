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
    category: number;
    date: string;
    user_id: string;
};