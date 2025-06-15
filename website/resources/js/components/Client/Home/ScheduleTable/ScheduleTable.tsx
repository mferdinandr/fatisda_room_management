import { TIME_SLOT_HEIGHT } from '@/lib/constants';
import { getDuration, randomizeColorBackground } from '@/lib/utils';
import type { Booking, Room, ScheduleRow } from '@/types/admin';
import { usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

interface ScheduleTableProps {
    isSidebarOpen: boolean;
    rooms: Room[];
    schedule: ScheduleRow[];
    selectedDate: string;
}

interface ScheduleItem {
    room: string;
    course: string;
    start: string;
    end: string;
    color: string;
    booking?: Booking;
}

export default function ScheduleTable({ isSidebarOpen, rooms, schedule, selectedDate }: ScheduleTableProps) {
    const { auth } = usePage().props as any;
    const isAuthenticated = !!auth?.user;

    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [detailOpened, setDetailOpened] = useState({
        course: '',
        end: '',
        room: '',
        start: '',
        booking: null as Booking | null,
    });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreen = () => setIsMobile(window.innerWidth < 640);
        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    // Convert backend data to frontend format
    const convertToScheduleItems = (): ScheduleItem[] => {
        const scheduleItems: ScheduleItem[] = [];

        schedule.forEach((row) => {
            row.slots.forEach((slot) => {
                if (slot.is_booked && slot.booking) {
                    const room = rooms.find((r) => r.id === slot.room_id);
                    if (!room) return;

                    // Get course name based on booking purpose
                    let courseName = '';
                    if (slot.booking.keperluan === 'kelas' && slot.booking.mata_kuliah) {
                        courseName = slot.booking.mata_kuliah;
                    } else if (slot.booking.keperluan === 'rapat') {
                        courseName = 'Rapat';
                    } else {
                        courseName = 'Acara Lainnya';
                    }

                    // Format time from "HH:mm:ss" to "HH.mm"
                    const formatTime = (timeStr: string) => {
                        return timeStr.substring(0, 5).replace(':', '.');
                    };

                    scheduleItems.push({
                        room: room.name,
                        course: courseName,
                        start: formatTime(row.time_slot.start_time),
                        end: formatTime(row.time_slot.end_time),
                        color: randomizeColorBackground(),
                        booking: slot.booking,
                    });
                }
            });
        });

        return scheduleItems;
    };

    const scheduleItems = convertToScheduleItems();

    // Extract unique times from timeSlots
    const times = schedule.map((row) => {
        const time = row.time_slot.start_time.substring(0, 5).replace(':', '.');
        return time;
    });

    // Extract room names
    const roomNames = rooms.map((room) => room.name);

    const calculateMinHeight = () => {
        const headerHeight = 60;
        const totalTimeSlots = times.length;
        return headerHeight + totalTimeSlots * TIME_SLOT_HEIGHT;
    };

    const handleOpenDetail = (scheduleItem: ScheduleItem) => {
        setIsDetailOpen(!isDetailOpen);
        setDetailOpened({
            course: scheduleItem.course,
            end: scheduleItem.end,
            room: scheduleItem.room,
            start: scheduleItem.start,
            booking: scheduleItem.booking || null,
        });
    };

    const handleSlotClick = (room: string, time: string) => {
        if (!isAuthenticated) {
            // Redirect to login
            window.location.href = '/login';
            return;
        }

        // Find the room and time slot IDs
        const roomObj = rooms.find((r) => r.name === room);
        const timeSlotObj = schedule.find((row) => {
            const formattedTime = row.time_slot.start_time.substring(0, 5).replace(':', '.');
            return formattedTime === time;
        })?.time_slot;

        if (!roomObj || !timeSlotObj) return;

        // Check if slot is available
        const slot = schedule.find((row) => row.time_slot.id === timeSlotObj.id)?.slots.find((s) => s.room_id === roomObj.id);

        if (slot && slot.is_available) {
            // Navigate to booking form
            const params = new URLSearchParams({
                room_id: roomObj.id.toString(),
                time_slot_id: timeSlotObj.id.toString(),
                date: selectedDate,
            });

            window.location.href = `/booking/create?${params.toString()}`;
        }
    };

    return (
        <div
            className={`mt-28 font-sans transition-all duration-300 ${isSidebarOpen ? 'ml-66' : 'ml-12'} overflow-hidden`}
            style={{ minHeight: `${calculateMinHeight()}px` }}
        >
            <div className="font-black text-black">
                <div
                    className={`grid min-w-full text-sm`}
                    style={{
                        gridTemplateColumns: `${isMobile ? '80px' : '100px'} repeat(${roomNames.length}, minmax(${isMobile ? '110px' : '150px'}, 1fr))`,
                    }}
                >
                    {/* Header */}
                    <div className="border-b-2 py-2 text-center font-medium"></div>
                    {roomNames.map((room, i) => (
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

                            {roomNames.map((room) => {
                                const scheduleItem = scheduleItems.find((s) => s.room === room && s.start === time);

                                // Check if slot is available for booking
                                const roomObj = rooms.find((r) => r.name === room);
                                const timeSlotObj = schedule.find((row) => {
                                    const formattedTime = row.time_slot.start_time.substring(0, 5).replace(':', '.');
                                    return formattedTime === time;
                                })?.time_slot;

                                const slot =
                                    roomObj && timeSlotObj
                                        ? schedule.find((row) => row.time_slot.id === timeSlotObj.id)?.slots.find((s) => s.room_id === roomObj.id)
                                        : null;

                                const isAvailable = slot?.is_available || false;

                                return (
                                    <div className="relative border-l-2" key={room + time} style={{ height: `${TIME_SLOT_HEIGHT}px` }}>
                                        {scheduleItem ? (
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
                                                {scheduleItem.booking?.dosen && <p className="text-xs opacity-75">{scheduleItem.booking.dosen}</p>}
                                            </div>
                                        ) : isAvailable ? (
                                            <div
                                                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-green-300 bg-green-50 px-3 py-2 text-green-600 hover:bg-green-100"
                                                style={{
                                                    height: `${TIME_SLOT_HEIGHT - 4}px`,
                                                    position: 'absolute',
                                                    top: '2px',
                                                    left: '4px',
                                                    right: '4px',
                                                }}
                                                onClick={() => handleSlotClick(room, time)}
                                            >
                                                <p className="text-xs font-medium">{isAuthenticated ? '+ Book' : 'Login to Book'}</p>
                                            </div>
                                        ) : null}

                                        {isDetailOpen && detailOpened.room === room && detailOpened.start === time && (
                                            <div className="absolute z-10 mt-2 w-64 rounded-lg border bg-white p-4 shadow-lg">
                                                <h4 className="font-bold text-gray-900">{detailOpened.course}</h4>
                                                <p className="text-sm text-gray-600">
                                                    {detailOpened.room} • {detailOpened.start} - {detailOpened.end}
                                                </p>
                                                {detailOpened.booking?.dosen && (
                                                    <p className="mt-1 text-sm text-gray-600">Dosen: {detailOpened.booking.dosen}</p>
                                                )}
                                                {detailOpened.booking?.user && (
                                                    <p className="text-sm text-gray-600">Peminjam: {detailOpened.booking.user.name}</p>
                                                )}
                                                <button
                                                    onClick={() => setIsDetailOpen(false)}
                                                    className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}
