export type Role = 'admin' | 'teacher' | 'student';

export type StudentGroup = 'Group I' | 'Group II';

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  group: StudentGroup;
  phone: string;
  email: string;
  category: 'General' | 'BC' | 'SC' | 'ST' | 'EWS';
  joinDate: string;
  attendancePercentage: number;
  totalClasses: number;
  attendedClasses: number;
  targetExam: string;
  notes?: string;
}

export interface Faculty {
  id: string;
  name: string;
  subject: string;
  phone: string;
  email: string;
  qualification: string;
  classesTaken: number;
  activeGroups: StudentGroup[];
}

export interface ClassLog {
  id: string;
  date: string; // May be empty string initially (reflecting the 6 missing dates from the prompt)
  group: StudentGroup;
  subject: string;
  topic: string;
  hours: number;
  facultyName: string;
  status: 'completed' | 'scheduled';
  notes?: string;
}

export interface DailyAttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD or DD-MMM
  studentId: string;
  studentName: string;
  group: StudentGroup;
  status: AttendanceStatus;
  markedBy?: string;
}

export interface MockTest {
  id: string;
  testName: string;
  date: string;
  subject: string;
  totalMarks: number;
  group: StudentGroup | 'All';
}

export interface StudentTestScore {
  id: string;
  testId: string;
  studentId: string;
  marksObtained: number;
  rank: number;
  totalMarks: number;
  remarks?: string;
}

export interface SubjectModule {
  id: string;
  name: string;
  group: StudentGroup;
  totalHours: number;
  completedHours: number;
  topics: {
    title: string;
    completed: boolean;
  }[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'normal' | 'important';
  targetGroup: 'All' | 'Group I' | 'Group II';
  author: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  rollNo?: string;
  group?: StudentGroup;
  phone?: string;
  subject?: string;
}
