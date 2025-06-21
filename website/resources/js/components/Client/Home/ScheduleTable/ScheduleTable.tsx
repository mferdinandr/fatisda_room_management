import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TIME_SLOT_HEIGHT } from '@/lib/constants';
import { getDuration } from '@/lib/utils';
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
        color: '',
        booking: null as Booking | null,
    });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreen = () => setIsMobile(window.innerWidth < 640);
        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);

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
                        color: String(slot.booking.color) || 'bg-blue-500',
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
        setDetailOpened({
            course: scheduleItem.course,
            end: scheduleItem.end,
            room: scheduleItem.room,
            start: scheduleItem.start,
            color: scheduleItem.color || 'bg-blue-500',
            booking: scheduleItem.booking || null,
        });
        setIsDetailOpen(true);
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
        <>
            <div
                className={`mt-28 font-sans transition-all duration-300 ${isSidebarOpen ? 'ml-66' : 'ml-12'} overflow-hidden`}
                style={{ minHeight: `${calculateMinHeight()}px` }}
            >
                <div className="font-black text-black">
                    <div
                        className={`grid min-w-full text-sm`}
                        style={{
                            gridTemplateColumns: `${isMobile ? '80px' : '70px'} repeat(${roomNames.length}, minmax(${isMobile ? '110px' : '120px'}, 1fr))`,
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
                                                    className={`flex cursor-pointer flex-col rounded-lg px-3 py-2 font-semibold text-white`}
                                                    style={{
                                                        backgroundColor: scheduleItem.color.startsWith('#')
                                                            ? scheduleItem.color
                                                            : scheduleItem.color === 'bg-blue-500'
                                                              ? '#3B82F6'
                                                              : scheduleItem.color,
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
                                                    {scheduleItem.booking?.dosen && (
                                                        <p className="text-xs opacity-75">{scheduleItem.booking.dosen}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                isAvailable && (
                                                    <div
                                                        className="flex cursor-pointer flex-col items-center justify-center rounded-lg px-3 py-2"
                                                        style={{
                                                            height: `${TIME_SLOT_HEIGHT - 4}px`,
                                                            position: 'absolute',
                                                            top: '2px',
                                                            left: '4px',
                                                            right: '4px',
                                                        }}
                                                        onClick={() => handleSlotClick(room, time)}
                                                    ></div>
                                                )
                                            )}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="w-full max-w-md font-sans">
                    <DialogHeader>
                        <div className="flex items-start gap-3">
                            <div className="flex-1">
                                <DialogTitle className="text-xl font-bold text-white">{detailOpened.course}</DialogTitle>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        {/* Room Information */}
                        <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{detailOpened.room}</p>
                                <p className="text-sm text-gray-600">Ruangan</p>
                            </div>
                        </div>

                        {/* Time Information */}
                        <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">
                                    {detailOpened.start} - {detailOpened.end}
                                </p>
                                <p className="text-sm text-gray-600">Waktu</p>
                            </div>
                        </div>

                        {/* Lecturer Information */}
                        {detailOpened.booking?.dosen && (
                            <div className="flex items-center gap-3 rounded-lg bg-purple-50 p-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                                    <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{detailOpened.booking.dosen}</p>
                                    <p className="text-sm text-gray-600">Dosen</p>
                                </div>
                            </div>
                        )}

                        {/* Borrower Information */}
                        {detailOpened.booking?.user && (
                            <div className="flex items-center gap-3 rounded-lg bg-orange-50 p-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                                    <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{detailOpened.booking.user.name}</p>
                                    <p className="text-sm text-gray-600">Peminjam</p>
                                </div>
                            </div>
                        )}

                        {/* Purpose Information */}
                        {detailOpened.booking?.keperluan && (
                            <div className="flex items-center gap-3 rounded-lg bg-yellow-50 p-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                                    <svg className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 capitalize">{detailOpened.booking.keperluan}</p>
                                    <p className="text-sm text-gray-600">Keperluan</p>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
