import { ClassRoom, Student, Topic, Assessment, Submission, DiscussionPost, ExamSession } from '../types';

export const INITIAL_CLASSES: ClassRoom[] = [
  {
    id: 'class-12a1',
    name: '12A1',
    grade: '12',
    academicYear: '2025-2026',
    homeroomTeacher: 'ThS. Nguyễn Văn Hùng',
    roomNumber: 'Phòng 301 - Lab Tin học',
    studentCount: 30,
  },
  {
    id: 'class-12a2',
    name: '12A2',
    grade: '12',
    academicYear: '2025-2026',
    homeroomTeacher: 'Cô Trần Mai Lan',
    roomNumber: 'Phòng 302 - Lab Tin học',
    studentCount: 28,
  },
  {
    id: 'class-12a3',
    name: '12A3',
    grade: '12',
    academicYear: '2025-2026',
    homeroomTeacher: 'Thầy Lê Quang Đạt',
    roomNumber: 'Phòng 303',
    studentCount: 32,
  },
  {
    id: 'class-11a1',
    name: '11A1',
    grade: '11',
    academicYear: '2025-2026',
    homeroomTeacher: 'Cô Phạm Hải Yến',
    roomNumber: 'Phòng 201',
    studentCount: 34,
  },
  {
    id: 'class-11a2',
    name: '11A2',
    grade: '11',
    academicYear: '2025-2026',
    homeroomTeacher: 'Thầy Hoàng Minh Đức',
    roomNumber: 'Phòng 202',
    studentCount: 31,
  },
  {
    id: 'class-10a1',
    name: '10A1',
    grade: '10',
    academicYear: '2025-2026',
    homeroomTeacher: 'Thầy Đỗ Trọng Nghĩa',
    roomNumber: 'Phòng 101',
    studentCount: 35,
  },
  {
    id: 'class-10a2',
    name: '10A2',
    grade: '10',
    academicYear: '2025-2026',
    homeroomTeacher: 'Cô Vũ Thị Thu Hương',
    roomNumber: 'Phòng 102',
    studentCount: 33,
  },
];

export const INITIAL_STUDENTS: Student[] = [
  // 12A1
  { id: 'hs-12a1-01', stt: 1, fullName: 'Nguyễn Văn An', birthDate: '2008-04-12', classId: 'class-12a1', className: '12A1', gender: 'Nam', email: 'an.nv@thptkntt.edu.vn' },
  { id: 'hs-12a1-02', stt: 2, fullName: 'Trần Thị Bích', birthDate: '2008-08-25', classId: 'class-12a1', className: '12A1', gender: 'Nữ', email: 'bich.tt@thptkntt.edu.vn' },
  { id: 'hs-12a1-03', stt: 3, fullName: 'Lê Hoàng Cường', birthDate: '2008-01-18', classId: 'class-12a1', className: '12A1', gender: 'Nam', email: 'cuong.lh@thptkntt.edu.vn' },
  { id: 'hs-12a1-04', stt: 4, fullName: 'Phạm Minh Duy', birthDate: '2008-11-03', classId: 'class-12a1', className: '12A1', gender: 'Nam', email: 'duy.pm@thptkntt.edu.vn' },
  { id: 'hs-12a1-05', stt: 5, fullName: 'Đỗ Thảo Giang', birthDate: '2008-06-15', classId: 'class-12a1', className: '12A1', gender: 'Nữ', email: 'giang.dt@thptkntt.edu.vn' },
  { id: 'hs-12a1-06', stt: 6, fullName: 'Hoàng Quốc Huy', birthDate: '2008-09-30', classId: 'class-12a1', className: '12A1', gender: 'Nam', email: 'huy.hq@thptkntt.edu.vn' },
  { id: 'hs-12a1-07', stt: 7, fullName: 'Vũ Ngọc Hân', birthDate: '2008-03-09', classId: 'class-12a1', className: '12A1', gender: 'Nữ', email: 'han.vn@thptkntt.edu.vn' },
  { id: 'hs-12a1-08', stt: 8, fullName: 'Bùi Gia Khiêm', birthDate: '2008-12-21', classId: 'class-12a1', className: '12A1', gender: 'Nam', email: 'khiem.bg@thptkntt.edu.vn' },
  { id: 'hs-12a1-09', stt: 9, fullName: 'Ngô Khánh Linh', birthDate: '2008-05-14', classId: 'class-12a1', className: '12A1', gender: 'Nữ', email: 'linh.nk@thptkntt.edu.vn' },
  { id: 'hs-12a1-10', stt: 10, fullName: 'Đặng Tuấn Minh', birthDate: '2008-07-08', classId: 'class-12a1', className: '12A1', gender: 'Nam', email: 'minh.dt@thptkntt.edu.vn' },
  { id: 'hs-12a1-11', stt: 11, fullName: 'Trịnh Bảo Nam', birthDate: '2008-02-27', classId: 'class-12a1', className: '12A1', gender: 'Nam', email: 'nam.tb@thptkntt.edu.vn' },
  { id: 'hs-12a1-12', stt: 12, fullName: 'Lý Kim Ngân', birthDate: '2008-10-10', classId: 'class-12a1', className: '12A1', gender: 'Nữ', email: 'ngan.lk@thptkntt.edu.vn' },
  { id: 'hs-12a1-13', stt: 13, fullName: 'Dương Tấn Phát', birthDate: '2008-04-05', classId: 'class-12a1', className: '12A1', gender: 'Nam', email: 'phat.dt@thptkntt.edu.vn' },
  { id: 'hs-12a1-14', stt: 14, fullName: 'Mai Phương Quỳnh', birthDate: '2008-08-19', classId: 'class-12a1', className: '12A1', gender: 'Nữ', email: 'quynh.mp@thptkntt.edu.vn' },
  { id: 'hs-12a1-15', stt: 15, fullName: 'Chu Đình Sơn', birthDate: '2008-06-22', classId: 'class-12a1', className: '12A1', gender: 'Nam', email: 'son.cd@thptkntt.edu.vn' },

  // 12A2
  { id: 'hs-12a2-01', stt: 1, fullName: 'Lê Thanh Bình', birthDate: '2008-03-11', classId: 'class-12a2', className: '12A2', gender: 'Nam', email: 'binh.lt@thptkntt.edu.vn' },
  { id: 'hs-12a2-02', stt: 2, fullName: 'Phan Ánh Dương', birthDate: '2008-07-29', classId: 'class-12a2', className: '12A2', gender: 'Nữ', email: 'duong.pa@thptkntt.edu.vn' },
  { id: 'hs-12a2-03', stt: 3, fullName: 'Hoàng Trọng Hải', birthDate: '2008-02-14', classId: 'class-12a2', className: '12A2', gender: 'Nam', email: 'hai.ht@thptkntt.edu.vn' },
  { id: 'hs-12a2-04', stt: 4, fullName: 'Nguyễn Kiều Oanh', birthDate: '2008-11-18', classId: 'class-12a2', className: '12A2', gender: 'Nữ', email: 'oanh.nk@thptkntt.edu.vn' },
  { id: 'hs-12a2-05', stt: 5, fullName: 'Vũ Thái Sơn', birthDate: '2008-09-05', classId: 'class-12a2', className: '12A2', gender: 'Nam', email: 'son.vt@thptkntt.edu.vn' },

  // 11A1
  { id: 'hs-11a1-01', stt: 1, fullName: 'Nguyễn Tùng Anh', birthDate: '2009-05-19', classId: 'class-11a1', className: '11A1', gender: 'Nam', email: 'anh.nt11@thptkntt.edu.vn' },
  { id: 'hs-11a1-02', stt: 2, fullName: 'Đào Thu Hà', birthDate: '2009-09-02', classId: 'class-11a1', className: '11A1', gender: 'Nữ', email: 'ha.dt11@thptkntt.edu.vn' },

  // 10A1
  { id: 'hs-10a1-01', stt: 1, fullName: 'Trần Văn Cảnh', birthDate: '2010-01-15', classId: 'class-10a1', className: '10A1', gender: 'Nam', email: 'canh.tv10@thptkntt.edu.vn' },
  { id: 'hs-10a1-02', stt: 2, fullName: 'Vũ Thùy Linh', birthDate: '2010-10-24', classId: 'class-10a1', className: '10A1', gender: 'Nữ', email: 'linh.vt10@thptkntt.edu.vn' },
];

