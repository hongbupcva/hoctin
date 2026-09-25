import React, { useState, useRef } from 'react';
import { GradeLevel, ClassRoom, Student, Submission } from '../types';
import { parseStudentExcelFile, downloadStudentTemplateExcel } from '../utils/excelParser';
import { 
  Users, 
  FileSpreadsheet, 
  Upload, 
  Plus, 
  Search, 
  Trash2, 
  Download, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';

interface ClassManagerProps {
  classes: ClassRoom[];
  students: Student[];
  submissions: Submission[];
  selectedGrade: GradeLevel;
  setSelectedGrade: (grade: GradeLevel) => void;
  selectedClassId: string;
  setSelectedClassId: (classId: string) => void;
  onAddStudent: (student: Student) => void;
  onImportStudents: (students: Student[]) => void;
  onDeleteStudent: (studentId: string) => void;
  onSelectStudentForAnalytics?: (studentId: string) => void;
}

export const ClassManager: React.FC<ClassManagerProps> = ({
  classes,
  students,
  submissions,
  selectedGrade,
  setSelectedGrade,
  selectedClassId,
  setSelectedClassId,
  onAddStudent,
  onImportStudents,
  onDeleteStudent,
  onSelectStudentForAnalytics
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    loading: boolean;
    preview: Student[];
    errors: string[];
    fileName: string;
  }>({
    loading: false,
    preview: [],
    errors: [],
    fileName: '',
  });

  // Form State for manual student addition
  const [manualForm, setManualForm] = useState({
    fullName: '',
    birthDate: '2008-01-01',
    gender: 'Nam' as 'Nam' | 'Nữ',
    email: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter classes by grade
  const gradeClasses = classes.filter(c => c.grade === selectedGrade);
  const currentClass = classes.find(c => c.id === selectedClassId) || gradeClasses[0];

  // If selectedClassId is not in current grade, fallback to first in grade
  React.useEffect(() => {
    if (gradeClasses.length > 0 && (!currentClass || currentClass.grade !== selectedGrade)) {
      setSelectedClassId(gradeClasses[0].id);
    }
  }, [selectedGrade, classes]);

  // Filter students by selected class and search
  const classStudents = students.filter(s => s.classId === currentClass?.id);
  const filteredStudents = classStudents.filter(s =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentClass) return;

    setImportStatus({ loading: true, preview: [], errors: [], fileName: file.name });
    const result = await parseStudentExcelFile(file, currentClass.id, currentClass.name);

    setImportStatus({
      loading: false,
      preview: result.importedStudents,
      errors: result.errors,
      fileName: file.name
    });
  };

  const handleConfirmImport = () => {
    if (importStatus.preview.length > 0) {
      onImportStudents(importStatus.preview);
      setShowImportModal(false);
      setImportStatus({ loading: false, preview: [], errors: [], fileName: '' });
    }
  };

  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.fullName.trim() || !currentClass) return;

    const newStudent: Student = {
      id: `hs-man-${Date.now()}`,
      stt: classStudents.length + 1,
      fullName: manualForm.fullName.trim(),
      birthDate: manualForm.birthDate,
      classId: currentClass.id,
      className: currentClass.name,
      gender: manualForm.gender,
      email: manualForm.email.trim() || `${manualForm.fullName.toLowerCase().replace(/\s+/g, '.')}@thptkntt.edu.vn`,
    };

    onAddStudent(newStudent);
    setShowAddModal(false);
    setManualForm({
      fullName: '',
      birthDate: '2008-01-01',
      gender: 'Nam',
      email: '',
    });
  };

  // Helper to get student's exam count and avg score
  const getStudentStats = (studentId: string) => {
    const studentSubs = submissions.filter(s => s.studentId === studentId);
    if (studentSubs.length === 0) return { examCount: 0, avgScore: null };
    const totalScore = studentSubs.reduce((acc, curr) => acc + curr.score, 0);
    return {
      examCount: studentSubs.length,
      avgScore: Math.round((totalScore / studentSubs.length) * 10) / 10
    };
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Grade Selector Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-600" />
              Quản lý Lớp học & Hồ sơ Học sinh
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Phân hệ quản lý danh sách học sinh theo khối lớp SGK Tin học Kết nối tri thức với cuộc sống
            </p>
          </div>

          {/* Grade selection tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl shrink-0 border border-slate-200/60">
            {(['10', '11', '12'] as GradeLevel[]).map(grade => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  selectedGrade === grade
                    ? 'bg-white text-indigo-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tin học {grade}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Class List Pills */}
        <div className="pt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-2 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-slate-400" />
            Danh sách lớp Khối {selectedGrade}:
          </span>
          {gradeClasses.map(c => {
            const isSelected = c.id === currentClass?.id;
            const count = students.filter(s => s.classId === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedClassId(c.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="font-bold">{c.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white font-mono' : 'bg-slate-200 text-slate-600 font-mono'
                }`}>
                  {count} HS
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Class Information Card & Action Bar */}
      {currentClass && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm border border-slate-800 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">Lab Tin học</span>
                <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-400/30">
                  {currentClass.academicYear}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-3">
                <h2 className="text-3xl font-extrabold tracking-tight text-white font-mono">
                  {currentClass.name}
                </h2>
                <span className="text-xs text-slate-400 font-sans">· Khối {currentClass.grade}</span>
              </div>

              <div className="space-y-2 mt-4 text-xs text-slate-300 divide-y divide-slate-800/80">
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-slate-400">Giáo viên:</span>
                  <span className="font-medium text-white">{currentClass.homeroomTeacher}</span>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-slate-400">Phòng thực hành:</span>
                  <span className="font-mono text-cyan-300">{currentClass.roomNumber}</span>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-slate-400">Sĩ số lớp:</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">{classStudents.length} học sinh</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 mt-4 relative z-10 space-y-2">
              <button
                onClick={() => downloadStudentTemplateExcel('xlsx')}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800/90 hover:bg-slate-800 text-xs font-semibold text-slate-200 rounded-xl transition-all border border-slate-700/80 hover:border-slate-600 hover:text-white"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tải mẫu Excel chuẩn (.xlsx)</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
            {/* Search and Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm học sinh theo tên, email trường cấp..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm học sinh</span>
                </button>

                <button
                  onClick={() => setShowImportModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl transition-colors shadow-xs"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Import Excel (.xlsx)</span>
                </button>
              </div>
            </div>

            {/* Student Table */}
            <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/90 text-slate-600 border-b border-slate-200 sticky top-0 z-10 backdrop-blur-xs font-mono text-[11px]">
                    <tr>
                      <th className="py-3 px-3 font-bold w-12 text-center">STT</th>
                      <th className="py-3 px-3 font-bold">Họ và tên</th>
                      <th className="py-3 px-3 font-bold">Ngày sinh</th>
                      <th className="py-3 px-3 font-bold">Giới tính</th>
                      <th className="py-3 px-3 font-bold">Tài khoản Email</th>
                      <th className="py-3 px-3 font-bold text-center">Lượt thi</th>
                      <th className="py-3 px-3 font-bold text-center">Điểm TB</th>
                      <th className="py-3 px-3 font-bold text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-10 text-center text-slate-400">
                          <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                          <p className="font-medium text-slate-600">Không tìm thấy học sinh nào</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Nhập danh sách học sinh từ file Excel hoặc bấm "Thêm học sinh"</p>
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student, idx) => {
                        const stats = getStudentStats(student.id);
                        return (
                          <tr key={student.id} className="hover:bg-blue-50/40 transition-colors group">
                            <td className="py-2.5 px-3 text-center text-slate-500 font-mono text-[11px]">
                              {(student.stt || idx + 1).toString().padStart(2, '0')}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${
                                  student.gender === 'Nữ' ? 'bg-pink-500' : 'bg-blue-600'
                                }`}>
                                  {student.fullName.charAt(0)}
                                </div>
                                <button
                                  onClick={() => onSelectStudentForAnalytics?.(student.id)}
                                  className="hover:text-blue-600 text-left font-semibold text-slate-900 transition-colors"
                                  title="Xem phân tích bài làm AI của học sinh này"
                                >
                                  {student.fullName}
                                </button>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                              {student.birthDate}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                                student.gender === 'Nữ' ? 'bg-pink-50 text-pink-700 border border-pink-200/60' : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                              }`}>
                                {student.gender}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px] truncate max-w-[160px]">
                              {student.email}
                            </td>
                            <td className="py-2.5 px-3 text-center text-slate-600 font-mono text-[11px]">
                              {stats.examCount > 0 ? (
                                <span className="font-semibold text-slate-800">{stats.examCount} bài</span>
                              ) : (
                                <span className="text-slate-400">0</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              {stats.avgScore !== null ? (
                                <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] inline-block ${
                                  stats.avgScore >= 8.0 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                    : stats.avgScore >= 6.5 
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                                    : stats.avgScore >= 5.0 
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                  {stats.avgScore.toFixed(1)}
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[10px] font-mono">-</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => onDeleteStudent(student.id)}
                                className="text-slate-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors opacity-60 group-hover:opacity-100"
                                title="Xóa học sinh"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: Import Danh Sách Excel */}
      {showImportModal && currentClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Import Danh sách Học sinh vào Lớp {currentClass.name}
                </h3>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 overflow-y-auto flex-1">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                <p className="font-semibold mb-1">Cấu trúc các cột chuẩn trong tệp Excel (.xlsx hoặc .csv):</p>
                <p>Cột 1: <strong>STT</strong> · Cột 2: <strong>Họ và tên</strong> · Cột 3: <strong>Ngày sinh</strong> (YYYY-MM-DD hoặc DD/MM/YYYY) · Cột 4: <strong>Lớp</strong> · Cột 5: <strong>Giới tính</strong> (Tùy chọn) · Cột 6: <strong>Email</strong> (Tùy chọn)</p>
              </div>

              {/* Upload Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer transition-all bg-slate-50 hover:bg-blue-50/30"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <p className="text-sm font-semibold text-slate-800">
                  Bấm vào đây để chọn tệp Excel từ máy tính (.xlsx, .csv)
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Hệ thống tự động nhận diện các cột STT, Họ tên, Ngày sinh, Lớp
                </p>
              </div>

              {/* Quick Template Downloads */}
              <div className="flex items-center justify-between text-xs text-slate-600 px-1">
                <span>Chưa có tệp dữ liệu?</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadStudentTemplateExcel('xlsx')}
                    className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải mẫu Excel chuẩn (.xlsx)
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => downloadStudentTemplateExcel('csv')}
                    className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Tải mẫu (.csv)
                  </button>
                </div>
              </div>

              {/* Import Results / Errors */}
              {importStatus.loading && (
                <div className="text-center py-4 text-xs text-blue-600 font-medium">
                  Đang phân tích dữ liệu tệp Excel...
                </div>
              )}

              {importStatus.errors.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    {importStatus.errors.map((err, i) => (
                      <p key={i}>{err}</p>
                    ))}
                  </div>
                </div>
              )}

              {importStatus.preview.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Đã đọc thành công {importStatus.preview.length} học sinh từ tệp "{importStatus.fileName}"
                    </span>
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-600 sticky top-0">
                        <tr>
                          <th className="py-2 px-3">STT</th>
                          <th className="py-2 px-3">Họ và tên</th>
                          <th className="py-2 px-3">Ngày sinh</th>
                          <th className="py-2 px-3">Lớp</th>
                          <th className="py-2 px-3">Email</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {importStatus.preview.map((s, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-1.5 px-3 font-mono">{s.stt}</td>
                            <td className="py-1.5 px-3 font-medium text-slate-800">{s.fullName}</td>
                            <td className="py-1.5 px-3 font-mono text-slate-600">{s.birthDate}</td>
                            <td className="py-1.5 px-3">{s.className}</td>
                            <td className="py-1.5 px-3 font-mono text-slate-500">{s.email}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={importStatus.preview.length === 0}
                onClick={handleConfirmImport}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors"
              >
                Xác nhận thêm {importStatus.preview.length} học sinh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: Thêm Học sinh thủ công */}
      {showAddModal && currentClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              Thêm Học sinh mới vào Lớp {currentClass.name}
            </h3>

            <form onSubmit={handleManualAddSubmit} className="space-y-4 py-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Họ và tên học sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={manualForm.fullName}
                  onChange={(e) => setManualForm({ ...manualForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    value={manualForm.birthDate}
                    onChange={(e) => setManualForm({ ...manualForm, birthDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giới tính</label>
                  <select
                    value={manualForm.gender}
                    onChange={(e) => setManualForm({ ...manualForm, gender: e.target.value as 'Nam' | 'Nữ' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email học sinh</label>
                <input
                  type="email"
                  placeholder="Để trống sẽ tự động tạo theo tên"
                  value={manualForm.email}
                  onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Thêm học sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
