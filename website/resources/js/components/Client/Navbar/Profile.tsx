import { router } from '@inertiajs/react';
import { EllipsisVertical, User } from 'lucide-react';

type IProfileProps = {
    name: string;
    email: string;
};

const Profile = ({ name, email }: IProfileProps) => {
    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="bg-on-background flex items-center gap-2 rounded-3xl px-3 py-1.5 sm:gap-5 sm:rounded-4xl sm:px-4">
            <User />
            <div className="flex flex-col leading-4.5">
                <p>{name}</p>
                <p className="font-light">{email}</p>
            </div>

            {/* Wrapper for icon and menu */}
            <div className="group relative">
                <EllipsisVertical className="cursor-pointer" />

                {/* Menu: muncul saat hover, tanpa celah */}
                <div className="absolute top-full right-0 hidden pt-4 group-hover:flex">
                    <div className="shadow-background w-32 flex-col rounded-lg bg-white py-2 shadow-lg">
                        <button className="w-full cursor-pointer px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">History</button>
                        <button className="w-full cursor-pointer px-4 py-2 text-left text-sm text-red-600 hover:bg-red-100" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
