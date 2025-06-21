import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { ChevronDown, History, LogOut, Settings } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type IProfileProps = {
    name: string;
    email: string;
    role?: string;
};

const Profile = ({ name, email, role = 'user' }: IProfileProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        setIsDropdownOpen(false);
        setIsModalOpen(true);
    };

    const confirmLogout = () => {
        router.post('/logout');
    };

    const cancelLogout = () => {
        setIsModalOpen(false);
    };

    const handleMyBookings = () => {
        setIsDropdownOpen(false);
        router.visit('/my-bookings');
    };

    const handleDashboard = () => {
        setIsDropdownOpen(false);
        if (role === 'admin') {
            router.visit('/admin/dashboard');
        } else {
            router.visit('/dashboard');
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Get initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase())
            .join('')
            .substring(0, 2);
    };

    return (
        <>
            <div className="relative cursor-pointer" ref={dropdownRef}>
                <button
                    onClick={toggleDropdown}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 transition-all duration-200 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none"
                >
                    {/* Avatar */}
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
                        {getInitials(name)}
                    </div>

                    {/* User Info - Hidden on mobile */}
                    <div className="hidden flex-col items-start text-left sm:flex">
                        <p className="text-sm leading-tight font-medium text-gray-900">{name}</p>
                        <p className="text-xs leading-tight text-gray-500">{email}</p>
                    </div>

                    {/* Role Badge - Hidden on mobile */}
                    {role === 'admin' ? (
                        <div className="hidden sm:flex">
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">Admin</span>
                        </div>
                    ) : (
                        <div className="hidden sm:flex">
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-green-600">User</span>
                        </div>
                    )}

                    {/* Dropdown Arrow */}
                    <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''} cursor-pointer`}
                    />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute top-full right-0 z-50 mt-2 w-64 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                        {/* Mobile: Show user info in dropdown */}
                        <div className="border-b border-gray-100 px-4 py-3 sm:hidden">
                            <p className="text-sm font-medium text-gray-900">{name}</p>
                            <p className="text-xs text-gray-500">{email}</p>
                            {role === 'admin' && (
                                <span className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">Admin</span>
                            )}
                        </div>

                        {/* Dashboard */}
                        {role === 'admin' && (
                            <button
                                onClick={handleDashboard}
                                className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                <Settings className="h-4 w-4" />
                                Dashboard
                            </button>
                        )}

                        {/* My Bookings - Only for regular users */}
                        {role !== 'admin' && (
                            <button
                                onClick={handleMyBookings}
                                className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                <History className="h-4 w-4" />
                                My Bookings
                            </button>
                        )}

                        {/* Divider */}
                        <div className="my-1 border-t border-gray-100"></div>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                )}
            </div>

            {/* Logout Confirmation Modal */}
            {isModalOpen && (
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="bg-white px-6 py-7 font-sans sm:max-w-md">
                        <DialogHeader>
                            <div className="text-background flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                    <LogOut className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <DialogTitle>Confirm Logout</DialogTitle>
                                    <DialogDescription>Are you sure you want to logout from your account?</DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <DialogFooter className="mt-3 flex-col gap-2 sm:flex-row">
                            <Button onClick={cancelLogout} variant="outline" className="flex-1">
                                Cancel
                            </Button>
                            <Button onClick={confirmLogout} variant="destructive" className="flex-1">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default Profile;
