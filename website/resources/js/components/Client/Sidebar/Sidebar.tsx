import { Calendar } from '@/components/ui/calendar';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface ISidebarProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    selectedDate: string; // YYYY-MM-DD format
    canGoToPrevious?: boolean;
}

const Sidebar = ({ isOpen, setIsOpen, selectedDate, canGoToPrevious = true }: ISidebarProps) => {
    const [date, setDate] = useState<Date | undefined>(new Date(selectedDate));

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleDateSelect = (newDate: Date | undefined) => {
        if (!newDate) return;

        // Check if it's a past date and if we can't go to previous
        const today = new Date();
        const isPastDate = newDate < today && newDate.toDateString() !== today.toDateString();

        if (isPastDate && !canGoToPrevious) {
            return;
        }

        setDate(newDate);

        // Format date for URL
        const formattedDate = newDate.toISOString().split('T')[0];

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

    const isDateDisabled = (date: Date) => {
        if (canGoToPrevious) return false;

        const today = new Date();
        return date < today && date.toDateString() !== today.toDateString();
    };

    return (
        <div
            className={`bg-background shadow-background fixed top-28 bottom-0 left-0 z-50 flex flex-col shadow-xl transition-all duration-300 ease-in-out ${isOpen ? 'w-70 p-3 md:p-4' : 'w-14 p-2'} rounded-tr-4xl`}
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
                    <Calendar mode="single" selected={date} onSelect={handleDateSelect} disabled={isDateDisabled} className="" />
                </>
            )}
        </div>
    );
};

export default Sidebar;
