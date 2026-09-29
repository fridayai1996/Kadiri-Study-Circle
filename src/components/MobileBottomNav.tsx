import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  GraduationCap,
  UserCheck,
  PlusCircle,
  LogOut,
  CalendarCheck,
  BookOpen,
  Users
} from 'lucide-react';

export const MobileBottomNav: React.FC<{ onOpenRegisterModal?: () => void }> = ({ onOpenRegisterModal }) => {
  const { role, setRole, currentUser, logout } = useApp();

  if (!currentUser) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1 shadow-lg">
      <div className="grid grid-cols-4 items-center h-13 max-w-md mx-auto">
        {currentUser.role === 'admin' ? (
          <>
            <button
              onClick={() => setRole('admin')}
              className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                role === 'admin' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Admin</span>
            </button>

            <button
              onClick={() => setRole('teacher')}
              className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                role === 'teacher' ? 'text-indigo-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Faculty</span>
            </button>

            <button
              onClick={() => setRole('student')}
              className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                role === 'student' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserCheck className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Student</span>
            </button>

            <button
              onClick={onOpenRegisterModal}
              className="min-h-[44px] flex flex-col items-center justify-center text-slate-600 hover:text-teal-700 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Enroll</span>
            </button>
          </>
        ) : currentUser.role === 'teacher' ? (
          <>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="min-h-[44px] flex flex-col items-center justify-center text-indigo-700 font-bold"
            >
              <CalendarCheck className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Roll-Call</span>
            </button>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="min-h-[44px] flex flex-col items-center justify-center text-slate-600 hover:text-indigo-700"
            >
              <Users className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Students</span>
            </button>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="min-h-[44px] flex flex-col items-center justify-center text-slate-600 hover:text-indigo-700"
            >
              <GraduationCap className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Faculty</span>
            </button>

            <button
              onClick={logout}
              className="min-h-[44px] flex flex-col items-center justify-center text-rose-600 hover:text-rose-700"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Exit</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="min-h-[44px] flex flex-col items-center justify-center text-emerald-700 font-bold"
            >
              <UserCheck className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">My Profile</span>
            </button>

            <button
              onClick={() => window.scrollTo({ top: 300, behavior: 'smooth' })}
              className="min-h-[44px] flex flex-col items-center justify-center text-slate-600 hover:text-emerald-700"
            >
              <CalendarCheck className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Attendance</span>
            </button>

            <button
              onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
              className="min-h-[44px] flex flex-col items-center justify-center text-slate-600 hover:text-emerald-700"
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Syllabus</span>
            </button>

            <button
              onClick={logout}
              className="min-h-[44px] flex flex-col items-center justify-center text-rose-600 hover:text-rose-700"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Exit</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
