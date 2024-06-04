import { Icon } from '@iconify/react';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
    {
        title: 'Overview',
        path: '/overview',
        icon: <Icon icon="lucide:home" width="24" height="24" />,
    },
    {
        title: 'Transactions',
        path: '/transactions',
        icon: <Icon icon="lucide:credit-card" width="24" height="24" />,
        submenu: false
    },
    {
        title: 'Create',
        path: '/transactions/create',
        icon: <Icon icon="lucide:circle-plus" width="24" height="24" />,
        submenu: false
    },
    {
        title: 'Analytics',
        path: '/analytics',
        icon: <Icon icon="lucide:line-chart" width="24" height="24" />,
        submenu: false
    },
    {
        title: 'Categories',
        path: '/categories',
        icon: <Icon icon="lucide:tag" width="24" height="24" />,
        submenu: false
    },
    {
        title: 'Settings',
        path: '/settings',
        icon: <Icon icon="lucide:settings" width="24" height="24" />,
        submenu: false
    }
];

export const INCOME = {
    title: 'Income',
    value: 'income',
    icon: <Icon icon="bx:bxs-dollar-circle" width="24" height="24" color='green' />,
    colour: '#00e396',
};

export const EXPENSES = {
    title: 'Expenses',
    value: 'expenses',
    icon: <Icon icon="bx:bxs-credit-card" width="24" height="24" color='red' />,
    colour: '#ff4560',
};