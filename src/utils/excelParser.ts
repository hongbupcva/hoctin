import * as XLSX from 'xlsx';
import { Student } from '../types';

export interface ExcelImportResult {
  success: boolean;
  importedStudents: Student[];
  errors: string[];
  totalRows: number;
}

/**
 * Đọc file Excel (.xlsx, .xls) hoặc CSV và chuyển đổi thành danh sách học sinh chuẩn
 */
export async function parseStudentExcelFile(
  file: File,
  targetClassId: string,
  targetClassName: string
): Promise<ExcelImportResult> {
  const errors: string[] = [];
  const importedStudents: Student[] = [];

  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });
    
    // Đọc sheet đầu tiên
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return { success: false, importedStudents: [], errors: ['Tệp Excel rỗng hoặc không có bảng tính'], totalRows: 0 };
    }

    const worksheet = workbook.Sheets[firstSheetName];
    // Chuyển thành dạng mảng các dòng (header row + data rows)
    const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (rawData.length < 2) {
      return { success: false, importedStudents: [], errors: ['Tệp cần có ít nhất 1 dòng tiêu đề và 1 dòng dữ liệu'], totalRows: 0 };
    }

    // 1. Phân tích dòng tiêu đề (Header row)
    const headerRow = rawData[0].map((h: any) => (h ? String(h).trim().toLowerCase() : ''));
    
    // Tìm vị trí cột: STT, Họ và tên (hoặc Họ tên), Ngày sinh, Lớp, Giới tính, Email
    let sttCol = headerRow.findIndex(h => h.includes('stt') || h.includes('số thứ tự'));
    let nameCol = headerRow.findIndex(h => h.includes('họ') && h.includes('tên') || h === 'họ tên' || h === 'họ và tên' || h === 'fullname' || h === 'name');
    let dobCol = headerRow.findIndex(h => h.includes('ngày sinh') || h.includes('ngaysinh') || h.includes('dob') || h.includes('birth'));
    let classCol = headerRow.findIndex(h => h === 'lớp' || h.includes('lop') || h === 'class');
    let genderCol = headerRow.findIndex(h => h.includes('giới tính') || h.includes('gioitinh') || h === 'gender');
    let emailCol = headerRow.findIndex(h => h.includes('email') || h.includes('thư điện tử'));

    // Nếu không khớp tên chuẩn, mặc định theo thứ tự các cột 0: STT, 1: Họ tên, 2: Ngày sinh, 3: Lớp
    if (nameCol === -1 && rawData[0].length >= 2) {
      sttCol = 0;
      nameCol = 1;
      dobCol = rawData[0].length > 2 ? 2 : -1;
      classCol = rawData[0].length > 3 ? 3 : -1;
    }

    let parsedCount = 0;

    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i];
      if (!row || row.length === 0) continue;

      const rawName = nameCol >= 0 && row[nameCol] ? String(row[nameCol]).trim() : '';
      if (!rawName) continue; // Bỏ qua dòng trống

      parsedCount++;

      // Xử lý STT
      let stt = parsedCount;
      if (sttCol >= 0 && row[sttCol]) {
        const parsedStt = parseInt(String(row[sttCol]), 10);
        if (!isNaN(parsedStt)) stt = parsedStt;
      }

      // Xử lý ngày sinh
      let birthDate = '2008-01-01';
      if (dobCol >= 0 && row[dobCol]) {
        const rawDob = row[dobCol];
        if (rawDob instanceof Date) {
          birthDate = rawDob.toISOString().split('T')[0];
        } else if (typeof rawDob === 'string') {
          // Format DD/MM/YYYY or YYYY-MM-DD
          const parts = rawDob.trim().split(/[/.-]/);
          if (parts.length === 3) {
            if (parts[0].length === 4) {
              birthDate = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
            } else {
              birthDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
          }
        }
      }

      // Xử lý Lớp
      let studentClass = targetClassName;
      if (classCol >= 0 && row[classCol]) {
        studentClass = String(row[classCol]).trim();
      }

      // Xử lý Giới tính
      let gender: 'Nam' | 'Nữ' = 'Nam';
      if (genderCol >= 0 && row[genderCol]) {
        const gStr = String(row[genderCol]).toLowerCase();
        if (gStr.includes('nữ') || gStr === 'f' || gStr.includes('female')) {
          gender = 'Nữ';
        }
      } else {
        // Dự đoán theo tên lót thường gặp
        const lowerName = rawName.toLowerCase();
        if (lowerName.includes('thị') || lowerName.includes('ngọc') || lowerName.includes('mai') || lowerName.includes('linh')) {
          gender = 'Nữ';
        }
      }

      // Xử lý Email
      let email = `${removeVietnameseTones(rawName).toLowerCase().replace(/\s+/g, '.')}.${stt}@thptkntt.edu.vn`;
      if (emailCol >= 0 && row[emailCol]) {
        email = String(row[emailCol]).trim();
      }

      importedStudents.push({
        id: `hs-imp-${Date.now()}-${stt}-${Math.random().toString(36).substring(2, 6)}`,
        stt,
        fullName: rawName,
        birthDate,
        classId: targetClassId,
        className: studentClass,
        gender,
        email,
      });
    }

    if (importedStudents.length === 0) {
      errors.push('Không tìm thấy dữ liệu học sinh hợp lệ trong bảng tính.');
      return { success: false, importedStudents: [], errors, totalRows: rawData.length - 1 };
    }

    return {
      success: true,
      importedStudents,
      errors,
      totalRows: importedStudents.length
    };
  } catch (err: any) {
    errors.push(`Lỗi đọc tệp Excel: ${err?.message || 'Tệp bị lỗi định dạng'}`);
    return { success: false, importedStudents: [], errors, totalRows: 0 };
  }
}

