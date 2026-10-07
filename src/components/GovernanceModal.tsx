import React from 'react';
import { X, ShieldCheck, GraduationCap, UserCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GovernanceModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Data Access & Modification Guidelines</h2>
            <p className="text-xs text-slate-500">Kadiri Study Circle · Role Authority & Change Process</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Section 1: Who is Allowed to Change What */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>1. Authority Matrix: Who Can Change What?</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Admin Box */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Admin (Coordinator)</span>
                </div>
                <div className="text-[11px] text-slate-500 font-semibold uppercase">Full Master Authority</div>
                <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                  <li>Enroll / Register students</li>
                  <li>Edit student bio-data & roll nos</li>
                  <li>Switch batch (Group I ↔ Group II)</li>
                  <li>Override attendance audit errors</li>
                  <li>Assign faculty mentors</li>
                  <li>Issue circulars & export CSV</li>
                </ul>
              </div>

              {/* Teacher Box */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>Teacher / Faculty</span>
                </div>
                <div className="text-[11px] text-slate-500 font-semibold uppercase">Academic & Roll-Call</div>
                <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                  <li>Mark daily roll-call (P / A / L)</li>
                  <li>Log class topics & syllabus hours</li>
                  <li>Fill missing class dates</li>
                  <li>Enter mock exam marks & tests</li>
                  <li className="text-slate-400 italic">Cannot edit student personal info</li>
                </ul>
              </div>

              {/* Student Box */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Student (Aspirant)</span>
                </div>
                <div className="text-[11px] text-slate-500 font-semibold uppercase">Personal Tracking</div>
                <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                  <li>Record daily self check-in</li>
                  <li>Check off syllabus topics mastered</li>
                  <li>View personal attendance & %</li>
                  <li>View test marks & hall ticket eligibility</li>
                  <li className="text-slate-400 italic">Read-only master records (tamper-proof)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2: Step-by-Step Change Process */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>2. Step-by-Step Process for Data Changes</span>
            </h3>

            <div className="space-y-2.5">
              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <strong className="text-slate-900">Student Correction Request:</strong>
                  <p className="text-slate-600 mt-0.5">
                    If an aspirant notices an incorrect phone number, spelling error, or an attendance discrepancy (e.g., medical leave marked as unexcused absent), they notify their Faculty mentor or Center Coordinator.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <strong className="text-slate-900">Verification Against Class Registers:</strong>
                  <p className="text-slate-600 mt-0.5">
                    The Faculty cross-checks the physical roll-call log or class syllabus record for the specified date to confirm presence.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <div>
                  <strong className="text-slate-900">Admin Revision in the App:</strong>
                  <p className="text-slate-600 mt-0.5">
                    The Admin navigates to the <strong>Student Roster</strong> tab in the Executive Dashboard, clicks <strong>"Edit"</strong> next to the student's name, updates the details or adjusted attendance count, and saves.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center shrink-0 text-xs">
                  4
                </span>
                <div>
                  <strong className="text-slate-900">Instant Synchronized Update:</strong>
                  <p className="text-slate-600 mt-0.5">
                    The revised record instantly updates the student's individual dashboard, recalibrates the executive metrics (such as the 92.9% average), clears audit alerts, and reflects on exported CSV roster reports.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
