// resources/js/Components/Admin/Layout/AdminLayout.tsx

import { Head } from '@inertiajs/react';
import { ReactNode, useState } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
    currentRoute?: string;
    userName?: string;
}

export default function AdminLayout({ children, title = 'Admin Dashboard', currentRoute, userName }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <Head title={title} />

            <div className="min-h-screen bg-gray-50 font-sans">
                <AdminNavbar userName={userName} onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

                <div className="flex pt-14">
                    <AdminSidebar currentRoute={currentRoute} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                    {/* Main content */}
                    <div className="flex-1 p-4 transition-all duration-300 md:ml-0 md:p-8">{children}</div>

                    {/* Mobile overlay */}
                    {sidebarOpen && <div className="bg-opacity-50 fixed inset-0 z-40 bg-black md:hidden" onClick={() => setSidebarOpen(false)} />}
                </div>
            </div>
        </>
    );
}
