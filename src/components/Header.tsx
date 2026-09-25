import React from 'react';
import { BookOpen, Users, BarChart3, Database, Award, GraduationCap, Gamepad2, Settings, Lock } from 'lucide-react';
import { HBLogo } from './HBLogo';
import { SystemConfig } from '../types';

export type TabType = 'classes' | 'learning' | 'assessment' | 'games' | 'analytics' | 'schema' | 'system';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  userRole: 'teacher' | 'student';
  setUserRole: (role: 'teacher' | 'student') => void;
  systemConfig: SystemConfig;
  onOpenTeacherPinModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  systemConfig,
  onOpenTeacherPinModal,
}) => {
  const allNavItems: { id: TabType; label: string; icon: any; badge?: string; roles?: ('teacher' | 'student')[] }[] = [
    { id: 'classes', label: 'Quản lý Lớp', icon: Users, roles: ['teacher'] },
    { id: 'learning', label: 'Không gian Học tập', icon: BookOpen, roles: ['teacher', 'student'] },
    { id: 'assessment', label: 'Kiểm tra & Đánh giá', icon: Award, roles: ['teacher', 'student'] },
    { id: 'games', label: 'Game Ôn tập', icon: Gamepad2, badge: 'HOT', roles: ['teacher', 'student'] },
    { id: 'analytics', label: 'AI Analytics', icon: BarChart3, roles: ['teacher'] },
    { id: 'schema', label: 'CSDL Schema', icon: Database, roles: ['teacher'] },
    { id: 'system', label: 'Hệ thống', icon: Settings, badge: 'ADMIN', roles: ['teacher'] },
  ];

  // Filter tabs according to userRole and SystemConfig
  const navItems = allNavItems.filter(item => {
    if (!item.roles || !item.roles.includes(userRole)) return false;
    if (userRole === 'student') {
      // In Exam Lockdown Mode, only Assessment is visible
      if (systemConfig.examLockdownMode) {
        return item.id === 'assessment';
      }
      // Check individual module toggles
      if (item.id === 'learning' && !systemConfig.studentAllowedTabs.learning) return false;
      if (item.id === 'assessment' && !systemConfig.studentAllowedTabs.assessment) return false;
      if (item.id === 'games' && !systemConfig.studentAllowedTabs.games) return false;
    }
    return true;
  });

  const handleTeacherRoleClick = () => {
    if (userRole === 'teacher') return;
    if (systemConfig.requirePinForTeacher) {
      onOpenTeacherPinModal();
    } else {
      setUserRole('teacher');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Wordmark & Modern HB Tech Branding */}
          <div className="cursor-pointer" onClick={() => setActiveTab(userRole === 'teacher' ? 'classes' : 'learning')}>
            <HBLogo size="md" subtitle="Nền tảng Tin học 10, 11, 12 · KNTT" />
          </div>

          {/* Zone 2: Navigation Links (Tactile 3D Command Buttons) */}
          <nav className="hidden lg:flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl border border-slate-300/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_1px_2px_rgba(255,255,255,0.8)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 relative select-none cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-b from-indigo-500 via-indigo-600 to-indigo-700 text-white font-bold border border-indigo-400/80 border-b-[3.5px] border-b-indigo-950 shadow-[0_2px_8px_rgba(79,70,229,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] translate-y-[1px]'
                      : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-700 font-semibold border border-slate-300/80 border-b-[3.5px] border-b-slate-400 shadow-[0_2px_3px_rgba(0,0,0,0.06)] hover:from-white hover:to-indigo-50/60 hover:text-indigo-700 hover:border-b-indigo-400 hover:-translate-y-[1px] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08)] active:translate-y-[2px] active:border-b-[1px] active:shadow-none'
                  }`}
                >
                  <span
                    className={`p-1 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-800/80 text-cyan-200 shadow-inner'
                        : 'bg-slate-200/70 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <span className="tracking-tight">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-md font-mono uppercase tracking-wider shadow-xs animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(103,232,249,0.9)] ml-0.5 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Role Switcher */}
          <div className="flex items-center gap-3">
            {/* Modern 3D Role Switch Toggle with PIN Protection */}
            {userRole === 'student' && systemConfig.hideRoleSwitcherForStudent ? (
              <button
                onClick={onOpenTeacherPinModal}
                title="Mở khóa quyền Giáo viên / Quản trị viên (Cần mã PIN)"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Học sinh</span>
              </button>
            ) : (
              <div className="flex items-center bg-slate-200/80 p-1 rounded-xl border border-slate-300/90 shadow-[inset_0_2px_3px_rgba(0,0,0,0.06)] gap-1">
                <button
                  onClick={handleTeacherRoleClick}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 select-none cursor-pointer ${
                    userRole === 'teacher'
                      ? 'bg-gradient-to-b from-indigo-600 to-indigo-700 text-white font-bold border border-indigo-500 border-b-[2.5px] border-b-indigo-950 shadow-[0_2px_5px_rgba(79,70,229,0.35)] translate-y-[1px]'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 border-b-[2.5px] border-b-slate-300 active:translate-y-[1px]'
                  }`}
                >
                  {systemConfig.requirePinForTeacher && userRole === 'student' && (
                    <Lock className="w-3 h-3 text-slate-400" />
                  )}
                  <span>Giáo viên</span>
                </button>
                <button
                  onClick={() => setUserRole('student')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 select-none cursor-pointer ${
                    userRole === 'student'
                      ? 'bg-gradient-to-b from-cyan-600 to-cyan-700 text-white font-bold border border-cyan-500 border-b-[2.5px] border-b-cyan-950 shadow-[0_2px_5px_rgba(8,145,178,0.35)] translate-y-[1px]'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 border-b-[2.5px] border-b-slate-300 active:translate-y-[1px]'
                  }`}
                >
                  <span>Học sinh</span>
                </button>
              </div>
            )}

            {/* User Identity Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200/80">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold shadow-xs border border-indigo-400/30">
                {userRole === 'teacher' ? (
                  <GraduationCap className="w-4 h-4 text-cyan-300" />
                ) : (
                  <span className="text-[11px] font-black text-cyan-300">HB</span>
                )}
              </div>
              <div className="hidden md:block text-left text-xs leading-tight">
                <p className="font-bold text-slate-800">
                  {userRole === 'teacher' ? 'ThS. Nguyễn Văn Hùng' : 'Nguyễn Văn An'}
                </p>
                <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  {userRole === 'teacher' ? 'Admin / GV Tin học' : 'Lớp 12A1 · THPT'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Medium & Mobile screen tab row (Tactile 3D Command Buttons) */}
        <div className="lg:hidden flex items-center py-2.5 border-t border-slate-100 overflow-x-auto gap-2 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 select-none cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-b from-indigo-500 via-indigo-600 to-indigo-700 text-white font-bold border border-indigo-400 border-b-[3px] border-b-indigo-950 shadow-[0_2px_6px_rgba(79,70,229,0.4)] translate-y-[1px]'
                    : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-700 border border-slate-300 border-b-[3px] border-b-slate-400 shadow-2xs hover:bg-slate-50 active:translate-y-[2px] active:border-b-[1px]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[8px] font-black px-1.5 py-0.2 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded font-mono uppercase">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

