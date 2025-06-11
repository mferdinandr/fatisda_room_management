// resources/js/Components/Admin/Room/RoomForm.tsx
// Simplest solution: Let TypeScript infer the type

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Room } from '@/types/admin';
import { useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

interface RoomFormProps {
    room?: Room;
    isEditing?: boolean;
    onCancel?: () => void;
}

export default function RoomForm({ room, isEditing = false, onCancel }: RoomFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: room?.name || '',
        capacity: room?.capacity || 1,
        facilities: room?.facilities || '',
        is_active: room?.is_active ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && room) {
            put(`/admin/rooms/${room.id}`, {
                onSuccess: () => {
                    // Handle success (redirect will be handled by controller)
                },
            });
        } else {
            post('/admin/rooms', {
                onSuccess: () => {
                    reset();
                },
            });
        }
    };

    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle>{isEditing ? 'Edit Room' : 'Create New Room'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Room Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Room Name *</Label>
                        <Input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g., Ruangan 1, Lab Komputer, Aula Besar"
                            className={errors.name ? 'border-red-600' : ''}
                        />
                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Capacity */}
                    <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity (people) *</Label>
                        <Input
                            id="capacity"
                            type="number"
                            min="1"
                            max="1000"
                            value={data.capacity}
                            onChange={(e) => setData('capacity', parseInt(e.target.value) || 1)}
                            placeholder="e.g., 30"
                            className={errors.capacity ? 'border-red-600' : ''}
                        />
                        {errors.capacity && <p className="text-sm text-red-600">{errors.capacity}</p>}
                    </div>

                    {/* Facilities */}
                    <div className="space-y-2">
                        <Label htmlFor="facilities">Facilities</Label>
                        <Textarea
                            id="facilities"
                            value={data.facilities}
                            onChange={(e) => setData('facilities', e.target.value)}
                            placeholder="e.g., Proyektor, AC, Whiteboard, Sound System"
                            rows={3}
                            className={errors.facilities ? 'border-red-600' : ''}
                        />
                        <p className="text-muted-foreground text-sm">List the available facilities in this room (optional)</p>
                        {errors.facilities && <p className="text-sm text-red-600">{errors.facilities}</p>}
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center space-x-2">
                        <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked as boolean)} />
                        <Label
                            htmlFor="is_active"
                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Room is active and available for booking
                        </Label>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col gap-4 pt-6 sm:flex-row">
                        <Button type="submit" disabled={processing} className="flex-1 sm:flex-none" variant={`secondary`}>
                            {processing ? (
                                <>
                                    <div className="border-background mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                                    {isEditing ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    {isEditing ? 'Update Room' : 'Create Room'}
                                </>
                            )}
                        </Button>

                        <Button type="button" variant="destructive" onClick={onCancel} disabled={processing} className="flex-1 sm:flex-none">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                    </div>

                    {/* Validation Summary */}
                    {Object.keys(errors).length > 0 && (
                        <div className="mt-4 rounded-md border border-red-600/20 bg-red-600/10 p-4">
                            <h4 className="mb-2 text-sm font-medium text-red-600">Please fix the following errors:</h4>
                            <ul className="space-y-1 text-sm text-red-600">
                                {Object.entries(errors).map(([key, message]) => (
                                    <li key={key}>• {message}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
