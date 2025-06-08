// resources/js/Components/Admin/Room/RoomStats.tsx

import type { Room } from '@/types/admin';
import { Building2, CheckCircle, Users } from 'lucide-react';
import StatsCard from '../Shared/StatsCard';

interface RoomStatsProps {
    rooms: Room[];
}

export default function RoomStats({ rooms }: RoomStatsProps) {
    const totalRooms = rooms.length;
    const activeRooms = rooms.filter((room) => room.is_active).length;
    const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);

    return (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatsCard title="Total Rooms" value={totalRooms} description="All rooms in system" icon={<Building2 className="h-4 w-4" />} />

            <StatsCard title="Active Rooms" value={activeRooms} description="Available for booking" icon={<CheckCircle className="h-4 w-4" />} />

            <StatsCard title="Total Capacity" value={totalCapacity} description="Combined seating capacity" icon={<Users className="h-4 w-4" />} />
        </div>
    );
}