export const INITIAL_TOPICS: Topic[] = [
  // Khối 12: Chủ đề F & E
  {
    id: 'topic-12-f',
    grade: '12',
    code: 'Chủ đề F',
    title: 'Định hướng nghề nghiệp - Trí tuệ nhân tạo',
    description: 'Tìm hiểu tổng quan về Trí tuệ nhân tạo (AI), các ứng dụng hiện đại, máy học và định hướng nghề nghiệp trong kỷ nguyên số.',
    lessons: [
      {
        id: 'lesson-12-f-01',
        topicId: 'topic-12-f',
        grade: '12',
        lessonNumber: 1,
        title: 'Làm quen với Trí tuệ nhân tạo',
        subtitle: 'Khái niệm, các đặc trưng cơ bản và bài kiểm tra Turing',
        durationMinutes: 45,
        summary: 'Trí tuệ nhân tạo (Artificial Intelligence - AI) là khả năng của máy tính thực hiện các công việc đòi hỏi trí thông minh của con người như học hỏi, suy luận, nhận thức và giải quyết vấn đề.',
        objectives: [
          'Phát biểu được định nghĩa và lịch sử hình thành của Trí tuệ nhân tạo (AI).',
          'Giải thích được mục đích và ý nghĩa của phép thử Turing (Turing Test).',
          'Phân biệt được AI hẹp (Narrow AI / Weak AI) và AI tổng quát (AGI / Strong AI).',
          'Nhận biết được một số ứng dụng tiêu biểu của AI trong đời sống thực tế.'
        ],
        keyPoints: [
          'Thuật ngữ "Trí tuệ nhân tạo" được John McCarthy đưa ra lần đầu năm 1956 tại hội thảo Dartmouth.',
          'Phép thử Turing (Alan Turing đề xuất năm 1950) nhằm đánh giá xem máy móc có hành vi thông minh tương đương con người hay không.',
          'AI hiện nay hầu hết là AI hẹp (Narrow AI) - chuyên sâu thực hiện một nhiệm vụ cụ thể như nhận dạng khuôn mặt, dịch máy, gợi ý nội dung.',
          'Các công nghệ cốt lõi bao gồm: Học máy (Machine Learning), Học sâu (Deep Learning), Xử lý ngôn ngữ tự nhiên (NLP) và Thị giác máy tính.'
        ],
        theoryMarkdown: `### 1. Khái niệm Trí tuệ nhân tạo (AI)
Trí tuệ nhân tạo (Artificial Intelligence - AI) là một ngành khoa học và kỹ thuật thuộc lĩnh vực Tin học nhằm tạo ra các hệ thống máy tính có khả năng thực hiện các hành vi trí tuệ giống như con người.

### 2. Phép thử Turing (Turing Test)
Năm 1950, nhà toán học Alan Turing công bố bài báo "Computing Machinery and Intelligence", đề xuất phép thử Turing:
- **Nguyên lý:** Một người thẩm vấn (Human Judge) trò chuyện qua văn bản với hai đối tượng ẩn danh: một người thật và một cỗ máy AI.
- **Kết luận:** Nếu người thẩm vấn không thể phân biệt được đâu là người, đâu là máy tính một cách đáng tin cậy, thì cỗ máy được coi là đã vượt qua phép thử Turing.

### 3. Phân loại Trí tuệ nhân tạo
- **AI hẹp (Weak / Narrow AI):** Hệ thống được huấn luyện để giải quyết xuất sắc một tác vụ đơn lẻ (Ví dụ: Siri, AlphaGo, nhận diện biển số xe).
- **AI tổng quát (General AI / AGI):** Hệ thống có năng lực trí tuệ toàn diện tương đương hoặc vượt trội con người trong mọi lĩnh vực nhận thức (hiện vẫn đang trong quá trình nghiên cứu).`,
        codeSnippet: {
          lang: 'python',
          code: `# Mô phỏng phân loại hoa Iris bằng Học máy (Machine Learning đơn giản)
from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier

# 1. Nạp tập dữ liệu hoa Iris
iris = load_iris()
X, y = iris.data, iris.target

# 2. Khởi tạo mô hình cây quyết định
clf = DecisionTreeClassifier()
clf.fit(X, y)

# 3. Dự đoán mẫu hoa mới [Độ dài đài hoa, Chiều rộng đài, Độ dài cánh, Chiều rộng cánh]
sample = [[5.1, 3.5, 1.4, 0.2]]
prediction = clf.predict(sample)
print("Loại hoa dự đoán:", iris.target_names[prediction[0]])`,
          explanation: 'Mô hình cây quyết định học quy luật từ các đặc trưng hoa để phân loại mẫu mới tự động.',
          previewType: 'console_output'
        },
        materials: [
          {
            id: 'mat-01',
            title: 'Slide_Bai01_Lam_quen_voi_AI_KNTT12.pdf',
            type: 'pdf',
            size: '2.4 MB',
            uploadedBy: 'ThS. Nguyễn Văn Hùng',
            uploadedAt: '2026-09-10',
            description: 'Slide bài giảng chuẩn theo sách giáo khoa Tin học 12 Kết nối tri thức.'
          },
          {
            id: 'mat-02',
            title: 'Tóm_tắt_lý_thuyết_Phep_thu_Turing_AI_hep.docx',
            type: 'doc',
            size: '512 KB',
            uploadedBy: 'ThS. Nguyễn Văn Hùng',
            uploadedAt: '2026-09-12',
            description: 'Tài liệu ôn tập nhanh và sơ đồ tư duy phân loại hệ thống AI.'
          }
        ],
        videoEmbedUrl: 'https://www.youtube.com/embed/aircAruvnKk'
      },
      {
        id: 'lesson-12-f-02',
        topicId: 'topic-12-f',
        grade: '12',
        lessonNumber: 2,
        title: 'Trí tuệ nhân tạo trong cuộc sống & Nghề nghiệp tương lai',
        subtitle: 'Ứng dụng trong y tế, giao thông, giáo dục và trách nhiệm đạo đức AI',
        durationMinutes: 45,
        summary: 'Khám phá các khía cạnh ứng dụng sâu rộng của AI, đạo đức trí tuệ nhân tạo (quyền riêng tư, thiên vị dữ liệu) và các vị trí việc làm mới trong kỷ nguyên số.',
        objectives: [
          'Nêu được các tác động tích cực và thách thức của AI đối với xã hội.',
          'Hiểu vấn đề đạo đức AI: Quyền sở hữu trí tuệ, an toàn thông tin và thiên vị thuật toán.',
          'Xác định được các ngành nghề phát triển: Kỹ sư dữ liệu, Chuyên gia huấn luyện AI, Kỹ sư kiểm thử thuật toán.'
        ],
        keyPoints: [
          'AI hỗ trợ chẩn đoán hình ảnh y tế, xe tự hành, trợ lý ảo cá nhân.',
          'Vấn đề thiên vị (Bias): Dữ liệu huấn luyện thiếu khách quan dẫn đến mô hình đưa ra kết quả phân biệt đối xử.',
          'Đạo đức AI là yếu tố sống còn khi triển khai các hệ thống quyết định tự động.'
        ],
        theoryMarkdown: `### 1. Ứng dụng AI trong các ngành kinh tế - xã hội
- **Y tế & Chăm sóc sức khỏe:** Phân tích ảnh chụp X-quang, MRI, phát hiện sớm tế bào ung thư; nghiên cứu bào chế thuốc mới.
- **Giao thông thông minh:** Điều phối đèn tín hiệu giao thông thời gian thực; hệ thống xe tự lái (Tesla Autopilot, Waymo).
- **Giáo dục thông minh (EdTech):** Cá nhân hóa lộ trình học tập, tự động chấm bài, phát hiện lỗ hổng kiến thức học sinh.

### 2. Trách nhiệm đạo đức và Pháp luật số khi dùng AI
- **Tính minh bạch (Explainable AI):** Con người cần hiểu lý do vì sao thuật toán đưa ra quyết định đó.
- **Bảo mật dữ liệu cá nhân:** Không tùy tiện thu thập hoặc chia sẻ dữ liệu nhạy cảm để huấn luyện mô hình.`,
        materials: [
          {
            id: 'mat-03',
            title: 'Bao_cao_Dao_duc_va_Nghe_nghiep_AI_2026.pdf',
            type: 'pdf',
            size: '1.8 MB',
            uploadedBy: 'ThS. Nguyễn Văn Hùng',
            uploadedAt: '2026-09-14'
          }
        ]
      }
    ]
  },
  {
    id: 'topic-12-e',
    grade: '12',
    code: 'Chủ đề E',
    title: 'Ứng dụng tin học - Thiết kế trang web',
    description: 'Thực hành xây dựng trang web hiện đại với ngôn ngữ HTML5, định kiểu nâng cao bằng CSS3, mô hình Flexbox và nguyên lý Responsive.',
    lessons: [
      {
        id: 'lesson-12-e-12',
        topicId: 'topic-12-e',
        grade: '12',
        lessonNumber: 12,
        title: 'Thiết kế trang web với CSS Flexbox & Bộ chọn',
        subtitle: 'Các loại bộ chọn (Selectors), lớp giả (Pseudo-classes) và dàn trang Flexbox',
        durationMinutes: 45,
        summary: 'CSS Flexbox (Flexible Box Layout) là một mô hình bố cục một chiều mạnh mẽ trong CSS, giúp phân bổ không gian và căn chỉnh các phần tử giao diện một cách linh hoạt, đáp ứng đa kích thước màn hình.',
        objectives: [
          'Hiểu và vận dụng thành thạo các bộ chọn CSS: Bộ chọn phần tử, class, id, bộ chọn thuộc tính.',
          'Nắm vững cú pháp và công dụng của các lớp giả (Pseudo-classes) như :hover, :active, :nth-child(), :focus.',
          'Thiết lập Flex Container với display: flex và các thuộc tính justify-content, align-items, flex-direction.',
          'Tạo thanh điều hướng (Navbar) và thẻ sản phẩm (Card) chuẩn phong cách hiện đại.'
        ],
        keyPoints: [
          'Mô hình Flexbox gồm 2 trục chính: Trục chính (Main Axis) và Trục chéo (Cross Axis).',
          'justify-content dùng để căn chỉnh các item dọc theo TRỤC CHÍNH (Main Axis: center, space-between, flex-start, flex-end).',
          'align-items dùng để căn chỉnh các item dọc theo TRỤC CHÉO (Cross Axis: center, flex-start, stretch, baseline).',
          'Lớp giả :nth-child(2n) hoặc :nth-child(odd) cho phép định kiểu xen kẽ các hàng trong bảng hoặc danh sách.',
          'Bộ chọn con trực tiếp (>) khác với bộ chọn con cháu (khoảng trắng).'
        ],
        theoryMarkdown: `### 1. Bộ chọn CSS (CSS Selectors) & Lớp giả (Pseudo-classes)
- **Bộ chọn cơ bản:**
  - Phần tử: \`p\`, \`h1\`, \`div\`
  - Lớp (Class): \`.button-primary\`
  - Định danh (ID): \`#header-main\`
- **Bộ chọn kết hợp:**
  - Con trực tiếp: \`ul > li\` (chỉ chọn thẻ li là con trực tiếp của ul)
  - Hậu duệ: \`div p\` (chọn mọi thẻ p nằm bên trong div)
- **Lớp giả (Pseudo-classes):**
  - \`:hover\` kích hoạt khi rê chuột lên phần tử.
  - \`:focus\` khi phần tử nhận tiêu điểm (ví dụ ô input).
  - \`:nth-child(n)\` chọn phần tử con thứ n của cha.

### 2. Mô hình bố cục Flexbox
Khi gán thuộc tính \`display: flex\` cho một phần tử cha, nó sẽ trở thành **Flex Container**, và tất cả các thẻ con trực tiếp của nó trở thành **Flex Items**.

| Thuộc tính trên Container | Ý nghĩa & Các giá trị chính |
| :--- | :--- |
| \`flex-direction\` | Hướng của trục chính: \`row\` (mặc định), \`column\`, \`row-reverse\` |
| \`justify-content\` | Căn chỉnh trên trục chính: \`flex-start\`, \`center\`, \`space-between\`, \`space-around\` |
| \`align-items\` | Căn chỉnh trên trục chéo: \`stretch\`, \`center\`, \`flex-start\`, \`flex-end\` |
| \`flex-wrap\` | Cho phép bẻ hàng: \`nowrap\`, \`wrap\` |`,
        codeSnippet: {
          lang: 'html',
          code: `<!-- Ví dụ Flexbox Navigation Bar -->
<div style="display: flex; justify-content: space-between; align-items: center; background: #0f172a; padding: 12px 20px; border-radius: 8px; color: white;">
  <span style="font-weight: bold; font-size: 16px; color: #38bdf8;">EduTin 12</span>
  <div style="display: flex; gap: 16px;">
    <a href="#" style="color: #cbd5e1; text-decoration: none;">Bài học</a>
    <a href="#" style="color: #cbd5e1; text-decoration: none;">Kiểm tra</a>
    <a href="#" style="color: #38bdf8; text-decoration: none; font-weight: 600;">Hỏi đáp</a>
  </div>
</div>`,
          explanation: 'Thanh menu sử dụng display: flex với justify-content: space-between và align-items: center.',
          previewType: 'html_preview'
        },
        materials: [
          {
            id: 'mat-04',
            title: 'Bai_giang_CSS_Flexbox_Bo_chon_KNTT12.pdf',
            type: 'pdf',
            size: '3.1 MB',
            uploadedBy: 'ThS. Nguyễn Văn Hùng',
            uploadedAt: '2026-09-18',
            description: 'Tài liệu hướng dẫn trực quan sơ đồ 2 trục Main-axis và Cross-axis trong Flexbox.'
          },
          {
            id: 'mat-05',
            title: 'Template_Web_Flexbox_Demo_Code.zip',
            type: 'code',
            size: '840 KB',
            uploadedBy: 'ThS. Nguyễn Văn Hùng',
            uploadedAt: '2026-09-20',
            description: 'Mã nguồn mẫu thực hành thiết kế giao diện thẻ bài viết (Card Grid) và Navbar.'
          }
        ]
      }
    ]
  },

  // Khối 11: Chủ đề 5 - Lập trình Python
  {
    id: 'topic-11-cs',
    grade: '11',
    code: 'Chủ đề 5',
    title: 'Giải quyết vấn đề với sự trợ giúp của máy tính - Lập trình Python',
    description: 'Xây dựng thuật toán, hàm người dùng định nghĩa, danh sách nâng cao và tư duy đệ quy trong ngôn ngữ Python.',
    lessons: [
      {
        id: 'lesson-11-16',
        topicId: 'topic-11-cs',
        grade: '11',
        lessonNumber: 16,
        title: 'Hàm và Đệ quy trong Python',
        subtitle: 'Xây dựng hàm modul hóa chương trình và giải thuật chia để trị',
        durationMinutes: 45,
        summary: 'Hàm giúp chia nhỏ bài toán phức tạp thành các đơn vị con dễ quản lý, tái sử dụng và kiểm thử.',
        objectives: [
          'Định nghĩa và gọi hàm trong Python với từ khóa def.',
          'Phân biệt tham số hình thức và đối số thực tế.',
          'Nhận biết cấu trúc giải thuật đệ quy: Điều kiện dừng (Base case) và Bước đệ quy (Recursive step).'
        ],
        keyPoints: [
          'Cú pháp định nghĩa hàm: def ten_ham(tham_so): return gia_tri',
          'Một hàm đệ quy bắt buộc phải có điều kiện dừng, nếu không sẽ gây lỗi RecursionError: maximum recursion depth exceeded.'
        ],
        theoryMarkdown: `### 1. Khái niệm và cú pháp Hàm
Hàm (Function) là một khối lệnh được đặt tên, thực hiện một nhiệm vụ chuyên biệt và có thể được gọi thực thi nhiều lần.

### 2. Thuật toán Đệ quy
Một hàm được gọi là đệ quy (Recursive) nếu trong thân hàm có lời gọi lại chính nó với kích thước dữ liệu bài toán nhỏ hơn.`,
        codeSnippet: {
          lang: 'python',
          code: `# Tính giai thừa bằng hàm đệ quy
def giai_thua(n):
    # 1. Điều kiện dừng (Base case)
    if n == 0 or n == 1:
        return 1
    # 2. Bước đệ quy (Recursive step)
    return n * giai_thua(n - 1)

print("5! =", giai_thua(5)) # Kết quả: 120`,
          explanation: 'Hàm giai_thua gọi lại chính nó cho đến khi n giảm về 1.',
          previewType: 'console_output'
        },
        materials: [
          {
            id: 'mat-06',
            title: 'De_quy_Python_KNTT11.pdf',
            type: 'pdf',
            size: '1.9 MB',
            uploadedBy: 'Cô Phạm Hải Yến',
            uploadedAt: '2026-09-15'
          }
        ]
      }
    ]
  },

  // Khối 10: Chủ đề 5 - Nhập môn Lập trình Python
  {
    id: 'topic-10-prog',
    grade: '10',
    code: 'Chủ đề 5',
    title: 'Giải quyết vấn đề với sự trợ giúp của máy tính - Làm quen với Python',
    description: 'Các kiểu dữ liệu cơ sở, biến, biểu thức logic, câu lệnh rẽ nhánh if-else và vòng lặp for/while.',
    lessons: [
      {
        id: 'lesson-10-18',
        topicId: 'topic-10-prog',
        grade: '10',
        lessonNumber: 18,
        title: 'Các lệnh vào ra và Kiểu dữ liệu trong Python',
        subtitle: 'Lệnh print(), input(), các hàm ép kiểu int(), float(), str()',
        durationMinutes: 45,
        summary: 'Làm quen với môi trường lập trình Python, cú pháp nhập dữ liệu từ bàn phím và xuất thông tin ra màn hình.',
        objectives: [
          'Sử dụng lệnh input() để nhập xâu ký tự từ bàn phím.',
          'Dùng các hàm int(), float() để chuyển đổi kiểu dữ liệu xâu sang số.',
          'Sử dụng lệnh print() với các tham số sep và end.'
        ],
        keyPoints: [
          'Hàm input() luôn trả về kiểu dữ liệu xâu ký tự (str).',
          'Muốn thực hiện phép toán số học, cần ép kiểu dữ liệu bằng int() hoặc float().'
        ],
        theoryMarkdown: `### 1. Kiểu dữ liệu cơ sở trong Python
- Số nguyên: \`int\` (ví dụ: \`5\`, \`-12\`)
- Số thực: \`float\` (ví dụ: \`3.14\`, \`-0.5\`)
- Xâu ký tự: \`str\` (ví dụ: \`"Tin học 10"\`)
- Giá trị logic: \`bool\` (\`True\` hoặc \`False\`)`,
        materials: [
          {
            id: 'mat-07',
            title: 'Giao_trinh_Python_Co_ban_Tin10_KNTT.pdf',
            type: 'pdf',
            size: '2.8 MB',
            uploadedBy: 'Thầy Đỗ Trọng Nghĩa',
            uploadedAt: '2026-09-08'
          }
        ]
      }
    ]
  }
];

