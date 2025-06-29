import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Building2, LogOut, Menu, X } from 'lucide-react';

interface AdminNavbarProps {
    userName?: string;
    onMenuClick: () => void;
    sidebarOpen: boolean;
}

export default function AdminNavbar({ userName = 'Admin', onMenuClick, sidebarOpen }: AdminNavbarProps) {
    return (
        <nav className="bg-background text-on-background text-primary-foreground fixed right-0 left-0 z-50 shadow-lg">
            <div className="flex items-center justify-between px-4 py-4 md:px-10">
                {/* Left side - Menu button + Logo */}
                <div className="flex items-center space-x-4">
                    {/* Mobile menu button */}
                    <Button variant="ghost" size="sm" className="md:hidden" onClick={onMenuClick}>
                        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>

                    {/* Logo */}
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <Building2 className="h-5 w-5 md:h-6 md:w-6" />
                        <h1 className="text-lg font-bold md:text-xl">
                            <span className="hidden sm:inline">FATISDA Admin</span>
                            <span className="sm:hidden">Admin</span>
                        </h1>
                    </div>
                </div>

                {/* Right side - User info + Logout */}
                <div className="flex items-center space-x-2 md:space-x-4">
                    <span className="hidden text-xs sm:inline md:text-sm">Hello, {userName}</span>
                    <span className="text-xs sm:hidden md:text-sm">{userName}</span>

                    <Button asChild variant="destructive" size="sm" className="text-xs md:text-sm">
                        <Link href="/logout" method="post">
                            <LogOut className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" />
                            <span className="hidden sm:inline">Logout</span>
                            <span className="sm:hidden">Exit</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </nav>
    );
}
