import { Question, GradeLevel, Assessment } from '../types';

export const SAMPLE_RAW_EXAMS: Record<GradeLevel, { title: string; topicCode: string; topicTitle: string; text: string }> = {
  '10': {
    title: 'Đề kiểm tra 15 phút: Đại cương Khoa học máy tính & Mạng Internet',
    topicCode: 'Chủ đề 1',
    topicTitle: 'Máy tính và xã hội tri thức',
    text: `Câu 1: Đơn vị đo dung lượng thông tin cơ bản nhỏ nhất trong máy tính là gì?
A. Bit (0 hoặc 1)
B. Byte (8 bit)
C. Megabyte
D. Gigabyte
Đáp án: A
Giải thích: Bit là đơn vị thông tin nhỏ nhất biểu diễn 2 trạng thái nhị phân 0 hoặc 1.

Câu 2: Thiết bị nào sau đây vừa là thiết bị vào vừa là thiết bị ra (I/O device)?
A. Chuột máy tính
B. Màn hình cảm ứng
C. Bàn phím cơ
D. Máy quét scanner
Đáp án: B
Giải thích: Màn hình cảm ứng vừa nhận thao tác chạm (đầu vào) vừa hiển thị hình ảnh (đầu ra).

Câu 3: Địa chỉ IP phiên bản 4 (IPv4) gồm bao nhiêu bit và được chia thành bao nhiêu nhóm số?
A. 16 bit, 2 nhóm số
B. 32 bit, 4 nhóm số cách nhau bởi dấu chấm
C. 64 bit, 4 nhóm số
D. 128 bit, 8 nhóm số
Đáp án: B
Giải thích: IPv4 gồm 32 bit nhị phân, chia thành 4 octet (mỗi octet 8 bit) viết dưới dạng số thập phân từ 0 đến 255.

Câu 4: Để phòng tránh mã độc tống tiền (Ransomware) và mất dữ liệu, biện pháp quan trọng hàng đầu là:
A. Tắt hoàn toàn màn hình máy tính khi không dùng
B. Định kỳ sao lưu dữ liệu quan trọng ra ổ cứng ngoài hoặc đám mây
C. Đặt độ phân giải màn hình thật cao
D. Tăng tốc độ chuột lên mức tối đa
Đáp án: B
Giải thích: Sao lưu dữ liệu dự phòng định kỳ giúp phục hồi nhanh chóng khi hệ thống gặp sự cố an ninh mạng.`
  },
  '11': {
    title: 'Đề kiểm tra Định kỳ: Hàm, Đệ quy và CSDL Quan hệ',
    topicCode: 'Chủ đề 5',
    topicTitle: 'Giải quyết vấn đề với sự trợ giúp của máy tính - Python',
    text: `Câu 1: Trong Python, từ khóa nào sau đây dùng để định nghĩa một hàm mới?
A. function
B. def
C. define
D. func
Đáp án: B
Giải thích: Cú pháp hàm trong Python là def tên_hàm(tham_số): ...

Câu 2: Một thuật toán đệ quy hợp lệ bắt buộc phải có thành phần nào để không bị lặp vô hạn?
A. Lệnh while True
B. Điều kiện dừng (Base case)
C. Biến toàn cục global
D. Lệnh break
Đáp án: B
Giải thích: Điều kiện dừng trả về kết quả cụ thể mà không tiếp tục gọi lại đệ quy.

Câu 3: Trong cơ sở dữ liệu quan hệ, một trường (Field) được chọn làm Khóa chính (Primary Key) phải thỏa mãn điều kiện gì?
A. Giá trị có thể trùng nhau ở nhiều bản ghi
B. Có thể để trống giá trị NULL
C. Giá trị duy nhất không trùng lặp và không được rỗng (NOT NULL)
D. Phải luôn là kiểu dữ liệu chuỗi ký tự dài
Đáp án: C
Giải thích: Khóa chính dùng để định danh duy nhất từng bản ghi (hàng) trong bảng dữ liệu.

Câu 4: Câu lệnh SQL nào dùng để truy vấn và trích xuất dữ liệu từ bảng?
A. UPDATE
B. INSERT
C. DELETE
D. SELECT
Đáp án: D
Giải thích: SELECT là mệnh đề cốt lõi trong SQL để truy vấn và lọc dữ liệu.`
  },
  '12': {
    title: 'Đề khảo sát: Trí tuệ nhân tạo & Công nghệ Web hiện đại',
    topicCode: 'Chủ đề F',
    topicTitle: 'Định hướng nghề nghiệp - Trí tuệ nhân tạo & Web',
    text: `Câu 1: Bài kiểm tra Turing (Turing Test) do Alan Turing đề xuất năm 1950 nhằm mục đích gì?
A. Đo tốc độ xử lý phần cứng của chip CPU
B. Đánh giá khả năng máy tính có thể thể hiện hành vi thông minh tương đương con người
C. Kiểm tra dung lượng bộ nhớ RAM của máy chủ
D. Đo băng thông đường truyền mạng cáp quang
Đáp án: B
Giải thích: Turing Test kiểm tra xem người đối thoại có thể phân biệt được câu trả lời từ máy tính hay con người hay không.

Câu 2: Trí tuệ nhân tạo hẹp (Narrow AI / Weak AI) là gì?
A. AI có ý thức và cảm xúc như con người
B. AI được thiết kế chuyên biệt để giải quyết một nhiệm vụ cụ thể như nhận dạng khuôn mặt, chơi cờ
C. AI có khả năng tự sáng tạo vũ trụ mới
D. AI không thể chạy trên máy tính
Đáp án: B
Giải thích: Narrow AI chuyên biệt hóa cho một miền bài toán xác định, là dạng AI phổ biến hiện nay.

Câu 3: Trong CSS Flexbox, để dàn đều các phần tử con với khoảng cách trống bằng nhau ở giữa các phần tử, giá trị justify-content nào được dùng?
A. flex-start
B. space-between
C. center
D. flex-end
Đáp án: B
Giải thích: space-between đẩy phần tử đầu về mép trái, phần tử cuối về mép phải và chia đều khoảng cách ở giữa.

Câu 4: Lớp giả (Pseudo-class) :hover trong CSS được kích hoạt khi nào?
A. Khi trang web vừa tải xong
B. Khi người dùng di chuyển con trỏ chuột lướt qua phần tử
C. Khi người dùng bấm giữ chuột trái
D. Khi liên kết đã được bấm truy cập trong quá khứ
Đáp án: B
Giải thích: :hover áp dụng khi con trỏ chuột nằm trên phần tử mà chưa nhấn nút chuột.`
  }
};