/**
 * Tạo và tải xuống file Excel mẫu chuẩn cho giáo viên nhập danh sách học sinh
 */
export function downloadStudentTemplateExcel(format: 'xlsx' | 'csv' = 'xlsx') {
  const templateData = [
    {
      'STT': 1,
      'Họ và tên': 'Nguyễn Văn An',
      'Ngày sinh': '2008-04-12',
      'Lớp': '12A1',
      'Giới tính': 'Nam',
      'Email': 'an.nv@thptkntt.edu.vn'
    },
    {
      'STT': 2,
      'Họ và tên': 'Trần Thị Bích',
      'Ngày sinh': '2008-08-25',
      'Lớp': '12A1',
      'Giới tính': 'Nữ',
      'Email': 'bich.tt@thptkntt.edu.vn'
    },
    {
      'STT': 3,
      'Họ và tên': 'Lê Hoàng Cường',
      'Ngày sinh': '2008-01-18',
      'Lớp': '12A1',
      'Giới tính': 'Nam',
      'Email': 'cuong.lh@thptkntt.edu.vn'
    },
    {
      'STT': 4,
      'Họ và tên': 'Phạm Minh Duy',
      'Ngày sinh': '2008-11-03',
      'Lớp': '12A1',
      'Giới tính': 'Nam',
      'Email': 'duy.pm@thptkntt.edu.vn'
    },
    {
      'STT': 5,
      'Họ và tên': 'Đỗ Thảo Giang',
      'Ngày sinh': '2008-06-15',
      'Lớp': '12A1',
      'Giới tính': 'Nữ',
      'Email': 'giang.dt@thptkntt.edu.vn'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh_Sach_Hoc_Sinh');

  // Đặt độ rộng cột phù hợp
  worksheet['!cols'] = [
    { wch: 8 },  // STT
    { wch: 24 }, // Họ và tên
    { wch: 15 }, // Ngày sinh
    { wch: 10 }, // Lớp
    { wch: 12 }, // Giới tính
    { wch: 28 }, // Email
  ];

  const fileName = `Mau_Nhap_Hoc_Sinh_EduTin.${format}`;
  XLSX.writeFile(workbook, fileName, { bookType: format === 'csv' ? 'csv' : 'xlsx' });
}

/**
 * Xuất bảng điểm lớp học ra file Excel
 */
export function exportGradebookToExcel(
  submissions: any[],
  assessmentTitle: string,
  className: string
) {
  const exportRows = submissions.map((sub, idx) => ({
    'STT': idx + 1,
    'Họ và tên': sub.studentName,
    'Lớp': sub.className,
    'Bài kiểm tra': sub.assessmentTitle,
    'Điểm số': sub.score,
    'Số câu đúng': `${sub.correctCount}/${sub.totalQuestions}`,
    'Thời gian làm bài (giây)': sub.durationSeconds,
    'Thời gian nộp': sub.submittedAt,
    'Xếp loại': sub.score >= 8.0 ? 'Giỏi' : sub.score >= 6.5 ? 'Khá' : sub.score >= 5.0 ? 'Trung bình' : 'Chưa đạt'
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Bang_Diem');

  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 22 },
    { wch: 8 },
    { wch: 35 },
    { wch: 10 },
    { wch: 14 },
    { wch: 24 },
    { wch: 20 },
    { wch: 14 }
  ];

  const safeName = removeVietnameseTones(className).replace(/\s+/g, '_');
  XLSX.writeFile(workbook, `Bang_Diem_${safeName}_${Date.now()}.xlsx`);
}

function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}
