export type SideNavItem = {
    title: string;
    path: string;
    icon?: JSX.Element;
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
    icon?: string;
    colour: string;
    type?: string;
}

export type FinancialType = {
    title: string;
    value: string;
    icon: JSX.Element;
    iconName: string;
    colour: string;
}

export type KeyValueProp<T, U> = {
    label: T;
    value: U;
};

export type MonthlyTransactionsProp = {
    month: number;
    year: number;
    total_amount: number;
    type: string;
}

/* Budget */

export type CategoryTotalProps = {
    id: string;
    name: string;
    total: string;
    type: string;
};

export type BudgetTargetProps = {
    category_id: string | number;
    category_name: string;
    category_type: string;
    target: string | number;
};