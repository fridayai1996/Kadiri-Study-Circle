import React from 'react';
import { useApp } from '../context/AppContext';

import { ShieldCheck, GraduationCap, UserCheck, RefreshCw, LogOut } from 'lucide-react';

export const Header: React.FC<{ onOpenRegisterModal?: () => void }> = ({ onOpenRegisterModal }) => {
  const { role, setRole, currentUser, logout, resetToDefault } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5">
          <img src="/assets/andhra-pradesh.png" width="48" height="48" alt="Government of Andhra Pradesh" className="shrink-0 object-contain" />
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap leading-none">
              Kadiri Study Circle
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5 hidden sm:inline">
              APPSC Group I & Group II Coaching
            </span>
          </div>
          <img src="/assets/sri-sathya-sai.jpeg" width="48" height="48" alt="Sri Sathya Sai district" className="shrink-0 object-contain" />
        </div>

        {/* Zone 2: Navigation / Authority Scope */}
        <div className="flex items-center gap-2">
          {currentUser?.role === 'admin' ? (
            /* Admin has master access and can review teacher/student views */
            <nav className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60">
              <button
                onClick={() => setRole('admin')}
                className={`min-h-[34px] px-2.5 sm:px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  role === 'admin'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Admin</span>
              </button>

              <button
                onClick={() => setRole('teacher')}
                className={`min-h-[34px] px-2.5 sm:px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  role === 'teacher'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Faculty View</span>
                <span className="sm:hidden">Teacher</span>
              </button>

              <button
                onClick={() => setRole('student')}
                className={`min-h-[34px] px-2.5 sm:px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  role === 'student'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Student View</span>
                <span className="sm:hidden">Student</span>
              </button>
            </nav>
          ) : currentUser?.role === 'teacher' ? (
            /* Teacher scope indicator */
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200/70 rounded-xl text-xs">
              <GraduationCap className="w-4 h-4 text-indigo-700 shrink-0" />
              <div className="truncate max-w-[200px] sm:max-w-xs">
                <span className="font-bold text-indigo-950">{currentUser.name}</span>
                {currentUser.subject && (
                  <span className="hidden sm:inline text-indigo-700 ml-1">({currentUser.subject})</span>
                )}
              </div>
            </div>
          ) : (
            /* Student private scope indicator */
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/70 rounded-xl text-xs">
              <UserCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <div className="truncate max-w-[200px] sm:max-w-xs">
                <span className="font-bold text-emerald-950">{currentUser?.name}</span>
                <span className="text-emerald-700 ml-1 font-mono">({currentUser?.rollNo})</span>
              </div>
            </div>
          )}
        </div>

        {/* Zone 3: Actions & Logout */}
        <div className="flex items-center gap-2">
          {currentUser?.role === 'admin' && onOpenRegisterModal && (
            <button
              onClick={onOpenRegisterModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors border border-teal-200/60"
            >
              + Enroll Candidate
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button
              onClick={resetToDefault}
              className="min-h-[36px] min-w-[36px] flex items-center justify-center p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Reset to official Kadiri Study Circle demo records"
              aria-label="Reset demo records"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={logout}
            className="min-h-[36px] px-3 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200/60 flex items-center gap-1.5"
            title="Sign out of current account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