export const INITIAL_EXAM_SESSIONS: ExamSession[] = [
  {
    id: 'session-mid-1',
    title: 'Kiểm tra Giữa Học kỳ I - Năm học 2026 - 2027',
    grade: 'ALL',
    semester: 'Học kỳ 1',
    startDate: '2026-10-15',
    endDate: '2026-10-30',
    status: 'active',
    description: 'Đợt kiểm tra đánh giá định kỳ giữa học kỳ I cho toàn bộ học sinh khối 10, 11 và 12 môn Tin học.'
  },
  {
    id: 'session-regular-12',
    title: 'Kiểm tra thường xuyên Đợt 1 - Tin học 12',
    grade: '12',
    semester: 'Học kỳ 1',
    startDate: '2026-09-15',
    endDate: '2026-09-28',
    status: 'completed',
    description: 'Kiểm tra 15 phút về Chủ đề Trí tuệ nhân tạo (AI) và Thiết kế Web CSS Flexbox.'
  },
  {
    id: 'session-python-11',
    title: 'Khảo sát Năng lực Lập trình Python & CSDL - Khối 11',
    grade: '11',
    semester: 'Học kỳ 1',
    startDate: '2026-09-20',
    endDate: '2026-10-05',
    status: 'active',
    description: 'Đánh giá kỹ năng lập trình hàm, tư duy đệ quy và cấu trúc dữ liệu mảng/danh sách Python.'
  },
  {
    id: 'session-intro-10',
    title: 'Đánh giá Nhập môn Tin học & Tư duy Máy tính - Khối 10',
    grade: '10',
    semester: 'Học kỳ 1',
    startDate: '2026-09-18',
    endDate: '2026-10-10',
    status: 'active',
    description: 'Khảo sát nền tảng đại cương khoa học máy tính, mạng Internet và an toàn số.'
  },
  {
    id: 'session-final-1',
    title: 'Kiểm tra Cuối Học kỳ I - Đánh giá Năng lực Toàn diện',
    grade: 'ALL',
    semester: 'Học kỳ 1',
    startDate: '2026-12-15',
    endDate: '2026-12-30',
    status: 'upcoming',
    description: 'Kỳ thi chính thức kết thúc học kỳ 1 theo ma trận đề chuẩn Bộ GD&ĐT.'
  }
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  // ĐỀ 1: Làm quen với Trí tuệ nhân tạo (Tin 12 - KNTT)
  {
    id: 'test-ai-12-01',
    title: 'Kiểm tra 15 phút: Làm quen với Trí tuệ nhân tạo (Tin học 12 - KNTT)',
    description: 'Đề kiểm tra đánh giá kiến thức cơ bản về khái niệm AI, bài kiểm tra Turing, phân loại AI hẹp và AI tổng quát theo chương trình Sách giáo khoa Kết nối tri thức.',
    grade: '12',
    sessionId: 'session-regular-12',
    sessionTitle: 'Kiểm tra thường xuyên Đợt 1 - Tin học 12',
    topicCode: 'Chủ đề F',
    topicTitle: 'Định hướng nghề nghiệp - Trí tuệ nhân tạo',
    durationMinutes: 15,
    totalPoints: 10,
    passScore: 5.0,
    questionCount: 5,
    createdAt: '2026-09-18',
    isPublished: true,
    questions: [
      {
        id: 'q-ai-01',
        assessmentId: 'test-ai-12-01',
        lessonId: 'lesson-12-f-01',
        lessonTitle: 'Bài 1: Làm quen với Trí tuệ nhân tạo',
        topicTitle: 'Chủ đề F: Định hướng nghề nghiệp',
        grade: '12',
        text: 'Thuật ngữ "Trí tuệ nhân tạo" (Artificial Intelligence - AI) chính thức được đưa ra lần đầu tiên tại hội thảo khoa học nào và vào năm nào?',
        options: [
          { id: 'A', text: 'Hội thảo Dartmouth vào năm 1956' },
          { id: 'B', text: 'Hội thảo Cambridge vào năm 1950' },
          { id: 'C', text: 'Hội nghị Oxford vào năm 1968' },
          { id: 'D', text: 'Hội thảo Stanford vào năm 1975' }
        ],
        correctOptionId: 'A',
        explanation: 'Thuật ngữ "Trí tuệ nhân tạo" được John McCarthy cùng các cộng sự chính thức đặt ra tại hội thảo trường Đại học Dartmouth (Mỹ) vào mùa hè năm 1956.',
        difficulty: 'Nhận biết',
        knowledgeTag: 'Lịch sử hình thành AI'
      },
      {
        id: 'q-ai-02',
        assessmentId: 'test-ai-12-01',
        lessonId: 'lesson-12-f-01',
        lessonTitle: 'Bài 1: Làm quen với Trí tuệ nhân tạo',
        topicTitle: 'Chủ đề F: Định hướng nghề nghiệp',
        grade: '12',
        text: 'Mục đích cốt lõi của "Phép thử Turing" (Turing Test) do nhà toán học Alan Turing đề xuất năm 1950 là gì?',
        options: [
          { id: 'A', text: 'Đo lường tốc độ xử lý phần cứng của siêu máy tính' },
          { id: 'B', text: 'Kiểm tra xem máy tính có khả năng thể hiện hành vi thông minh tương đương con người hay không' },
          { id: 'C', text: 'Kiểm tra khả năng kết nối mạng không dây giữa các máy tính' },
          { id: 'D', text: 'Đánh giá độ an toàn bảo mật và mã hóa của thuật toán' }
        ],
        correctOptionId: 'B',
        explanation: 'Phép thử Turing nhằm xác định một hệ thống máy tính có hành vi trí tuệ tương đương hay không thể phân biệt được với con người thông qua đối thoại gián tiếp.',
        difficulty: 'Thông hiểu',
        knowledgeTag: 'Phép thử Turing'
      },
      {
        id: 'q-ai-03',
        assessmentId: 'test-ai-12-01',
        lessonId: 'lesson-12-f-01',
        lessonTitle: 'Bài 1: Làm quen với Trí tuệ nhân tạo',
        topicTitle: 'Chủ đề F: Định hướng nghề nghiệp',
        grade: '12',
        text: 'Hệ thống trợ lý giọng nói như Apple Siri, Google Assistant hay phần mềm chơi cờ AlphaGo thuộc loại AI nào sau đây?',
        options: [
          { id: 'A', text: 'AI tổng quát (General AI / AGI)' },
          { id: 'B', text: 'Siêu trí tuệ nhân tạo (Super AI)' },
          { id: 'C', text: 'AI hẹp (Narrow AI / Weak AI)' },
          { id: 'D', text: 'AI tự ý thức (Self-aware AI)' }
        ],
        correctOptionId: 'C',
        explanation: 'Hiện nay tất cả các ứng dụng thực tế như Siri, ChatGPT hay AlphaGo đều là AI hẹp (Narrow AI) vì chúng được huấn luyện giải quyết các tập nhiệm vụ cụ thể, chưa có trí tuệ toàn diện như con người.',
        difficulty: 'Thông hiểu',
        knowledgeTag: 'Phân loại AI hẹp vs AGI'
      },
      {
        id: 'q-ai-04',
        assessmentId: 'test-ai-12-01',
        lessonId: 'lesson-12-f-01',
        lessonTitle: 'Bài 1: Làm quen với Trí tuệ nhân tạo',
        topicTitle: 'Chủ đề F: Định hướng nghề nghiệp',
        grade: '12',
        text: 'Trong Học máy (Machine Learning), phương pháp học mà dữ liệu đầu vào đã có sẵn các nhãn kết quả chính xác tương ứng để mô hình đối chiếu và điều chỉnh được gọi là:',
        options: [
          { id: 'A', text: 'Học có giám sát (Supervised Learning)' },
          { id: 'B', text: 'Học không giám sát (Unsupervised Learning)' },
          { id: 'C', text: 'Học tăng cường (Reinforcement Learning)' },
          { id: 'D', text: 'Học bán giám sát hoàn toàn tự do' }
        ],
        correctOptionId: 'A',
        explanation: 'Học có giám sát (Supervised Learning) sử dụng tập dữ liệu huấn luyện đã được gán nhãn (labeled data) gồm cặp (đầu vào, nhãn mục tiêu) để thuật toán học ánh xạ.',
        difficulty: 'Vận dụng',
        knowledgeTag: 'Phương pháp Học có giám sát'
      },
      {
        id: 'q-ai-05',
        assessmentId: 'test-ai-12-01',
        lessonId: 'lesson-12-f-02',
        lessonTitle: 'Bài 2: Trí tuệ nhân tạo trong cuộc sống & Nghề nghiệp tương lai',
        topicTitle: 'Chủ đề F: Định hướng nghề nghiệp',
        grade: '12',
        text: 'Hiện tượng hệ thống AI đưa ra các quyết định thiên lệch hoặc mang tính phân biệt đối xử (Bias) thường xuất phát chủ yếu từ nguyên nhân nào?',
        options: [
          { id: 'A', text: 'Do tốc độ vi xử lý CPU của máy chủ quá nhanh' },
          { id: 'B', text: 'Do tập dữ liệu huấn luyện (Training Data) bị lệch, thiếu đa dạng hoặc mang sẵn định kiến lịch sử' },
          { id: 'C', text: 'Do ngôn ngữ lập trình Python không hỗ trợ toán học phức tạp' },
          { id: 'D', text: 'Do màn hình hiển thị của người dùng không đủ độ phân giải' }
        ],
        correctOptionId: 'B',
        explanation: 'Mô hình AI phản ánh chính xác những gì nó được học từ dữ liệu. Nếu dữ liệu huấn luyện bị thiên vị (Data Bias), thuật toán sẽ nhân rộng sự thiên lệch đó trong các quyết định thực tế.',
        difficulty: 'Vận dụng',
        knowledgeTag: 'Đạo đức và Thiên vị dữ liệu trong AI'
      }
    ]
  },

  // ĐỀ 2: CSS Flexbox và Bộ chọn nâng cao (Tin 12 - KNTT)
  {
    id: 'test-css-12-02',
    title: 'Kiểm tra thực hành: CSS Flexbox và Bộ chọn (Tin học 12 - KNTT)',
    description: 'Đánh giá kỹ năng chọn phần tử với CSS Selectors, Pseudo-classes và thiết lập dàn trang bố cục responsive bằng thuộc tính Flexbox.',
    grade: '12',
    sessionId: 'session-mid-1',
    sessionTitle: 'Kiểm tra Giữa Học kỳ I - Năm học 2026 - 2027',
    topicCode: 'Chủ đề E',
    topicTitle: 'Ứng dụng tin học - Thiết kế trang web',
    durationMinutes: 15,
    totalPoints: 10,
    passScore: 5.0,
    questionCount: 5,
    createdAt: '2026-09-20',
    isPublished: true,
    questions: [
      {
        id: 'q-css-01',
        assessmentId: 'test-css-12-02',
        lessonId: 'lesson-12-e-12',
        lessonTitle: 'Bài 12: Thiết kế trang web với CSS Flexbox & Bộ chọn',
        topicTitle: 'Chủ đề E: Thiết kế trang web',
        grade: '12',
        text: 'Trong CSS, bộ chọn con trực tiếp (Child combinator) được biểu diễn bằng ký hiệu nào giữa phần tử cha và phần tử con?',
        options: [
          { id: 'A', text: 'Dấu cách (Khoảng trắng)' },
          { id: 'B', text: 'Dấu lớn hơn (>)' },
          { id: 'C', text: 'Dấu cộng (+)' },
          { id: 'D', text: 'Dấu ngã (~)' }
        ],
        correctOptionId: 'B',
        explanation: 'Cú pháp "parent > child" chỉ áp dụng định kiểu cho các thẻ child là con trực tiếp cấp 1 của parent, khác với dấu khoảng trắng là chọn tất cả con cháu.',
        difficulty: 'Nhận biết',
        knowledgeTag: 'Bộ chọn con trực tiếp'
      },
      {
        id: 'q-css-02',
        assessmentId: 'test-css-12-02',
        lessonId: 'lesson-12-e-12',
        lessonTitle: 'Bài 12: Thiết kế trang web với CSS Flexbox & Bộ chọn',
        topicTitle: 'Chủ đề E: Thiết kế trang web',
        grade: '12',
        text: 'Để định kiểu cho một liên kết hoặc nút bấm khi con trỏ chuột của người dùng đang di chuyển lướt qua nó, ta dùng lớp giả (Pseudo-class) nào?',
        options: [
          { id: 'A', text: ':hover' },
          { id: 'B', text: ':focus' },
          { id: 'C', text: ':active' },
          { id: 'D', text: ':visited' }
        ],
        correctOptionId: 'A',
        explanation: ':hover được kích hoạt khi người dùng rê chuột lên phần tử mà chưa bấm chuột.',
        difficulty: 'Nhận biết',
        knowledgeTag: 'CSS Pseudo-classes'
      },
      {
        id: 'q-css-03',
        assessmentId: 'test-css-12-02',
        lessonId: 'lesson-12-e-12',
        lessonTitle: 'Bài 12: Thiết kế trang web với CSS Flexbox & Bộ chọn',
        topicTitle: 'Chủ đề E: Thiết kế trang web',
        grade: '12',
        text: 'Trong một Flex Container có hướng mặc định (flex-direction: row), thuộc tính nào được sử dụng để căn chỉnh các phần tử con dọc theo TRỤC CHÉO (Cross Axis - tức trục dọc)?',
        options: [
          { id: 'A', text: 'justify-content' },
          { id: 'B', text: 'align-items' },
          { id: 'C', text: 'flex-wrap' },
          { id: 'D', text: 'align-content' }
        ],
        correctOptionId: 'B',
        explanation: 'Trong mô hình Flexbox, justify-content điều khiển căn chỉnh trên Trục chính (Main Axis), còn align-items điều khiển căn chỉnh trên Trục chéo (Cross Axis). Khi flex-direction: row, trục chéo là trục dọc.',
        difficulty: 'Thông hiểu',
        knowledgeTag: 'Flexbox align-items'
      },
      {
        id: 'q-css-04',
        assessmentId: 'test-css-12-02',
        lessonId: 'lesson-12-e-12',
        lessonTitle: 'Bài 12: Thiết kế trang web với CSS Flexbox & Bộ chọn',
        topicTitle: 'Chủ đề E: Thiết kế trang web',
        grade: '12',
        text: 'Để chọn và định dạng nền màu xám nhạt cho tất cả các hàng chẵn (2, 4, 6, ...) trong một bảng danh sách các thẻ <li>, bộ chọn nào sau đây là chính xác nhất?',
        options: [
          { id: 'A', text: 'li:nth-child(even)' },
          { id: 'B', text: 'li:nth-child(odd)' },
          { id: 'C', text: 'li:first-child' },
          { id: 'D', text: 'li:last-of-type' }
        ],
        correctOptionId: 'A',
        explanation: 'Lớp giả :nth-child(even) hoặc :nth-child(2n) chọn các phần tử ở vị trí chẵn. Ngược lại :nth-child(odd) chọn các vị trí lẻ.',
        difficulty: 'Vận dụng',
        knowledgeTag: 'CSS Pseudo-classes'
      },
      {
        id: 'q-css-05',
        assessmentId: 'test-css-12-02',
        lessonId: 'lesson-12-e-12',
        lessonTitle: 'Bài 12: Thiết kế trang web với CSS Flexbox & Bộ chọn',
        topicTitle: 'Chủ đề E: Thiết kế trang web',
        grade: '12',
        text: 'Muốn dàn 3 khối hộp nằm trên cùng một hàng ngang, trong đó hộp đầu tiên sát lề trái, hộp cuối cùng sát lề phải và khoảng cách giữa các hộp được phân bố đều nhau tự động, giá trị justify-content nào phù hợp nhất?',
        options: [
          { id: 'A', text: 'justify-content: space-between;' },
          { id: 'B', text: 'justify-content: center;' },
          { id: 'C', text: 'justify-content: space-around;' },
          { id: 'D', text: 'justify-content: flex-end;' }
        ],
        correctOptionId: 'A',
        explanation: 'space-between đặt phần tử đầu tiên sát mép bắt đầu, phần tử cuối sát mép kết thúc, và chia đều khoảng cách trống còn lại giữa các phần tử.',
        difficulty: 'Vận dụng',
        knowledgeTag: 'Flexbox justify-content'
      }
    ]
  },

  // ĐỀ 3: Hàm và Đệ quy Python (Tin 11 - KNTT)
  {
    id: 'test-py-11-01',
    title: 'Kiểm tra 15 phút: Hàm và Giải thuật Đệ quy (Tin học 11 - KNTT)',
    description: 'Đánh giá kỹ năng xây dựng hàm modul hóa, truyền tham số, giá trị trả về và bản chất đệ quy trong Python.',
    grade: '11',
    sessionId: 'session-python-11',
    sessionTitle: 'Khảo sát Năng lực Lập trình Python & CSDL - Khối 11',
    topicCode: 'Chủ đề 5',
    topicTitle: 'Giải quyết vấn đề với sự trợ giúp của máy tính',
    durationMinutes: 15,
    totalPoints: 10,
    passScore: 5.0,
    questionCount: 4,
    createdAt: '2026-09-21',
    isPublished: true,
    questions: [
      {
        id: 'q-py11-01',
        assessmentId: 'test-py-11-01',
        lessonId: 'lesson-11-16',
        lessonTitle: 'Bài 16: Hàm và Đệ quy trong Python',
        topicTitle: 'Chủ đề 5: Lập trình Python',
        grade: '11',
        text: 'Trong Python, từ khóa nào sau đây được dùng để định nghĩa một hàm mới do người dùng đặt tên?',
        options: [
          { id: 'A', text: 'function' },
          { id: 'B', text: 'def' },
          { id: 'C', text: 'func' },
          { id: 'D', text: 'define' }
        ],
        correctOptionId: 'B',
        explanation: 'Python sử dụng cú pháp def ten_ham(tham_so): để khai báo hàm.',
        difficulty: 'Nhận biết',
        knowledgeTag: 'Cú pháp định nghĩa hàm'
      },
      {
        id: 'q-py11-02',
        assessmentId: 'test-py-11-01',
        lessonId: 'lesson-11-16',
        lessonTitle: 'Bài 16: Hàm và Đệ quy trong Python',
        topicTitle: 'Chủ đề 5: Lập trình Python',
        grade: '11',
        text: 'Một hàm đệ quy bắt buộc phải có thành phần nào để tránh rơi vào vòng lặp vô tận gây lỗi tràn ngăn xếp (RecursionError)?',
        options: [
          { id: 'A', text: 'Vòng lặp while True' },
          { id: 'B', text: 'Điều kiện dừng (Base case)' },
          { id: 'C', text: 'Biến toàn cục global' },
          { id: 'D', text: 'Lệnh break lồng nhau' }
        ],
        correctOptionId: 'B',
        explanation: 'Điều kiện dừng (Base case) trả về giá trị trực tiếp mà không gọi lại hàm nữa, đảm bảo đệ quy kết thúc an toàn.',
        difficulty: 'Thông hiểu',
        knowledgeTag: 'Cấu trúc giải thuật đệ quy'
      },
      {
        id: 'q-py11-03',
        assessmentId: 'test-py-11-01',
        lessonId: 'lesson-11-16',
        lessonTitle: 'Bài 16: Hàm và Đệ quy trong Python',
        topicTitle: 'Chủ đề 5: Lập trình Python',
        grade: '11',
        text: 'Hàm sau trả về giá trị gì khi gọi tong(4)? def tong(n): return n + tong(n-1) if n > 1 else 1',
        options: [
          { id: 'A', text: '10' },
          { id: 'B', text: '24' },
          { id: 'C', text: '4' },
          { id: 'D', text: '16' }
        ],
        correctOptionId: 'A',
        explanation: 'tong(4) = 4 + 3 + 2 + 1 = 10.',
        difficulty: 'Vận dụng',
        knowledgeTag: 'Tính toán đệ quy'
      },
      {
        id: 'q-py11-04',
        assessmentId: 'test-py-11-01',
        lessonId: 'lesson-11-16',
        lessonTitle: 'Bài 16: Hàm và Đệ quy trong Python',
        topicTitle: 'Chủ đề 5: Lập trình Python',
        grade: '11',
        text: 'Lệnh "return" trong hàm Python có tác dụng chính nào?',
        options: [
          { id: 'A', text: 'In giá trị ra màn hình Console' },
          { id: 'B', text: 'Kết thúc thực thi hàm và trả kết quả về nơi gọi' },
          { id: 'C', text: 'Tạm dừng chương trình trong 1 giây' },
          { id: 'D', text: 'Khởi động lại toàn bộ chương trình từ đầu' }
        ],
        correctOptionId: 'B',
        explanation: 'Lệnh return ngay lập tức thoát khỏi hàm và truyền giá trị trả về cho biểu thức gọi hàm.',
        difficulty: 'Thông hiểu',
        knowledgeTag: 'Lệnh return trong hàm'
      }
    ]
  },

  // ĐỀ 4: Đại cương Tin học & Mạng máy tính (Tin 10 - KNTT)
  {
    id: 'test-it-10-01',
    title: 'Kiểm tra 15 phút: Đại cương Tin học & Mạng Internet (Tin học 10 - KNTT)',
    description: 'Kiểm tra kiến thức nền tảng về phần cứng, phần mềm, địa chỉ IP và nguyên lý truyền thông mạng.',
    grade: '10',
    sessionId: 'session-intro-10',
    sessionTitle: 'Đánh giá Nhập môn Tin học & Tư duy Máy tính - Khối 10',
    topicCode: 'Chủ đề 1',
    topicTitle: 'Máy tính và xã hội tri thức',
    durationMinutes: 15,
    totalPoints: 10,
    passScore: 5.0,
    questionCount: 4,
    createdAt: '2026-09-19',
    isPublished: true,
    questions: [
      {
        id: 'q-it10-01',
        assessmentId: 'test-it-10-01',
        lessonId: 'lesson-10-01',
        lessonTitle: 'Bài 1: Thông tin và xử lý thông tin',
        topicTitle: 'Chủ đề 1: Máy tính và xã hội tri thức',
        grade: '10',
        text: 'Đơn vị đo lượng thông tin cơ bản và nhỏ nhất trong máy tính là gì?',
        options: [
          { id: 'A', text: 'Bit (0 hoặc 1)' },
          { id: 'B', text: 'Byte (8 bit)' },
          { id: 'C', text: 'Kilobyte' },
          { id: 'D', text: 'Gigabyte' }
        ],
        correctOptionId: 'A',
        explanation: 'Bit (viết tắt của Binary Digit) là đơn vị nhỏ nhất, mang giá trị 0 hoặc 1 biểu diễn trạng thái tín hiệu.',
        difficulty: 'Nhận biết',
        knowledgeTag: 'Đơn vị đo thông tin'
      },
      {
        id: 'q-it10-02',
        assessmentId: 'test-it-10-01',
        lessonId: 'lesson-10-02',
        lessonTitle: 'Bài 2: Mạng máy tính và Internet',
        topicTitle: 'Chủ đề 1: Máy tính và xã hội tri thức',
        grade: '10',
        text: 'Giao thức mạng nào sau đây có chức năng định tuyến và đánh địa chỉ duy nhất cho mỗi thiết bị tham gia mạng toàn cầu?',
        options: [
          { id: 'A', text: 'IP (Internet Protocol)' },
          { id: 'B', text: 'HTML' },
          { id: 'C', text: 'CSS' },
          { id: 'D', text: 'USB' }
        ],
        correctOptionId: 'A',
        explanation: 'Giao thức IP gán địa chỉ IP (IPv4 hoặc IPv6) để định danh và dẫn đường cho các gói tin trên Internet.',
        difficulty: 'Thông hiểu',
        knowledgeTag: 'Giao thức mạng IP'
      },
      {
        id: 'q-it10-03',
        assessmentId: 'test-it-10-01',
        lessonId: 'lesson-10-03',
        lessonTitle: 'Bài 3: An toàn số & Bảo mật thông tin',
        topicTitle: 'Chủ đề 1: Máy tính và xã hội tri thức',
        grade: '10',
        text: 'Hành động nào sau đây giúp tăng cường bảo mật cho tài khoản cá nhân trực tuyến?',
        options: [
          { id: 'A', text: 'Bật xác thực hai yếu tố (2FA) và đặt mật khẩu mạnh' },
          { id: 'B', text: 'Dùng một mật khẩu "123456" cho tất cả dịch vụ' },
          { id: 'C', text: 'Lưu mật khẩu vào file công khai trên máy net' },
          { id: 'D', text: 'Bấm vào mọi đường link quà tặng trúng thưởng lạ' }
        ],
        correctOptionId: 'A',
        explanation: 'Xác thực 2 yếu tố (2FA) kết hợp mật khẩu có chữ hoa, số và ký tự đặc biệt giúp ngăn ngừa hiệu quả việc đánh cắp tài khoản.',
        difficulty: 'Vận dụng',
        knowledgeTag: 'An toàn bảo mật số'
      },
      {
        id: 'q-it10-04',
        assessmentId: 'test-it-10-01',
        lessonId: 'lesson-10-01',
        lessonTitle: 'Bài 1: Thông tin và xử lý thông tin',
        topicTitle: 'Chủ đề 1: Máy tính và xã hội tri thức',
        grade: '10',
        text: '1 Byte tương đương với bao nhiêu bit?',
        options: [
          { id: 'A', text: '8 bit' },
          { id: 'B', text: '10 bit' },
          { id: 'C', text: '16 bit' },
          { id: 'D', text: '1024 bit' }
        ],
        correctOptionId: 'A',
        explanation: 'Theo quy chuẩn công nghệ thông tin quốc tế, 1 Byte = 8 bits.',
        difficulty: 'Nhận biết',
        knowledgeTag: 'Đổi đơn vị thông tin'
      }
    ]
  },

  // ĐỀ 5: Làm quen Lập trình Python cơ bản (Tin 10 - KNTT)
  {
    id: 'test-py-10-02',
    title: 'Kiểm tra Giữa kỳ: Lập trình Python cơ bản (Tin học 10 - KNTT)',
    description: 'Khảo sát kiến thức biến, kiểu dữ liệu int, float, str, cấu trúc rẽ nhánh if-elif-else và vòng lặp for trong Python.',
    grade: '10',
    sessionId: 'session-mid-1',
    sessionTitle: 'Kiểm tra Giữa Học kỳ I - Năm học 2026 - 2027',
    topicCode: 'Chủ đề 4',
    topicTitle: 'Ứng dụng tin học - Lập trình cơ bản',
    durationMinutes: 15,
    totalPoints: 10,
    passScore: 5.0,
    questionCount: 4,
    createdAt: '2026-09-22',
    isPublished: true,
    questions: [
      {
        id: 'q-py10-01',
        assessmentId: 'test-py-10-02',
        lessonId: 'lesson-10-10',
        lessonTitle: 'Bài 10: Biến và kiểu dữ liệu trong Python',
        topicTitle: 'Chủ đề 4: Lập trình cơ bản',
        grade: '10',
        text: 'Kết quả của lệnh print(type(3.14)) trong Python là gì?',
        options: [
          { id: 'A', text: "<class 'float'>" },
          { id: 'B', text: "<class 'int'>" },
          { id: 'C', text: "<class 'str'>" },
          { id: 'D', text: "<class 'bool'>" }
        ],
        correctOptionId: 'A',
        explanation: 'Số 3.14 có phần thập phân nên thuộc kiểu số thực float.',
        difficulty: 'Nhận biết',
        knowledgeTag: 'Kiểu dữ liệu số thực float'
      },
      {
        id: 'q-py10-02',
        assessmentId: 'test-py-10-02',
        lessonId: 'lesson-10-11',
        lessonTitle: 'Bài 11: Cấu trúc rẽ nhánh if-else',
        topicTitle: 'Chủ đề 4: Lập trình cơ bản',
        grade: '10',
        text: 'Đoạn mã sau in ra gì? x = 10; if x > 5: print("Lớn") else: print("Nhỏ")',
        options: [
          { id: 'A', text: 'Lớn' },
          { id: 'B', text: 'Nhỏ' },
          { id: 'C', text: 'Lỗi cú pháp' },
          { id: 'D', text: 'Không in gì' }
        ],
        correctOptionId: 'A',
        explanation: 'Vì điều kiện x > 5 đúng (10 > 5) nên khối lệnh if được thực hiện và in ra "Lớn".',
        difficulty: 'Thông hiểu',
        knowledgeTag: 'Cấu trúc điều kiện if'
      },
      {
        id: 'q-py10-03',
        assessmentId: 'test-py-10-02',
        lessonId: 'lesson-10-12',
        lessonTitle: 'Bài 12: Vòng lặp for trong Python',
        topicTitle: 'Chủ đề 4: Lập trình cơ bản',
        grade: '10',
        text: 'Hàm range(1, 5) trong vòng lặp for sẽ sinh ra dãy số nguyên nào?',
        options: [
          { id: 'A', text: '1, 2, 3, 4' },
          { id: 'B', text: '1, 2, 3, 4, 5' },
          { id: 'C', text: '0, 1, 2, 3, 4' },
          { id: 'D', text: '2, 3, 4, 5' }
        ],
        correctOptionId: 'A',
        explanation: 'range(start, stop) sinh các giá trị từ start đến stop - 1. Do đó range(1, 5) gồm 1, 2, 3, 4.',
        difficulty: 'Thông hiểu',
        knowledgeTag: 'Hàm range trong vòng lặp'
      },
      {
        id: 'q-py10-04',
        assessmentId: 'test-py-10-02',
        lessonId: 'lesson-10-10',
        lessonTitle: 'Bài 10: Biến và kiểu dữ liệu trong Python',
        topicTitle: 'Chủ đề 4: Lập trình cơ bản',
        grade: '10',
        text: 'Quy tắc đặt tên biến nào sau đây là HỢP LỆ trong ngôn ngữ Python?',
        options: [
          { id: 'A', text: 'diem_tin_hoc' },
          { id: 'B', text: '2diem' },
          { id: 'C', text: 'diem-tin-hoc' },
          { id: 'D', text: 'diem tin hoc' }
        ],
        correctOptionId: 'A',
        explanation: 'Tên biến trong Python chỉ chứa chữ cái, chữ số và dấu gạch dưới _, không được bắt đầu bằng chữ số và không chứa dấu gạch ngang hay khoảng trắng.',
        difficulty: 'Vận dụng',
        knowledgeTag: 'Quy tắc đặt tên biến'
      }
    ]
  }
];

