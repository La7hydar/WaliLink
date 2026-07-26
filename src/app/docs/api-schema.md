# API Schema Documentation

## Base URL
```
https://api.pesantren-app.com/v1
```

## Authentication
All API endpoints require Bearer token authentication:
```
Authorization: Bearer <token>
```

## Response Format
All API responses follow this structure:
```json
{
  "success": boolean,
  "data": any,
  "message": string,
  "error": string
}
```

## Student Profile APIs

### GET /students/{studentId}/profile
Get complete student profile information.

**Response:**
```json
{
  "success": true,
  "data": {
    "student": {
      "id": "student_001",
      "name": "Ahmad Rizki",
      "fullName": "Ahmad Rizki Maulana",
      "nickname": "Ahmad",
      "nisn": "0078594321",
      "birthPlace": "Yogyakarta",
      "birthDate": "15 Agustus 2010",
      "age": 14,
      "class": "Kelas 3 Tsanawiyah",
      "grade": 9,
      "studyClub": "Tahfidz Club Al-Hikmah",
      "dormitory": "Asrama Al-Hikmah",
      "roomNumber": "Kamar 15B",
      "entryYear": "2022",
      "status": "Aktif",
      "profilePhoto": "https://cdn.example.com/photos/student_001.jpg"
    },
    "guardian": {
      "id": "guardian_001",
      "title": "Bapak",
      "fullName": "Dr. H. Hasan Abdurrahman, M.Pd.I",
      "relationship": "Ayah Kandung",
      "phone": "0812-3456-7890",
      "whatsapp": "0812-3456-7890",
      "email": "hasan.abdurrahman@gmail.com",
      "occupation": "Dosen & Konsultan Pendidikan Islam",
      "company": "UIN Sunan Kalijaga Yogyakarta"
    },
    "address": {
      "street": "Jl. Kaliurang KM 14.5 No. 123",
      "village": "Sardonoharjo",
      "district": "Ngaglik",
      "regency": "Sleman",
      "province": "Daerah Istimewa Yogyakarta",
      "postalCode": "55581",
      "region": "Yogyakarta Utara"
    },
    "emergencyContact": {
      "contactName": "Ibu Siti Khadijah",
      "relationship": "Ibu Kandung",
      "phone": "0856-7890-1234"
    },
    "virtualAccount": {
      "bankName": "Bank Syariah Indonesia",
      "accountNumber": "7770012345678",
      "accountName": "Ahmad Rizki Maulana",
      "swiftCode": "BSYAIDJA",
      "purpose": "Transfer untuk kebutuhan santri dan pembayaran"
    },
    "emoneyBalance": 150000,
    "attendanceRate": 95
  }
}
```

## Academic APIs

### GET /students/{studentId}/scores
Get academic scores for a student.

**Query Parameters:**
- `semester` (optional): Filter by semester
- `year` (optional): Filter by year

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "subject": "Al-Quran",
      "score": 88,
      "fullMark": 100,
      "grade": "A-",
      "semester": "Ganjil",
      "year": "2024"
    }
  ]
}
```

### GET /students/{studentId}/performance
Get performance radar data for dashboard.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "subject": "Keaktifan",
      "score": 85,
      "fullMark": 100
    },
    {
      "subject": "Kedisiplinan",
      "score": 78,
      "fullMark": 100
    }
  ]
}
```

## Achievement APIs

### GET /students/{studentId}/achievements
Get student achievements.

**Query Parameters:**
- `category` (optional): Filter by category (academic, religious, sports, arts, leadership)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ach_001",
      "title": "Juara 2 Lomba Tahfidz Al-Quran",
      "description": "Meraih juara 2 dalam lomba hafalan Al-Quran tingkat kabupaten",
      "category": "religious",
      "level": "kabupaten",
      "position": "Juara 2",
      "date": "2024-11-15",
      "certificate": "cert_tahfidz_001.pdf"
    }
  ]
}
```

### POST /students/{studentId}/achievements
Create new achievement record.

**Request Body:**
```json
{
  "title": "Juara 1 Matematika",
  "description": "Meraih juara 1 olimpiade matematika",
  "category": "academic",
  "level": "provinsi",
  "position": "Juara 1",
  "date": "2024-12-20"
}
```

## Discipline APIs

### GET /students/{studentId}/discipline
Get discipline records.

**Query Parameters:**
- `type` (optional): Filter by type (violation, reward)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "disc_001",
      "type": "violation",
      "title": "Terlambat Sholat Maghrib",
      "description": "Terlambat mengikuti sholat maghrib berjamaah di masjid",
      "category": "Ibadah",
      "date": "2024-12-18",
      "reportedBy": "Ustadz Ahmad",
      "points": -5,
      "status": "confirmed"
    }
  ]
}
```

