import AdminLayout from '@/components/Admin/Layout/AdminLayout';
import TimeSlotForm from '@/components/Admin/TimeSlot/TimeSlotForm';
import type { TimeSlot } from '@/types/admin';
import { router } from '@inertiajs/react';

interface Props {
    timeSlot: TimeSlot;
}

export default function EditTimeSlot({ timeSlot }: Props) {
    const handleCancel = () => {
        router.visit('/admin/time-slots');
    };

    return (
        <AdminLayout title={`Edit ${timeSlot.label}`} currentRoute="admin.time-slots.edit">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Time Slot: {timeSlot.label}</h1>
                    <p className="mt-2 text-gray-600">Update time slot information and settings</p>
                </div>

                {/* Form */}
                <TimeSlotForm timeSlot={timeSlot} isEditing={true} onCancel={handleCancel} />
            </div>
        </AdminLayout>
    );
}
