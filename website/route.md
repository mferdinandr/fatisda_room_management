# Dokumentasi Routes - Sistem Booking Ruangan

## 🌐 **WEB ROUTES (web.php)**

### **🏠 Public Routes (No Authentication Required)**

| Method | URI | Name | Controller | Description |
|--------|-----|------|------------|-------------|
| `GET` | `/` | `home` | Closure | Home page dengan schedule matrix |
| `GET` | `/schedule` | `schedule.index` | `ScheduleController@index` | Public schedule viewer |
| `GET` | `/api/schedule` | `api.schedule` | `ScheduleController@getSchedule` | Get schedule data (JSON) |
| `GET` | `/api/availability` | `api.availability` | `ScheduleController@checkAvailability` | Check slot availability |
| `GET` | `/test-db` | - | Closure | Database test endpoint |

### **🔐 Authenticated Routes (auth + verified)**

#### **User Booking Management**
| Method | URI | Name | Controller | Description |
|--------|-----|------|------------|-------------|
| `GET` | `/booking/create` | `bookings.create` | `BookingController@create` | Show booking form |
| `POST` | `/booking` | `bookings.store` | `BookingController@store` | Create new booking |
| `GET` | `/booking/check-availability` | `bookings.check-availability` | `BookingController@checkAvailability` | Check availability |
| `GET` | `/my-bookings` | `bookings.my-bookings` | `BookingController@myBookings` | User's booking list |
| `GET` | `/my-bookings/{booking}` | `bookings.show` | `BookingController@show` | Show single booking |
| `GET` | `/my-bookings/{booking}/edit` | `bookings.edit` | `BookingController@edit` | Edit booking form |
| `PUT` | `/my-bookings/{booking}` | `bookings.update` | `BookingController@update` | Update booking |
| `DELETE` | `/my-bookings/{booking}` | `bookings.destroy` | `BookingController@destroy` | Cancel booking |

#### **User Dashboard**
| Method | URI | Name | Controller | Description |
|--------|-----|------|------------|-------------|
| `GET` | `/dashboard` | `dashboard` | Closure | User dashboard (redirects admin) |

### **👑 Admin Routes (auth + verified + role:admin)**

#### **Admin Dashboard**
| Method | URI | Name | Controller | Description |
|--------|-----|------|------------|-------------|
| `GET` | `/admin/dashboard` | `admin.dashboard` | Closure | Admin dashboard with stats |

#### **Room Management**
| Method | URI | Name | Controller | Description |
|--------|-----|------|------------|-------------|
| `GET` | `/admin/rooms` | `admin.rooms.index` | `Admin\RoomController@index` | List all rooms |
| `GET` | `/admin/rooms/create` | `admin.rooms.create` | `Admin\RoomController@create` | Create room form |
| `POST` | `/admin/rooms` | `admin.rooms.store` | `Admin\RoomController@store` | Store new room |
| `GET` | `/admin/rooms/{room}` | `admin.rooms.show` | `Admin\RoomController@show` | Show room details |
| `GET` | `/admin/rooms/{room}/edit` | `admin.rooms.edit` | `Admin\RoomController@edit` | Edit room form |
| `PUT` | `/admin/rooms/{room}` | `admin.rooms.update` | `Admin\RoomController@update` | Update room |
| `DELETE` | `/admin/rooms/{room}` | `admin.rooms.destroy` | `Admin\RoomController@destroy` | Delete room |

#### **Time Slot Management**
| Method | URI | Name | Controller | Description |
|--------|-----|------|------------|-------------|
| `GET` | `/admin/time-slots` | `admin.time-slots.index` | `Admin\TimeSlotController@index` | List all time slots |
| `GET` | `/admin/time-slots/create` | `admin.time-slots.create` | `Admin\TimeSlotController@create` | Create time slot form |
| `POST` | `/admin/time-slots` | `admin.time-slots.store` | `Admin\TimeSlotController@store` | Store new time slot |
| `GET` | `/admin/time-slots/{timeSlot}` | `admin.time-slots.show` | `Admin\TimeSlotController@show` | Show time slot details |
| `GET` | `/admin/time-slots/{timeSlot}/edit` | `admin.time-slots.edit` | `Admin\TimeSlotController@edit` | Edit time slot form |
| `PUT` | `/admin/time-slots/{timeSlot}` | `admin.time-slots.update` | `Admin\TimeSlotController@update` | Update time slot |
| `DELETE` | `/admin/time-slots/{timeSlot}` | `admin.time-slots.destroy` | `Admin\TimeSlotController@destroy` | Delete time slot |

