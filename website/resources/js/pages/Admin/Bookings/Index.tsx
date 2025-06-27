import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, router } from '@inertiajs/react';
import { Calendar, CheckCircle, Clock, FileText, Filter, Search, XCircle } from 'lucide-react';
import { useState } from 'react';

import BookingTable from '@/components/Admin/Booking/BookingTable';
import AdminLayout from '@/components/Admin/Layout/AdminLayout';
import StatsCard from '@/components/Admin/Shared/StatsCard';
import type { PaginatedBookings, Room } from '@/types/admin';

interface Props {
    bookings: PaginatedBookings;
    rooms: Room[];
    stats: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    };
    filters: {
        status?: string;
        date_from?: string;
        date_to?: string;
        room_id?: string;
        search?: string;
    };
}

export default function BookingsIndex({ bookings, rooms, stats, filters }: Props) {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);

        // Apply filters
        router.get('/admin/bookings', newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setLocalFilters({});
        router.get('/admin/bookings');
    };

    return (
        <AdminLayout title="Manage Bookings" currentRoute="admin.bookings.index">
            <Head title="Manage Bookings" />

            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
                        <p className="mt-2 text-gray-600">Review, approve, and manage room booking requests</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <StatsCard
                        title="Total Bookings"
                        value={stats.total}
                        description="All booking requests"
                        icon={<FileText className="h-4 w-4" />}
                    />

                    <StatsCard
                        title="Pending Review"
                        value={stats.pending}
                        description="Awaiting approval"
                        icon={<Clock className="h-4 w-4" />}
                        className="border-yellow-200 bg-yellow-50"
                    />

                    <StatsCard
                        title="Approved"
                        value={stats.approved}
                        description="Confirmed bookings"
                        icon={<CheckCircle className="h-4 w-4" />}
                        className="border-green-200 bg-green-50"
                    />

                    <StatsCard
                        title="Rejected"
                        value={stats.rejected}
                        description="Declined requests"
                        icon={<XCircle className="h-4 w-4" />}
                        className="border-red-200 bg-red-50"
                    />
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Filter className="mr-2 h-5 w-5" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
                            {/* Search */}
                            <div className="lg:col-span-2">
                                <Label htmlFor="search">Search</Label>
                                <div className="relative">
                                    <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                                    <Input
                                        id="search"
                                        placeholder="User, course, lecturer..."
                                        value={localFilters.search || ''}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={localFilters.status || 'all'}
                                    onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Room */}
                            <div>
                                <Label htmlFor="room">Room</Label>
                                <Select
                                    value={localFilters.room_id || 'all'}
                                    onValueChange={(value) => handleFilterChange('room_id', value === 'all' ? '' : value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All rooms" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Rooms</SelectItem>
                                        {rooms.map((room) => (
                                            <SelectItem key={room.id} value={room.id.toString()}>
                                                {room.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date From */}
                            <div>
                                <Label htmlFor="date_from">From Date</Label>
                                <Input
                                    id="date_from"
                                    type="date"
                                    value={localFilters.date_from || ''}
                                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                />
                            </div>

                            {/* Date To */}
                            <div>
                                <Label htmlFor="date_to">To Date</Label>
                                <Input
                                    id="date_to"
                                    type="date"
                                    value={localFilters.date_to || ''}
                                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Filter Actions */}
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-muted-foreground text-sm">
                                {Object.values(localFilters).some((v) => v) && (
                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                    <span>Active filters: {Object.entries(localFilters).filter(([_, v]) => v).length}</span>
                                )}
                            </div>

                            {Object.values(localFilters).some((v) => v) && (
                                <Button variant="outline" size="sm" onClick={clearFilters}>
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Bookings Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Calendar className="mr-2 h-5 w-5" />
                            Booking Requests ({bookings.meta?.total || bookings.data?.length || 0})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BookingTable bookings={bookings} />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
