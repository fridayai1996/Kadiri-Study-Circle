import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Award, BookOpen, Calendar, CheckSquare, Square, ShieldCheck } from 'lucide-react';
import { RegisterStudentModal } from './RegisterStudentModal';
import { StudentCorrectionModal } from './StudentCorrectionModal';

export const StudentDashboard: React.FC = () => {
  const {
    students,
    activeStudentId,
    setActiveStudentId,
    currentUser,
    syllabusModules,
    toggleSyllabusTopic,
    testScores,
    mockTests,
    dailyAttendanceHistory,
    announcements,
    showToast
  } = useApp();

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);

  // Active student - strictly locked to currentUser if logged in as student
  const effectiveStudentId = currentUser?.role === 'student' ? currentUser.id : activeStudentId;
  const student = students.find(s => s.id === effectiveStudentId) || students[0];

  const isLowAttendance = student.attendancePercentage < 75;

  // Student test scores
  const myScores = testScores.filter(s => s.studentId === student.id);

  // Student syllabus modules
  const relevantModules = syllabusModules.filter(m => m.group === student.group);

  // Quick student self attendance check-in for today
  const handleSelfCheckin = () => {
    showToast({
      type: 'success',
      title: 'Study Circle Check-in Recorded',
      message: `${student.name} marked present for today's session.`
    });
  };

  // Recent attendance dates for this student
  const attendanceDates = [
    { date: '2026-09-27', day: 'Fri', status: dailyAttendanceHistory['2026-09-27']?.[student.id] || 'present' },
    { date: '2026-09-24', day: 'Tue', status: dailyAttendanceHistory['2026-09-24']?.[student.id] || 'present' },
    { date: '2026-09-23', day: 'Mon', status: dailyAttendanceHistory['2026-09-23']?.[student.id] || 'present' },
    { date: '2026-09-22', day: 'Sun', status: 'present' },
    { date: '2026-09-21', day: 'Sat', status: 'present' }
  ];

  return (
    <div className="space-y-6">
      {/* Student Banner with Quick Profile Switcher */}
      <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {student.name}
                </h1>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                  student.group === 'Group I' ? 'bg-teal-50 text-teal-800' : 'bg-indigo-50 text-indigo-800'
                }`}>
                  {student.group}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                <span>Roll: <strong className="font-mono text-slate-700">{student.rollNo}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Goal: <strong className="text-slate-700">{student.targetExam}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Category: {student.category}</span>
              </div>
            </div>
          </div>

          {/* Persona selector: Only Admin can preview other students */}
          <div className="flex items-center gap-2">
            {currentUser?.role === 'admin' ? (
              <div className="relative">
                <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-0.5">
                  Admin Preview: View Candidate ({students.length})
                </label>
                <select
                  value={student.id}
                  onChange={e => setActiveStudentId(e.target.value)}
                  className="text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer focus:outline-none"
                >
                  <optgroup label="Group I Candidates">
                    {students.filter(s => s.group === 'Group I').map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.rollNo}) - {s.attendancePercentage}%
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Group II Candidates">
                    {students.filter(s => s.group === 'Group II').map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.rollNo}) - {s.attendancePercentage}%
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-600">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold text-slate-800">Private Student Profile</span>
              </div>
            )}

            <button
              onClick={() => setIsCorrectionModalOpen(true)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors border border-slate-200/60 whitespace-nowrap"
              title="Report attendance or bio-data discrepancy to center coordinator"
            >
              Report Discrepancy
            </button>

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="px-3 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors border border-teal-200/60 whitespace-nowrap"
              >
                + Register
              </button>
            )}
          </div>
        </div>

        {/* Low Attendance Warning if < 75% */}
        {isLowAttendance ? (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-900 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong>Attendance Warning ({student.attendancePercentage}%):</strong> Your attendance is below the
              mandatory 75% benchmark (Attended {student.attendedClasses} of {student.totalClasses} classes).
              Please meet the Kadiri Study Circle Coordinator to maintain eligibility for the upcoming mock exams.
            </div>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Attendance Compliant ({student.attendancePercentage}%):</strong> Eligible for all APPSC test series & study materials.
              </span>
            </div>
            <button
              onClick={handleSelfCheckin}
              className="px-3 py-1 font-semibold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 rounded-lg transition-colors text-[11px]"
            >
              Daily Self Check-in
            </button>
          </div>
        )}
      </div>

      {/* Metrics Row: Attendance, Syllabus, Tests */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Attendance Card */}
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Attendance Rate</span>
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold font-mono tabular-nums ${isLowAttendance ? 'text-rose-600' : 'text-teal-700'}`}>
              {student.attendancePercentage}%
            </span>
            <span className="text-xs text-slate-500">
              ({student.attendedClasses} / {student.totalClasses} classes)
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isLowAttendance ? 'bg-rose-500' : 'bg-teal-600'
              }`}
              style={{ width: `${Math.min(student.attendancePercentage, 100)}%` }}
            />
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Absent: {student.totalClasses - student.attendedClasses} classes</span>
            <span className={isLowAttendance ? 'text-rose-600 font-semibold' : 'text-emerald-600 font-semibold'}>
              {isLowAttendance ? 'Deficit' : 'On Track'}
            </span>
          </div>
        </div>

        {/* Target & Rank Card */}
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Academy Rank & Mock Tests</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {myScores[0] ? `#${myScores[0].rank}` : 'Top Tier'}
            </span>
            <span className="text-xs text-slate-500">in batch</span>
          </div>

          <div className="text-xs text-slate-600 line-clamp-1">
            {myScores[0] ? `${myScores[0].marksObtained}/${myScores[0].totalMarks} in Prelims Mock` : 'Participating in tests'}
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Next Grand Mock: Sunday</span>
            <span className="text-indigo-600 font-semibold">150 Marks</span>
          </div>
        </div>

        {/* Syllabus Progress Card */}
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>APPSC Syllabus Covered</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-indigo-600">
              74%
            </span>
            <span className="text-xs text-slate-500">completed</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-2">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: '74%' }} />
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Faculty Hours: ~50 hrs</span>
            <span className="text-slate-700 font-semibold">{student.group}</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Syllabus Checklist & Attendance Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Syllabus Tracker */}
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Syllabus Topic Checklist</h3>
              <p className="text-xs text-slate-500">{student.group} Core Preparation</p>
            </div>
            <span className="text-xs font-mono text-indigo-600 font-semibold">Tap to mark mastered</span>
          </div>

          <div className="space-y-4">
            {relevantModules.map(module => (
              <div key={module.id} className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{module.name}</h4>
                  <span className="text-[11px] font-mono text-slate-500">
                    {module.completedHours} / {module.totalHours} hrs
                  </span>
                </div>

                <div className="space-y-1.5">
                  {module.topics.map((topic, idx) => (
                    <button
                      key={topic.title}
                      onClick={() => toggleSyllabusTopic(module.id, idx)}
                      className="w-full flex items-start gap-2.5 text-left text-xs p-1.5 rounded-lg hover:bg-white transition-colors"
                    >
                      {topic.completed ? (
                        <CheckSquare className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      )}
                      <span className={topic.completed ? 'text-slate-800 line-through decoration-slate-300' : 'text-slate-700 font-medium'}>
                        {topic.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Daily Attendance Logs & Tests */}
        <div className="space-y-4">
          {/* Attendance Log History */}
          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Attendance Records</h3>
                <p className="text-xs text-slate-500">Personal roll-call verification</p>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-700">
                {student.attendedClasses} / {student.totalClasses} Total
              </span>
            </div>

            <div className="space-y-2">
              {attendanceDates.map(item => (
                <div
                  key={item.date}
                  className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-16 font-mono font-semibold text-slate-800">{item.date.slice(5)}</span>
                    <span className="text-slate-500">({item.day})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.status === 'present' ? (
                      <span className="text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-md text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Present
                      </span>
                    ) : (
                      <span className="text-rose-700 font-bold bg-rose-100 px-2.5 py-0.5 rounded-md text-[11px]">
                        Absent
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mock Test Score History */}
          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Mock Exam Scores</h3>
                <p className="text-xs text-slate-500">Kadiri Study Circle Test Series</p>
              </div>
              <Award className="w-4 h-4 text-amber-500" />
            </div>

            <div className="space-y-2">
              {mockTests.map(test => {
                const score = testScores.find(s => s.testId === test.id && s.studentId === student.id);
                return (
                  <div key={test.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{test.testName}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-mono">{test.date} · {test.subject}</div>
                    </div>
                    <div className="text-right">
                      {score ? (
                        <>
                          <div className="font-mono font-bold text-teal-700 text-sm">
                            {score.marksObtained} / {score.totalMarks}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">Rank #{score.rank}</div>
                        </>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Upcoming / Evaluated</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's Classes & Notices */}
          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Important Notices</h3>
              <span className="text-xs text-slate-500 font-mono">Latest Circular</span>
            </div>

            {announcements.slice(0, 2).map(ann => (
              <div key={ann.id} className="p-3 bg-slate-50 rounded-xl">
                <div className="font-semibold text-xs text-slate-900">{ann.title}</div>
                <p className="text-xs text-slate-600 mt-1">{ann.content}</p>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">{ann.date} · {ann.author}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <RegisterStudentModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
      <StudentCorrectionModal
        isOpen={isCorrectionModalOpen}
        onClose={() => setIsCorrectionModalOpen(false)}
        student={student}
      />
    </div>
  );
};
