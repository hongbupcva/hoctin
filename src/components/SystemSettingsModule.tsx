import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Sliders,
  Settings,
  AlertCircle,
  CheckCircle2,
  School,
  Sparkles,
  BookOpen,
  Award,
  Gamepad2,
  Terminal,
  Trophy,
  ExternalLink,
  Info
} from 'lucide-react';
import { SystemConfig } from '../types';

interface SystemSettingsModuleProps {
  config: SystemConfig;
  onSaveConfig: (newConfig: SystemConfig) => void;
  onResetDefaults: () => void;
  onPreviewStudentMode: () => void;
}

export const SystemSettingsModule: React.FC<SystemSettingsModuleProps> = ({
  config,
  onSaveConfig,
  onResetDefaults,
  onPreviewStudentMode,
}) => {
  const [formData, setFormData] = useState<SystemConfig>(config);
  const [showPin, setShowPin] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState<'access' | 'modules' | 'exam' | 'info'>('access');

  // Handle saving
  const handleSave = () => {
    onSaveConfig(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Handle toggle allowed tabs
  const handleToggleTab = (tab: keyof SystemConfig['studentAllowedTabs']) => {
    setFormData(prev => ({
      ...prev,
      studentAllowedTabs: {
        ...prev.studentAllowedTabs,
        [tab]: !prev.studentAllowedTabs[tab],
      },
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Header Banner & Status Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-indigo-500/30 relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-cyan-300 text-xs font-mono font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>TRUNG TÂM QUẢN TRỊ HỆ THỐNG · ADMIN CONSOLE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Cài đặt Hệ thống & Phân quyền Học sinh
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Cấu hình bảo mật để học sinh khi truy cập thiết bị chỉ thấy và thao tác trong không gian dành riêng cho học sinh, khóa chuyển đổi quyền giáo viên và quản lý các phân hệ hiển thị.
            </p>
          </div>

          {/* Quick status badge 3D */}
          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-3.5 flex items-center gap-3">
              <div
                className={`w-3.5 h-3.5 rounded-full ${
                  formData.studentOnlyMode
                    ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse'
                    : 'bg-amber-400'
                }`}
              />
              <div>
                <p className="text-[11px] font-mono text-slate-400 uppercase">Chế độ phân quyền</p>
                <p className="text-xs font-bold text-white">
                  {formData.studentOnlyMode ? 'ĐANG KHÓA HỌC SINH' : 'Chế độ Mở Tự do'}
                </p>
              </div>
            </div>

            <button
              onClick={onPreviewStudentMode}
              className="px-4 py-3 bg-gradient-to-b from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white text-xs font-bold rounded-xl border border-cyan-300 border-b-[3px] border-b-cyan-800 shadow-md active:translate-y-[1px] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Xem trước giao diện Học sinh</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs for Settings Sections (3D Tactile Buttons) */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl border border-slate-300/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSection('access')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-150 whitespace-nowrap flex items-center gap-2 cursor-pointer select-none ${
            activeSection === 'access'
              ? 'bg-gradient-to-b from-indigo-500 to-indigo-700 text-white font-bold border border-indigo-400 border-b-[3px] border-b-indigo-950 shadow-[0_2px_6px_rgba(79,70,229,0.35)] translate-y-[1px]'
              : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-700 border border-slate-300/80 border-b-[3px] border-b-slate-400 shadow-2xs hover:text-indigo-700 hover:-translate-y-[1px] active:translate-y-[2px]'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>1. Khóa & Phân quyền Học sinh</span>
        </button>

        <button
          onClick={() => setActiveSection('modules')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-150 whitespace-nowrap flex items-center gap-2 cursor-pointer select-none ${
            activeSection === 'modules'
              ? 'bg-gradient-to-b from-indigo-500 to-indigo-700 text-white font-bold border border-indigo-400 border-b-[3px] border-b-indigo-950 shadow-[0_2px_6px_rgba(79,70,229,0.35)] translate-y-[1px]'
              : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-700 border border-slate-300/80 border-b-[3px] border-b-slate-400 shadow-2xs hover:text-indigo-700 hover:-translate-y-[1px] active:translate-y-[2px]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>2. Phân hệ Học sinh được thấy</span>
        </button>

        <button
          onClick={() => setActiveSection('exam')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-150 whitespace-nowrap flex items-center gap-2 cursor-pointer select-none ${
            activeSection === 'exam'
              ? 'bg-gradient-to-b from-indigo-500 to-indigo-700 text-white font-bold border border-indigo-400 border-b-[3px] border-b-indigo-950 shadow-[0_2px_6px_rgba(79,70,229,0.35)] translate-y-[1px]'
              : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-700 border border-slate-300/80 border-b-[3px] border-b-slate-400 shadow-2xs hover:text-indigo-700 hover:-translate-y-[1px] active:translate-y-[2px]'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>3. Chế độ Phòng thi Kiosk</span>
        </button>

        <button
          onClick={() => setActiveSection('info')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-150 whitespace-nowrap flex items-center gap-2 cursor-pointer select-none ${
            activeSection === 'info'
              ? 'bg-gradient-to-b from-indigo-500 to-indigo-700 text-white font-bold border border-indigo-400 border-b-[3px] border-b-indigo-950 shadow-[0_2px_6px_rgba(79,70,229,0.35)] translate-y-[1px]'
              : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-700 border border-slate-300/80 border-b-[3px] border-b-slate-400 shadow-2xs hover:text-indigo-700 hover:-translate-y-[1px] active:translate-y-[2px]'
          }`}
        >
          <School className="w-3.5 h-3.5" />
          <span>4. Thông tin Hệ thống & Đơn vị</span>
        </button>
      </div>

      {/* 3. Section Content Panels */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-8">
        {/* SECTION 1: KHÓA & PHÂN QUYỀN HỌC SINH */}
        {activeSection === 'access' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-600" />
                <span>Chính sách Truy cập & Bảo vệ Quyền Học sinh</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Thiết lập kiểm soát nghiêm ngặt để học sinh không tự ý thay đổi dữ liệu hoặc xem các màn hình nhạy cảm của giáo viên.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Policy 1: Student-Only Mode */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  formData.studentOnlyMode
                    ? 'bg-indigo-50/60 border-indigo-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
                        <ShieldCheck className="w-4 h-4" />
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">
                        Bật Khóa Phân quyền Học sinh
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Khi học sinh truy cập vào ứng dụng, hệ thống chỉ hiển thị đúng các phân hệ dành cho học sinh. Các tab <strong>Quản lý Lớp, AI Analytics, CSDL Schema</strong> và <strong>Cài đặt Hệ thống</strong> sẽ được bảo vệ tuyệt đối.
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={formData.studentOnlyMode}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, studentOnlyMode: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              {/* Policy 2: Require PIN for Teacher */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  formData.requirePinForTeacher
                    ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
                        <KeyRound className="w-4 h-4" />
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">
                        Yêu cầu Mã PIN để chuyển sang Giáo viên
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Học sinh không thể tự ý bấm sang vai trò Giáo viên. Khi bấm chuyển vai trò, hệ thống sẽ yêu cầu nhập đúng mã PIN bảo mật của Giáo viên/Admin mới được cấp quyền.
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={formData.requirePinForTeacher}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          requirePinForTeacher: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>

              {/* Policy 3: Admin PIN Configuration */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                    <KeyRound className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Mã PIN Bảo mật Admin / Giáo viên</h3>
                    <p className="text-[11px] text-slate-500">Mã PIN dùng để mở khóa quyền Giáo viên</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 max-w-sm">
                  <div className="relative flex-1">
                    <input
                      type={showPin ? 'text' : 'password'}
                      value={formData.adminPin}
                      maxLength={8}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, adminPin: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono tracking-widest text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Mã PIN 4-8 số"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, adminPin: '1234' }))}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300"
                  >
                    Đặt lại '1234'
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  * Mặc định là: <code className="font-mono font-bold text-slate-700">1234</code>. Giáo viên có thể đặt từ 4 - 8 chữ số.
                </p>
              </div>

              {/* Policy 4: Hide Role Switcher completely */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  formData.hideRoleSwitcherForStudent
                    ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-amber-600 text-white">
                        <EyeOff className="w-4 h-4" />
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">
                        Ẩn nút Chuyển vai trò đối với Học sinh
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Ẩn hoàn toàn nút chuyển đổi Giáo viên/Học sinh trên thanh menu trên cùng khi ở giao diện học sinh. Giáo viên có thể mở khóa bằng nút ổ khóa kín đáo ở chân trang.
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={formData.hideRoleSwitcherForStudent}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          hideRoleSwitcherForStudent: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: QUẢN LÝ PHÂN HỆ HỌC SINH ĐƯỢC THẤY */}
        {activeSection === 'modules' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <span>Danh mục Phân hệ Hiển thị cho Học sinh</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Admin có toàn quyền quyết định học sinh được phép truy cập vào những phân hệ nào trong 3 phân hệ học sinh.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Module 1: Không gian học tập */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  formData.studentAllowedTabs.learning
                    ? 'bg-indigo-50/50 border-indigo-300 shadow-sm ring-1 ring-indigo-400/30'
                    : 'bg-slate-50/60 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-xs">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.studentAllowedTabs.learning}
                      onChange={() => handleToggleTab('learning')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  1. Không gian Học tập
                </h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Lý thuyết bài học theo SGK KNTT, thực hành lập trình HTML/CSS, Python và tải tài liệu học tập.
                </p>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Trạng thái:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      formData.studentAllowedTabs.learning
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {formData.studentAllowedTabs.learning ? 'ĐANG HIỂN THỊ' : 'ĐÃ ẨN'}
                  </span>
                </div>
              </div>

              {/* Module 2: Kiểm tra & Đánh giá */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  formData.studentAllowedTabs.assessment
                    ? 'bg-emerald-50/50 border-emerald-300 shadow-sm ring-1 ring-emerald-400/30'
                    : 'bg-slate-50/60 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs">
                    <Award className="w-5 h-5" />
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.studentAllowedTabs.assessment}
                      onChange={() => handleToggleTab('assessment')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  2. Kiểm tra & Đánh giá
                </h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Làm đề kiểm tra trắc nghiệm & tự luận ngắn, nộp bài tính điểm tự động và xem lịch sử kết quả.
                </p>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Trạng thái:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      formData.studentAllowedTabs.assessment
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {formData.studentAllowedTabs.assessment ? 'ĐANG HIỂN THỊ' : 'ĐÃ ẨN'}
                  </span>
                </div>
              </div>

              {/* Module 3: Game Ôn tập */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  formData.studentAllowedTabs.games
                    ? 'bg-amber-50/50 border-amber-300 shadow-sm ring-1 ring-amber-400/30'
                    : 'bg-slate-50/60 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-amber-600 text-white shadow-xs">
                    <Gamepad2 className="w-5 h-5" />
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.studentAllowedTabs.games}
                      onChange={() => handleToggleTab('games')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  3. Game Ôn tập (Đấu trường)
                </h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Trò chơi kiến thức: Đấu trường tốc độ, Ai là triệu phú, Thẻ ghép nối thuật ngữ và Bảng xếp hạng.
                </p>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Trạng thái:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      formData.studentAllowedTabs.games
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {formData.studentAllowedTabs.games ? 'ĐANG HIỂN THỊ' : 'ĐÃ ẨN'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quyền tính năng phụ */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Quyền năng nâng cao cho Học sinh:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-indigo-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.allowStudentCodePlayground}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        allowStudentCodePlayground: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">Mở IDE Code Sandbox</p>
                    <p className="text-slate-500">Học sinh được chạy thử code HTML/CSS và Python</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-indigo-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.allowStudentLeaderboard}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        allowStudentLeaderboard: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">Xem Bảng xếp hạng Điểm số</p>
                    <p className="text-slate-500">Cho phép học sinh xem top điểm Game ôn tập</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: CHẾ ĐỘ PHÒNG THI KIOSK */}
        {activeSection === 'exam' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-rose-600" />
                <span>Chế độ Phòng thi Kiosk (Khóa thi tập trung)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Kích hoạt khi tổ chức kiểm tra 15 phút, 1 tiết hoặc thi học kỳ tại phòng máy tính.
              </p>
            </div>

            <div
              className={`p-6 rounded-2xl border transition-all ${
                formData.examLockdownMode
                  ? 'bg-rose-50/80 border-rose-300 shadow-md ring-1 ring-rose-400'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-rose-600 text-white">
                      <Lock className="w-5 h-5" />
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      Bật Chế độ Khóa Phòng thi (Exam Lockdown Mode)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                    Khi bật chế độ này: Toàn bộ học sinh truy cập vào hệ thống sẽ <strong>chỉ thấy duy nhất phân hệ Kiểm tra & Đánh giá</strong>. Mọi phân hệ lý thuyết và game ôn tập sẽ tự động tạm khóa để đảm bảo tính công bằng, nghiêm túc trong giờ kiểm tra.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={formData.examLockdownMode}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, examLockdownMode: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>

              {formData.examLockdownMode && (
                <div className="mt-4 p-3 bg-white/90 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-800 font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    Chế độ phòng thi đang kích hoạt: Học sinh chỉ được phép làm bài kiểm tra trong thời gian này.
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION 4: THÔNG TIN HỆ THỐNG & ĐƠN VỊ */}
        {activeSection === 'info' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <School className="w-5 h-5 text-indigo-600" />
                <span>Thông tin Đơn vị & Thông điệp Chạy chữ</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Tùy chỉnh tên trường và thông điệp hiển thị tại thanh chữ chạy (Marquee Ticker).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tên Đơn vị / Trường THPT</label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, schoolName: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="VD: Trường THPT Chuyên..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tiêu đề Hệ thống</label>
                <input
                  type="text"
                  value={formData.systemTitle}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, systemTitle: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tiêu đề hiển thị..."
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Thông điệp chạy chữ nổi bật (Hiển thị cùng "Học vui mỗi ngày!")
                </label>
                <input
                  type="text"
                  value={formData.announcementText}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, announcementText: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nội dung thông báo chạy chữ..."
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. Action Command Toolbar (3D Tactile Buttons) */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onResetDefaults}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300/80 border-b-[2.5px] border-b-slate-400 active:translate-y-[1px] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục Mặc định</span>
            </button>

            {saveSuccess && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Đã lưu cấu hình phân quyền thành công!</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleSave}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-b from-indigo-500 via-indigo-600 to-indigo-700 hover:from-indigo-400 hover:to-indigo-600 text-white font-bold text-xs rounded-xl border border-indigo-400 border-b-[3.5px] border-b-indigo-950 shadow-[0_2px_8px_rgba(79,70,229,0.4)] active:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>LƯU CẤU HÌNH HỆ THỐNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
