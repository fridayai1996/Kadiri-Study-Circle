import type { AttendanceStatus, Student } from './types';

export function applyAttendance(students: Student[], previous: Record<string, AttendanceStatus>, updates: Record<string, AttendanceStatus>) {
 const attendance = { ...previous, ...updates };
 return { attendance, students: students.map(student => {
  const status = updates[student.id];
  if (!status) return student;
  const old = previous[student.id];
  const totalClasses = student.totalClasses + (old ? 0 : 1);
  const attendedClasses = student.attendedClasses - (old === 'present' || old === 'late' ? 1 : 0) + (status === 'present' || status === 'late' ? 1 : 0);
  return { ...student, totalClasses, attendedClasses, attendancePercentage: Math.round(attendedClasses / totalClasses * 1000) / 10 };
 }) };
}
