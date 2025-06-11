// resources/js/Pages/Booking/Create.tsx

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-grup';
import { Textarea } from '@/components/ui/textarea';
import type { Room, TimeSlot } from '@/types/admin';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, Calendar, Clock, Save } from 'lucide-react';

interface Props {
    room: Room;
    timeSlot: TimeSlot;
    date: string;
}

export default function CreateBooking({ room, timeSlot, date }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        room_id: room.id,
        time_slot_id: timeSlot.id,
        booking_date: date,
        keperluan: 'kelas' as 'kelas' | 'rapat' | 'lainnya',
        mata_kuliah: '',
        dosen: '',
        catatan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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

    return (
        <>
            <Head title="Book Room" />

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
                                    <Link href="/my-bookings">My Bookings</Link>
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

                <div className="mx-auto max-w-3xl px-4 py-8">
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
                                                    <Label htmlFor="kelas">Class (Kelas)</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="rapat" id="rapat" />
                                                    <Label htmlFor="rapat">Meeting (Rapat)</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="lainnya" id="lainnya" />
                                                    <Label htmlFor="lainnya">Others (Lainnya)</Label>
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
                                            <Button type="submit" variant={'secondary'} disabled={processing} className="flex-1">
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
                                                <Link href={`/?date=${date}`}>Cancel</Link>
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
                                        <p className="font-medium text-blue-800">{room.name}</p>
                                        <p className="text-sm text-blue-600">Capacity: {room.capacity} people</p>
                                        {room.facilities && <p className="mt-1 text-sm text-blue-600">{room.facilities}</p>}
                                    </div>

                                    <div className="rounded-lg bg-green-50 p-4">
                                        <div className="mb-2 flex items-center">
                                            <Clock className="mr-2 h-5 w-5 text-green-600" />
                                            <span className="font-semibold text-green-900">Time</span>
                                        </div>
                                        <p className="font-medium text-green-800">{timeSlot.label}</p>
                                    </div>

                                    <div className="rounded-lg bg-purple-50 p-4">
                                        <div className="mb-2 flex items-center">
                                            <Calendar className="mr-2 h-5 w-5 text-purple-600" />
                                            <span className="font-semibold text-purple-900">Date</span>
                                        </div>
                                        <p className="font-medium text-purple-800">{formatDate(date)}</p>
                                    </div>

                                    <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                        <h4 className="mb-2 font-medium text-yellow-800">Important Notes:</h4>
                                        <ul className="space-y-1 text-sm text-yellow-700">
                                            <li>• Your booking requires admin approval</li>
                                            <li>• You'll receive notification once approved</li>
                                            <li>• Bookings can be edited until approved</li>
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