#### **Booking Management (Admin)**
| Method | URI | Name | Controller | Description |
|--------|-----|------|------------|-------------|
| `GET` | `/admin/bookings` | `admin.bookings.index` | `Admin\BookingController@index` | List all bookings |
| `GET` | `/admin/bookings/{booking}` | `admin.bookings.show` | `Admin\BookingController@show` | Show booking details |
| `POST` | `/admin/bookings/{booking}/approve` | `admin.bookings.approve` | `Admin\BookingController@approve` | Approve booking |
| `POST` | `/admin/bookings/{booking}/reject` | `admin.bookings.reject` | `Admin\BookingController@reject` | Reject booking |
| `POST` | `/admin/bookings/bulk-approve` | `admin.bookings.bulk-approve` | `Admin\BookingController@bulkApprove` | Bulk approve bookings |
| `POST` | `/admin/bookings/bulk-reject` | `admin.bookings.bulk-reject` | `Admin\BookingController@bulkReject` | Bulk reject bookings |
| `DELETE` | `/admin/bookings/{booking}` | `admin.bookings.destroy` | `Admin\BookingController@destroy` | Delete booking |
| `GET` | `/admin/bookings/export` | `admin.bookings.export` | `Admin\BookingController@export` | Export bookings |

#### **Authentication**
| Method | URI | Name | Controller | Description |
|--------|-----|------|------------|-------------|
| `POST` | `/logout` | `logout` | Closure | User logout |

---

## 🔌 **API ROUTES (api.php)**

### **📡 API V1 Public Routes**

#### **Test & Status**
| Method | URI | Controller | Description |
|--------|-----|------------|-------------|
| `GET` | `/working` | Closure | API status check |
| `GET` | `/v1/test` | Closure | API V1 status check |

#### **Authentication (Public)**
| Method | URI | Controller | Description |
|--------|-----|------------|-------------|
| `POST` | `/v1/register` | Closure | User registration |
| `POST` | `/v1/login` | Closure | User login |

#### **Public Data Access**
| Method | URI | Controller | Description |
|--------|-----|------------|-------------|
| `GET` | `/v1/rooms-public` | `Api\V1\RoomController@index` | Get all active rooms |
| `GET` | `/v1/rooms-public/{room}` | `Api\V1\RoomController@show` | Get single room |
| `GET` | `/v1/rooms-public/{room}/availability` | `Api\V1\RoomController@availability` | Room availability |
| `GET` | `/v1/time-slots-public` | `Api\V1\TimeSlotController@index` | Get all time slots |
| `GET` | `/v1/time-slots-public/{timeSlot}` | `Api\V1\TimeSlotController@show` | Get single time slot |
| `GET` | `/v1/time-slots-availability` | `Api\V1\TimeSlotController@availability` | Time slot availability |
| `GET` | `/v1/public-schedule` | `Api\V1\BookingController@publicSchedule` | Public schedule data |
| `GET` | `/v1/public-schedule-matrix` | `Api\V1\BookingController@publicScheduleMatrix` | Schedule matrix |

### **🔐 API V1 Authenticated Routes (auth:sanctum)**

#### **User Profile**
| Method | URI | Controller | Description |
|--------|-----|------------|-------------|
| `GET` | `/v1/me` | Closure | Get current user data |
| `POST` | `/v1/logout` | Closure | API logout (delete token) |

#### **User Booking Management**
| Method | URI | Controller | Description |
|--------|-----|------------|-------------|
| `GET` | `/v1/booking/check-availability` | `Api\V1\BookingController@checkAvailability` | Check availability |
| `POST` | `/v1/bookings` | `Api\V1\BookingController@store` | Create booking |
| `GET` | `/v1/my-bookings` | `Api\V1\BookingController@myBookings` | User's bookings |
| `GET` | `/v1/my-bookings/{booking}` | `Api\V1\BookingController@show` | Show user booking |
| `PUT` | `/v1/my-bookings/{booking}` | `Api\V1\BookingController@update` | Update booking |
| `DELETE` | `/v1/my-bookings/{booking}` | `Api\V1\BookingController@destroy` | Delete booking |

