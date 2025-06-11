<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Room;
use App\Models\TimeSlot;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Display a listing of bookings.
     */
    public function index(Request $request)
    {
        $query = Booking::with(['user', 'room', 'timeSlot']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('booking_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('booking_date', '<=', $request->date_to);
        }

        // Filter by room
        if ($request->filled('room_id')) {
            $query->where('room_id', $request->room_id);
        }

        // Search by user name or course
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%");
                })->orWhere('mata_kuliah', 'like', "%{$search}%")
                  ->orWhere('dosen', 'like', "%{$search}%");
            });
        }

        $bookings = $query->orderBy('booking_date', 'desc')
                          ->orderBy('created_at', 'desc')
                          ->paginate(20);

        // Get filter options
        $rooms = Room::active()->orderBy('name')->get();
        $stats = [
            'total' => Booking::count(),
            'pending' => Booking::where('status', 'pending')->count(),
            'approved' => Booking::where('status', 'approved')->count(),
            'rejected' => Booking::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $bookings,
            'rooms' => $rooms,
            'stats' => $stats,
            'filters' => $request->only(['status', 'date_from', 'date_to', 'room_id', 'search']),
        ]);
    }

    /**
     * Display the specified booking.
     */
    public function show(Booking $booking)
    {
        $booking->load(['user', 'room', 'timeSlot']);

        return Inertia::render('Admin/Bookings/Show', [
            'booking' => $booking
        ]);
    }

    /**
     * Approve a booking.
     */
    public function approve(Request $request, Booking $booking)
    {
        if ($booking->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Only pending bookings can be approved.');
        }

        // Check for conflicts with already approved bookings
        $conflict = Booking::where('room_id', $booking->room_id)
            ->where('time_slot_id', $booking->time_slot_id)
            ->where('booking_date', $booking->booking_date)
            ->where('status', 'approved')
            ->where('id', '!=', $booking->id)
            ->exists();

        if ($conflict) {
            return redirect()->back()
                ->with('error', 'Cannot approve: Another booking already approved for this slot.');
        }

        $booking->update([
            'status' => 'approved',
            'admin_notes' => $request->input('admin_notes'),
        ]);

        return redirect()->back()
            ->with('success', 'Booking approved successfully!');
    }

    /**
     * Reject a booking.
     */
    public function reject(Request $request, Booking $booking)
    {
        $request->validate([
            'admin_notes' => 'required|string|max:500',
        ]);

        if ($booking->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Only pending bookings can be rejected.');
        }

        $booking->update([
            'status' => 'rejected',
            'admin_notes' => $request->admin_notes,
        ]);

        return redirect()->back()
            ->with('success', 'Booking rejected successfully!');
    }

    /**
     * Bulk approve bookings.
     */
    public function bulkApprove(Request $request)
    {
        $request->validate([
            'booking_ids' => 'required|array',
            'booking_ids.*' => 'exists:bookings,id',
        ]);

        $bookings = Booking::whereIn('id', $request->booking_ids)
            ->where('status', 'pending')
            ->get();

        $approved = 0;
        $conflicts = 0;

        foreach ($bookings as $booking) {
            // Check for conflicts
            $conflict = Booking::where('room_id', $booking->room_id)
                ->where('time_slot_id', $booking->time_slot_id)
                ->where('booking_date', $booking->booking_date)
                ->where('status', 'approved')
                ->where('id', '!=', $booking->id)
                ->exists();

            if (!$conflict) {
                $booking->update(['status' => 'approved']);
                $approved++;
            } else {
                $conflicts++;
            }
        }

        $message = "Approved {$approved} booking(s).";
        if ($conflicts > 0) {
            $message .= " {$conflicts} booking(s) had conflicts and were skipped.";
        }

        return redirect()->back()->with('success', $message);
    }

    /**
     * Bulk reject bookings.
     */
    public function bulkReject(Request $request)
    {
        $request->validate([
            'booking_ids' => 'required|array',
            'booking_ids.*' => 'exists:bookings,id',
            'admin_notes' => 'required|string|max:500',
        ]);

        $rejected = Booking::whereIn('id', $request->booking_ids)
            ->where('status', 'pending')
            ->update([
                'status' => 'rejected',
                'admin_notes' => $request->admin_notes,
            ]);

        return redirect()->back()
            ->with('success', "Rejected {$rejected} booking(s) successfully!");
    }

    /**
     * Delete a booking.
     */
    public function destroy(Booking $booking)
    {
        $booking->delete();

        return redirect()->route('admin.bookings.index')
            ->with('success', 'Booking deleted successfully!');
    }

    /**
     * Export bookings to CSV.
     */
    public function export(Request $request)
    {
        $query = Booking::with(['user', 'room', 'timeSlot']);

        // Apply same filters as index
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('date_from')) {
            $query->whereDate('booking_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('booking_date', '<=', $request->date_to);
        }
        if ($request->filled('room_id')) {
            $query->where('room_id', $request->room_id);
        }

        $bookings = $query->orderBy('booking_date', 'desc')->get();

        $csvData = [];
        $csvData[] = [
            'ID', 'Date', 'Room', 'Time', 'User', 'Purpose', 'Subject/Course', 
            'Lecturer', 'Status', 'Notes', 'Admin Notes', 'Created At'
        ];

        foreach ($bookings as $booking) {
            $csvData[] = [
                $booking->id,
                $booking->booking_date,
                $booking->room->name,
                $booking->timeSlot->label,
                $booking->user->name,
                ucfirst($booking->keperluan),
                $booking->mata_kuliah ?? '-',
                $booking->dosen ?? '-',
                ucfirst($booking->status),
                $booking->catatan ?? '-',
                $booking->admin_notes ?? '-',
                $booking->created_at->format('Y-m-d H:i:s'),
            ];
        }

        $filename = 'bookings_export_' . now()->format('Y_m_d_H_i_s') . '.csv';
        
        return response()->streamDownload(function () use ($csvData) {
            $file = fopen('php://output', 'w');
            foreach ($csvData as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }
}