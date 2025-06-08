import { TIME_SLOT_HEIGHT } from '@/lib/constants';
import { getDuration } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

interface ScheduleTableProps {
    isSidebarOpen: boolean;
}

interface ScheduleItem {
    room: string;
    course: string;
    start: string;
    end: string;
    color: string;
}

export default function ScheduleTable({ isSidebarOpen }: ScheduleTableProps) {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [detailOpened, setDetailOpened] = useState({
        course: '',
        end: '',
        room: '',
        start: '',
    });
    const rooms = ['Ruangan 1', 'Ruangan 2', 'Ruangan 3', 'Ruangan 4'];
    const times = ['09.00', '10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00', '17.00'];

    const schedule: ScheduleItem[] = [
        {
            room: 'Ruangan 1',
            course: 'Kalkulus 2',
            start: '09.00',
            end: '10.00',
            color: 'bg-red-500',
        },
        {
            room: 'Ruangan 2',
            course: 'Kalkulus 2',
            start: '10.00',
            end: '11.00',
            color: 'bg-lime-400',
        },
        {
            room: 'Ruangan 4',
            course: 'Kalkulus 12',
            start: '15.00',
            end: '17.00',
            color: 'bg-lime-400',
        },
        {
            room: 'Ruangan 3',
            course: 'Kalkulus 12',
            start: '15.00',
            end: '16.00',
            color: 'bg-lime-400',
        },
    ];

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreen = () => setIsMobile(window.innerWidth < 640);
        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    const calculateMinHeight = () => {
        const headerHeight = 60;
        const totalTimeSlots = times.length;
        return headerHeight + totalTimeSlots * TIME_SLOT_HEIGHT;
    };

    const handleOpenDetail = (scheduleItem) => {
        setIsDetailOpen(!isDetailOpen);
        setDetailOpened({
            course: scheduleItem.course,
            end: scheduleItem.end,
            room: scheduleItem.room,
            start: scheduleItem.start,
        });
        console.log(detailOpened);
    };
    console.log(isDetailOpen);

    return (
        <div
            className={`mt-28 font-sans transition-all duration-300 ${isSidebarOpen ? 'ml-66' : 'ml-12'} overflow-hidden`}
            style={{ minHeight: `${calculateMinHeight()}px` }}
        >
            <div className="font-black text-black">
                <div
                    className={`grid min-w-full text-sm`}
                    style={{
                        gridTemplateColumns: `${isMobile ? '80px' : '100px'} repeat(${rooms.length}, minmax(${isMobile ? '110px' : '150px'}, 1fr))`,
                    }}
                >
                    {/* Header */}
                    <div className="border-b-2 py-2 text-center font-medium"></div>
                    {rooms.map((room, i) => (
                        <div key={i} className="text-background border-b-2 border-l-2 py-2 text-center text-sm font-bold md:text-base">
                            {room}
                        </div>
                    ))}

                    {/* Rows */}
                    {times.map((time) => (
                        <React.Fragment key={time}>
                            <div className="flex justify-end pr-3 text-end text-sm" style={{ height: `${TIME_SLOT_HEIGHT}px` }}>
                                {time}
                            </div>

                            {rooms.map((room) => {
                                const scheduleItem = schedule.find((s) => s.room === room && s.start === time);

                                return (
                                    <>
                                        <div className="relative border-l-2" key={room + time} style={{ height: `${TIME_SLOT_HEIGHT}px` }}>
                                            {scheduleItem && (
                                                <div
                                                    className={`${scheduleItem.color} flex cursor-pointer flex-col rounded-lg px-3 py-2 font-semibold text-white`}
                                                    style={{
                                                        height: `${getDuration(scheduleItem.start, scheduleItem.end) * TIME_SLOT_HEIGHT + 8}px`,
                                                        position: 'absolute',
                                                        top: '1px',
                                                        left: '4px',
                                                        right: '4px',
                                                    }}
                                                    onClick={() => handleOpenDetail(scheduleItem)}
                                                >
                                                    <p className="text-sm font-bold">{scheduleItem.course}</p>
                                                    <p className="text-xs opacity-90">
                                                        {scheduleItem.start} - {scheduleItem.end}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        {isDetailOpen && <div className="absolute">{detailOpened.room}</div>}
                                    </>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}
