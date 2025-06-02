import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import Profile from './Profile';

const Navbar = () => {
    const { auth } = usePage<SharedData>().props;

    console.log('asdasdad', auth.user);
    return (
        <header className="mb-6 w-full text-sm">
            <nav className="bg-background flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-2">
                <img src="/image/logo.png" alt="Room Management Logo" width={60} />
                {auth.user ? (
                    <Profile email={auth.user.email} name={auth.user.name} />
                ) : (
                    <Link
                        href={route('login')}
                        className="bg-on-background inline-block rounded-2xl px-3 py-1.5 text-sm leading-normal transition ease-in hover:scale-105 md:px-5"
                    >
                        Log in
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
