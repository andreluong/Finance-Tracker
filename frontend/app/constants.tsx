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
            { title: 'All', path: '/transactions/all' },
            { title: 'Income', path: '/transactions/income' },
            { title: 'Expenses', path: '/transactions/expenses' },
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