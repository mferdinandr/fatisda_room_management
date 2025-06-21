import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import Profile from './Profile';

const Navbar = () => {
    const { auth } = usePage<SharedData>().props;

    return (
        <header className="from-secondary/20 to-background/30 fixed -top-3 z-50 mb-6 w-full bg-white px-6 pt-6 text-sm">
            <nav className="bg-background flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-2 shadow-lg backdrop-blur-sm">
                {/* Logo Section */}
                <Link href="/" className="flex items-center space-x-3 transition-opacity hover:opacity-80">
                    <img src="/image/logo.png" alt="Room Management Logo" width={60} />
                </Link>

                {/* Right Section */}
                {auth.user ? (
                    <Profile email={auth.user.email} name={auth.user.name} role={String(auth.user.role)} />
                ) : (
                    <Link
                        href={route('login')}
                        className="inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 ease-in-out hover:scale-105 hover:bg-blue-700"
                    >
                        Log in
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
