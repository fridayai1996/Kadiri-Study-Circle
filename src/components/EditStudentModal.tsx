import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Student, StudentGroup } from '../types';
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export const EditStudentModal: React.FC<Props> = ({ isOpen, onClose, student }) => {
  const { updateStudent } = useApp();

  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [group, setGroup] = useState<StudentGroup>('Group I');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'General' | 'BC' | 'SC' | 'ST' | 'EWS'>('General');
  const [targetExam, setTargetExam] = useState('');
  const [attendedClasses, setAttendedClasses] = useState(0);
  const [totalClasses, setTotalClasses] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (student) {
      setName(student.name);
      setRollNo(student.rollNo);
      setGroup(student.group);
      setPhone(student.phone);
      setEmail(student.email);
      setCategory(student.category);
      setTargetExam(student.targetExam);
      setAttendedClasses(student.attendedClasses);
      setTotalClasses(student.totalClasses);
      setNotes(student.notes || '');
    }
  }, [student, isOpen]);

  if (!isOpen || !student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateStudent(student.id, {
      name: name.trim(),
      rollNo: rollNo.trim(),
      group,
      phone: phone.trim(),
      email: email.trim(),
      category,
      targetExam: targetExam.trim(),
      attendedClasses: Number(attendedClasses),
      totalClasses: Number(totalClasses),
      notes: notes.trim()
    });

    onClose();
  };

  const currentPct = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 1000) / 10 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Admin: Edit Student Record</h2>
              <p className="text-xs text-slate-500">Official Data Revision & Audit Correction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900">
            <strong>Audit Note:</strong> Only authorized center administrators can modify student bio-data, roll numbers, or adjust cumulative attendance counts.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Candidate Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Roll Number</label>
              <input
                type="text"
                value={rollNo}
                onChange={e => setRollNo(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Stream / Batch</label>
              <select
                value={group}
                onChange={e => setGroup(e.target.value as StudentGroup)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="Group I">APPSC Group I (Executive)</option>
                <option value="Group II">APPSC Group II (Non-Executive)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category / Quota</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="General">General (OC)</option>
                <option value="BC">BC (Backward Class)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Post Goal</label>
              <input
                type="text"
                value={targetExam}
                onChange={e => setTargetExam(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          {/* Attendance Adjustment */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Attendance Count Override (Audit)</span>
              <span className="font-mono font-bold text-teal-700">Calculated: {currentPct}%</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Attended Classes</label>
                <input
                  type="number"
                  min="0"
                  max={totalClasses}
                  value={attendedClasses}
                  onChange={e => setAttendedClasses(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Total Conducted</label>
                <input
                  type="number"
                  min="1"
                  value={totalClasses}
                  onChange={e => setTotalClasses(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Operational & Medical Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Medical leave verified, parental confirmation received."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Record Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
