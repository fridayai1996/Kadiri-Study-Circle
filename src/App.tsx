/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ToastContainer } from './components/ToastContainer';
import { RegisterStudentModal } from './components/RegisterStudentModal';

const MainContent: React.FC = () => {
  const { currentUser, role } = useApp();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // If user is not authenticated, show secure login gate
  if (!currentUser) {
    return (
      <>
        <LoginScreen />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-900 pb-20 md:pb-12">
      {/* Top Bar with Top Bar Contract */}
      <Header onOpenRegisterModal={() => setIsRegisterModalOpen(true)} />

      {/* Main Body - Strictly bounded by authenticated role */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentUser.role === 'admin' ? (
          <>
            {role === 'admin' && <AdminDashboard />}
            {role === 'teacher' && <TeacherDashboard />}
            {role === 'student' && <StudentDashboard />}
          </>
        ) : currentUser.role === 'teacher' ? (
          <TeacherDashboard />
        ) : (
          <StudentDashboard />
        )}
      </main>

      {/* Mobile-first bottom navigation bar */}
      <MobileBottomNav onOpenRegisterModal={() => setIsRegisterModalOpen(true)} />

      {/* Interactive Global Modals */}
      <RegisterStudentModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      {/* Non-intrusive Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
