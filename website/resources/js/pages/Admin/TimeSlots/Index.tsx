import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { CheckCircle, Clock, Plus } from 'lucide-react';

import AdminLayout from '@/components/Admin/Layout/AdminLayout';
import StatsCard from '@/components/Admin/Shared/StatsCard';
import TimeSlotTable from '@/components/Admin/TimeSlot/TimeSlotTable';
import type { TimeSlot } from '@/types/admin';

interface Props {
    timeSlots: TimeSlot[];
}

export default function TimeSlotsIndex({ timeSlots }: Props) {
    const totalTimeSlots = timeSlots.length;
    const activeTimeSlots = timeSlots.filter((slot) => slot.is_active).length;
    const totalDuration = timeSlots.reduce((sum, slot) => {
        const start = new Date(`1970-01-01T${slot.start_time}`);
        const end = new Date(`1970-01-01T${slot.end_time}`);
        return sum + (end.getTime() - start.getTime()) / (1000 * 60); // minutes
    }, 0);

    return (
        <AdminLayout title="Manage Time Slots" currentRoute="admin.time-slots.index">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Time Slots</h1>
                        <p className="mt-2 text-gray-600">Create and manage available time periods for room booking</p>
                    </div>

                    <Button asChild variant={'secondary'}>
                        <Link href="/admin/time-slots/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Time Slot
                        </Link>
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <StatsCard
                        title="Total Time Slots"
                        value={totalTimeSlots}
                        description="All time periods in system"
                        icon={<Clock className="h-4 w-4" />}
                    />

                    <StatsCard
                        title="Active Time Slots"
                        value={activeTimeSlots}
                        description="Available for booking"
                        icon={<CheckCircle className="h-4 w-4" />}
                    />

                    <StatsCard
                        title="Total Duration"
                        value={`${Math.round(totalDuration / 60)}h ${totalDuration % 60}m`}
                        description="Combined active time"
                        icon={<Clock className="h-4 w-4" />}
                    />
                </div>

                {/* Time Slots Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Time Slots ({timeSlots.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TimeSlotTable timeSlots={timeSlots} />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
