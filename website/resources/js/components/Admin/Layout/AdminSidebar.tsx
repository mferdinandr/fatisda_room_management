import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Building2, Calendar, Clock, Home, LayoutDashboard } from 'lucide-react';

interface SidebarItem {
    href: string;
    label: string;
    icon: React.ReactNode;
    isActive?: boolean;
    isDisabled?: boolean;
    badge?: string;
}

interface AdminSidebarProps {
    currentRoute?: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function AdminSidebar({ currentRoute, isOpen, onClose }: AdminSidebarProps) {
    const sidebarItems: SidebarItem[] = [
        {
            href: '/admin/dashboard',
            label: 'Dashboard',
            icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
            isActive: currentRoute === 'admin.dashboard',
        },
        {
            href: '/admin/rooms',
            label: 'Manage Rooms',
            icon: <Building2 className="mr-2 h-4 w-4" />,
            isActive: currentRoute?.startsWith('admin.rooms'),
        },
        {
            href: '/admin/time-slots',
            label: 'Time Slots',
            icon: <Clock className="mr-2 h-4 w-4" />,
            isActive: currentRoute?.startsWith('admin.time-slots'),
        },
        {
            href: '/admin/bookings',
            label: 'Bookings',
            icon: <Calendar className="mr-2 h-4 w-4" />,
            isActive: currentRoute?.startsWith('admin.bookings'),
        },
    ];

    const handleLinkClick = () => {
        // Close sidebar on mobile when link is clicked
        if (window.innerWidth < 768) {
            onClose();
        }
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden min-h-screen w-64 bg-white shadow-lg md:block">
                <div className="p-4">
                    <nav className="space-y-2">
                        {sidebarItems.map((item, index) => (
                            <div key={index}>
                                {item.isDisabled ? (
                                    <Button variant="ghost" className="w-full cursor-not-allowed justify-start opacity-50" size="sm" disabled>
                                        {item.icon}
                                        {item.label}
                                        {item.badge && (
                                            <Badge variant="secondary" className="ml-auto bg-yellow-200 text-xs text-yellow-800">
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </Button>
                                ) : (
                                    <Button asChild variant={item.isActive ? 'default' : 'ghost'} className="w-full justify-start" size="sm">
                                        <Link href={item.href}>
                                            {item.icon}
                                            {item.label}
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        ))}

                        <hr className="my-4" />

                        <Button asChild variant="secondary" className="w-full justify-start" size="sm">
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                    </nav>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:hidden ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="p-4 pt-20">
                    {' '}
                    {/* Add top padding for navbar */}
                    <nav className="space-y-2">
                        {sidebarItems.map((item, index) => (
                            <div key={index}>
                                {item.isDisabled ? (
                                    <Button variant="ghost" className="w-full cursor-not-allowed justify-start opacity-50" size="sm" disabled>
                                        {item.icon}
                                        {item.label}
                                        {item.badge && (
                                            <Badge variant="secondary" className="ml-auto bg-yellow-200 text-xs text-yellow-800">
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </Button>
                                ) : (
                                    <Button
                                        asChild
                                        variant={item.isActive ? 'default' : 'ghost'}
                                        className="w-full justify-start"
                                        size="sm"
                                        onClick={handleLinkClick}
                                    >
                                        <Link href={item.href}>
                                            {item.icon}
                                            {item.label}
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        ))}

                        <hr className="my-4" />

                        <Button asChild variant="secondary" className="w-full justify-start" size="sm" onClick={handleLinkClick}>
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                    </nav>
                </div>
            </div>
        </>
    );
}
