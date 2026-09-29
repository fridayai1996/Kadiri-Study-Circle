import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Faculty, StudentGroup } from '../types';
import { X, GraduationCap, CheckCircle2, UserCheck, BookOpen } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  facultyMember: Faculty | null;
}

export const EditFacultyModal: React.FC<Props> = ({ isOpen, onClose, facultyMember }) => {
  const { updateFaculty } = useApp();

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [qualification, setQualification] = useState('');
  const [classesTaken, setClassesTaken] = useState(0);
  const [activeGroups, setActiveGroups] = useState<StudentGroup[]>(['Group I', 'Group II']);

  useEffect(() => {
    if (facultyMember) {
      setName(facultyMember.name);
      setSubject(facultyMember.subject);
      setPhone(facultyMember.phone);
      setEmail(facultyMember.email);
      setQualification(facultyMember.qualification);
      setClassesTaken(facultyMember.classesTaken);
      setActiveGroups(facultyMember.activeGroups || ['Group I', 'Group II']);
    }
  }, [facultyMember, isOpen]);

  if (!isOpen || !facultyMember) return null;

  const toggleGroup = (grp: StudentGroup) => {
    setActiveGroups(prev =>
      prev.includes(grp)
        ? prev.length > 1
          ? prev.filter(g => g !== grp)
          : prev
        : [...prev, grp]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !subject.trim()) return;

    updateFaculty(facultyMember.id, {
      name: name.trim(),
      subject: subject.trim(),
      phone: phone.trim(),
      email: email.trim(),
      qualification: qualification.trim(),
      classesTaken: Number(classesTaken) >= 0 ? Number(classesTaken) : 0,
      activeGroups
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Modify Faculty Details</h2>
              <p className="text-xs text-slate-500">Kadiri Study Circle · Faculty Register</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Dr. K. N. Rao"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Specialization *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Indian Polity & Constitution"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="94401 55001"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="mentor@kadirisc.in"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Background & Qualifications</label>
            <textarea
              rows={2}
              value={qualification}
              onChange={e => setQualification(e.target.value)}
              placeholder="e.g. M.A., Ph.D. (Pol Sci), Ex-Guest Faculty AP Academy, 12 years coaching experience"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Classes Conducted</label>
              <input
                type="number"
                min="0"
                value={classesTaken}
                onChange={e => setClassesTaken(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Batches Handled</label>
              <div className="flex items-center gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={activeGroups.includes('Group I')}
                    onChange={() => toggleGroup('Group I')}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>APPSC Group I</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={activeGroups.includes('Group II')}
                    onChange={() => toggleGroup('Group II')}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>APPSC Group II</span>
                </label>
              </div>
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
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Faculty Details</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
