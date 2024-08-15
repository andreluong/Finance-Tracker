import { Icon } from '@iconify/react';
import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
    {
        title: 'Overview',
        path: '/overview',
        icon: <Icon icon="lucide:home" width="24" height="24" />
    },
    {
        title: 'Transactions',
        path: '/transactions',
        icon: <Icon icon="lucide:credit-card" width="24" height="24" />
    },
    {
        title: 'Create',
        path: '/transactions/create',
        icon: <Icon icon="lucide:circle-plus" width="24" height="24" />
    },
    {
        title: 'Statistics',
        path: '/statistics',
        icon: <Icon icon="lucide:bar-chart-3" width="24" height="24" />
    }
];

export const INCOME = {
    title: 'Income',
    value: 'income',
    icon: <Icon icon="bx:dollar-circle" width="28" height="28" color='green' />,
    iconName: 'bx:dollar-circle',
    colour: '#00e396',
};

export const EXPENSES = {
    title: 'Expenses',
    value: 'expenses',
    icon: <Icon icon="bx:credit-card" width="28" height="28" color='red' />,
    iconName: 'bx:credit-card',
    colour: '#ff4560',
};

export const EXPENSE = {
    title: 'Expense',
    value: 'expense',
    icon: <Icon icon="bx:credit-card" width="28" height="28" color='red' />,
    iconName: 'bx:credit-card',
    colour: '#ff4560',
};

export const NET_INCOME = {
    title: 'Net Income',
    value: 'netIncome',
    icon: <Icon icon="mdi:chart-line" width="28" height="28" color='blue' />,
    iconName: 'mdi:chart-line',
    colour: '#536dfe',
};

export const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

export const MONTHS_SHORT = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];
