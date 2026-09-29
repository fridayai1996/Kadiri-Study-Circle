import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { StudentGroup, ClassLog } from '../types';
import { X, Calendar, Clock, BookOpen, User, CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingLog?: ClassLog | null;
}

export const LogClassModal: React.FC<Props> = ({ isOpen, onClose, editingLog }) => {
  const { addClassLog, updateClassLog, faculty } = useApp();

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [group, setGroup] = useState<StudentGroup>('Group I');
  const [subject, setSubject] = useState('Indian Polity');
  const [topic, setTopic] = useState('');
  const [hours, setHours] = useState(2.0);
  const [facultyName, setFacultyName] = useState(faculty[0]?.name || 'Dr. K. N. Rao');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingLog) {
      setDate(editingLog.date || new Date().toISOString().split('T')[0]);
      setGroup(editingLog.group);
      setSubject(editingLog.subject);
      setTopic(editingLog.topic);
      setHours(editingLog.hours);
      setFacultyName(editingLog.facultyName);
      setNotes(editingLog.notes || '');
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setTopic('');
      setNotes('');
    }
  }, [editingLog, isOpen, faculty]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim()) return;

    if (editingLog) {
      updateClassLog(editingLog.id, {
        date,
        group,
        subject,
        topic,
        hours: Number(hours),
        facultyName,
        notes
      });
    } else {
      addClassLog({
        date,
        group,
        subject,
        topic,
        hours: Number(hours),
        facultyName,
        status: 'completed',
        notes
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {editingLog ? 'Update Class Record' : 'Log New Class Session'}
            </h2>
            <p className="text-xs text-slate-500">Kadiri Study Circle · Daily Academic Register</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Class Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Group</label>
              <select
                value={group}
                onChange={e => setGroup(e.target.value as StudentGroup)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="Group I">APPSC Group I</option>
                <option value="Group II">APPSC Group II</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="Indian Polity">Indian Polity & Constitution</option>
                <option value="Indian Economy">Indian Economy & AP Budget</option>
                <option value="AP History">AP History & Culture</option>
                <option value="Indian History">Indian National Movement</option>
                <option value="Mental Ability">Mental Ability & Reasoning</option>
                <option value="Science & Technology">Science & Technology</option>
                <option value="Current Affairs">Current Affairs & Governance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty Mentor</label>
              <select
                value={facultyName}
                onChange={e => setFacultyName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                {faculty.map(f => (
                  <option key={f.id} value={f.name}>
                    {f.name} ({f.subject.slice(0, 15)}...)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Topic Covered *</label>
            <input
              type="text"
              required
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Fundamental Rights, Articles 14 to 21 with landmark judgments"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Hours)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="8"
                value={hours}
                onChange={e => setHours(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Operational Notes</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Optional class feedback or syllabus status"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
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
              <CheckCircle className="w-4 h-4" />
              <span>{editingLog ? 'Save Updates' : 'Save Class Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
