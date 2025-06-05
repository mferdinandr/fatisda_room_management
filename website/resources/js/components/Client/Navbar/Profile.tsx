import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { EllipsisVertical, User } from 'lucide-react';
import { useState } from 'react';

type IProfileProps = {
    name: string;
    email: string;
};

const Profile = ({ name, email }: IProfileProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogout = () => {
        // Tampilkan modal konfirmasi logout
        setIsModalOpen(true);
    };

    const confirmLogout = () => {
        // Proses logout setelah konfirmasi
        router.post('/logout');
    };

    const cancelLogout = () => {
        // Menutup modal tanpa logout
        setIsModalOpen(false);
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

            {isModalOpen && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="w-2/3 max-w-96 rounded-lg bg-white p-6 shadow-lg">
                        <h3 className="font-sans text-2xl font-bold">Are you sure?</h3>
                        <p className="my-2 text-sm">Do you want logout?</p>
                        <div className="mt-5 flex justify-end gap-4">
                            <Button onClick={cancelLogout} className="rounded-md border px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
                                Cancel
                            </Button>
                            <Button onClick={confirmLogout} variant={'destructive'}>
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