// Dữ liệu nộp bài mẫu tạo sẵn để hiển thị biểu đồ phân tích phổ điểm ngay lập tức
export const INITIAL_SUBMISSIONS: Submission[] = [
  // 15 học sinh lớp 12A1 làm bài Kiểm tra AI (test-ai-12-01)
  {
    id: 'sub-01',
    assessmentId: 'test-ai-12-01',
    assessmentTitle: 'Kiểm tra 15 phút: Làm quen với Trí tuệ nhân tạo (Tin học 12 - KNTT)',
    studentId: 'hs-12a1-01',
    studentName: 'Nguyễn Văn An',
    classId: 'class-12a1',
    className: '12A1',
    submittedAt: '2026-09-22 08:35:10',
    score: 8.0,
    maxScore: 10,
    correctCount: 4,
    totalQuestions: 5,
    durationSeconds: 420,
    answers: [
      { questionId: 'q-ai-01', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 45 },
      { questionId: 'q-ai-02', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 50 },
      { questionId: 'q-ai-03', selectedOptionId: 'C', isCorrect: true, timeSpentSeconds: 60 },
      { questionId: 'q-ai-04', selectedOptionId: 'B', isCorrect: false, timeSpentSeconds: 120 }, // Nhầm học có giám sát
      { questionId: 'q-ai-05', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 65 }
    ]
  },
  {
    id: 'sub-02',
    assessmentId: 'test-ai-12-01',
    assessmentTitle: 'Kiểm tra 15 phút: Làm quen với Trí tuệ nhân tạo (Tin học 12 - KNTT)',
    studentId: 'hs-12a1-02',
    studentName: 'Trần Thị Bích',
    classId: 'class-12a1',
    className: '12A1',
    submittedAt: '2026-09-22 08:34:00',
    score: 10.0,
    maxScore: 10,
    correctCount: 5,
    totalQuestions: 5,
    durationSeconds: 310,
    answers: [
      { questionId: 'q-ai-01', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 30 },
      { questionId: 'q-ai-02', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 40 },
      { questionId: 'q-ai-03', selectedOptionId: 'C', isCorrect: true, timeSpentSeconds: 45 },
      { questionId: 'q-ai-04', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 65 },
      { questionId: 'q-ai-05', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 50 }
    ]
  },
  {
    id: 'sub-03',
    assessmentId: 'test-ai-12-01',
    assessmentTitle: 'Kiểm tra 15 phút: Làm quen với Trí tuệ nhân tạo (Tin học 12 - KNTT)',
    studentId: 'hs-12a1-03',
    studentName: 'Lê Hoàng Cường',
    classId: 'class-12a1',
    className: '12A1',
    submittedAt: '2026-09-22 08:36:12',
    score: 6.0,
    maxScore: 10,
    correctCount: 3,
    totalQuestions: 5,
    durationSeconds: 510,
    answers: [
      { questionId: 'q-ai-01', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 55 },
      { questionId: 'q-ai-02', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 70 },
      { questionId: 'q-ai-03', selectedOptionId: 'A', isCorrect: false, timeSpentSeconds: 110 }, // Nhầm Siri là AGI
      { questionId: 'q-ai-04', selectedOptionId: 'B', isCorrect: false, timeSpentSeconds: 130 }, // Sai học có giám sát
      { questionId: 'q-ai-05', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 80 }
    ]
  },
  {
    id: 'sub-04',
    assessmentId: 'test-ai-12-01',
    assessmentTitle: 'Kiểm tra 15 phút: Làm quen với Trí tuệ nhân tạo (Tin học 12 - KNTT)',
    studentId: 'hs-12a1-04',
    studentName: 'Phạm Minh Duy',
    classId: 'class-12a1',
    className: '12A1',
    submittedAt: '2026-09-22 08:37:45',
    score: 4.0,
    maxScore: 10,
    correctCount: 2,
    totalQuestions: 5,
    durationSeconds: 580,
    answers: [
      { questionId: 'q-ai-01', selectedOptionId: 'B', isCorrect: false, timeSpentSeconds: 65 },
      { questionId: 'q-ai-02', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 80 },
      { questionId: 'q-ai-03', selectedOptionId: 'A', isCorrect: false, timeSpentSeconds: 120 },
      { questionId: 'q-ai-04', selectedOptionId: 'C', isCorrect: false, timeSpentSeconds: 140 },
      { questionId: 'q-ai-05', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 75 }
    ]
  },
  {
    id: 'sub-05',
    assessmentId: 'test-ai-12-01',
    assessmentTitle: 'Kiểm tra 15 phút: Làm quen với Trí tuệ nhân tạo (Tin học 12 - KNTT)',
    studentId: 'hs-12a1-05',
    studentName: 'Đỗ Thảo Giang',
    classId: 'class-12a1',
    className: '12A1',
    submittedAt: '2026-09-22 08:33:50',
    score: 8.0,
    maxScore: 10,
    correctCount: 4,
    totalQuestions: 5,
    durationSeconds: 390,
    answers: [
      { questionId: 'q-ai-01', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 40 },
      { questionId: 'q-ai-02', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 45 },
      { questionId: 'q-ai-03', selectedOptionId: 'C', isCorrect: true, timeSpentSeconds: 50 },
      { questionId: 'q-ai-04', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 70 },
      { questionId: 'q-ai-05', selectedOptionId: 'A', isCorrect: false, timeSpentSeconds: 90 }
    ]
  },
  {
    id: 'sub-06',
    assessmentId: 'test-ai-12-01',
    assessmentTitle: 'Kiểm tra 15 phút: Làm quen với Trí tuệ nhân tạo (Tin học 12 - KNTT)',
    studentId: 'hs-12a1-06',
    studentName: 'Hoàng Quốc Huy',
    classId: 'class-12a1',
    className: '12A1',
    submittedAt: '2026-09-22 08:35:30',
    score: 8.0,
    maxScore: 10,
    correctCount: 4,
    totalQuestions: 5,
    durationSeconds: 410,
    answers: [
      { questionId: 'q-ai-01', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 45 },
      { questionId: 'q-ai-02', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 55 },
      { questionId: 'q-ai-03', selectedOptionId: 'C', isCorrect: true, timeSpentSeconds: 60 },
      { questionId: 'q-ai-04', selectedOptionId: 'B', isCorrect: false, timeSpentSeconds: 95 },
      { questionId: 'q-ai-05', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 65 }
    ]
  },
  {
    id: 'sub-07',
    assessmentId: 'test-ai-12-01',
    assessmentTitle: 'Kiểm tra 15 phút: Làm quen với Trí tuệ nhân tạo (Tin học 12 - KNTT)',
    studentId: 'hs-12a1-07',
    studentName: 'Vũ Ngọc Hân',
    classId: 'class-12a1',
    className: '12A1',
    submittedAt: '2026-09-22 08:34:25',
    score: 10.0,
    maxScore: 10,
    correctCount: 5,
    totalQuestions: 5,
    durationSeconds: 330,
    answers: [
      { questionId: 'q-ai-01', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 35 },
      { questionId: 'q-ai-02', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 40 },
      { questionId: 'q-ai-03', selectedOptionId: 'C', isCorrect: true, timeSpentSeconds: 40 },
      { questionId: 'q-ai-04', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 55 },
      { questionId: 'q-ai-05', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 45 }
    ]
  },
  {
    id: 'sub-08',
    assessmentId: 'test-ai-12-01',
    assessmentTitle: 'Kiểm tra 15 phút: Làm quen với Trí tuệ nhân tạo (Tin học 12 - KNTT)',
    studentId: 'hs-12a1-08',
    studentName: 'Bùi Gia Khiêm',
    classId: 'class-12a1',
    className: '12A1',
    submittedAt: '2026-09-22 08:38:00',
    score: 4.0,
    maxScore: 10,
    correctCount: 2,
    totalQuestions: 5,
    durationSeconds: 600,
    answers: [
      { questionId: 'q-ai-01', selectedOptionId: 'B', isCorrect: false, timeSpentSeconds: 70 },
      { questionId: 'q-ai-02', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 90 },
      { questionId: 'q-ai-03', selectedOptionId: 'A', isCorrect: false, timeSpentSeconds: 130 },
      { questionId: 'q-ai-04', selectedOptionId: 'B', isCorrect: false, timeSpentSeconds: 150 },
      { questionId: 'q-ai-05', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 80 }
    ]
  },
  {
    id: 'sub-09',
    assessmentId: 'test-ai-12-01',
    assessmentTitle: 'Kiểm tra 15 phút: Làm quen với Trí tuệ nhân tạo (Tin học 12 - KNTT)',
    studentId: 'hs-12a1-09',
    studentName: 'Ngô Khánh Linh',
    classId: 'class-12a1',
    className: '12A1',
    submittedAt: '2026-09-22 08:35:05',
    score: 8.0,
    maxScore: 10,
    correctCount: 4,
    totalQuestions: 5,
    durationSeconds: 380,
    answers: [
      { questionId: 'q-ai-01', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 40 },
      { questionId: 'q-ai-02', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 50 },
      { questionId: 'q-ai-03', selectedOptionId: 'C', isCorrect: true, timeSpentSeconds: 50 },
      { questionId: 'q-ai-04', selectedOptionId: 'B', isCorrect: false, timeSpentSeconds: 85 },
      { questionId: 'q-ai-05', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 60 }
    ]
  },
  {
    id: 'sub-10',
    assessmentId: 'test-ai-12-01',
    assessmentTitle: 'Kiểm tra 15 phút: Làm quen với Trí tuệ nhân tạo (Tin học 12 - KNTT)',
    studentId: 'hs-12a1-10',
    studentName: 'Đặng Tuấn Minh',
    classId: 'class-12a1',
    className: '12A1',
    submittedAt: '2026-09-22 08:36:40',
    score: 6.0,
    maxScore: 10,
    correctCount: 3,
    totalQuestions: 5,
    durationSeconds: 490,
    answers: [
      { questionId: 'q-ai-01', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 50 },
      { questionId: 'q-ai-02', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 65 },
      { questionId: 'q-ai-03', selectedOptionId: 'A', isCorrect: false, timeSpentSeconds: 110 },
      { questionId: 'q-ai-04', selectedOptionId: 'B', isCorrect: false, timeSpentSeconds: 120 },
      { questionId: 'q-ai-05', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 70 }
    ]
  },

  // 10 bài nộp kiểm tra CSS Flexbox & Bộ chọn (test-css-12-02) thể hiện rõ 70% sai câu Pseudo-classes!
  {
    id: 'sub-css-01',
    assessmentId: 'test-css-12-02',
    assessmentTitle: 'Kiểm tra thực hành: CSS Flexbox và Bộ chọn (Tin học 12 - KNTT)',
    studentId: 'hs-12a1-01',
    studentName: 'Nguyễn Văn An',
    classId: 'class-12a1',
    className: '12A1',
    submittedAt: '2026-09-23 09:15:00',
    score: 6.0,
    maxScore: 10,
    correctCount: 3,
    totalQuestions: 5,
    durationSeconds: 430,
    answers: [
      { questionId: 'q-css-01', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 40 },
      { questionId: 'q-css-02', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 35 },
      { questionId: 'q-css-03', selectedOptionId: 'A', isCorrect: false, timeSpentSeconds: 95 }, // Sai align-items vs justify-content
      { questionId: 'q-css-04', selectedOptionId: 'B', isCorrect: false, timeSpentSeconds: 110 }, // Sai CSS Pseudo-classes nth-child
      { questionId: 'q-css-05', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 60 }
    ]
  },
  {
    id: 'sub-css-02',
    assessmentId: 'test-css-12-02',
    assessmentTitle: 'Kiểm tra thực hành: CSS Flexbox và Bộ chọn (Tin học 12 - KNTT)',
    studentId: 'hs-12a1-02',
    studentName: 'Trần Thị Bích',
    classId: 'class-12a1',
    className: '12A1',
    submittedAt: '2026-09-23 09:12:30',
    score: 8.0,
    maxScore: 10,
    correctCount: 4,
    totalQuestions: 5,
    durationSeconds: 310,
    answers: [
      { questionId: 'q-css-01', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 30 },
      { questionId: 'q-css-02', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 25 },
      { questionId: 'q-css-03', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 45 },
      { questionId: 'q-css-04', selectedOptionId: 'B', isCorrect: false, timeSpentSeconds: 85 }, // Sai CSS Pseudo-classes nth-child
      { questionId: 'q-css-05', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 40 }
    ]
  },
  {
    id: 'sub-css-03',
    assessmentId: 'test-css-12-02',
    assessmentTitle: 'Kiểm tra thực hành: CSS Flexbox và Bộ chọn (Tin học 12 - KNTT)',
    studentId: 'hs-12a1-03',
    studentName: 'Lê Hoàng Cường',
    classId: 'class-12a1',
    className: '12A1',
    submittedAt: '2026-09-23 09:16:15',
    score: 4.0,
    maxScore: 10,
    correctCount: 2,
    totalQuestions: 5,
    durationSeconds: 520,
    answers: [
      { questionId: 'q-css-01', selectedOptionId: 'A', isCorrect: false, timeSpentSeconds: 60 },
      { questionId: 'q-css-02', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 40 },
      { questionId: 'q-css-03', selectedOptionId: 'A', isCorrect: false, timeSpentSeconds: 120 },
      { questionId: 'q-css-04', selectedOptionId: 'C', isCorrect: false, timeSpentSeconds: 130 }, // Sai CSS Pseudo-classes nth-child
      { questionId: 'q-css-05', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 70 }
    ]
  },
  {
    id: 'sub-css-04',
    assessmentId: 'test-css-12-02',
    assessmentTitle: 'Kiểm tra thực hành: CSS Flexbox và Bộ chọn (Tin học 12 - KNTT)',
    studentId: 'hs-12a1-04',
    studentName: 'Phạm Minh Duy',
    classId: 'class-12a1',
    className: '12A1',
    submittedAt: '2026-09-23 09:17:40',
    score: 4.0,
    maxScore: 10,
    correctCount: 2,
    totalQuestions: 5,
    durationSeconds: 590,
    answers: [
      { questionId: 'q-css-01', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 50 },
      { questionId: 'q-css-02', selectedOptionId: 'B', isCorrect: false, timeSpentSeconds: 65 },
      { questionId: 'q-css-03', selectedOptionId: 'A', isCorrect: false, timeSpentSeconds: 130 },
      { questionId: 'q-css-04', selectedOptionId: 'B', isCorrect: false, timeSpentSeconds: 140 }, // Sai CSS Pseudo-classes
      { questionId: 'q-css-05', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 75 }
    ]
  },
  {
    id: 'sub-css-05',
    assessmentId: 'test-css-12-02',
    assessmentTitle: 'Kiểm tra thực hành: CSS Flexbox và Bộ chọn (Tin học 12 - KNTT)',
    studentId: 'hs-12a1-05',
    studentName: 'Đỗ Thảo Giang',
    classId: 'class-12a1',
    className: '12A1',
    submittedAt: '2026-09-23 09:14:10',
    score: 6.0,
    maxScore: 10,
    correctCount: 3,
    totalQuestions: 5,
    durationSeconds: 380,
    answers: [
      { questionId: 'q-css-01', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 35 },
      { questionId: 'q-css-02', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 30 },
      { questionId: 'q-css-03', selectedOptionId: 'A', isCorrect: false, timeSpentSeconds: 100 },
      { questionId: 'q-css-04', selectedOptionId: 'B', isCorrect: false, timeSpentSeconds: 105 }, // Sai CSS Pseudo-classes
      { questionId: 'q-css-05', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 50 }
    ]
  },
  {
    id: 'sub-css-06',
    assessmentId: 'test-css-12-02',
    assessmentTitle: 'Kiểm tra thực hành: CSS Flexbox và Bộ chọn (Tin học 12 - KNTT)',
    studentId: 'hs-12a1-06',
    studentName: 'Hoàng Quốc Huy',
    classId: 'class-12a1',
    className: '12A1',
    submittedAt: '2026-09-23 09:15:30',
    score: 6.0,
    maxScore: 10,
    correctCount: 3,
    totalQuestions: 5,
    durationSeconds: 410,
    answers: [
      { questionId: 'q-css-01', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 45 },
      { questionId: 'q-css-02', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 35 },
      { questionId: 'q-css-03', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 70 },
      { questionId: 'q-css-04', selectedOptionId: 'B', isCorrect: false, timeSpentSeconds: 95 }, // Sai CSS Pseudo-classes
      { questionId: 'q-css-05', selectedOptionId: 'C', isCorrect: false, timeSpentSeconds: 85 }
    ]
  },
  {
    id: 'sub-css-07',
    assessmentId: 'test-css-12-02',
    assessmentTitle: 'Kiểm tra thực hành: CSS Flexbox và Bộ chọn (Tin học 12 - KNTT)',
    studentId: 'hs-12a1-07',
    studentName: 'Vũ Ngọc Hân',
    classId: 'class-12a1',
    className: '12A1',
    submittedAt: '2026-09-23 09:13:00',
    score: 10.0,
    maxScore: 10,
    correctCount: 5,
    totalQuestions: 5,
    durationSeconds: 300,
    answers: [
      { questionId: 'q-css-01', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 25 },
      { questionId: 'q-css-02', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 20 },
      { questionId: 'q-css-03', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 40 },
      { questionId: 'q-css-04', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 50 },
      { questionId: 'q-css-05', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 45 }
    ]
  },
  {
    id: 'sub-css-08',
    assessmentId: 'test-css-12-02',
    assessmentTitle: 'Kiểm tra thực hành: CSS Flexbox và Bộ chọn (Tin học 12 - KNTT)',
    studentId: 'hs-12a1-08',
    studentName: 'Bùi Gia Khiêm',
    classId: 'class-12a1',
    className: '12A1',
    submittedAt: '2026-09-23 09:18:20',
    score: 4.0,
    maxScore: 10,
    correctCount: 2,
    totalQuestions: 5,
    durationSeconds: 590,
    answers: [
      { questionId: 'q-css-01', selectedOptionId: 'A', isCorrect: false, timeSpentSeconds: 70 },
      { questionId: 'q-css-02', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 45 },
      { questionId: 'q-css-03', selectedOptionId: 'A', isCorrect: false, timeSpentSeconds: 140 },
      { questionId: 'q-css-04', selectedOptionId: 'B', isCorrect: false, timeSpentSeconds: 130 }, // Sai CSS Pseudo-classes
      { questionId: 'q-css-05', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 85 }
    ]
  },
  {
    id: 'sub-css-09',
    assessmentId: 'test-css-12-02',
    assessmentTitle: 'Kiểm tra thực hành: CSS Flexbox và Bộ chọn (Tin học 12 - KNTT)',
    studentId: 'hs-12a1-09',
    studentName: 'Ngô Khánh Linh',
    classId: 'class-12a1',
    className: '12A1',
    submittedAt: '2026-09-23 09:14:45',
    score: 6.0,
    maxScore: 10,
    correctCount: 3,
    totalQuestions: 5,
    durationSeconds: 390,
    answers: [
      { questionId: 'q-css-01', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 40 },
      { questionId: 'q-css-02', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 30 },
      { questionId: 'q-css-03', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 65 },
      { questionId: 'q-css-04', selectedOptionId: 'B', isCorrect: false, timeSpentSeconds: 90 }, // Sai CSS Pseudo-classes
      { questionId: 'q-css-05', selectedOptionId: 'C', isCorrect: false, timeSpentSeconds: 80 }
    ]
  },
  {
    id: 'sub-css-10',
    assessmentId: 'test-css-12-02',
    assessmentTitle: 'Kiểm tra thực hành: CSS Flexbox và Bộ chọn (Tin học 12 - KNTT)',
    studentId: 'hs-12a1-10',
    studentName: 'Đặng Tuấn Minh',
    classId: 'class-12a1',
    className: '12A1',
    submittedAt: '2026-09-23 09:17:00',
    score: 4.0,
    maxScore: 10,
    correctCount: 2,
    totalQuestions: 5,
    durationSeconds: 520,
    answers: [
      { questionId: 'q-css-01', selectedOptionId: 'B', isCorrect: true, timeSpentSeconds: 50 },
      { questionId: 'q-css-02', selectedOptionId: 'A', isCorrect: true, timeSpentSeconds: 40 },
      { questionId: 'q-css-03', selectedOptionId: 'A', isCorrect: false, timeSpentSeconds: 120 },
      { questionId: 'q-css-04', selectedOptionId: 'D', isCorrect: false, timeSpentSeconds: 130 }, // Sai CSS Pseudo-classes
      { questionId: 'q-css-05', selectedOptionId: 'B', isCorrect: false, timeSpentSeconds: 95 }
    ]
  }
];

