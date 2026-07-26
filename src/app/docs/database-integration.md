# Database Integration Guide

## Database Schema

### Student Management Tables

```sql
-- Students table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nisn VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    nickname VARCHAR(50),
    birth_place VARCHAR(100),
    birth_date DATE,
    age INT GENERATED ALWAYS AS (EXTRACT(YEAR FROM AGE(birth_date))) STORED,
    gender ENUM('male', 'female') NOT NULL,
    entry_year INT NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    grade INT NOT NULL,
    study_club VARCHAR(100),
    dormitory_id UUID REFERENCES dormitories(id),
    room_number VARCHAR(20),
    status ENUM('active', 'inactive', 'graduated', 'transferred') DEFAULT 'active',
    profile_photo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Guardians table
CREATE TABLE guardians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(20),
    full_name VARCHAR(150) NOT NULL,
    relationship ENUM('father', 'mother', 'grandfather', 'grandmother', 'uncle', 'aunt', 'other') NOT NULL,
    phone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20),
    email VARCHAR(100),
    occupation VARCHAR(100),
    company VARCHAR(150),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Addresses table
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    type ENUM('home', 'guardian', 'emergency') DEFAULT 'home',
    street TEXT NOT NULL,
    village VARCHAR(100),
    district VARCHAR(100),
    regency VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(10),
    region VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Emergency contacts table
CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    contact_name VARCHAR(150) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    is_primary BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Virtual accounts table
CREATE TABLE virtual_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    bank_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(50) UNIQUE NOT NULL,
    account_name VARCHAR(150) NOT NULL,
    swift_code VARCHAR(20),
    purpose TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Academic Performance Tables

```sql
-- Academic scores table
CREATE TABLE academic_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
    full_mark DECIMAL(5,2) DEFAULT 100,
    grade VARCHAR(5),
    semester ENUM('ganjil', 'genap') NOT NULL,
    academic_year VARCHAR(9) NOT NULL, -- e.g., "2024/2025"
    exam_type ENUM('daily', 'mid', 'final', 'practical') NOT NULL,
    exam_date DATE,
    teacher_id UUID REFERENCES teachers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_student_semester_year (student_id, semester, academic_year),
    INDEX idx_subject_exam_type (subject, exam_type)
);

-- Achievements table
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category ENUM('academic', 'religious', 'sports', 'arts', 'leadership', 'social') NOT NULL,
    level ENUM('pesantren', 'kabupaten', 'provinsi', 'nasional', 'internasional') NOT NULL,
    position VARCHAR(50), -- e.g., "Juara 1", "Peringkat 3"
    achievement_date DATE NOT NULL,
    certificate_url TEXT,
    photo_url TEXT,
    verified_by UUID REFERENCES staff(id),
    verification_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_student_category (student_id, category),
    INDEX idx_achievement_date (achievement_date DESC)
);
```

### Discipline & Attendance Tables

```sql
-- Discipline records table
CREATE TABLE discipline_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    type ENUM('violation', 'reward') NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    record_date DATE NOT NULL,
    reported_by UUID REFERENCES staff(id),
    points INT DEFAULT 0, -- negative for violations, positive for rewards
    status ENUM('pending', 'confirmed', 'resolved', 'dismissed') DEFAULT 'pending',
    resolution_notes TEXT,
    resolved_by UUID REFERENCES staff(id),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_student_date (student_id, record_date DESC),
    INDEX idx_type_status (type, status)
);

-- Attendance records table
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    activity_type ENUM('prayer', 'class', 'activity', 'study', 'meal') NOT NULL,
    activity_name VARCHAR(100) NOT NULL,
    status ENUM('present', 'absent', 'late', 'excused', 'sick') NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    notes TEXT,
    recorded_by UUID REFERENCES staff(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_student_activity (student_id, attendance_date, activity_type, activity_name),
    INDEX idx_student_date (student_id, attendance_date DESC),
    INDEX idx_activity_status (activity_type, status)
);
```

### Financial Tables

```sql
-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    type ENUM('spp', 'dormitory', 'meal', 'activity', 'exam', 'other') NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    description VARCHAR(200) NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('pending', 'paid', 'overdue', 'cancelled') DEFAULT 'pending',
    payment_date TIMESTAMP,
    payment_method VARCHAR(50),
    reference_number VARCHAR(100),
    notes TEXT,
    created_by UUID REFERENCES staff(id),
    processed_by UUID REFERENCES staff(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_student_status (student_id, status),
    INDEX idx_due_date (due_date),
    INDEX idx_payment_date (payment_date DESC)
);

