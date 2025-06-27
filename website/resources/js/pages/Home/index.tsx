import ScheduleTable from '@/components/Client/Home/ScheduleTable/ScheduleTable';
import Navbar from '@/components/Client/Navbar/Navbar';
import Sidebar from '@/components/Client/Sidebar/Sidebar';
import { Button } from '@/components/ui/button';
import type { Room, ScheduleRow } from '@/types/admin';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
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
            <div className="to-secondary w- flex min-h-screen flex-col items-center bg-linear-to-br from-white px-3 py-4 text-[#1b1b18] md:px-8 lg:justify-center">
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
                <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end">
                    <Button asChild variant={'secondary'} size="lg" className="rounded-full shadow-lg transition-all duration-200 hover:shadow-xl">
                        <Link href={`/booking/create?date=${date}`}>
                            <Plus className="mr-2 h-5 w-5" />
                            Book Room
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
