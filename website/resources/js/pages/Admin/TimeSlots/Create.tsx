import AdminLayout from '@/components/Admin/Layout/AdminLayout';
import TimeSlotForm from '@/components/Admin/TimeSlot/TimeSlotForm';
import { router } from '@inertiajs/react';

export default function CreateTimeSlot() {
    const handleCancel = () => {
        router.visit('/admin/time-slots');
    };

    return (
        <AdminLayout title="Create Time Slot" currentRoute="admin.time-slots.create">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Create New Time Slot</h1>
                    <p className="mt-2 text-gray-600">Add a new time period to the booking system</p>
                </div>

                {/* Form */}
                <TimeSlotForm onCancel={handleCancel} />
            </div>
        </AdminLayout>
    );
}
