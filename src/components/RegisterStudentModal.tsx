import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentGroup } from '../types';
import { X, UserPlus, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterStudentModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addStudent, students } = useApp();

  const [group, setGroup] = useState<StudentGroup>('Group I');
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'General' | 'BC' | 'SC' | 'ST' | 'EWS'>('General');
  const [targetExam, setTargetExam] = useState('APPSC Group I (Deputy Collector)');
  const [notes, setNotes] = useState('');

  // Auto generate next roll number when modal opens or group changes
  React.useEffect(() => {
    if (isOpen) {
      const groupCount = students.filter(s => s.group === group).length + 1;
      const prefix = group === 'Group I' ? 'KSC-G1-' : 'KSC-G2-';
      const formattedNum = groupCount < 10 ? `0${groupCount}` : `${groupCount}`;
      setRollNo(`${prefix}${formattedNum}`);
      if (group === 'Group I') {
        setTargetExam('APPSC Group I (Deputy Collector / DSP)');
      } else {
        setTargetExam('APPSC Group II (Deputy Tahsildar / ACTO)');
      }
    }
  }, [isOpen, group, students]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addStudent({
      rollNo: rollNo.trim() || `KSC-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      group,
      phone: phone.trim() || '98480 99999',
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@kadirisc.in`,
      category,
      joinDate: new Date().toISOString().split('T')[0],
      targetExam,
      notes: notes.trim()
    });

    // Reset and close
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Register New Candidate</h2>
              <p className="text-xs text-slate-500">Kadiri Study Circle · APPSC Coaching Roster</p>
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
          {/* Target Group Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Batch / Stream</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setGroup('Group I')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  group === 'Group I'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                APPSC Group I (12 current)
              </button>
              <button
                type="button"
                onClick={() => setGroup('Group II')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  group === 'Group II'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                APPSC Group II (23 current)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Student Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. K. Vamsi Krishna"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Roll Number</label>
              <input
                type="text"
                value={rollNo}
                onChange={e => setRollNo(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="98480 12345"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Post / Goal</label>
            <input
              type="text"
              value={targetExam}
              onChange={e => setTargetExam(e.target.value)}
              placeholder="e.g. Deputy Collector / ACTO"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Address</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Kadiri Town / Rural candidate, library member"
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
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors"
            >
              Enroll Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
