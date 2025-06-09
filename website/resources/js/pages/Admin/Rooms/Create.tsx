import AdminLayout from '@/components/Admin/Layout/AdminLayout';
import RoomForm from '@/components/Admin/Room/RoomForm';
import { router } from '@inertiajs/react';

export default function CreateRoom() {
    const handleCancel = () => {
        router.visit('/admin/rooms');
    };

    return (
        <AdminLayout title="Create Room" currentRoute="admin.rooms.create">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Create New Room</h1>
                    <p className="mt-2 text-gray-600">Add a new room to the booking system</p>
                </div>

                {/* Form */}
                <RoomForm onCancel={handleCancel} />
            </div>
        </AdminLayout>
    );
}
