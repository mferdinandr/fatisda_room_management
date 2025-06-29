// resources/js/Pages/Admin/Rooms/Show.tsx

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Building2, Calendar, CheckCircle, Edit, Trash2, Users, XCircle } from 'lucide-react';
import { useState } from 'react';

import AdminLayout from '@/components/Admin/Layout/AdminLayout';
import type { Room } from '@/types/admin';

interface Props {
    room: Room;
    bookingsCount: number;
}

export default function ShowRoom({ room, bookingsCount }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${room.name}"? This action cannot be undone.`)) {
            setIsDeleting(true);
            router.delete(`/admin/rooms/${room.id}`, {
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

    return (
        <AdminLayout title={`Room: ${room.name}`} currentRoute="admin.rooms.show">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                    <div className="flex items-center space-x-4">
                        <Button asChild variant="outline" size="sm">
                            <Link href="/admin/rooms">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Rooms
                            </Link>
                        </Button>

                        <div>
                            <h1 className="flex items-center text-3xl font-bold text-gray-900">
                                <Building2 className="mr-3 h-8 w-8" />
                                {room.name}
                            </h1>
                            <p className="mt-2 text-gray-600">Room details and information</p>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <Button asChild variant="outline">
                            <Link href={`/admin/rooms/${room.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Room
                            </Link>
                        </Button>

                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting || bookingsCount > 0}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            {isDeleting ? 'Deleting...' : 'Delete Room'}
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
                                <h3 className="text-sm font-medium text-yellow-800">Cannot delete room</h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <p>
                                        This room has {bookingsCount} existing booking{bookingsCount !== 1 ? 's' : ''}
                                        and cannot be deleted. You can deactivate it instead by editing the room.
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
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Room Name</Label>
                                        <p className="text-lg font-semibold">{room.name}</p>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Capacity</Label>
                                        <p className="flex items-center text-lg font-semibold">
                                            <Users className="mr-2 h-5 w-5 text-gray-400" />
                                            {room.capacity} people
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                                    <div className="mt-1">
                                        <Badge variant={room.is_active ? 'default' : 'secondary'} className="flex w-fit items-center">
                                            {room.is_active ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                                            {room.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Facilities</Label>
                                    <div className="mt-1">
                                        {room.facilities ? (
                                            <p className="text-gray-900">{room.facilities}</p>
                                        ) : (
                                            <p className="text-gray-500 italic">No facilities listed</p>
                                        )}
                                    </div>
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
                                    <p className="mt-2 text-sm text-gray-500">No bookings have been made for this room yet.</p>
                                ) : (
                                    <p className="mt-2 text-sm text-gray-500">
                                        This room has been booked {bookingsCount} time{bookingsCount !== 1 ? 's' : ''}.
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
                                <CardTitle>Room Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Room ID</Label>
                                    <p className="font-mono text-sm">{room.id}</p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Created</Label>
                                    <p className="text-sm">{formatDate(room.created_at)}</p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                                    <p className="text-sm">{formatDate(room.updated_at)}</p>
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
                                    <Link href={`/admin/rooms/${room.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit This Room
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

// Helper component for labels
function Label({ children, className }: { children: React.ReactNode; className?: string }) {
    return <label className={className}>{children}</label>;
}
