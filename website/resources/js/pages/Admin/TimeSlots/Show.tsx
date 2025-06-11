import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, CheckCircle, Clock, Edit, Trash2, XCircle } from 'lucide-react';
import { useState } from 'react';

import AdminLayout from '@/components/Admin/Layout/AdminLayout';
import type { TimeSlot } from '@/types/admin';

interface Props {
    timeSlot: TimeSlot;
    bookingsCount: number;
}

export default function ShowTimeSlot({ timeSlot, bookingsCount }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${timeSlot.label}"? This action cannot be undone.`)) {
            setIsDeleting(true);
            router.delete(`/admin/time-slots/${timeSlot.id}`, {
                onFinish: () => setIsDeleting(false),
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatTime = (timeString: string) => {
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    const getDuration = () => {
        const start = new Date(`1970-01-01T${timeSlot.start_time}`);
        const end = new Date(`1970-01-01T${timeSlot.end_time}`);
        const minutes = (end.getTime() - start.getTime()) / (1000 * 60);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours > 0) {
            return `${hours}h ${remainingMinutes}m`;
        }
        return `${remainingMinutes}m`;
    };

    return (
        <AdminLayout title={`Time Slot: ${timeSlot.label}`} currentRoute="admin.time-slots.show">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                    <div className="flex items-center space-x-4">
                        <Button asChild variant="outline" size="sm">
                            <Link href="/admin/time-slots">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Time Slots
                            </Link>
                        </Button>

                        <div>
                            <h1 className="flex items-center text-3xl font-bold text-gray-900">
                                <Clock className="mr-3 h-8 w-8" />
                                {timeSlot.label}
                            </h1>
                            <p className="mt-2 text-gray-600">Time slot details and information</p>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <Button asChild variant="outline">
                            <Link href={`/admin/time-slots/${timeSlot.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Time Slot
                            </Link>
                        </Button>

                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting || bookingsCount > 0}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            {isDeleting ? 'Deleting...' : 'Delete Time Slot'}
                        </Button>
                    </div>
                </div>

                {/* Delete Warning */}
                {bookingsCount > 0 && (
                    <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <Calendar className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">Cannot delete time slot</h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <p>
                                        This time slot has {bookingsCount} existing booking{bookingsCount !== 1 ? 's' : ''}
                                        and cannot be deleted. You can deactivate it instead by editing the time slot.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Info */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Time Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Start Time</Label>
                                        <p className="font-mono text-lg font-semibold">{formatTime(timeSlot.start_time)}</p>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">End Time</Label>
                                        <p className="font-mono text-lg font-semibold">{formatTime(timeSlot.end_time)}</p>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Duration</Label>
                                        <p className="text-lg font-semibold">{getDuration()}</p>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                                    <div className="mt-1">
                                        <Badge variant={timeSlot.is_active ? 'default' : 'secondary'} className="flex w-fit items-center">
                                            {timeSlot.is_active ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                                            {timeSlot.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Full Label</Label>
                                    <p className="text-lg font-semibold">{timeSlot.label}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bookings Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Booking Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Bookings</p>
                                        <p className="text-2xl font-bold">{bookingsCount}</p>
                                    </div>
                                    <Calendar className="h-8 w-8 text-gray-400" />
                                </div>

                                {bookingsCount === 0 ? (
                                    <p className="mt-2 text-sm text-gray-500">No bookings have been made for this time slot yet.</p>
                                ) : (
                                    <p className="mt-2 text-sm text-gray-500">
                                        This time slot has been booked {bookingsCount} time{bookingsCount !== 1 ? 's' : ''}.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Meta Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Slot Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Slot ID</Label>
                                    <p className="font-mono text-sm">{timeSlot.id}</p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Created</Label>
                                    <p className="text-sm">{formatDate(timeSlot.created_at)}</p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                                    <p className="text-sm">{formatDate(timeSlot.updated_at)}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button asChild variant="outline" className="w-full justify-start">
                                    <Link href={`/admin/time-slots/${timeSlot.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit This Time Slot
                                    </Link>
                                </Button>

                                <Button variant="outline" className="w-full cursor-not-allowed justify-start opacity-50" disabled>
                                    <Calendar className="mr-2 h-4 w-4" />
                                    View Bookings
                                    <Badge variant="secondary" className="ml-auto text-xs">
                                        Soon
                                    </Badge>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