-- E-money transactions table
CREATE TABLE emoney_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    type ENUM('topup', 'spending', 'refund', 'transfer') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    balance_before DECIMAL(10,2) NOT NULL,
    balance_after DECIMAL(10,2) NOT NULL,
    description VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    location VARCHAR(150),
    merchant_id UUID REFERENCES merchants(id),
    reference_number VARCHAR(100),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_by UUID REFERENCES staff(id),
    
    INDEX idx_student_date (student_id, transaction_date DESC),
    INDEX idx_type_category (type, category)
);
```

## Backend API Implementation Examples

### 1. Student Profile Service

```typescript
// services/StudentService.ts
import { Database } from '../database/connection';
import { StudentProfile, Student, Guardian } from '../types/database';

export class StudentService {
  private db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  async getStudentProfile(studentId: string): Promise<StudentProfile> {
    const query = `
      SELECT 
        s.*,
        g.title as guardian_title,
        g.full_name as guardian_full_name,
        g.relationship as guardian_relationship,
        g.phone as guardian_phone,
        g.whatsapp as guardian_whatsapp,
        g.email as guardian_email,
        g.occupation as guardian_occupation,
        g.company as guardian_company,
        a.street, a.village, a.district, a.regency, a.province, 
        a.postal_code, a.region,
        ec.contact_name as emergency_contact_name,
        ec.relationship as emergency_relationship,
        ec.phone as emergency_phone,
        va.bank_name, va.account_number, va.account_name, 
        va.swift_code, va.purpose as va_purpose
      FROM students s
      LEFT JOIN guardians g ON s.id = g.student_id AND g.is_primary = true
      LEFT JOIN addresses a ON s.id = a.student_id AND a.type = 'home'
      LEFT JOIN emergency_contacts ec ON s.id = ec.student_id AND ec.is_primary = true
      LEFT JOIN virtual_accounts va ON s.id = va.student_id AND va.is_active = true
      WHERE s.id = ? AND s.status = 'active'
    `;

    const [rows] = await this.db.execute(query, [studentId]);
    const row = rows[0] as any;

    if (!row) {
      throw new Error('Student not found');
    }

    // Get e-money balance
    const emoneyBalance = await this.getEmoneyBalance(studentId);
    
    // Get attendance rate
    const attendanceRate = await this.getAttendanceRate(studentId);

    return {
      student: {
        id: row.id,
        name: row.name,
        fullName: row.full_name,
        nickname: row.nickname,
        nisn: row.nisn,
        birthPlace: row.birth_place,
        birthDate: row.birth_date,
        age: row.age,
        class: row.class_name,
        grade: row.grade,
        studyClub: row.study_club,
        dormitory: row.dormitory_name,
        roomNumber: row.room_number,
        entryYear: row.entry_year.toString(),
        status: row.status,
        profilePhoto: row.profile_photo
      },
      guardian: {
        id: row.guardian_id,
        title: row.guardian_title,
        fullName: row.guardian_full_name,
        relationship: row.guardian_relationship,
        phone: row.guardian_phone,
        whatsapp: row.guardian_whatsapp,
        email: row.guardian_email,
        occupation: row.guardian_occupation,
        company: row.guardian_company
      },
      address: {
        street: row.street,
        village: row.village,
        district: row.district,
        regency: row.regency,
        province: row.province,
        postalCode: row.postal_code,
        region: row.region
      },
      emergencyContact: {
        contactName: row.emergency_contact_name,
        relationship: row.emergency_relationship,
        phone: row.emergency_phone
      },
      virtualAccount: {
        bankName: row.bank_name,
        accountNumber: row.account_number,
        accountName: row.account_name,
        swiftCode: row.swift_code,
        purpose: row.va_purpose
      },
      emoneyBalance,
      attendanceRate,
      // Other arrays will be populated by separate methods
      academicScores: [],
      performanceData: [],
      achievements: [],
      disciplineRecords: [],
      payments: [],
      emoneyTransactions: [],
      attendanceRecords: [],
      albumPhotos: [],
      notifications: [],
      chatContacts: []
    };
  }

  private async getEmoneyBalance(studentId: string): Promise<number> {
    const query = `
      SELECT COALESCE(SUM(
        CASE 
          WHEN type IN ('topup', 'refund') THEN amount
          WHEN type IN ('spending', 'transfer') THEN -amount
          ELSE 0
        END
      ), 0) as balance
      FROM emoney_transactions
      WHERE student_id = ?
    `;

    const [rows] = await this.db.execute(query, [studentId]);
    return (rows[0] as any)?.balance || 0;
  }

