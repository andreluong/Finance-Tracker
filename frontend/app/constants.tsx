import { Icon } from '@iconify/react';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <Icon icon="lucide:home" width="24" height="24" />,
    },
    {
        title: 'Transactions',
        path: '/transactions',
        icon: <Icon icon="lucide:credit-card" width="24" height="24" />,
        submenu: true,
        subMenuItems: [
            { title: 'History', path: '/transactions/history' },
            { title: 'Create', path: '/transactions/create' }
        ],
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
    icon: <Icon icon="bx:bxs-dollar-circle" width="24" height="24" />,
    colour: '#00e396',
};

export const EXPENSES = {
    title: 'Expenses',
    value: 'expenses',
    icon: <Icon icon="bx:bxs-credit-card" width="24" height="24" />,
    colour: '#ff4560',
};