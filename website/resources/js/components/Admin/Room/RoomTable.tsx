// resources/js/Components/Admin/Room/RoomTable.tsx

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Room } from '@/types/admin';
import { Link, router } from '@inertiajs/react';
import { Building2, Edit, Eye, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

interface RoomTableProps {
    rooms: Room[];
}

export default function RoomTable({ rooms }: RoomTableProps) {
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const handleDelete = (roomId: number, roomName: string) => {
        if (confirm(`Are you sure you want to delete "${roomName}"?`)) {
            setIsDeleting(roomId);
            router.delete(`/admin/rooms/${roomId}`, {
                onFinish: () => setIsDeleting(null),
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (rooms.length === 0) {
        return (
            <div className="text-muted-foreground py-12 text-center">
                <Building2 className="mx-auto mb-4 h-16 w-16 opacity-50" />
                <h3 className="mb-2 text-lg font-semibold">No rooms found</h3>
                <p className="mb-4 text-sm">Start by adding your first room to the system</p>
                <Button asChild>
                    <Link href="/admin/rooms/create">Add Your First Room</Link>
                </Button>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Facilities</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rooms.map((room) => (
                    <TableRow key={room.id}>
                        <TableCell className="font-medium">
                            <div className="flex items-center">
                                <Building2 className="text-muted-foreground mr-2 h-4 w-4" />
                                {room.name}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center">
                                <Users className="text-muted-foreground mr-1 h-4 w-4" />
                                <span className="font-medium">{room.capacity}</span>
                                <span className="text-muted-foreground ml-1">people</span>
                            </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                            <div className="truncate" title={room.facilities || ''}>
                                {room.facilities || <span className="text-muted-foreground italic">No facilities listed</span>}
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant={room.is_active ? 'default' : 'secondary'}>{room.is_active ? 'Active' : 'Inactive'}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(room.created_at)}</TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                                <Button asChild variant="outline" size="sm" title="View details">
                                    <Link href={`/admin/rooms/${room.id}`}>
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </Button>

                                <Button asChild variant="secondary" size="sm" title="Edit room">
                                    <Link href={`/admin/rooms/${room.id}/edit`}>
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                </Button>

                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(room.id, room.name)}
                                    disabled={isDeleting === room.id}
                                    title="Delete room"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
