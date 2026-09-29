import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import { X, Send, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
}

export const StudentCorrectionModal: React.FC<Props> = ({ isOpen, onClose, student }) => {
  const { showToast } = useApp();
  const [requestType, setRequestType] = useState<'attendance' | 'contact' | 'stream'>('attendance');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    showToast({
      type: 'success',
      title: 'Correction Request Dispatched',
      message: `Your request regarding ${requestType} has been submitted to the Admin coordinator for verification.`
    });

    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Request Data Correction</h2>
            <p className="text-xs text-slate-500">Candidate: {student.name} ({student.rollNo})</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-teal-50/70 border border-teal-200/60 rounded-xl text-xs text-teal-900">
            <strong>Change Policy:</strong> To protect attendance and record integrity, candidates cannot directly alter official logs. Requests are reviewed by the center coordinator against daily faculty registers.
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Correction Category</label>
            <select
              value={requestType}
              onChange={e => setRequestType(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="attendance">Attendance Discrepancy (e.g., Medical leave, marked absent erroneously)</option>
              <option value="contact">Contact Information (Phone, Email, Address)</option>
              <option value="stream">Target Stream / Goal (Group I ↔ Group II, Target Post)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Details of Correction *</label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Specify the date, reason, or updated details (e.g. 'I was present in Indian Polity class on 24-Sep with Dr. Rao sir')."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20"
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
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit to Coordinator</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
