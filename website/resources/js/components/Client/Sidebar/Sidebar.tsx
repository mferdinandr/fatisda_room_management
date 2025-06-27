import { Calendar } from '@/components/ui/calendar';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface ISidebarProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    selectedDate: string;
    canGoToPrevious?: boolean;
}

const Sidebar = ({ isOpen, setIsOpen, selectedDate }: ISidebarProps) => {
    const [date, setDate] = useState<Date | undefined>(new Date(selectedDate));

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleDateSelect = (newDate: Date | undefined) => {
        if (!newDate) return;

        // Check if it's a past date and if we can't go to previous

        setDate(newDate);

        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, '0');
        const day = String(newDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        // Navigate to new date
        router.get(
            '/',
            { date: formattedDate },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <div
            className={`bg-background shadow-background fixed top-28 bottom-0 left-0 z-40 flex flex-col shadow-xl transition-all duration-300 ease-in-out ${isOpen ? 'w-70 p-3 md:p-4' : 'w-14 p-2'} rounded-tr-4xl`}
        >
            <div className={`${isOpen ? 'mx-0' : 'mx-auto'} mt-2 flex`}>
                {isOpen && <p className="mb-2 font-light tracking-wider opacity-40">Select Date</p>}
                <div className="ml-auto">
                    {isOpen ? (
                        <ChevronLeft onClick={toggleSidebar} className="cursor-pointer" />
                    ) : (
                        <ChevronRight onClick={toggleSidebar} className="cursor-pointer" />
                    )}
                </div>
            </div>

            {isOpen && (
                <>
                    <h3 className="mb-4 text-xl text-white">
                        {date?.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </h3>
                    <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
                </>
            )}
        </div>
    );
};

export default Sidebar;
