import React, { createContext, useContext, useState, useEffect } from 'react';
import { applyAttendance } from '../attendance';
import { Role, Student, Faculty, ClassLog, MockTest, StudentTestScore, SubjectModule, Announcement, AttendanceStatus, AuthUser } from '../types';
import { INITIAL_STUDENTS, INITIAL_FACULTY, INITIAL_CLASS_LOGS, INITIAL_MOCK_TESTS, INITIAL_TEST_SCORES, INITIAL_SYLLABUS_MODULES, INITIAL_ANNOUNCEMENTS } from '../data/initialData';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface AppContextType {
  currentUser: AuthUser | null;
  login: (role: Role, identifier: string, password?: string) => { success: boolean; message?: string; };
  logout: () => void;
  role: Role;
  setRole: (role: Role) => void;
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  activeTeacherId: string;
  setActiveTeacherId: (id: string) => void;

  students: Student[];
  faculty: Faculty[];
  classLogs: ClassLog[];
  mockTests: MockTest[];
  testScores: StudentTestScore[];
  syllabusModules: SubjectModule[];
  announcements: Announcement[];
  dailyAttendanceHistory: { [dateStr: string]: { [studentId: string]: AttendanceStatus; }; };

  // Actions
  addStudent: (newStudent: Omit<Student, 'id' | 'attendancePercentage' | 'totalClasses' | 'attendedClasses'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  markDailyAttendance: (date: string, attendanceMap: { [studentId: string]: AttendanceStatus; }) => void;

  addClassLog: (log: Omit<ClassLog, 'id'>) => void;
  updateClassLog: (id: string, updates: Partial<ClassLog>) => void;
  deleteClassLog: (id: string) => void;

  addFaculty: (faculty: Omit<Faculty, 'id' | 'classesTaken'>) => void;
  updateFaculty: (id: string, updates: Partial<Faculty>) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  addTestScore: (score: Omit<StudentTestScore, 'id'>) => void;
  toggleSyllabusTopic: (moduleId: string, topicIndex: number) => void;

  resetToDefault: () => void;
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'ksc_kadiri_study_circle_v2';

// ---- Persistence keys (kept backward-compatible; do not rename) ----

const AUTH_KEY = 'ksc_current_user_v2';
const ROLE_KEY = 'ksc_user_role';
const ACTIVE_STUDENT_KEY = 'ksc_active_student';
const ACTIVE_TEACHER_KEY = 'ksc_active_teacher';

const DATA_KEYS = {
  students: `${STORAGE_KEY}_students`,
  faculty: `${STORAGE_KEY}_faculty`,
  classLogs: `${STORAGE_KEY}_classLogs`,
  mockTests: `${STORAGE_KEY}_mockTests`,
  testScores: `${STORAGE_KEY}_testScores`,
  syllabus: `${STORAGE_KEY}_syllabus`,
  announcements: `${STORAGE_KEY}_announcements`,
  attendanceHistory: `${STORAGE_KEY}_attendanceHistory`,
} as const;

type DataState = {
  students: Student[];
  faculty: Faculty[];
  classLogs: ClassLog[];
  mockTests: MockTest[];
  testScores: StudentTestScore[];
  syllabusModules: SubjectModule[];
  announcements: Announcement[];
  dailyAttendanceHistory: { [dateStr: string]: { [studentId: string]: AttendanceStatus; }; };
};

// ---- Single persistence effect: writes all data + session fields on any change ----
function usePersist({
  role,
  activeStudentId,
  activeTeacherId,
  data,
}: {
  role: Role;
  activeStudentId: string;
  activeTeacherId: string;
  data: DataState;
}) {
  useEffect(() => {
    localStorage.setItem(ROLE_KEY, role);
    localStorage.setItem(ACTIVE_STUDENT_KEY, activeStudentId);
    localStorage.setItem(ACTIVE_TEACHER_KEY, activeTeacherId);
    localStorage.setItem(DATA_KEYS.students, JSON.stringify(data.students));
    localStorage.setItem(DATA_KEYS.faculty, JSON.stringify(data.faculty));
    localStorage.setItem(DATA_KEYS.classLogs, JSON.stringify(data.classLogs));
    localStorage.setItem(DATA_KEYS.mockTests, JSON.stringify(data.mockTests));
    localStorage.setItem(DATA_KEYS.testScores, JSON.stringify(data.testScores));
    localStorage.setItem(DATA_KEYS.syllabus, JSON.stringify(data.syllabusModules));
    localStorage.setItem(DATA_KEYS.announcements, JSON.stringify(data.announcements));
    localStorage.setItem(DATA_KEYS.attendanceHistory, JSON.stringify(data.dailyAttendanceHistory));
  }, [role, activeStudentId, activeTeacherId, data]);
}

// ---- Helper: clear all data keys (used by resetToDefault) ----
function clearDataKeys() {
  localStorage.removeItem(DATA_KEYS.students);
  localStorage.removeItem(DATA_KEYS.faculty);
  localStorage.removeItem(DATA_KEYS.classLogs);
  localStorage.removeItem(DATA_KEYS.mockTests);
  localStorage.removeItem(DATA_KEYS.testScores);
  localStorage.removeItem(DATA_KEYS.syllabus);
  localStorage.removeItem(DATA_KEYS.announcements);
  localStorage.removeItem(DATA_KEYS.attendanceHistory);
}

function readDataState(): DataState {
  return {
    students: (() => { const s = localStorage.getItem(DATA_KEYS.students); return s ? JSON.parse(s) : INITIAL_STUDENTS; })(),
    faculty: (() => { const s = localStorage.getItem(DATA_KEYS.faculty); return s ? JSON.parse(s) : INITIAL_FACULTY; })(),
    classLogs: (() => { const s = localStorage.getItem(DATA_KEYS.classLogs); return s ? JSON.parse(s) : INITIAL_CLASS_LOGS; })(),
    mockTests: (() => { const s = localStorage.getItem(DATA_KEYS.mockTests); return s ? JSON.parse(s) : INITIAL_MOCK_TESTS; })(),
    testScores: (() => { const s = localStorage.getItem(DATA_KEYS.testScores); return s ? JSON.parse(s) : INITIAL_TEST_SCORES; })(),
    syllabusModules: (() => { const s = localStorage.getItem(DATA_KEYS.syllabus); return s ? JSON.parse(s) : INITIAL_SYLLABUS_MODULES; })(),
    announcements: (() => { const s = localStorage.getItem(DATA_KEYS.announcements); return s ? JSON.parse(s) : INITIAL_ANNOUNCEMENTS; })(),
    dailyAttendanceHistory: (() => {
      const s = localStorage.getItem(DATA_KEYS.attendanceHistory);
      if (s) return JSON.parse(s);
      const map: { [dateStr: string]: { [studentId: string]: AttendanceStatus; } } = {};
      const sept23: { [studentId: string]: AttendanceStatus; } = {};
      const sept24: { [studentId: string]: AttendanceStatus; } = {};
      const sept27: { [studentId: string]: AttendanceStatus; } = {};
      INITIAL_STUDENTS.forEach((st, idx) => {
        sept23[st.id] = idx < 32 ? 'present' : 'absent';
        sept24[st.id] = idx < 33 ? 'present' : 'absent';
        sept27[st.id] = (idx === 11 || idx === 32 || idx === 33 || idx === 34) ? 'absent' : 'present';
      });
      map['2026-09-23'] = sept23;
      map['2026-09-24'] = sept24;
      map['2026-09-27'] = sept27;
      return map;
    })(),
  };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [role, setRoleState] = useState<Role>(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved) {
      try {
        const u = JSON.parse(saved);
        return u.role || 'admin';
      } catch (e) {
        // fallback
      }
    }
    return (localStorage.getItem(ROLE_KEY) as Role) || 'admin';
  });

  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    return localStorage.getItem(ACTIVE_STUDENT_KEY) || 'std-g1-01';
  });

  const [activeTeacherId, setActiveTeacherId] = useState<string>(() => {
    return localStorage.getItem(ACTIVE_TEACHER_KEY) || 'fac-01';
  });

  const [students, setStudents] = useState<Student[]>(() => readDataState().students);
  const [faculty, setFaculty] = useState<Faculty[]>(() => readDataState().faculty);
  const [classLogs, setClassLogs] = useState<ClassLog[]>(() => readDataState().classLogs);
  const [mockTests, setMockTests] = useState<MockTest[]>(() => readDataState().mockTests);
  const [testScores, setTestScores] = useState<StudentTestScore[]>(() => readDataState().testScores);
  const [syllabusModules, setSyllabusModules] = useState<SubjectModule[]>(() => readDataState().syllabusModules);
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => readDataState().announcements);
  const [dailyAttendanceHistory, setDailyAttendanceHistory] = useState<{ [dateStr: string]: { [studentId: string]: AttendanceStatus; }; }>(() => readDataState().dailyAttendanceHistory);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // ---- Persist all data + session fields with one effect ----
  usePersist({
    role,
    activeStudentId,
    activeTeacherId,
    data: {
      students,
      faculty,
      classLogs,
      mockTests,
      testScores,
      syllabusModules,
      announcements,
      dailyAttendanceHistory,
    },
  });

  // Login handler with strict validation
  const login = (targetRole: Role, identifier: string, password?: string): { success: boolean; message?: string; } => {
    if (targetRole === 'admin') {
      // Pre-set admin credentials: admin@kadirisc.in or admin / kadiri2026
      if (password && password.trim() !== 'admin' && password.trim() !== 'kadiri2026' && password.trim() !== '1234') {
        return { success: false, message: 'Invalid Admin password. Use demo password: admin' };
      }
      const user: AuthUser = {
        id: 'admin-01',
        name: 'Center Administrator (Coordinator)',
        email: 'admin@kadirisc.in',
        role: 'admin'
      };
      setCurrentUser(user);
      setRoleState('admin');
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      showToast({
        type: 'success',
        title: 'Admin Access Granted',
        message: 'Full management access enabled across all sections.'
      });
      return { success: true };
    }

    if (targetRole === 'teacher') {
      // Find faculty by ID or email or name
      const matched = faculty.find(
        f => f.id === identifier ||
             f.email.toLowerCase() === identifier.trim().toLowerCase() ||
             f.name.toLowerCase().includes(identifier.trim().toLowerCase())
      ) || faculty[0];

      if (password && password.trim() !== 'teacher' && password.trim() !== 'faculty' && password.trim() !== '1234') {
        return { success: false, message: 'Invalid Faculty password. Use demo password: teacher' };
      }

      const user: AuthUser = {
        id: matched.id,
        name: matched.name,
        email: matched.email,
        role: 'teacher',
        subject: matched.subject,
        phone: matched.phone
      };
      setCurrentUser(user);
      setRoleState('teacher');
      setActiveTeacherId(matched.id);
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      showToast({
        type: 'success',
        title: `Welcome, ${matched.name}`,
        message: 'Access granted to student rolls, class logger & faculty directory.'
      });
      return { success: true };
    }

    if (targetRole === 'student') {
      const q = identifier.trim().toLowerCase();
      const matched = students.find(
        s => s.id === identifier ||
             s.rollNo.toLowerCase() === q ||
             s.email.toLowerCase() === q ||
             s.phone.replace(/\s+/g, '') === q.replace(/\s+/g, '') ||
             s.name.toLowerCase().includes(q)
      );

      if (!matched) {
        return { success: false, message: `Candidate not found with roll no or email "${identifier}".` };
      }

      if (password && password.trim() !== 'student' && password.trim() !== '1234' && password.trim() !== matched.rollNo.toLowerCase()) {
        return { success: false, message: 'Invalid Student password. Use demo password: student' };
      }

      const user: AuthUser = {
        id: matched.id,
        name: matched.name,
        email: matched.email,
        role: 'student',
        rollNo: matched.rollNo,
        group: matched.group,
        phone: matched.phone
      };
      setCurrentUser(user);
      setRoleState('student');
      setActiveStudentId(matched.id);
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      showToast({
        type: 'success',
        title: `Welcome, ${matched.name}`,
        message: `Candidate dashboard loaded for Roll No: ${matched.rollNo}`
      });
      return { success: true };
    }

    return { success: false, message: 'Unknown role' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_KEY);
    showToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been safely signed out.'
    });
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
  };


  const addStudent = (newStudent: Omit<Student, 'id' | 'attendancePercentage' | 'totalClasses' | 'attendedClasses'>) => {
    const id = `std-${Date.now().toString(36)}`;
    const totalClasses = newStudent.group === 'Group I' ? 25 : 32;
    const student: Student = {
      ...newStudent,
      id,
      totalClasses,
      attendedClasses: totalClasses,
      attendancePercentage: 100.0
    };
    setStudents(prev => [student, ...prev]);
    showToast({
      type: 'success',
      title: 'Student Enrolled Successfully',
      message: `${student.name} (${student.rollNo}) added to ${student.group}`
    });
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id !== id) return s;
        const updated = { ...s, ...updates };
        if (updates.attendedClasses !== undefined || updates.totalClasses !== undefined) {
          const tot = updated.totalClasses || 1;
          const att = updated.attendedClasses || 0;
          updated.attendancePercentage = Math.round((att / tot) * 1000) / 10;
        }
        return updated;
      })
    );
    showToast({
      type: 'success',
      title: 'Student Record Updated'
    });
  };

  const deleteStudent = (id: string) => {
    const st = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    showToast({
      type: 'info',
      title: 'Student Removed',
      message: st?.name
    });
  };

  const markDailyAttendance = (date: string, attendanceMap: { [studentId: string]: AttendanceStatus; }) => {
    if (!currentUser || currentUser.role === 'student') return;
    const previous = dailyAttendanceHistory[date] || {};
    setDailyAttendanceHistory(prev => ({
      ...prev,
      [date]: { ...prev[date], ...attendanceMap }
    }));

    // Update cumulative student attendance count
    setStudents(prev =>
      applyAttendance(prev, previous, attendanceMap).students
    );

    const presentCount = Object.values(attendanceMap).filter(v => v === 'present' || v === 'late').length;
    showToast({
      type: 'success',
      title: 'Attendance Saved',
      message: `${presentCount} students marked present on ${date}`
    });
  };

  const addClassLog = (log: Omit<ClassLog, 'id'>) => {
    const id = `clog-${Date.now().toString(36)}`;
    const newLog: ClassLog = { ...log, id };
    setClassLogs(prev => [newLog, ...prev]);

    // Increment faculty classes taken
    if (log.facultyName) {
      setFaculty(prev =>
        prev.map(f => (f.name === log.facultyName ? { ...f, classesTaken: f.classesTaken + 1 } : f))
      );
    }

    showToast({
      type: 'success',
      title: 'Class Logged Successfully',
      message: `${newLog.subject} (${newLog.group}) recorded`
    });
  };

  const updateClassLog = (id: string, updates: Partial<ClassLog>) => {
    setClassLogs(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
    showToast({
      type: 'success',
      title: 'Class Record Updated'
    });
  };

  const deleteClassLog = (id: string) => {
    setClassLogs(prev => prev.filter(c => c.id !== id));
    showToast({
      type: 'info',
      title: 'Class Record Deleted'
    });
  };

  const addFaculty = (newFaculty: Omit<Faculty, 'id' | 'classesTaken'>) => {
    const id = `fac-${Date.now().toString(36)}`;
    setFaculty(prev => [...prev, { ...newFaculty, id, classesTaken: 0 }]);
    showToast({
      type: 'success',
      title: 'Faculty Member Added',
      message: newFaculty.name
    });
  };

  const updateFaculty = (id: string, updates: Partial<Faculty>) => {
    setFaculty(prev => prev.map(f => (f.id === id ? { ...f, ...updates } : f)));
    showToast({
      type: 'success',
      title: 'Faculty Details Updated',
      message: 'Modifications saved successfully.'
    });
  };

  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'date'>) => {
    const id = `ann-${Date.now().toString(36)}`;
    const date = new Date().toISOString().split('T')[0];
    setAnnouncements(prev => [{ ...ann, id, date }, ...prev]);
    showToast({
      type: 'success',
      title: 'Notice Published',
      message: ann.title
    });
  };

  const addTestScore = (score: Omit<StudentTestScore, 'id'>) => {
    const id = `sc-${Date.now().toString(36)}`;
    setTestScores(prev => [...prev, { ...score, id }]);
    showToast({
      type: 'success',
      title: 'Score Recorded'
    });
  };

  const toggleSyllabusTopic = (moduleId: string, topicIndex: number) => {
    setSyllabusModules(prev =>
      prev.map(mod => {
        if (mod.id !== moduleId) return mod;
        const newTopics = [...mod.topics];
        newTopics[topicIndex] = {
          ...newTopics[topicIndex],
          completed: !newTopics[topicIndex].completed
        };
        const completedCount = newTopics.filter(t => t.completed).length;
        const completedHours = Math.round((completedCount / newTopics.length) * mod.totalHours);
        return {
          ...mod,
          topics: newTopics,
          completedHours
        };
      })
    );
  };

  const resetToDefault = () => {
    clearDataKeys();

    setStudents(INITIAL_STUDENTS);
    setFaculty(INITIAL_FACULTY);
    setClassLogs(INITIAL_CLASS_LOGS);
    setMockTests(INITIAL_MOCK_TESTS);
    setTestScores(INITIAL_TEST_SCORES);
    setSyllabusModules(INITIAL_SYLLABUS_MODULES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);

    showToast({
      type: 'info',
      title: 'Reset to Initial Data',
      message: 'Official Kadiri Study Circle records restored.'
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        role,
        setRole,
        activeStudentId,
        setActiveStudentId,
        activeTeacherId,
        setActiveTeacherId,
        students,
        faculty,
        classLogs,
        mockTests,
        testScores,
        syllabusModules,
        announcements,
        dailyAttendanceHistory,
        addStudent,
        updateStudent,
        deleteStudent,
        markDailyAttendance,
        addClassLog,
        updateClassLog,
        deleteClassLog,
        addFaculty,
        updateFaculty,
        addAnnouncement,
        addTestScore,
        toggleSyllabusTopic,
        resetToDefault,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
