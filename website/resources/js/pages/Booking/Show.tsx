import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Booking } from '@/types/admin';
import { Head, Link, router } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Building2, Calendar, CheckCircle, Clock, Edit, FileText, Trash2, User, XCircle } from 'lucide-react';

interface Props {
    booking: Booking;
}

export default function ShowBooking({ booking }: Props) {
    const handleCancelBooking = () => {
        const bookingTitle = getBookingTitle();
        if (confirm(`Are you sure you want to cancel the booking for "${bookingTitle}"?`)) {
            router.delete(`/my-bookings/${booking.id}`);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-100 text-yellow-800">
                        <AlertCircle className="h-3 w-3" />
                        Pending Review
                    </Badge>
                );
            case 'approved':
                return (
                    <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3" />
                        Approved
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge variant="destructive" className="flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        Rejected
                    </Badge>
                );
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
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getBookingTitle = () => {
        if (booking.keperluan === 'kelas' && booking.mata_kuliah) {
            return booking.mata_kuliah;
        }
        if (booking.keperluan === 'rapat') {
            return 'Meeting';
        }
        return 'Other Event';
    };

    const getPurposeText = (keperluan: string) => {
        switch (keperluan) {
            case 'kelas':
                return 'Class (Kelas)';
            case 'rapat':
                return 'Meeting (Rapat)';
            case 'lainnya':
                return 'Others (Lainnya)';
            default:
                return keperluan;
        }
    };

    const canEdit = booking.status === 'pending';
    const canCancel = booking.status === 'pending';

    return (
        <>
            <Head title={`Booking Details - ${getBookingTitle()}`} />

            <div className="min-h-screen bg-gray-50 font-sans">
                {/* Navigation */}
                <nav className="border-b bg-white shadow-sm">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="flex items-center justify-between py-4">
                            <Link href="/" className="flex items-center space-x-2">
                                <Building2 className="h-6 w-6 text-blue-600" />
                                <span className="text-xl font-bold text-gray-900">FATISDA Room</span>
                            </Link>

                            <div className="flex items-center space-x-4">
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/my-bookings">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to My Bookings
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/logout" method="post">
                                        Logout
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="mx-auto max-w-4xl px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{getBookingTitle()}</h1>
                                <p className="mt-2 text-gray-600">Booking details and information</p>
                            </div>
                            {getStatusBadge(booking.status)}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Main Details */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Booking Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Room */}
                                    <div className="flex items-start gap-4 rounded-lg bg-blue-50 p-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                            <Building2 className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600">Room</p>
                                            <h3 className="font-semibold text-gray-900">{booking.room?.name}</h3>
                                            {booking.room?.capacity && (
                                                <p className="mt-1 text-sm text-gray-500">Capacity: {booking.room.capacity} people</p>
                                            )}
                                            {booking.room?.facilities && <p className="text-sm text-gray-500">{booking.room.facilities}</p>}
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <div className="flex items-start gap-4 rounded-lg bg-green-50 p-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                            <Calendar className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600">Date</p>
                                            <h3 className="font-semibold text-gray-900">{formatDate(booking.booking_date)}</h3>
                                        </div>
                                    </div>

                                    {/* Time */}
                                    <div className="flex items-start gap-4 rounded-lg bg-purple-50 p-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                                            <Clock className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600">Time Slot</p>
                                            <h3 className="font-semibold text-gray-900">{booking.time_slot?.label}</h3>
                                        </div>
                                    </div>

                                    {/* Purpose */}
                                    <div className="flex items-start gap-4 rounded-lg bg-yellow-50 p-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                                            <FileText className="h-5 w-5 text-yellow-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600">Purpose</p>
                                            <h3 className="font-semibold text-gray-900">{getPurposeText(booking.keperluan)}</h3>
                                        </div>
                                    </div>

                                    {/* Lecturer/PIC */}
                                    {booking.dosen && (
                                        <div className="flex items-start gap-4 rounded-lg bg-indigo-50 p-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                                                <User className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600">
                                                    {booking.keperluan === 'kelas' ? 'Lecturer' : 'Person in Charge'}
                                                </p>
                                                <h3 className="font-semibold text-gray-900">{booking.dosen}</h3>
                                            </div>
                                        </div>
                                    )}

                                    {/* Notes */}
                                    {booking.catatan && (
                                        <div className="border-background rounded-lg border bg-gray-50 p-4">
                                            <h4 className="mb-2 font-medium text-gray-900">Notes</h4>
                                            <p className="text-sm leading-relaxed text-gray-700">{booking.catatan}</p>
                                        </div>
                                    )}

                                    {/* Admin Notes (if rejected) */}
                                    {booking.status === 'rejected' && booking.admin_notes && (
                                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                            <h4 className="mb-2 flex items-center gap-2 font-medium text-red-800">
                                                <XCircle className="h-4 w-4" />
                                                Rejection Reason
                                            </h4>
                                            <p className="text-sm leading-relaxed text-red-700">{booking.admin_notes}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6 lg:col-span-1">
                            {/* Status Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Booking Status</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-center">{getStatusBadge(booking.status)}</div>

                                    {booking.status === 'pending' && (
                                        <div className="text-center text-sm text-gray-600">
                                            <p>Your booking is waiting for admin approval.</p>
                                        </div>
                                    )}

                                    {booking.status === 'approved' && (
                                        <div className="text-center text-sm text-gray-600">
                                            <p>Your booking has been approved! You can use the room at the scheduled time.</p>
                                        </div>
                                    )}

                                    {booking.status === 'rejected' && (
                                        <div className="text-center text-sm text-gray-600">
                                            <p>Unfortunately, your booking request was rejected.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            {(canEdit || canCancel) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {canEdit && (
                                            <Button asChild variant="outline" className="w-full">
                                                <Link href={`/my-bookings/${booking.id}/edit`}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Booking
                                                </Link>
                                            </Button>
                                        )}

                                        {canCancel && (
                                            <Button variant="destructive" className="w-full" onClick={handleCancelBooking}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Cancel Booking
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Timeline */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Timeline</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                            <FileText className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">Submitted</p>
                                            <p className="text-sm text-gray-500">{formatDateTime(booking.created_at)}</p>
                                        </div>
                                    </div>

                                    {booking.status !== 'pending' && (
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                                    booking.status === 'approved' ? 'bg-green-100' : 'bg-red-100'
                                                }`}
                                            >
                                                {booking.status === 'approved' ? (
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 text-red-600" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{booking.status === 'approved' ? 'Approved' : 'Rejected'}</p>
                                                <p className="text-sm text-gray-500">{formatDateTime(booking.updated_at)}</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Quick Navigation */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Navigation</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button asChild variant="outline" className="w-full">
                                        <Link href="/my-bookings">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            All My Bookings
                                        </Link>
                                    </Button>

                                    <Button asChild variant="secondary" className="w-full">
                                        <Link href={`/?date=${booking.booking_date}`}>
                                            <Calendar className="mr-2 h-4 w-4" />
                                            View Schedule
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