export const INITIAL_DISCUSSIONS: DiscussionPost[] = [
  {
    id: 'post-01',
    lessonId: 'lesson-12-e-12',
    lessonTitle: 'Bài 12: Thiết kế trang web với CSS Flexbox & Bộ chọn',
    authorName: 'Nguyễn Văn An',
    authorRole: 'Học sinh',
    avatarBg: 'bg-blue-600',
    title: 'Thầy cho em hỏi sự khác nhau giữa align-items: center và justify-content: center?',
    content: 'Khi em làm bài thực hành tạo thẻ Card cho sản phẩm, em đặt cả 2 thuộc tính này thì thấy phần tử vào chính giữa. Nhưng nếu đổi flex-direction: column thì có bị hoán đổi trục không ạ?',
    codeSnippet: {
      lang: 'css',
      code: `.card-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}`
    },
    createdAt: '2026-09-23 10:15',
    likes: 6,
    replies: [
      {
        id: 'rep-01-1',
        postId: 'post-01',
        authorName: 'ThS. Nguyễn Văn Hùng',
        authorRole: 'Giáo viên',
        avatarBg: 'bg-emerald-600',
        content: 'Chào em An, câu hỏi rất hay và đúng trọng tâm! Nguyên tắc cốt lõi của Flexbox là: justify-content luôn luôn điều khiển TRỤC CHÍNH (Main Axis), còn align-items luôn điều khiển TRỤC CHÉO (Cross Axis). Khi em chuyển sang flex-direction: column, trục chính trở thành trục dọc (từ trên xuống dưới), và trục chéo trở thành trục ngang (từ trái qua phải). Do đó, justify-content: center lúc này sẽ căn giữa theo chiều dọc, còn align-items: center sẽ căn giữa theo chiều ngang nhé!',
        createdAt: '2026-09-23 10:30',
        isAcceptedAnswer: true
      },
      {
        id: 'rep-01-2',
        postId: 'post-01',
        authorName: 'Trần Thị Bích',
        authorRole: 'Học sinh',
        avatarBg: 'bg-purple-600',
        content: 'Cảm ơn thầy ạ, hôm qua em làm bài kiểm tra cũng bị nhầm câu này vì quên mất việc trục chính đổi hướng khi dùng column.',
        createdAt: '2026-09-23 10:45'
      }
    ]
  },
  {
    id: 'post-02',
    lessonId: 'lesson-12-f-01',
    lessonTitle: 'Bài 1: Làm quen với Trí tuệ nhân tạo',
    authorName: 'Lê Hoàng Cường',
    authorRole: 'Học sinh',
    avatarBg: 'bg-amber-600',
    title: 'ChatGPT hay Gemini hiện nay đã được coi là AGI (AI tổng quát) chưa?',
    content: 'Em thấy ChatGPT có thể làm thơ, viết code Python và giải bài tập Tin học rất tốt, vậy nó đã vượt qua phép thử Turing và được coi là Trí tuệ nhân tạo tổng quát chưa thưa thầy cô?',
    createdAt: '2026-09-22 14:20',
    likes: 8,
    replies: [
      {
        id: 'rep-02-1',
        postId: 'post-02',
        authorName: 'ThS. Nguyễn Văn Hùng',
        authorRole: 'Giáo viên',
        avatarBg: 'bg-emerald-600',
        content: 'Chào Cường! Dù các mô hình ngôn ngữ lớn (LLMs) hiện nay rất ấn tượng, giới khoa học vẫn xếp chúng vào nhóm AI hẹp nâng cao (Narrow AI / Advanced Generative AI). Chúng hoạt động dựa trên cơ chế thống kê và suy đoán từ ngữ tiếp theo, chưa có khả năng tự ý thức, suy luận logic tổng quát hay thích nghi với môi trường hoàn toàn mới như con người (AGI). Về phép thử Turing, trong nhiều cuộc thử nghiệm ngắn hạn, chatbot có thể đánh lừa người thẩm vấn, nhưng vẫn thường gặp hiện tượng "ảo giác" (hallucination) khi đi sâu vào logic phức tạp.',
        createdAt: '2026-09-22 15:05',
        isAcceptedAnswer: true
      }
    ]
  }
];
