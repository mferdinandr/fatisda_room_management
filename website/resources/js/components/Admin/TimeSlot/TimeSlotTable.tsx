import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { TimeSlot } from '@/types/admin';
import { Link, router } from '@inertiajs/react';
import { Clock, Edit, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface TimeSlotTableProps {
    timeSlots: TimeSlot[];
}

export default function TimeSlotTable({ timeSlots }: TimeSlotTableProps) {
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const handleDelete = (timeSlotId: number, timeSlotLabel: string) => {
        if (confirm(`Are you sure you want to delete "${timeSlotLabel}"?`)) {
            setIsDeleting(timeSlotId);
            router.delete(`/admin/time-slots/${timeSlotId}`, {
                onFinish: () => setIsDeleting(null),
            });
        }
    };

    const formatTime = (timeString: string) => {
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    if (timeSlots.length === 0) {
        return (
            <div className="text-muted-foreground py-12 text-center">
                <Clock className="mx-auto mb-4 h-16 w-16 opacity-50" />
                <h3 className="mb-2 text-lg font-semibold">No time slots found</h3>
                <p className="mb-4 text-sm">Start by adding your first time slot to the system</p>
                <Button asChild>
                    <Link href="/admin/time-slots/create">Add Your First Time Slot</Link>
                </Button>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Time Range</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {timeSlots.map((timeSlot) => {
                    const startTime = new Date(`1970-01-01T${timeSlot.start_time}`);
                    const endTime = new Date(`1970-01-01T${timeSlot.end_time}`);
                    const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)); // minutes

                    return (
                        <TableRow key={timeSlot.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center">
                                    <Clock className="text-muted-foreground mr-2 h-4 w-4" />
                                    <span className="font-semibold">{timeSlot.label}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="font-mono text-sm">{formatTime(timeSlot.start_time)}</span>
                            </TableCell>
                            <TableCell>
                                <span className="font-mono text-sm">{formatTime(timeSlot.end_time)}</span>
                            </TableCell>
                            <TableCell>
                                <span className="text-muted-foreground text-sm">{duration} min</span>
                            </TableCell>
                            <TableCell>
                                <Badge variant={timeSlot.is_active ? 'default' : 'secondary'}>{timeSlot.is_active ? 'Active' : 'Inactive'}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                    <Button asChild variant="outline" size="sm" title="View details">
                                        <Link href={`/admin/time-slots/${timeSlot.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>

                                    <Button asChild variant="secondary" size="sm" title="Edit time slot">
                                        <Link href={`/admin/time-slots/${timeSlot.id}/edit`}>
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(timeSlot.id, timeSlot.label)}
                                        disabled={isDeleting === timeSlot.id}
                                        title="Delete time slot"
                                        className="hover:bg-destructive hover:text-destructive-foreground"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
