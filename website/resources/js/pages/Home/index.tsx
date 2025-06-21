import ScheduleTable from '@/components/Client/Home/ScheduleTable/ScheduleTable';
import Navbar from '@/components/Client/Navbar/Navbar';
import Sidebar from '@/components/Client/Sidebar/Sidebar';
import type { Room, ScheduleRow } from '@/types/admin';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    date: string;
    selectedDate: string;
    rooms: Room[];
    schedule: ScheduleRow[];
    canGoToPrevious: boolean;
}

export default function Welcome({ date, selectedDate, rooms, schedule }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex h-auto min-h-screen flex-col">
            <Head title={`Room Schedule - ${selectedDate}`}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="to-secondary flex min-h-screen w-full flex-col items-center bg-linear-to-br from-white px-3 py-4 text-[#1b1b18] md:px-8 lg:justify-center">
                <Navbar />
                <div className="flex h-full w-full overflow-x-auto opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    {/* Main Content Container */}
                    <div className="flex w-full flex-grow text-white">
                        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} selectedDate={date} />
                        <div className="flex-grow">
                            <ScheduleTable isSidebarOpen={isSidebarOpen} rooms={rooms} schedule={schedule} selectedDate={date} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