  private async getAttendanceRate(studentId: string): Promise<number> {
    const query = `
      SELECT 
        COUNT(*) as total_records,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_records
      FROM attendance_records
      WHERE student_id = ? 
        AND attendance_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
    `;

    const [rows] = await this.db.execute(query, [studentId]);
    const result = rows[0] as any;
    
    if (!result.total_records) return 0;
    return Math.round((result.present_records / result.total_records) * 100);
  }
}
```

### 2. Achievement Service

```typescript
// services/AchievementService.ts
export class AchievementService {
  private db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  async getAchievements(
    studentId: string, 
    category?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ achievements: Achievement[], total: number }> {
    let query = `
      SELECT 
        a.*,
        s.full_name as verifier_name
      FROM achievements a
      LEFT JOIN staff s ON a.verified_by = s.id
      WHERE a.student_id = ?
    `;
    
    const params: any[] = [studentId];

    if (category) {
      query += ' AND a.category = ?';
      params.push(category);
    }

    query += ' ORDER BY a.achievement_date DESC, a.created_at DESC';
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await this.db.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM achievements WHERE student_id = ?';
    const countParams = [studentId];
    
    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    const [countRows] = await this.db.execute(countQuery, countParams);
    const total = (countRows[0] as any).total;

    const achievements: Achievement[] = (rows as any[]).map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      level: row.level,
      position: row.position,
      date: row.achievement_date,
      certificate: row.certificate_url,
      photo: row.photo_url,
      verifiedBy: row.verifier_name,
      verificationDate: row.verification_date
    }));

    return { achievements, total };
  }

  async createAchievement(studentId: string, achievementData: Partial<Achievement>): Promise<Achievement> {
    const query = `
      INSERT INTO achievements (
        student_id, title, description, category, level, 
        position, achievement_date, certificate_url, photo_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      studentId,
      achievementData.title,
      achievementData.description,
      achievementData.category,
      achievementData.level,
      achievementData.position,
      achievementData.date,
      achievementData.certificate,
      achievementData.photo
    ];

    const [result] = await this.db.execute(query, params);
    const insertId = (result as any).insertId;

    // Return the created achievement
    return this.getAchievementById(insertId);
  }

  private async getAchievementById(id: string): Promise<Achievement> {
    const query = `
      SELECT a.*, s.full_name as verifier_name
      FROM achievements a
      LEFT JOIN staff s ON a.verified_by = s.id
      WHERE a.id = ?
    `;

    const [rows] = await this.db.execute(query, [id]);
    const row = rows[0] as any;

    if (!row) {
      throw new Error('Achievement not found');
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      level: row.level,
      position: row.position,
      date: row.achievement_date,
      certificate: row.certificate_url,
      photo: row.photo_url,
      verifiedBy: row.verifier_name,
      verificationDate: row.verification_date
    };
  }
}
```

### 3. API Routes Implementation

```typescript
// routes/studentRoutes.ts
import { Router } from 'express';
import { StudentService } from '../services/StudentService';
import { AchievementService } from '../services/AchievementService';
import { PaymentService } from '../services/PaymentService';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Student profile route
router.get('/students/:studentId/profile', async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentService = new StudentService(req.db);
    
    const profile = await studentService.getStudentProfile(studentId);
    
    res.json({
      success: true,
      data: profile,
      message: 'Student profile retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to fetch student profile'
    });
  }
});

// Achievements routes
router.get('/students/:studentId/achievements', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { category, page = 1, limit = 20 } = req.query;
    
    const achievementService = new AchievementService(req.db);
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const result = await achievementService.getAchievements(
      studentId,
      category as string,
      parseInt(limit as string),
      offset
    );
    
    res.json({
      success: true,
      data: result.achievements,
      pagination: {
        currentPage: parseInt(page as string),
        totalPages: Math.ceil(result.total / parseInt(limit as string)),
        totalItems: result.total,
        hasNext: offset + result.achievements.length < result.total,
        hasPrev: parseInt(page as string) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to fetch achievements'
    });
  }
});

router.post('/students/:studentId/achievements', 
  validateRequest([
    { field: 'title', required: true, type: 'string' },
    { field: 'category', required: true, type: 'string' },
    { field: 'level', required: true, type: 'string' },
    { field: 'date', required: true, type: 'date' }
  ]),
  async (req, res) => {
    try {
      const { studentId } = req.params;
      const achievementService = new AchievementService(req.db);
      
      const achievement = await achievementService.createAchievement(studentId, req.body);
      
      res.status(201).json({
        success: true,
        data: achievement,
        message: 'Achievement created successfully'
      });
    } catch (error) {
      console.error('Error creating achievement:', error);
      res.status(500).json({
        success: false,
        data: null,
        error: 'Failed to create achievement'
      });
    }
  }
);

// Academic scores route
router.get('/students/:studentId/scores', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { semester, year } = req.query;
    
    let query = `
      SELECT subject, score, full_mark, grade, semester, academic_year, exam_type, exam_date
      FROM academic_scores
      WHERE student_id = ?
    `;
    const params = [studentId];

    if (semester) {
      query += ' AND semester = ?';
      params.push(semester as string);
    }

    if (year) {
      query += ' AND academic_year = ?';
      params.push(year as string);
    }

    query += ' ORDER BY exam_date DESC, subject ASC';

    const [rows] = await req.db.execute(query, params);
    
    res.json({
      success: true,
      data: rows,
      message: 'Academic scores retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching academic scores:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to fetch academic scores'
    });
  }
});

// Performance data route (for radar chart)
router.get('/students/:studentId/performance', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const query = `
      SELECT 
        'Keaktifan' as subject, 
        COALESCE(AVG(CASE WHEN category = 'activity' THEN points ELSE NULL END), 75) as score,
        100 as fullMark
      FROM discipline_records 
      WHERE student_id = ? AND type = 'reward' AND record_date >= DATE_SUB(CURRENT_DATE, INTERVAL 3 MONTH)
      
      UNION ALL
      
      SELECT 
        'Kedisiplinan' as subject,
        GREATEST(0, 100 - ABS(COALESCE(SUM(CASE WHEN type = 'violation' THEN points ELSE 0 END), 0))) as score,
        100 as fullMark
      FROM discipline_records 
      WHERE student_id = ? AND record_date >= DATE_SUB(CURRENT_DATE, INTERVAL 3 MONTH)
      
      UNION ALL
      
      SELECT 
        'Prestasi' as subject,
        LEAST(100, 70 + COUNT(*) * 5) as score,
        100 as fullMark
      FROM achievements 
      WHERE student_id = ? AND achievement_date >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
      
      UNION ALL
      
      SELECT 
        'Kehadiran' as subject,
        COALESCE(
          (SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)),
          95
        ) as score,
        100 as fullMark
      FROM attendance_records 
      WHERE student_id = ? AND attendance_date >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)
      
      UNION ALL
      
      SELECT 
        'Nilai' as subject,
        COALESCE(AVG(score), 85) as score,
        100 as fullMark
      FROM academic_scores 
      WHERE student_id = ? AND exam_date >= DATE_SUB(CURRENT_DATE, INTERVAL 3 MONTH)
      
      UNION ALL
      
      SELECT 
        'Perilaku' as subject,
        GREATEST(60, 90 - ABS(COALESCE(SUM(CASE WHEN type = 'violation' AND category IN ('behavior', 'ethics') THEN points ELSE 0 END), 0)) * 2) as score,
        100 as fullMark
      FROM discipline_records 
      WHERE student_id = ? AND record_date >= DATE_SUB(CURRENT_DATE, INTERVAL 3 MONTH)
    `;
    
    const params = Array(6).fill(studentId);
    const [rows] = await req.db.execute(query, params);
    
    res.json({
      success: true,
      data: rows,
      message: 'Performance data retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching performance data:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to fetch performance data'
    });
  }
});

export default router;
```

### 4. Database Connection & Configuration

```typescript
// database/connection.ts
import mysql from 'mysql2/promise';
import { config } from '../config/database';

export class Database {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: true,
      connectionLimit: config.connectionLimit,
      queueLimit: 0,
      acquireTimeout: 60000,
      timeout: 60000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      timezone: '+00:00'
    });

    this.initializePool();
  }

  private initializePool() {
    this.pool.on('connection', (connection) => {
      console.log('New connection established:', connection.threadId);
    });

    this.pool.on('error', (err) => {
      console.error('Database pool error:', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        this.handleDisconnect();
      } else {
        throw err;
      }
    });
  }

  private handleDisconnect() {
    console.log('Reconnecting to database...');
    // The pool will automatically create new connections
  }

  async execute(query: string, params: any[] = []): Promise<any> {
    try {
      const connection = await this.pool.getConnection();
      const result = await connection.execute(query, params);
      connection.release();
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async transaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
    const connection = await this.pool.getConnection();
    
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

// Database configuration
export const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pesantren_db',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10')
};

export const database = new Database();
```

This database integration provides a comprehensive foundation for managing student data with proper relationships, indexing, and API endpoints that match the frontend requirements.