// resources/js/Pages/Admin/Rooms/Index.tsx

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

import AdminLayout from '@/components/Admin/Layout/AdminLayout';
import RoomStats from '@/components/Admin/Room/RoomStats';
import RoomTable from '@/components/Admin/Room/RoomTable';
import type { Room } from '@/types/admin';

interface Props {
    rooms: Room[];
}

export default function RoomsIndex({ rooms }: Props) {
    console.log(rooms);
    return (
        <AdminLayout title="Manage Rooms" currentRoute="admin.rooms.index">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Rooms</h1>
                        <p className="mt-2 text-gray-600">Add, edit, and manage rooms available for booking</p>
                    </div>

                    <Button asChild variant={'secondary'}>
                        <Link href="/admin/rooms/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Room
                        </Link>
                    </Button>
                </div>

                {/* Stats */}
                <RoomStats rooms={rooms} />

                {/* Rooms Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Rooms ({rooms.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RoomTable rooms={rooms} />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
