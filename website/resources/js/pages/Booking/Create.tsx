import Navbar from '@/components/Client/Navbar/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-grup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Room, TimeSlot } from '@/types/admin';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, Calendar, CheckCircle, Clock, Save, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    room?: Room;
    timeSlot?: TimeSlot;
    date: string;
    isSlotAvailable?: boolean;
    allRooms: Room[];
    allTimeSlots: TimeSlot[];
}

interface AvailabilityStatus {
    available: boolean;
    message: string;
    loading: boolean;
}

export default function CreateBooking({ room, timeSlot, date, isSlotAvailable = true, allRooms, allTimeSlots }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        room_id: room?.id || '',
        time_slot_id: timeSlot?.id || '',
        booking_date: date,
        keperluan: 'kelas' as 'kelas' | 'rapat' | 'lainnya',
        mata_kuliah: '',
        dosen: '',
        catatan: '',
    });

    const [availability, setAvailability] = useState<AvailabilityStatus>({
        available: isSlotAvailable,
        message: isSlotAvailable ? 'This time slot is available' : 'This time slot is not available',
        loading: false,
    });

    // Check availability when room, time slot, or date changes
    useEffect(() => {
        const checkAvailability = async () => {
            if (!data.room_id || !data.time_slot_id || !data.booking_date) {
                setAvailability({
                    available: false,
                    message: 'Please select room, time slot, and date',
                    loading: false,
                });
                return;
            }

            setAvailability((prev) => ({ ...prev, loading: true }));

            try {
                const response = await fetch(
                    `/booking/check-availability?room_id=${data.room_id}&time_slot_id=${data.time_slot_id}&date=${data.booking_date}`,
                );
                const result = await response.json();

                setAvailability({
                    available: result.available,
                    message: result.message,
                    loading: false,
                });
            } catch (error) {
                setAvailability({
                    available: false,
                    message: 'Error checking availability',
                    loading: false,
                });
            }
        };

        // Debounce the availability check
        const timeoutId = setTimeout(checkAvailability, 300);
        return () => clearTimeout(timeoutId);
    }, [data.room_id, data.time_slot_id, data.booking_date]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!availability.available) {
            return;
        }
        post('/booking');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const selectedRoom = allRooms.find((r) => r.id.toString() === data.room_id.toString());
    const selectedTimeSlot = allTimeSlots.find((ts) => ts.id.toString() === data.time_slot_id.toString());

    const AvailabilityIndicator = () => {
        if (availability.loading) {
            return (
                <div className="flex items-center space-x-2 text-blue-600">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    <span className="text-sm">Checking availability...</span>
                </div>
            );
        }

        return (
            <div className={`flex items-center space-x-2 ${availability.available ? 'text-green-600' : 'text-red-600'}`}>
                {availability.available ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                <span className="text-sm font-medium">{availability.message}</span>
            </div>
        );
    };

    return (
        <>
            <Head title="Book Room" />

            <div className="min-h-screen bg-gray-50 font-sans">
                {/* Navigation */}
                <Navbar />

                <div className="mx-auto max-w-3xl px-4 py-8 pt-32">
                    <div className="mb-8">
                        <Button asChild variant="outline" className="mb-4">
                            <Link href={`/?date=${date}`}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Schedule
                            </Link>
                        </Button>

                        <h1 className="mb-2 text-3xl font-bold text-gray-900">Book Room</h1>
                        <p className="text-gray-600">Fill out the form below to request a room booking</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Booking Form */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Booking Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Date Selection */}
                                        <div className="space-y-2">
                                            <Label htmlFor="booking_date">Date *</Label>
                                            <Input
                                                id="booking_date"
                                                type="date"
                                                value={data.booking_date}
                                                onChange={(e) => setData('booking_date', e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                className={errors.booking_date ? 'border-red-500' : ''}
                                            />
                                            {errors.booking_date && <p className="text-sm text-red-600">{errors.booking_date}</p>}
                                        </div>

                                        {/* Room Selection */}
                                        <div className="space-y-2">
                                            <Label htmlFor="room_id">Room *</Label>
                                            <Select value={data.room_id.toString()} onValueChange={(value) => setData('room_id', value)}>
                                                <SelectTrigger className={errors.room_id ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Select a room" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-on-background">
                                                    {allRooms.map((room) => (
                                                        <SelectItem key={room.id} value={room.id.toString()}>
                                                            {room.name} (Capacity: {room.capacity})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.room_id && <p className="text-sm text-red-600">{errors.room_id}</p>}
                                        </div>

                                        {/* Time Slot Selection */}
                                        <div className="space-y-2">
                                            <Label htmlFor="time_slot_id">Time Slot *</Label>
                                            <Select value={data.time_slot_id.toString()} onValueChange={(value) => setData('time_slot_id', value)}>
                                                <SelectTrigger className={errors.time_slot_id ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Select a time slot" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-on-background">
                                                    {allTimeSlots.map((timeSlot) => (
                                                        <SelectItem key={timeSlot.id} value={timeSlot.id.toString()}>
                                                            {timeSlot.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.time_slot_id && <p className="text-sm text-red-600">{errors.time_slot_id}</p>}
                                        </div>

                                        {/* Availability Status */}
                                        <div className="rounded-lg border p-4">
                                            <Label className="text-base font-medium">Availability Status</Label>
                                            <div className="mt-2">
                                                <AvailabilityIndicator />
                                            </div>
                                        </div>

                                        {/* Purpose */}
                                        <div className="space-y-3">
                                            <Label className="text-base font-medium">Purpose *</Label>
                                            <RadioGroup
                                                value={data.keperluan}
                                                onValueChange={(value) => setData('keperluan', value as 'kelas' | 'rapat' | 'lainnya')}
                                                className="flex flex-col space-y-2"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="kelas" id="kelas" />
                                                    <Label htmlFor="kelas" className="cursor-pointer">
                                                        Class (Kelas)
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="rapat" id="rapat" />
                                                    <Label htmlFor="rapat" className="cursor-pointer">
                                                        Meeting (Rapat)
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="lainnya" id="lainnya" />
                                                    <Label htmlFor="lainnya" className="cursor-pointer">
                                                        Others (Lainnya)
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                            {errors.keperluan && <p className="text-sm text-red-600">{errors.keperluan}</p>}
                                        </div>

                                        {/* Subject (if class) */}
                                        {data.keperluan === 'kelas' && (
                                            <div className="space-y-2">
                                                <Label htmlFor="mata_kuliah">Subject / Course *</Label>
                                                <Input
                                                    id="mata_kuliah"
                                                    value={data.mata_kuliah}
                                                    onChange={(e) => setData('mata_kuliah', e.target.value)}
                                                    placeholder="e.g., Kalkulus 2, Pemrograman Web"
                                                    className={errors.mata_kuliah ? 'border-red-500' : ''}
                                                />
                                                {errors.mata_kuliah && <p className="text-sm text-red-600">{errors.mata_kuliah}</p>}
                                            </div>
                                        )}

                                        {/* Lecturer/PIC */}
                                        <div className="space-y-2">
                                            <Label htmlFor="dosen">{data.keperluan === 'kelas' ? 'Lecturer' : 'Person in Charge'}</Label>
                                            <Input
                                                id="dosen"
                                                value={data.dosen}
                                                onChange={(e) => setData('dosen', e.target.value)}
                                                placeholder="e.g., Dr. John Smith"
                                                className={errors.dosen ? 'border-red-500' : ''}
                                            />
                                            {errors.dosen && <p className="text-sm text-red-600">{errors.dosen}</p>}
                                        </div>

                                        {/* Notes (required if others) */}
                                        <div className="space-y-2">
                                            <Label htmlFor="catatan">Notes {data.keperluan === 'lainnya' && '*'}</Label>
                                            <Textarea
                                                id="catatan"
                                                value={data.catatan}
                                                onChange={(e) => setData('catatan', e.target.value)}
                                                placeholder={
                                                    data.keperluan === 'lainnya'
                                                        ? 'Please describe the purpose of your booking...'
                                                        : 'Any additional notes (optional)'
                                                }
                                                rows={3}
                                                className={errors.catatan ? 'border-red-500' : ''}
                                            />
                                            {errors.catatan && <p className="text-sm text-red-600">{errors.catatan}</p>}
                                        </div>

                                        {/* Form Actions */}
                                        <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                                            <Button
                                                type="submit"
                                                variant={'secondary'}
                                                disabled={processing || !availability.available || availability.loading}
                                                className="flex-1"
                                            >
                                                {processing ? (
                                                    <>
                                                        <div className="border-background mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="mr-2 h-4 w-4" />
                                                        Submit Booking Request
                                                    </>
                                                )}
                                            </Button>

                                            <Button asChild variant="outline" className="flex-1">
                                                <Link href={`/?date=${data.booking_date}`}>Cancel</Link>
                                            </Button>
                                        </div>

                                        {/* Validation Summary */}
                                        {Object.keys(errors).length > 0 && (
                                            <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4">
                                                <h4 className="mb-2 text-sm font-medium text-red-800">Please fix the following errors:</h4>
                                                <ul className="space-y-1 text-sm text-red-700">
                                                    {Object.entries(errors).map(([key, message]) => (
                                                        <li key={key}>• {message}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Booking Summary */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Booking Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="rounded-lg bg-blue-50 p-4">
                                        <div className="mb-2 flex items-center">
                                            <Building2 className="mr-2 h-5 w-5 text-blue-600" />
                                            <span className="font-semibold text-blue-900">Room</span>
                                        </div>
                                        {selectedRoom ? (
                                            <>
                                                <p className="font-medium text-blue-800">{selectedRoom.name}</p>
                                                <p className="text-sm text-blue-600">Capacity: {selectedRoom.capacity} people</p>
                                                {selectedRoom.facilities && <p className="mt-1 text-sm text-blue-600">{selectedRoom.facilities}</p>}
                                            </>
                                        ) : (
                                            <p className="text-sm text-blue-600">Please select a room</p>
                                        )}
                                    </div>

                                    <div className="rounded-lg bg-green-50 p-4">
                                        <div className="mb-2 flex items-center">
                                            <Clock className="mr-2 h-5 w-5 text-green-600" />
                                            <span className="font-semibold text-green-900">Time</span>
                                        </div>
                                        {selectedTimeSlot ? (
                                            <p className="font-medium text-green-800">{selectedTimeSlot.label}</p>
                                        ) : (
                                            <p className="text-sm text-green-600">Please select a time slot</p>
                                        )}
                                    </div>

                                    <div className="rounded-lg bg-purple-50 p-4">
                                        <div className="mb-2 flex items-center">
                                            <Calendar className="mr-2 h-5 w-5 text-purple-600" />
                                            <span className="font-semibold text-purple-900">Date</span>
                                        </div>
                                        <p className="font-medium text-purple-800">{formatDate(data.booking_date)}</p>
                                    </div>

                                    <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                        <h4 className="mb-2 font-medium text-yellow-800">Important Notes:</h4>
                                        <ul className="space-y-1 text-sm text-yellow-700">
                                            <li>• Your booking requires admin approval</li>
                                            <li>• You'll receive notification once approved</li>
                                            <li>• Bookings can be edited until approved</li>
                                            <li>• Check availability before submitting</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
