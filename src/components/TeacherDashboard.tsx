import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { StudentGroup, AttendanceStatus, ClassLog, Faculty } from '../types';
import { Calendar, Save, Plus, Search, Pencil, GraduationCap } from 'lucide-react';
import { LogClassModal } from './LogClassModal';
import { EditFacultyModal } from './EditFacultyModal';

export const TeacherDashboard: React.FC = () => {
  const {
    students,
    faculty,
    classLogs,
    markDailyAttendance,
    dailyAttendanceHistory,
    mockTests,
    testScores,
    addTestScore,
    showToast,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'attendance' | 'students' | 'faculty' | 'logger' | 'marks'>('attendance');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedGroup, setSelectedGroup] = useState<'All' | StudentGroup>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Local state for attendance marking
  const [attendanceSheet, setAttendanceSheet] = useState<{ [studentId: string]: AttendanceStatus }>({});

  const [isLogClassModalOpen, setIsLogClassModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<ClassLog | null>(null);
  const [editingFacultyMember, setEditingFacultyMember] = useState<Faculty | null>(null);

  // Active faculty mentor for current session
  const activeFaculty = faculty.find(
    f => f.id === currentUser?.id || f.email.toLowerCase() === currentUser?.email?.toLowerCase()
  ) || faculty[0];

  // Score entry state
  const [selectedTestId, setSelectedTestId] = useState(mockTests[0]?.id || '');
  const [studentScoreInput, setStudentScoreInput] = useState<{ [studentId: string]: string }>({});

  // Sync attendanceSheet when date changes
  useEffect(() => {
    if (dailyAttendanceHistory[selectedDate]) {
      setAttendanceSheet(dailyAttendanceHistory[selectedDate]);
    } else {
      // Default all to 'present' for easy fast marking (teachers only need to tap absentees)
      const initial: { [studentId: string]: AttendanceStatus } = {};
      students.forEach(st => {
        initial[st.id] = 'present';
      });
      setAttendanceSheet(initial);
    }
  }, [selectedDate, dailyAttendanceHistory, students]);

  // Filter students for attendance sheet
  const filteredStudents = students.filter(st => {
    const matchesGroup = selectedGroup === 'All' || st.group === selectedGroup;
    const matchesSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const handleToggleStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceSheet(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const updated = { ...attendanceSheet };
    filteredStudents.forEach(st => {
      updated[st.id] = status;
    });
    setAttendanceSheet(updated);
    showToast({
      type: 'info',
      title: `All ${selectedGroup === 'All' ? 'Students' : selectedGroup} marked as ${status.toUpperCase()}`
    });
  };

  const handleSaveAttendance = () => {
    markDailyAttendance(selectedDate, attendanceSheet);
  };

  // Stats calculation
  const totalInFilter = filteredStudents.length;
  const presentCount = filteredStudents.filter(s => attendanceSheet[s.id] === 'present').length;
  const absentCount = filteredStudents.filter(s => attendanceSheet[s.id] === 'absent').length;
  const lateCount = filteredStudents.filter(s => attendanceSheet[s.id] === 'late').length;
  const attendanceRate = totalInFilter > 0 ? Math.round(((presentCount + lateCount) / totalInFilter) * 1000) / 10 : 0;

  // Selected test
  const activeTest = mockTests.find(t => t.id === selectedTestId) || mockTests[0];

  const handleSaveMarks = (studentId: string) => {
    const val = studentScoreInput[studentId];
    if (val === undefined || val === '') return;
    const marks = Number(val);
    if (isNaN(marks) || marks < 0 || marks > activeTest.totalMarks) {
      showToast({
        type: 'warning',
        title: 'Invalid Marks',
        message: `Marks must be between 0 and ${activeTest.totalMarks}`
      });
      return;
    }

    addTestScore({
      testId: activeTest.id,
      studentId,
      marksObtained: marks,
      rank: 1, // Will be computed in review
      totalMarks: activeTest.totalMarks,
      remarks: marks >= activeTest.totalMarks * 0.7 ? 'Good score' : 'Needs improvement'
    });

    setStudentScoreInput(prev => ({ ...prev, [studentId]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Teacher Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/70">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 tracking-wide uppercase">
            <span>Faculty Portal</span>
            <span aria-hidden="true">·</span>
            <span>Kadiri Study Circle</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Daily Attendance & Class Registers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Mark daily roll-call, log covered syllabus topics, and record mock test performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingLog(null);
              setIsLogClassModalOpen(true);
            }}
            className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Class Session</span>
          </button>
        </div>
      </div>

      {/* Prominent Faculty Profile Tile with Edit Action */}
      <div className="p-4 sm:p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {activeFaculty.name}
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-100">
                  {activeFaculty.subject}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                <span>Phone: <strong className="font-mono text-slate-700">{activeFaculty.phone}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Email: <strong className="text-slate-700">{activeFaculty.email}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Batches: <strong className="text-slate-700">{activeFaculty.activeGroups?.join(', ') || 'Group I, Group II'}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200/70 whitespace-nowrap">
              {activeFaculty.classesTaken} Classes Taken
            </span>
            <button
              type="button"
              onClick={() => setEditingFacultyMember(activeFaculty)}
              className="min-h-[38px] px-3.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-indigo-200/80 flex items-center gap-1.5 whitespace-nowrap shadow-2xs active:scale-[0.98]"
              title="Edit and modify faculty profile details"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Faculty Details</span>
            </button>
          </div>
        </div>

        {activeFaculty.qualification && (
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="truncate max-w-2xl">
              <span className="font-semibold text-slate-700">Bio & Qualifications: </span>
              <span>{activeFaculty.qualification}</span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl max-w-fit">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'attendance' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Put Daily Attendance
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'students' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Students Data ({students.length})
        </button>
        <button
          onClick={() => setActiveTab('faculty')}
          className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'faculty' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Other Faculty ({faculty.length})
        </button>
        <button
          onClick={() => setActiveTab('logger')}
          className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'logger' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Class Logs ({classLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('marks')}
          className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'marks' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Mock Test Marks
        </button>
      </div>

      {/* Tab: Put Daily Attendance */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          {/* Controls & Date bar */}
          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Date selector */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase">Roll-Call Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="text-sm font-bold text-slate-900 bg-transparent border-0 focus:ring-0 p-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Group filter */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl shrink-0">
                <button
                  onClick={() => setSelectedGroup('All')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedGroup === 'All' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  All ({students.length})
                </button>
                <button
                  onClick={() => setSelectedGroup('Group I')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedGroup === 'Group I' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Group I (12)
                </button>
                <button
                  onClick={() => setSelectedGroup('Group II')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedGroup === 'Group II' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Group II (23)
                </button>
              </div>
            </div>

            {/* Quick Actions & Search bar */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search student or roll no..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleMarkAll('present')}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200/60"
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => handleMarkAll('absent')}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200/60"
                >
                  Mark All Absent
                </button>
              </div>
            </div>
          </div>

          {/* Real-time stats bar */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <div className="p-3 bg-white border border-slate-200/80 rounded-xl text-center shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Filtered Total</span>
              <div className="text-lg sm:text-xl font-bold font-mono text-slate-900">{totalInFilter}</div>
            </div>
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-center shadow-xs">
              <span className="text-[11px] font-semibold text-emerald-700 uppercase">Present</span>
              <div className="text-lg sm:text-xl font-bold font-mono text-emerald-700">{presentCount}</div>
            </div>
            <div className="p-3 bg-rose-50/70 border border-rose-200/60 rounded-xl text-center shadow-xs">
              <span className="text-[11px] font-semibold text-rose-700 uppercase">Absent</span>
              <div className="text-lg sm:text-xl font-bold font-mono text-rose-700">{absentCount}</div>
            </div>
            <div className="p-3 bg-indigo-50/70 border border-indigo-200/60 rounded-xl text-center shadow-xs">
              <span className="text-[11px] font-semibold text-indigo-700 uppercase">Attendance</span>
              <div className="text-lg sm:text-xl font-bold font-mono text-indigo-700">{attendanceRate}%</div>
            </div>
          </div>

          {/* Student Attendance List with Tactile Toggles (>= 44px touch targets) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-3 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between text-xs text-slate-600 font-semibold">
              <span>Student Roll & Name</span>
              <span className="mr-3">Mark Status (Touch to Toggle)</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {filteredStudents.map(st => {
                const status = attendanceSheet[st.id] || 'present';
                return (
                  <div
                    key={st.id}
                    className="p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-500">{st.rollNo}</span>
                        <span className="text-xs font-bold text-slate-900 truncate">{st.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        <span>{st.group}</span>
                        <span aria-hidden="true"> · </span>
                        <span>Overall: {st.attendancePercentage}%</span>
                      </div>
                    </div>

                    {/* Touch Hitboxes >= 44px */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(st.id, 'present')}
                        className={`min-h-[44px] min-w-[44px] px-3 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                          status === 'present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                        title="Mark Present"
                      >
                        P
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(st.id, 'absent')}
                        className={`min-h-[44px] min-w-[44px] px-3 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                          status === 'absent'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                        }`}
                        title="Mark Absent"
                      >
                        A
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(st.id, 'late')}
                        className={`min-h-[44px] min-w-[44px] px-3 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                          status === 'late'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                        }`}
                        title="Mark Late"
                      >
                        L
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Save Action Button */}
            <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                Attendance for <strong className="text-slate-900">{selectedDate}</strong> ready to submit ({presentCount} Present, {absentCount} Absent).
              </div>
              <button
                onClick={handleSaveAttendance}
                className="min-h-[44px] px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Attendance for {selectedDate}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Students Data (Teacher Access to all students data) */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search candidate name or roll no..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl shrink-0">
              <button
                onClick={() => setSelectedGroup('All')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedGroup === 'All' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All ({students.length})
              </button>
              <button
                onClick={() => setSelectedGroup('Group I')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedGroup === 'Group I' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Group I (12)
              </button>
              <button
                onClick={() => setSelectedGroup('Group II')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedGroup === 'Group II' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Group II (23)
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-semibold">
                    <th className="py-3 px-4">Roll No</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Group</th>
                    <th className="py-3 px-4">Target Post</th>
                    <th className="py-3 px-4 text-center">Attendance Progress</th>
                    <th className="py-3 px-4 text-right">Attendance %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map(st => (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">{st.rollNo}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{st.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{st.phone} · {st.category}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${st.group === 'Group I' ? 'text-teal-700' : 'text-indigo-700'}`}>
                          {st.group}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{st.targetExam}</td>
                      <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-700">
                        {st.attendedClasses} / {st.totalClasses} classes
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        <span className={`font-bold ${st.attendancePercentage < 75 ? 'text-rose-600' : 'text-emerald-700'}`}>
                          {st.attendancePercentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
              Showing {filteredStudents.length} candidate academic profiles
            </div>
          </div>
        </div>
      )}

      {/* Tab: Other Faculty (Teacher Access to other teachers data) */}
      {activeTab === 'faculty' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Faculty Mentors & Colleagues Directory</h2>
              <p className="text-xs text-slate-500">Kadiri Study Circle subject instructors and syllabus coverage</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faculty.map(f => (
              <div key={f.id} className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{f.name}</h3>
                    <div className="text-xs text-indigo-700 font-semibold">{f.subject}</div>
                  </div>
                  <span className="text-xs font-mono tabular-nums font-bold bg-indigo-50 text-indigo-800 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                    {f.classesTaken} Classes Taken
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{f.qualification}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Phone: <strong className="font-mono text-slate-800">{f.phone}</strong></span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {f.activeGroups.map(g => (
                        <span key={g} className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {g}
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingFacultyMember(f)}
                      className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200/60 flex items-center gap-1"
                      title="Edit this mentor's details"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Class Logger */}
      {activeTab === 'logger' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recorded Academic Sessions</h2>
              <p className="text-xs text-slate-500">Subjects taught, hours logged & faculty records</p>
            </div>
            <button
              onClick={() => {
                setEditingLog(null);
                setIsLogClassModalOpen(true);
              }}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log New Session</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classLogs.map(log => {
              const isMissingDate = !log.date || log.date.trim() === '';
              return (
                <div key={log.id} className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-[11px] font-semibold ${log.group === 'Group I' ? 'text-teal-700' : 'text-indigo-700'}`}>
                        {log.group}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{log.subject}</h3>
                    </div>
                    {isMissingDate ? (
                      <span className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        Missing Date
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {log.date}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{log.topic}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Mentor: <strong className="text-slate-700">{log.facultyName}</strong></span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{log.hours} hrs</span>
                      <button
                        onClick={() => {
                          setEditingLog(log);
                          setIsLogClassModalOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Mock Test Marks */}
      {activeTab === 'marks' && (
        <div className="space-y-4">
          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase">Select Mock Exam</label>
              <select
                value={selectedTestId}
                onChange={e => setSelectedTestId(e.target.value)}
                className="mt-1 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none"
              >
                {mockTests.map(test => (
                  <option key={test.id} value={test.id}>
                    {test.testName} ({test.totalMarks} Marks · {test.date})
                  </option>
                ))}
              </select>
            </div>
            <div className="text-xs text-slate-500">
              Exam Date: <strong className="text-slate-800">{activeTest.date}</strong> · Total Marks: <strong className="text-slate-800">{activeTest.totalMarks}</strong>
            </div>
          </div>

          {/* Student Marks Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-semibold">
                    <th className="py-3 px-4">Roll No</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Stream</th>
                    <th className="py-3 px-4 text-center">Score Recorded</th>
                    <th className="py-3 px-4 text-right">Enter / Update Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.slice(0, 15).map(st => {
                    const existingScore = testScores.find(s => s.testId === activeTest.id && s.studentId === st.id);
                    return (
                      <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-slate-600">{st.rollNo}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{st.name}</td>
                        <td className="py-3 px-4 text-slate-600">{st.group}</td>
                        <td className="py-3 px-4 text-center font-mono tabular-nums">
                          {existingScore ? (
                            <span className="font-bold text-teal-700">
                              {existingScore.marksObtained} / {existingScore.totalMarks}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Not entered</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <input
                              type="number"
                              placeholder={existingScore ? `${existingScore.marksObtained}` : '0'}
                              value={studentScoreInput[st.id] ?? ''}
                              onChange={e => setStudentScoreInput({ ...studentScoreInput, [st.id]: e.target.value })}
                              className="w-16 px-2 py-1 text-xs border border-slate-200 rounded-lg text-right font-mono"
                              max={activeTest.totalMarks}
                              min={0}
                            />
                            <button
                              onClick={() => handleSaveMarks(st.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                            >
                              Save
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Log Class Modal */}
      <LogClassModal
        isOpen={isLogClassModalOpen}
        onClose={() => {
          setIsLogClassModalOpen(false);
          setEditingLog(null);
        }}
        editingLog={editingLog}
      />

      {/* Edit Faculty Modal */}
      <EditFacultyModal
        isOpen={Boolean(editingFacultyMember)}
        onClose={() => setEditingFacultyMember(null)}
        facultyMember={editingFacultyMember}
      />
    </div>
  );
};
