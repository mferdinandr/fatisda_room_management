import AdminLayout from '@/components/Admin/Layout/AdminLayout';
import RoomForm from '@/components/Admin/Room/RoomForm';
import type { Room } from '@/types/admin';
import { router } from '@inertiajs/react';

interface Props {
    room: Room;
}

export default function EditRoom({ room }: Props) {
    const handleCancel = () => {
        router.visit('/admin/rooms');
    };

    return (
        <AdminLayout title={`Edit ${room.name}`} currentRoute="admin.rooms.edit">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Room: {room.name}</h1>
                    <p className="mt-2 text-gray-600">Update room information and settings</p>
                </div>

                {/* Form */}
                <RoomForm room={room} isEditing={true} onCancel={handleCancel} />
            </div>
        </AdminLayout>
    );
}
