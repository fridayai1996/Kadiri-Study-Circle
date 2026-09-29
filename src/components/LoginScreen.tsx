import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import {
  ShieldCheck,
  GraduationCap,
  UserCheck,
  Lock,
  ArrowRight,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, faculty, students } = useApp();

  const [activeTab, setActiveTab] = useState<Role>('admin');
  const [identifier, setIdentifier] = useState('admin@kadirisc.in');
  const [password, setPassword] = useState('admin');
  const [errorMsg, setErrorMsg] = useState('');

  // When changing tab, update demo defaults for zero-friction convenience
  const handleTabChange = (role: Role) => {
    setActiveTab(role);
    setErrorMsg('');
    if (role === 'admin') {
      setIdentifier('admin@kadirisc.in');
      setPassword('admin');
    } else if (role === 'teacher') {
      setIdentifier(faculty[0]?.email || 'knrao.polity@kadirisc.in');
      setPassword('teacher');
    } else {
      setIdentifier('KSC-G1-01');
      setPassword('student');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(activeTab, identifier, password);
    if (!res.success) {
      setErrorMsg(res.message || 'Login failed. Please check your credentials.');
    }
  };

  // Quick 1-click preset login
  const handleQuickLogin = (role: Role, idStr: string, pwdStr: string) => {
    setErrorMsg('');
    login(role, idStr, pwdStr);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-600 text-white shadow-md mb-3">
          <BookOpen className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Kadiri Study Circle
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          APPSC Group I & Group II Coaching · Role-Based Access Portal
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-xl overflow-hidden">
          {/* Role Selection Tabs */}
          <div className="grid grid-cols-3 p-1.5 bg-slate-100/90 border-b border-slate-200/70">
            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              className={`min-h-[44px] flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-teal-600 mb-0.5" />
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('teacher')}
              className={`min-h-[44px] flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'teacher'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-indigo-600 mb-0.5" />
              <span>Teacher</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('student')}
              className={`min-h-[44px] flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'student'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-600 mb-0.5" />
              <span>Student</span>
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="p-6 sm:p-7 space-y-4">
            {/* Dynamic Scope / Permission Explainer */}
            <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
              activeTab === 'admin'
                ? 'bg-teal-50/70 border-teal-200/80 text-teal-900'
                : activeTab === 'teacher'
                ? 'bg-indigo-50/70 border-indigo-200/80 text-indigo-900'
                : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900'
            }`}>
              {activeTab === 'admin' && (
                <div>
                  <strong>Admin Authority:</strong> Full access to everything. Center executive dashboard, all student records, roll-call adjustments, faculty registers, and data quality audits.
                </div>
              )}
              {activeTab === 'teacher' && (
                <div>
                  <strong>Teacher Authority:</strong> Access enabled to <strong>all student attendance sheets</strong> and <strong>other teachers' directory & schedules</strong>. Master center settings are restricted.
                </div>
              )}
              {activeTab === 'student' && (
                <div>
                  <strong>Student Privacy Guarantee:</strong> Access enabled to <strong>your personal record only</strong>. View your own attendance %, test scores, and syllabus checklist. Other students' data is strictly protected.
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Input 1: Identifier */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {activeTab === 'admin' && 'Admin Official ID / Email'}
                {activeTab === 'teacher' && 'Faculty Member / Email'}
                {activeTab === 'student' && 'Student Roll Number or Mobile'}
              </label>

              {activeTab === 'teacher' ? (
                <select
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  {faculty.map(f => (
                    <option key={f.id} value={f.email}>
                      {f.name} ({f.subject})
                    </option>
                  ))}
                </select>
              ) : activeTab === 'student' ? (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="e.g. KSC-G1-01 or anusha.reddy@kadirisc.in"
                    className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 uppercase placeholder:normal-case placeholder:font-sans"
                  />
                  <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                    <span>Quick presets:</span>
                    <button
                      type="button"
                      onClick={() => setIdentifier('KSC-G1-01')}
                      className="text-teal-700 font-mono hover:underline"
                    >
                      KSC-G1-01 (Anusha - 100%)
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => setIdentifier('KSC-G1-12')}
                      className="text-rose-700 font-mono hover:underline"
                    >
                      KSC-G1-12 (Sandeep - 72%)
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => setIdentifier('KSC-G2-01')}
                      className="text-indigo-700 font-mono hover:underline"
                    >
                      KSC-G2-01 (Venkata Raman)
                    </button>
                  </div>
                </div>
              ) : (
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="admin@kadirisc.in"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              )}
            </div>

            {/* Input 2: Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Access Password / PIN</label>
                <span className="text-[11px] text-slate-400 font-mono">
                  Default: {activeTab === 'admin' ? 'admin' : activeTab === 'teacher' ? 'teacher' : 'student'}
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className={`w-full min-h-[46px] py-2.5 px-4 rounded-xl font-bold text-sm text-white shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] ${
                activeTab === 'admin'
                  ? 'bg-teal-600 hover:bg-teal-700'
                  : activeTab === 'teacher'
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <span>Sign In to {activeTab === 'admin' ? 'Admin Portal' : activeTab === 'teacher' ? 'Faculty Portal' : 'Student Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 text-center space-y-1.5">
            <div className="font-semibold text-slate-700">Quick Demo Logins (1-Tap):</div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin@kadirisc.in', 'admin')}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-teal-50 hover:text-teal-800 rounded-lg transition-colors font-medium"
              >
                Coordinator (Admin)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('teacher', 'knrao.polity@kadirisc.in', 'teacher')}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-indigo-50 hover:text-indigo-800 rounded-lg transition-colors font-medium"
              >
                Dr. K. N. Rao (Teacher)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('student', 'KSC-G1-01', 'student')}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition-colors font-medium"
              >
                Anusha (Student 100%)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('student', 'KSC-G1-12', 'student')}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-800 rounded-lg transition-colors font-medium"
              >
                Sandeep (Student 72%)
              </button>
            </div>
          </div>
        </div>

        {/* Security / Privacy Trust Marker */}
        <div className="mt-4 text-center text-xs text-slate-500">
          Kadiri Study Circle, Sri Sathya Sai District · APPSC Coaching Cell
        </div>
      </div>
    </div>
  );
};