/**
 * Parses raw text format exam into Question objects
 */
export function parseRawExamText(
  rawText: string,
  options: {
    grade: GradeLevel;
    assessmentId: string;
    topicTitle?: string;
  }
): Question[] {
  if (!rawText || !rawText.trim()) return [];

  const questions: Question[] = [];
  // Split questions by "Câu X:" or "Câu X." or "Question X:" or "Bai X:"
  const rawBlocks = rawText.split(/(?=(?:Câu|CÂU|Question|Bài|\bQ)\s*\d+[\s:.\-])/i);

  let qIndex = 1;
  for (const block of rawBlocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Extract Question Text
    const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) continue;

    let questionText = '';
    const optionMap: Record<string, string> = { A: '', B: '', C: '', D: '' };
    let correctOption: 'A' | 'B' | 'C' | 'D' = 'A';
    let explanation = '';
    let difficulty: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao' = 'Thông hiểu';
    let knowledgeTag = 'Kiến thức cốt lõi Tin học';

    let currentSection: 'question' | 'option' | 'answer' | 'explanation' = 'question';

    for (const line of lines) {
      // Check for Correct Answer line
      const ansMatch = line.match(/(?:Đáp án|ĐA|ĐÁP ÁN|Answer|Key|Correct)[:\s]*([A-D])/i);
      if (ansMatch) {
        correctOption = ansMatch[1].toUpperCase() as 'A' | 'B' | 'C' | 'D';
        currentSection = 'answer';
        continue;
      }

      // Check for Explanation line
      const expMatch = line.match(/(?:Giải thích|Lời giải|Ghi chú|Hướng dẫn)[:\s]*(.*)/i);
      if (expMatch) {
        explanation = expMatch[1] || '';
        currentSection = 'explanation';
        continue;
      }

      // Check for Difficulty line
      const diffMatch = line.match(/(?:Mức độ|Độ khó)[:\s]*(Nhận biết|Thông hiểu|Vận dụng cao|Vận dụng)/i);
      if (diffMatch) {
        difficulty = diffMatch[1] as any;
        continue;
      }

      // Check for Options A, B, C, D
      const optMatch = line.match(/^([A-D])[\s\.\)\:\-]+(.*)/i);
      if (optMatch) {
        const optLetter = optMatch[1].toUpperCase() as 'A' | 'B' | 'C' | 'D';
        optionMap[optLetter] = optMatch[2].trim();
        currentSection = 'option';
        continue;
      }

      // Accumulate text based on current section
      if (currentSection === 'question') {
        const cleanQuestionPrefix = line.replace(/^(?:Câu|CÂU|Question|Bài|\bQ)\s*\d+[\s:.\-]+/i, '').trim();
        if (questionText) {
          questionText += ' ' + line;
        } else {
          questionText = cleanQuestionPrefix || line;
        }
      } else if (currentSection === 'explanation') {
        explanation += (explanation ? ' ' : '') + line;
      }
    }

    // Default missing options with sensible placeholders if empty
    if (!optionMap.A) optionMap.A = 'Phương án A';
    if (!optionMap.B) optionMap.B = 'Phương án B';
    if (!optionMap.C) optionMap.C = 'Phương án C';
    if (!optionMap.D) optionMap.D = 'Phương án D';

    if (!explanation) {
      explanation = `Đáp án đúng là phương án ${correctOption}. Hãy tham khảo kỹ bài học tương ứng trong Sách giáo khoa Kết nối tri thức.`;
    }

    if (questionText) {
      questions.push({
        id: `q-up-${Date.now()}-${qIndex}`,
        assessmentId: options.assessmentId,
        lessonId: `lesson-imported-${qIndex}`,
        lessonTitle: options.topicTitle || 'Kiến thức chung',
        topicTitle: options.topicTitle || 'Tin học THPT',
        grade: options.grade,
        text: questionText,
        options: [
          { id: 'A', text: optionMap.A },
          { id: 'B', text: optionMap.B },
          { id: 'C', text: optionMap.C },
          { id: 'D', text: optionMap.D }
        ],
        correctOptionId: correctOption,
        explanation: explanation,
        difficulty: difficulty,
        knowledgeTag: knowledgeTag
      });
      qIndex++;
    }
  }

  return questions;
}
