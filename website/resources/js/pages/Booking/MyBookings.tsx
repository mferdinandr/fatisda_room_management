import Navbar from '@/components/Client/Navbar/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Booking } from '@/types/admin';
import { Head, Link, router } from '@inertiajs/react';
import { Building2, Calendar, Clock, Edit, Eye, Plus, Trash2 } from 'lucide-react';

interface Props {
    bookings: Booking[];
}

export default function MyBookings({ bookings }: Props) {
    const handleCancelBooking = (bookingId: number, courseName: string) => {
        if (confirm(`Are you sure you want to cancel the booking for "${courseName}"?`)) {
            router.delete(`/my-bookings/${bookingId}`);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Pending Review
                    </Badge>
                );
            case 'approved':
                return (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                        Approved
                    </Badge>
                );
            case 'rejected':
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getBookingTitle = (booking: Booking) => {
        if (booking.keperluan === 'kelas' && booking.mata_kuliah) {
            return booking.mata_kuliah;
        }
        if (booking.keperluan === 'rapat') {
            return 'Meeting';
        }
        return 'Other Event';
    };

    // Group bookings by status
    const pendingBookings = bookings.filter((b) => b.status === 'pending');
    const approvedBookings = bookings.filter((b) => b.status === 'approved');
    const rejectedBookings = bookings.filter((b) => b.status === 'rejected');

    return (
        <>
            <Head title="My Bookings" />

            <div className="min-h-screen bg-gray-50 font-sans">
                {/* Navigation */}
                <Navbar />

                <div className="mx-auto max-w-6xl px-4 py-8 pt-32">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                            <p className="mt-2 text-gray-600">Manage your room booking requests and history</p>
                        </div>

                        <Button asChild variant={'secondary'}>
                            <Link href={`/booking/create`}>
                                <Plus className="mr-2 h-4 w-4" />
                                New Booking
                            </Link>
                        </Button>
                    </div>

                    {bookings.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Calendar className="text-muted-foreground mx-auto mb-4 h-16 w-16 opacity-50" />
                                <h3 className="mb-2 text-lg font-semibold">No bookings yet</h3>
                                <p className="text-muted-foreground mb-6">You haven't made any room booking requests yet.</p>
                                <Button asChild variant={'secondary'}>
                                    <Link href="/">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Make Your First Booking
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-8">
                            {/* Pending Bookings */}
                            {pendingBookings.length > 0 && (
                                <div>
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900">Pending Review ({pendingBookings.length})</h2>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {pendingBookings.map((booking) => (
                                            <Card key={booking.id} className="border-yellow-200 bg-yellow-50">
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-start justify-between">
                                                        <CardTitle className="text-lg">{getBookingTitle(booking)}</CardTitle>
                                                        {getStatusBadge(booking.status)}
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Building2 className="mr-2 h-4 w-4" />
                                                        {booking.room?.name}
                                                    </div>

                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Calendar className="mr-2 h-4 w-4" />
                                                        {formatDate(booking.booking_date)}
                                                    </div>

                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Clock className="mr-2 h-4 w-4" />
                                                        {booking.time_slot?.label}
                                                    </div>

                                                    {booking.dosen && (
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-medium">Lecturer:</span> {booking.dosen}
                                                        </p>
                                                    )}

                                                    <div className="flex space-x-2 pt-3">
                                                        <Button asChild size="sm" variant="outline" className="flex-1">
                                                            <Link href={`/my-bookings/${booking.id}`}>
                                                                <Eye className="mr-1 h-4 w-4" />
                                                                View
                                                            </Link>
                                                        </Button>
                                                        <Button asChild size="sm" variant="outline" className="flex-1">
                                                            <Link href={`/my-bookings/${booking.id}/edit`}>
                                                                <Edit className="mr-1 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleCancelBooking(booking.id, getBookingTitle(booking))}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    <p className="text-xs text-gray-500">Submitted: {formatDateTime(booking.created_at)}</p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Approved Bookings */}
                            {approvedBookings.length > 0 && (
                                <div>
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900">Approved Bookings ({approvedBookings.length})</h2>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {approvedBookings.map((booking) => (
                                            <Card key={booking.id} className="border-green-200 bg-green-50">
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-start justify-between">
                                                        <CardTitle className="text-lg">{getBookingTitle(booking)}</CardTitle>
                                                        {getStatusBadge(booking.status)}
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Building2 className="mr-2 h-4 w-4" />
                                                        {booking.room?.name}
                                                    </div>

                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Calendar className="mr-2 h-4 w-4" />
                                                        {formatDate(booking.booking_date)}
                                                    </div>

                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Clock className="mr-2 h-4 w-4" />
                                                        {booking.time_slot?.label}
                                                    </div>

                                                    {booking.dosen && (
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-medium">Lecturer:</span> {booking.dosen}
                                                        </p>
                                                    )}

                                                    <div className="pt-3">
                                                        <Button asChild size="sm" variant="outline" className="w-full">
                                                            <Link href={`/my-bookings/${booking.id}`}>
                                                                <Eye className="mr-1 h-4 w-4" />
                                                                View Details
                                                            </Link>
                                                        </Button>
                                                    </div>

                                                    <p className="text-xs text-gray-500">Approved: {formatDateTime(booking.updated_at)}</p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Rejected Bookings */}
                            {rejectedBookings.length > 0 && (
                                <div>
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900">Rejected Requests ({rejectedBookings.length})</h2>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {rejectedBookings.map((booking) => (
                                            <Card key={booking.id} className="border-red-200 bg-red-50">
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-start justify-between">
                                                        <CardTitle className="text-lg">{getBookingTitle(booking)}</CardTitle>
                                                        {getStatusBadge(booking.status)}
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Building2 className="mr-2 h-4 w-4" />
                                                        {booking.room?.name}
                                                    </div>

                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Calendar className="mr-2 h-4 w-4" />
                                                        {formatDate(booking.booking_date)}
                                                    </div>

                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Clock className="mr-2 h-4 w-4" />
                                                        {booking.time_slot?.label}
                                                    </div>

                                                    {booking.admin_notes && (
                                                        <div className="rounded-md bg-red-100 p-3">
                                                            <p className="mb-1 text-sm font-medium text-red-800">Rejection Reason:</p>
                                                            <p className="text-sm text-red-700">{booking.admin_notes}</p>
                                                        </div>
                                                    )}

                                                    <div className="pt-3">
                                                        <Button asChild size="sm" variant="outline" className="w-full">
                                                            <Link href={`/my-bookings/${booking.id}`}>
                                                                <Eye className="mr-1 h-4 w-4" />
                                                                View Details
                                                            </Link>
                                                        </Button>
                                                    </div>

                                                    <p className="text-xs text-gray-500">Rejected: {formatDateTime(booking.updated_at)}</p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
