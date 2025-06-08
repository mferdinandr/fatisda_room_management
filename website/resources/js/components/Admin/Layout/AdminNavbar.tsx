import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Building2, LogOut } from 'lucide-react';

interface AdminNavbarProps {
    userName?: string;
}

export default function AdminNavbar({ userName = 'Admin' }: AdminNavbarProps) {
    return (
        <nav className="bg-background text-on-background text-primary-foreground fixed right-0 left-0 shadow-lg">
            <div className="flex flex-col justify-between px-10">
                <div className="flex items-center justify-between py-4">
                    <div className="flex items-center space-x-4">
                        <Building2 className="h-6 w-6" />
                        <h1 className="text-xl font-bold">FATISDA Admin</h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-sm">Hello, {userName}</span>
                        <Button asChild variant="destructive" size="sm">
                            <Link href="/logout" method="post">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
