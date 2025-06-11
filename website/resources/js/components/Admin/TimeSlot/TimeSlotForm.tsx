import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TimeSlot } from '@/types/admin';
import { useForm } from '@inertiajs/react';
import { ArrowLeft, Clock, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TimeSlotFormProps {
    timeSlot?: TimeSlot;
    isEditing?: boolean;
    onCancel?: () => void;
}

export default function TimeSlotForm({ timeSlot, isEditing = false, onCancel }: TimeSlotFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        start_time: timeSlot?.start_time || '',
        end_time: timeSlot?.end_time || '',
        is_active: timeSlot?.is_active ?? true,
    });

    const [previewLabel, setPreviewLabel] = useState('');

    // Update preview label when times change
    useEffect(() => {
        if (data.start_time && data.end_time) {
            setPreviewLabel(`${data.start_time} - ${data.end_time}`);
        } else {
            setPreviewLabel('');
        }
    }, [data.start_time, data.end_time]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && timeSlot) {
            put(`/admin/time-slots/${timeSlot.id}`, {
                onSuccess: () => {
                    // Handle success (redirect will be handled by controller)
                },
            });
        } else {
            post('/admin/time-slots', {
                onSuccess: () => {
                    reset();
                },
            });
        }
    };

    // Generate common time options
    const generateTimeOptions = () => {
        const options = [];
        for (let hour = 6; hour <= 22; hour++) {
            for (let minute of [0, 30]) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const displayTime = new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                });
                options.push({ value: timeString, label: displayTime });
            }
        }
        return options;
    };

    const timeOptions = generateTimeOptions();

    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    {isEditing ? 'Edit Time Slot' : 'Create New Time Slot'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Preview Label */}
                    {previewLabel && (
                        <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
                            <div className="flex items-center">
                                <Clock className="mr-2 h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium text-blue-900">Preview</p>
                                    <p className="text-lg font-semibold text-blue-800">{previewLabel}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Start Time */}
                        <div className="space-y-2">
                            <Label htmlFor="start_time">Start Time *</Label>
                            <div className="space-y-2">
                                <Input
                                    id="start_time"
                                    type="time"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                    className={errors.start_time ? 'border-destructive' : ''}
                                />

                                {/* Quick Select Buttons */}
                                <div className="flex flex-wrap gap-1">
                                    {timeOptions.slice(0, 8).map((option) => (
                                        <Button
                                            key={option.value}
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setData('start_time', option.value)}
                                            className="h-7 text-xs"
                                        >
                                            {option.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            {errors.start_time && <p className="text-sm text-red-600">{errors.start_time}</p>}
                        </div>

                        {/* End Time */}
                        <div className="space-y-2">
                            <Label htmlFor="end_time">End Time *</Label>
                            <div className="space-y-2">
                                <Input
                                    id="end_time"
                                    type="time"
                                    value={data.end_time}
                                    onChange={(e) => setData('end_time', e.target.value)}
                                    className={errors.end_time ? 'border-destructive' : ''}
                                />

                                {/* Quick Select Buttons */}
                                <div className="flex flex-wrap gap-1">
                                    {timeOptions.slice(8, 16).map((option) => (
                                        <Button
                                            key={option.value}
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setData('end_time', option.value)}
                                            className="h-7 text-xs"
                                        >
                                            {option.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            {errors.end_time && <p className="text-destructive text-sm">{errors.end_time}</p>}
                        </div>
                    </div>

                    {/* Quick Presets */}
                    <div className="space-y-2">
                        <Label>Common Time Slots</Label>
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                            {[
                                { start: '07:00', end: '08:00', label: '07:00-08:00' },
                                { start: '08:00', end: '09:00', label: '08:00-09:00' },
                                { start: '09:00', end: '10:00', label: '09:00-10:00' },
                                { start: '10:00', end: '11:00', label: '10:00-11:00' },
                                { start: '13:00', end: '14:00', label: '13:00-14:00' },
                                { start: '14:00', end: '15:00', label: '14:00-15:00' },
                                { start: '15:00', end: '16:00', label: '15:00-16:00' },
                                { start: '16:00', end: '17:00', label: '16:00-17:00' },
                            ].map((preset) => (
                                <Button
                                    key={preset.label}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setData({
                                            ...data,
                                            start_time: preset.start,
                                            end_time: preset.end,
                                        });
                                    }}
                                    className="text-xs"
                                >
                                    {preset.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center space-x-2">
                        <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked as boolean)} />
                        <Label
                            htmlFor="is_active"
                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Time slot is active and available for booking
                        </Label>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col gap-4 pt-6 sm:flex-row">
                        <Button type="submit" variant={'secondary'} disabled={processing} className="flex-1 sm:flex-none">
                            {processing ? (
                                <>
                                    <div className="border-background mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                                    {isEditing ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    {isEditing ? 'Update Time Slot' : 'Create Time Slot'}
                                </>
                            )}
                        </Button>

                        <Button type="button" variant="destructive" onClick={onCancel} disabled={processing} className="flex-1 sm:flex-none">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                    </div>

                    {/* Validation Summary */}
                    {(Object.keys(errors).length > 0 || errors.time_conflict) && (
                        <div className="bg-destructive/10 border-destructive/20 mt-4 rounded-md border p-4">
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
