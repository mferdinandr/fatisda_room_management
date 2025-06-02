import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div
            className={`bg-background absolute top-28 bottom-0 left-0 flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'w-70 p-3 md:p-4' : 'w-14 p-2'} rounded-tr-4xl`}
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
                    <Calendar mode="single" selected={date} onSelect={setDate} className="" />
                </>
            )}
        </div>
    );
};

export default Sidebar;
