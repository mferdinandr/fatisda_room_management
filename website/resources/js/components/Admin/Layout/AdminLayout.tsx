// resources/js/Components/Admin/Layout/AdminLayout.tsx

import { Head } from '@inertiajs/react';
import { ReactNode } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
    currentRoute?: string;
    userName?: string;
}

export default function AdminLayout({ children, title = 'Admin Dashboard', currentRoute, userName }: AdminLayoutProps) {
    return (
        <>
            <Head title={title} />

            <div className="min-h-screen bg-gray-50 font-sans">
                <AdminNavbar userName={userName} />

                <div className="flex pt-14">
                    <AdminSidebar currentRoute={currentRoute} />

                    <div className="flex-1 p-8">{children}</div>
                </div>
            </div>
        </>
    );
}