### **👑 API V1 Admin Routes (auth:sanctum + admin middleware)**

#### **Room Management (Admin)**
| Method | URI | Controller | Description |
|--------|-----|------------|-------------|
| `GET` | `/v1/rooms` | `Api\V1\RoomController@index` | List rooms (admin) |
| `POST` | `/v1/rooms` | `Api\V1\RoomController@store` | Create room |
| `GET` | `/v1/rooms/{room}` | `Api\V1\RoomController@show` | Show room (admin) |
| `PUT` | `/v1/rooms/{room}` | `Api\V1\RoomController@update` | Update room |
| `DELETE` | `/v1/rooms/{room}` | `Api\V1\RoomController@destroy` | Delete room |
| `GET` | `/v1/rooms/{room}/availability` | `Api\V1\RoomController@availability` | Room availability (admin) |

#### **Time Slot Management (Admin)**
| Method | URI | Controller | Description |
|--------|-----|------------|-------------|
| `GET` | `/v1/time-slots` | `Api\V1\TimeSlotController@index` | List time slots (admin) |
| `POST` | `/v1/time-slots` | `Api\V1\TimeSlotController@store` | Create time slot |
| `GET` | `/v1/time-slots/{timeSlot}` | `Api\V1\TimeSlotController@show` | Show time slot (admin) |
| `PUT` | `/v1/time-slots/{timeSlot}` | `Api\V1\TimeSlotController@update` | Update time slot |
| `DELETE` | `/v1/time-slots/{timeSlot}` | `Api\V1\TimeSlotController@destroy` | Delete time slot |

#### **Booking Management (Admin)**
| Method | URI | Controller | Description |
|--------|-----|------------|-------------|
| `GET` | `/v1/bookings` | `Api\V1\BookingController@index` | List all bookings |
| `GET` | `/v1/bookings/{booking}` | `Api\V1\BookingController@show` | Show booking (admin) |
| `POST` | `/v1/bookings/{booking}/approve` | `Api\V1\BookingController@approve` | Approve booking |
| `POST` | `/v1/bookings/{booking}/reject` | `Api\V1\BookingController@reject` | Reject booking |
| `POST` | `/v1/bookings/bulk-approve` | `Api\V1\BookingController@bulkApprove` | Bulk approve |
| `POST` | `/v1/bookings/bulk-reject` | `Api\V1\BookingController@bulkReject` | Bulk reject |
| `DELETE` | `/v1/bookings/{booking}` | `Api\V1\BookingController@destroy` | Delete booking |

### **📡 Legacy API Routes**
| Method | URI | Name | Controller | Description |
|--------|-----|------|------------|-------------|
| `GET` | `/schedule` | `api.schedule` | `ScheduleController@getSchedule` | Legacy schedule API |
| `GET` | `/availability` | `api.availability` | `ScheduleController@checkAvailability` | Legacy availability API |

---

## 📊 **Route Summary**

### **Web Routes Statistics**
- **Total Web Routes:** 29
- **Public Routes:** 5
- **Authenticated Routes:** 9 (user)
- **Admin Routes:** 15

### **API Routes Statistics**  
- **Total API Routes:** 32
- **Public API Routes:** 10
- **Authenticated API Routes:** 8
- **Admin API Routes:** 14

### **Authentication Levels**
1. **Public:** No authentication required
2. **Authenticated:** `auth:sanctum` or `auth + verified`
3. **Admin:** `auth:sanctum + admin` or `auth + verified + role:admin`

### **Key Features Covered**
- ✅ **Public Schedule Viewing**
- ✅ **User Booking Management** 
- ✅ **Admin Room Management**
- ✅ **Admin Time Slot Management**
- ✅ **Admin Booking Approval System**
- ✅ **API Authentication with Sanctum**
- ✅ **Role-based Access Control**
- ✅ **Bulk Operations (Admin)**
- ✅ **Data Export (Admin)**

### **External File Includes**
- `require __DIR__.'/settings.php'`
- `require __DIR__.'/auth.php'`
