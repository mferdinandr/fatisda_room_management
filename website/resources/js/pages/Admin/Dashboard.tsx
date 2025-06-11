import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Building2, Calendar, CheckCircle, Clock, Plus, Users } from 'lucide-react';

import AdminLayout from '@/components/Admin/Layout/AdminLayout';
import StatsCard from '@/components/Admin/Shared/StatsCard';
import { Badge } from '@/components/ui/badge';
import type { AdminStats } from '@/types/admin';

interface Props {
    stats: AdminStats;
}

export default function AdminDashboard({ stats }: Props) {
    return (
        <AdminLayout title="Admin Dashboard" currentRoute="admin.dashboard">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-2 text-gray-600">Welcome to FATISDA Room Booking Management System</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Rooms"
                        value={stats.total_rooms}
                        description="All rooms in system"
                        icon={<Building2 className="h-4 w-4" />}
                    />

                    <StatsCard
                        title="Active Rooms"
                        value={stats.active_rooms}
                        description="Available for booking"
                        icon={<CheckCircle className="h-4 w-4" />}
                    />

                    <StatsCard
                        title="Time Slots"
                        value={stats.total_time_slots}
                        description="Available time periods"
                        icon={<Clock className="h-4 w-4" />}
                    />

                    <StatsCard title="Total Users" value={stats.total_users} description="Registered users" icon={<Users className="h-4 w-4" />} />
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <Button asChild variant="outline" className="h-24 flex-col space-y-2">
                                <Link href="/admin/rooms/create">
                                    <Plus className="h-8 w-8" />
                                    <span>Add New Room</span>
                                </Link>
                            </Button>

                            <Button asChild variant="outline" className="h-24 flex-col space-y-2">
                                <Link href="/admin/time-slots/create">
                                    <Clock className="h-8 w-8" />
                                    <span>Add Time Slot</span>
                                </Link>
                            </Button>

                            <Button asChild variant="outline" className="h-24 flex-col space-y-2">
                                <Link href="/admin/bookings">
                                    <Calendar className="h-8 w-8" />
                                    <span>Manage Bookings</span>
                                    {stats.pending_bookings > 0 && (
                                        <Badge variant="destructive" className="text-xs">
                                            {stats.pending_bookings} pending
                                        </Badge>
                                    )}
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity Placeholder */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-muted-foreground py-8 text-center">
                            <Clock className="mx-auto mb-4 h-12 w-12 opacity-50" />
                            <p>No recent activity to show</p>
                            <p className="text-sm">Activity will appear here once bookings are made</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