## Payment APIs

### GET /students/{studentId}/payments
Get payment records.

**Query Parameters:**
- `status` (optional): Filter by status (pending, paid, overdue)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "pay_001",
      "type": "spp",
      "amount": 500000,
      "description": "SPP Bulan Januari 2025",
      "status": "pending",
      "dueDate": "2025-01-10"
    }
  ]
}
```

### POST /students/{studentId}/payments/{paymentId}/pay
Process payment.

**Request Body:**
```json
{
  "method": "Bank Transfer"
}
```

## E-Money APIs

### GET /students/{studentId}/emoney/balance
Get current e-money balance.

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 150000
  }
}
```

### GET /students/{studentId}/emoney/transactions
Get e-money transaction history.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "emoney_001",
      "type": "spending",
      "amount": 15000,
      "description": "Beli makan siang di kantin",
      "category": "Makanan",
      "date": "2024-12-19",
      "location": "Kantin Pesantren"
    }
  ]
}
```

### POST /students/{studentId}/emoney/topup
Top up e-money balance.

**Request Body:**
```json
{
  "amount": 100000
}
```

## Attendance APIs

### GET /students/{studentId}/attendance
Get attendance records.

**Query Parameters:**
- `date` (optional): Filter by specific date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "att_001",
      "date": "2024-12-19",
      "type": "prayer",
      "activity": "Sholat Maghrib",
      "status": "present",
      "time": "18:30:00",
      "note": null
    }
  ]
}
```

### GET /students/{studentId}/attendance/rate
Get attendance rate percentage.

**Response:**
```json
{
  "success": true,
  "data": {
    "rate": 95
  }
}
```

## Album APIs

### GET /students/{studentId}/album
Get album photos.

**Query Parameters:**
- `category` (optional): Filter by category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "photo_001",
      "url": "https://cdn.example.com/photos/photo_001.jpg",
      "title": "Kegiatan Tahfidz Pagi",
      "description": "Kegiatan hafalan Al-Quran di pagi hari",
      "category": "Kegiatan",
      "date": "2024-12-19",
      "tags": ["tahfidz", "pagi", "alquran"]
    }
  ]
}
```

## Notification APIs

### GET /students/{studentId}/notifications
Get notifications.

**Query Parameters:**
- `unread` (optional): Set to "true" to get only unread notifications

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "notif_001",
      "title": "Pembayaran SPP",
      "message": "Pengingat: SPP bulan Januari 2025 akan jatuh tempo dalam 7 hari",
      "type": "payment",
      "priority": "medium",
      "date": "2024-12-19",
      "read": false,
      "actionUrl": "/payment"
    }
  ]
}
```

### PUT /students/{studentId}/notifications/{notificationId}/read
Mark notification as read.

**Response:**
```json
{
  "success": true,
  "data": null,
  "message": "Notification marked as read"
}
```

## Chat APIs

### GET /students/{studentId}/chat/contacts
Get chat contacts.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "contact_001",
      "name": "Ustadz Ahmad Wijaya",
      "role": "ustadz",
      "avatar": "https://cdn.example.com/avatars/ustadz_001.jpg",
      "isOnline": true,
      "lastSeen": null
    }
  ]
}
```

### GET /students/{studentId}/chat/{contactId}/messages
Get chat messages.

**Query Parameters:**
- `limit` (optional): Number of messages to retrieve

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "msg_001",
      "senderId": "contact_001",
      "receiverId": "student_001",
      "content": "Assalamu'alaikum, bagaimana kabar Ahmad hari ini?",
      "type": "text",
      "timestamp": "2024-12-19T10:30:00Z",
      "read": true
    }
  ]
}
```

### POST /students/{studentId}/chat/{contactId}/send
Send message.

**Request Body:**
```json
{
  "content": "Wa'alaikumussalam, alhamdulillah baik ustadz",
  "type": "text"
}
```

## Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API calls are limited to 1000 requests per hour per token.

## Pagination

For endpoints that return lists, use these query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Response includes pagination metadata:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "hasNext": true,
    "hasPrev": false
  }
}
```