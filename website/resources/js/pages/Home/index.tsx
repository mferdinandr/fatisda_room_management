import ScheduleTable from '@/components/Client/Home/ScheduleTable/ScheduleTable';
import Navbar from '@/components/Client/Navbar/Navbar';
import Sidebar from '@/components/Client/Sidebar/Sidebar';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Welcome() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    return (
        <div className="flex h-auto min-h-screen flex-col">
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="to-secondary flex min-h-screen w-full flex-col items-center bg-linear-to-br from-white px-3 py-4 text-[#1b1b18] md:px-8 lg:justify-center">
                <Navbar />
                <div className="flex h-full w-full overflow-x-auto opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    {/* Main Content Container */}
                    <div className="flex w-full flex-grow text-white">
                        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                        <div className="flex-grow">
                            <ScheduleTable isSidebarOpen={isSidebarOpen} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
