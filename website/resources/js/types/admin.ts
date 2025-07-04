export interface Room {
    id: number;
    name: string;
    capacity: number;
    facilities: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface AdminStats {
    total_rooms: number;
    active_rooms: number;
    total_time_slots: number;
    total_users: number;
    pending_bookings: number;
}

export interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

export interface TimeSlot {
    id: number;
    start_time: string;
    end_time: string;
    label: string;
    is_active: boolean;
    updated_at: string;
    created_at: string;
}

export interface Booking {
    id: number;
    user_id: number;
    room_id: number;
    time_slot_id: number;
    booking_date: string;
    keperluan: 'kelas' | 'rapat' | 'lainnya';
    mata_kuliah?: string;
    dosen?: string;
    catatan?: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_notes?: string;
    created_at: string;
    updated_at: string;
    // Relations
    user?: User;
    room?: Room;
    color?: string;
    time_slot?: TimeSlot;
}

export interface StatsCardProps {
    title: string;
    value: number | string;
    description: string;
    icon: React.ReactNode;
    className?: string;
}

export interface TimeSlotFormData {
    start_time: string;
    end_time: string;
    is_active: boolean;
}

export interface ScheduleSlot {
    room_id: number;
    time_slot_id: number;
    is_booked: boolean;
    booking?: Booking;
    is_available: boolean;
}

export interface ScheduleRow {
    time_slot: TimeSlot;
    slots: ScheduleSlot[];
}

export interface BookingFormData {
    room_id: number;
    time_slot_id: number;
    booking_date: string;
    keperluan: 'kelas' | 'rapat' | 'lainnya';
    mata_kuliah?: string;
    dosen?: string;
    catatan?: string;
}

export interface PaginatedBookings {
    data: Booking[];
    links?: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    meta?: {
        current_page: number;
        from: number | null;
        last_page: number;
        per_page: number;
        to: number | null;
        total: number;
    };
}
