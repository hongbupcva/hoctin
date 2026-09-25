import React, { useState } from 'react';
import { ShieldCheck, KeyRound, X, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface TeacherPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPin: string;
}

export const TeacherPinModal: React.FC<TeacherPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  correctPin,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin.trim() === correctPin.trim()) {
      setError(false);
      setPin('');
      onSuccess();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 space-y-5 animate-scaleUp">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">Xác thực Giáo viên</h3>
              <p className="text-[11px] text-slate-500 font-mono">Bảo mật phân quyền Admin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Nhập mã PIN Giáo viên / Quản trị viên:
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                autoFocus
                value={pin}
                onChange={e => {
                  setPin(e.target.value);
                  setError(false);
                }}
                maxLength={8}
                placeholder="Nhập mã PIN..."
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-center text-lg font-mono tracking-widest font-bold focus:bg-white focus:outline-none focus:ring-2 ${
                  error
                    ? 'border-rose-400 text-rose-700 focus:ring-rose-400 bg-rose-50/50'
                    : 'border-slate-300 text-slate-900 focus:ring-indigo-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs font-semibold text-rose-700 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>Mã PIN không đúng! Vui lòng thử lại.</span>
            </div>
          )}

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
            <p className="flex items-center gap-1.5 font-medium text-slate-600">
              <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
              <span>Mã PIN mặc định: <strong className="text-indigo-700 font-mono">1234</strong></span>
            </p>
            <p className="text-[10px] text-slate-400">
              * Mã này do Giáo viên/Admin thiết lập trong mục "Hệ thống" để ngăn học sinh truy cập các tab quản trị.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-xs font-bold text-white bg-gradient-to-b from-indigo-500 to-indigo-700 hover:from-indigo-400 hover:to-indigo-600 rounded-xl border border-indigo-400 border-b-[3px] border-b-indigo-950 shadow-md active:translate-y-[1px] transition-all"
            >
              Xác nhận mở khóa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
