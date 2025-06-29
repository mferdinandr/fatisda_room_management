import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { PaginatedBookings } from '@/types/admin';
import { Link, router } from '@inertiajs/react';
import { Building2, Calendar, Check, Clock, Eye, MoreHorizontal, Trash2, User, X } from 'lucide-react';
import { useState } from 'react';

interface BookingTableProps {
    bookings: PaginatedBookings;
}

export default function BookingTable({ bookings }: BookingTableProps) {
    const [selectedBookings, setSelectedBookings] = useState<number[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const pendingIds = bookings.data.filter((booking) => booking.status === 'pending').map((booking) => booking.id);
            setSelectedBookings(pendingIds);
        } else {
            setSelectedBookings([]);
        }
    };

    const handleSelectBooking = (bookingId: number, checked: boolean) => {
        if (checked) {
            setSelectedBookings((prev) => [...prev, bookingId]);
        } else {
            setSelectedBookings((prev) => prev.filter((id) => id !== bookingId));
        }
    };

    const handleBulkApprove = () => {
        if (selectedBookings.length === 0) return;

        setIsProcessing(true);
        router.post(
            '/admin/bookings/bulk-approve',
            {
                booking_ids: selectedBookings,
            },
            {
                onFinish: () => {
                    setIsProcessing(false);
                    setSelectedBookings([]);
                },
            },
        );
    };

    const handleBulkReject = () => {
        if (selectedBookings.length === 0) return;

        const notes = prompt('Enter rejection reason:');
        if (!notes) return;

        setIsProcessing(true);
        router.post(
            '/admin/bookings/bulk-reject',
            {
                booking_ids: selectedBookings,
                admin_notes: notes,
            },
            {
                onFinish: () => {
                    setIsProcessing(false);
                    setSelectedBookings([]);
                },
            },
        );
    };

    const handleQuickApprove = (bookingId: number) => {
        router.post(`/admin/bookings/${bookingId}/approve`, {});
    };

    const handleQuickReject = (bookingId: number) => {
        const notes = prompt('Enter rejection reason:');
        if (!notes) return;

        router.post(`/admin/bookings/${bookingId}/reject`, {
            admin_notes: notes,
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Pending
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
            month: 'short',
            day: 'numeric',
            year: 'numeric',
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

    if (bookings.data.length === 0) {
        return (
            <div className="text-muted-foreground py-12 text-center">
                <Calendar className="mx-auto mb-4 h-16 w-16 opacity-50" />
                <h3 className="mb-2 text-lg font-semibold">No bookings found</h3>
                <p className="text-sm">No booking requests match your current filters</p>
            </div>
        );
    }

    const pendingCount = bookings.data.filter((b) => b.status === 'pending').length;

    return (
        <div className="space-y-4">
            {/* Bulk Actions */}
            {selectedBookings.length > 0 && (
                <div className="flex flex-col gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm font-medium text-blue-900">{selectedBookings.length} booking(s) selected</span>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Button size="sm" onClick={handleBulkApprove} disabled={isProcessing} className="bg-green-600 hover:bg-green-700">
                            <Check className="mr-1 h-4 w-4" />
                            Approve Selected
                        </Button>
                        <Button size="sm" variant="destructive" onClick={handleBulkReject} disabled={isProcessing}>
                            <X className="mr-1 h-4 w-4" />
                            Reject Selected
                        </Button>
                    </div>
                </div>
            )}

            {/* Mobile View */}
            <div className="block space-y-4 lg:hidden">
                {bookings.data.map((booking) => (
                    <div key={booking.id} className="space-y-4 rounded-lg border bg-white p-4">
                        {/* Header with checkbox and status */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                {booking.status === 'pending' && (
                                    <Checkbox
                                        checked={selectedBookings.includes(booking.id)}
                                        onCheckedChange={(checked) => handleSelectBooking(booking.id, checked as boolean)}
                                    />
                                )}
                                <span className="text-sm font-medium">#{booking.id}</span>
                            </div>
                            {getStatusBadge(booking.status)}
                        </div>

                        {/* User Info */}
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <User className="text-muted-foreground mr-2 h-4 w-4" />
                                <span className="font-medium">{booking.user?.name}</span>
                            </div>
                            {booking.mata_kuliah && <p className="text-muted-foreground ml-6 text-sm">Subject: {booking.mata_kuliah}</p>}
                            {booking.dosen && <p className="text-muted-foreground ml-6 text-sm">Lecturer: {booking.dosen}</p>}
                        </div>

                        {/* Room & Time Info */}
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <Building2 className="text-muted-foreground mr-2 h-4 w-4" />
                                <span className="font-medium">{booking.room?.name}</span>
                            </div>
                            <div className="text-muted-foreground ml-6 flex items-center text-sm">
                                <Calendar className="mr-1 h-3 w-3" />
                                {formatDate(booking.booking_date)}
                            </div>
                            <div className="text-muted-foreground ml-6 flex items-center text-sm">
                                <Clock className="mr-1 h-3 w-3" />
                                {booking.time_slot?.label}
                            </div>
                        </div>

                        {/* Purpose */}
                        <div>
                            <Badge variant="secondary" className="text-black capitalize">
                                {booking.keperluan}
                            </Badge>
                            {booking.catatan && <p className="text-muted-foreground mt-1 text-xs break-words">{booking.catatan}</p>}
                        </div>

                        {/* Admin Notes */}
                        {booking.admin_notes && (
                            <p className="text-muted-foreground text-xs break-words">
                                <strong>Admin Note:</strong> {booking.admin_notes}
                            </p>
                        )}

                        {/* Submitted Time */}
                        <p className="text-muted-foreground text-xs">Submitted: {formatDateTime(booking.created_at)}</p>

                        {/* Actions */}
                        <div className="flex items-center justify-between border-t pt-3">
                            <div className="flex gap-2">
                                {booking.status === 'pending' && (
                                    <>
                                        <Button size="sm" onClick={() => handleQuickApprove(booking.id)} className="bg-green-600 hover:bg-green-700">
                                            <Check className="mr-1 h-4 w-4" />
                                            Approve
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleQuickReject(booking.id)}>
                                            <X className="mr-1 h-4 w-4" />
                                            Reject
                                        </Button>
                                    </>
                                )}
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href={`/admin/bookings/${booking.id}`}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Details
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.delete(`/admin/bookings/${booking.id}`)} className="text-red-600">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden overflow-x-auto lg:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox checked={selectedBookings.length === pendingCount && pendingCount > 0} onCheckedChange={handleSelectAll} />
                            </TableHead>
                            <TableHead className="min-w-[200px]">User & Details</TableHead>
                            <TableHead className="min-w-[180px]">Room & Time</TableHead>
                            <TableHead className="min-w-[120px]">Purpose</TableHead>
                            <TableHead className="min-w-[100px]">Status</TableHead>
                            <TableHead className="min-w-[120px]">Submitted</TableHead>
                            <TableHead className="min-w-[150px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.data.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>
                                    {booking.status === 'pending' && (
                                        <Checkbox
                                            checked={selectedBookings.includes(booking.id)}
                                            onCheckedChange={(checked) => handleSelectBooking(booking.id, checked as boolean)}
                                        />
                                    )}
                                </TableCell>

                                <TableCell>
                                    <div className="max-w-[200px] space-y-1">
                                        <div className="flex items-center">
                                            <User className="text-muted-foreground mr-2 h-4 w-4 flex-shrink-0" />
                                            <span className="truncate font-medium">{booking.user?.name}</span>
                                        </div>
                                        {booking.mata_kuliah && (
                                            <p className="text-muted-foreground truncate text-sm">Subject: {booking.mata_kuliah}</p>
                                        )}
                                        {booking.dosen && <p className="text-muted-foreground truncate text-sm">Lecturer: {booking.dosen}</p>}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="max-w-[180px] space-y-1">
                                        <div className="flex items-center">
                                            <Building2 className="text-muted-foreground mr-2 h-4 w-4 flex-shrink-0" />
                                            <span className="truncate font-medium">{booking.room?.name}</span>
                                        </div>
                                        <div className="text-muted-foreground flex items-center text-sm">
                                            <Calendar className="mr-1 h-3 w-3 flex-shrink-0" />
                                            <span className="truncate">{formatDate(booking.booking_date)}</span>
                                        </div>
                                        <div className="text-muted-foreground flex items-center text-sm">
                                            <Clock className="mr-1 h-3 w-3 flex-shrink-0" />
                                            <span className="truncate">{booking.time_slot?.label}</span>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="max-w-[120px] space-y-1">
                                        <Badge variant="secondary" className="text-black capitalize">
                                            {booking.keperluan}
                                        </Badge>
                                        {booking.catatan && (
                                            <p className="text-muted-foreground max-w-xs truncate text-xs" title={booking.catatan}>
                                                {booking.catatan}
                                            </p>
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="max-w-[100px] space-y-1">
                                        {getStatusBadge(booking.status)}
                                        {booking.admin_notes && (
                                            <p className="text-muted-foreground mt-1 max-w-xs truncate text-xs" title={booking.admin_notes}>
                                                Note: {booking.admin_notes}
                                            </p>
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <span className="text-muted-foreground text-sm whitespace-nowrap">{formatDateTime(booking.created_at)}</span>
                                </TableCell>

                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        {booking.status === 'pending' && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleQuickApprove(booking.id)}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleQuickReject(booking.id)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-white">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/bookings/${booking.id}`}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => router.delete(`/admin/bookings/${booking.id}`)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {bookings.links && bookings.meta && (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-muted-foreground text-center text-sm sm:text-left">
                        Showing {bookings.meta.from || 0} to {bookings.meta.to || 0} of {bookings.meta.total || 0} results
                    </div>
                    <div className="flex justify-center sm:justify-end">
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                            {bookings.links.map((link: any, index: number) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className="min-w-[40px]"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
