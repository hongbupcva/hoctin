import { ReviewGame } from '../types';

export const INITIAL_GAMES: ReviewGame[] = [
  {
    id: 'game-ai-speed',
    title: 'Đấu trường Tri thức Tin 12: Trí tuệ nhân tạo (KNTT)',
    description: 'Chế độ thi đấu tốc độ với điểm thưởng chuỗi thắng (Combo Streak), kiểm tra phản xạ nhanh về phép thử Turing, AI hẹp và Máy học.',
    grade: '12',
    topicCode: 'Chủ đề F',
    mode: 'speed_quiz',
    timePerQuestionSeconds: 15,
    createdBy: 'ThS. Nguyễn Văn Hùng',
    createdAt: '2026-09-21',
    playCount: 42,
    highScore: 1250,
    questions: [
      {
        id: 'gq-1',
        text: 'Năm 1950, nhà toán học Alan Turing đề xuất phép thử Turing nhằm mục đích gì?',
        options: [
          { id: 'A', text: 'Đánh giá máy tính có hành vi trí tuệ tương đương con người hay không' },
          { id: 'B', text: 'Đo lường tốc độ xử lý xung nhịp của CPU' },
          { id: 'C', text: 'Kiểm tra độ bảo mật của mạng máy tính' },
          { id: 'D', text: 'Kiểm tra dung lượng lưu trữ của ổ cứng' }
        ],
        correctOptionId: 'A',
        explanation: 'Phép thử Turing đánh giá liệu một cỗ máy có khả năng thể hiện hành vi thông minh không thể phân biệt được với con người hay không.',
        hint: 'Tập trung vào khía cạnh nhận thức và trí thông minh của máy tính.',
        knowledgeTag: 'Phép thử Turing'
      },
      {
        id: 'gq-2',
        text: 'Thuật ngữ "Trí tuệ nhân tạo" (AI) được khai sinh tại hội thảo khoa học nào?',
        options: [
          { id: 'A', text: 'Hội thảo Dartmouth (1956)' },
          { id: 'B', text: 'Hội thảo Oxford (1960)' },
          { id: 'C', text: 'Hội nghị Geneva (1948)' },
          { id: 'D', text: 'Hội thảo Harvard (1972)' }
        ],
        correctOptionId: 'A',
        explanation: 'John McCarthy và các nhà khoa học đã chính thức đặt ra thuật ngữ AI tại Dartmouth năm 1956.',
        hint: 'Hội thảo diễn ra vào mùa hè năm 1956 tại Mỹ.',
        knowledgeTag: 'Lịch sử hình thành AI'
      },
      {
        id: 'gq-3',
        text: 'Ứng dụng Siri, Google Maps và phần mềm AlphaGo thuộc cấp độ AI nào?',
        options: [
          { id: 'A', text: 'AI tổng quát (AGI)' },
          { id: 'B', text: 'AI hẹp (Narrow / Weak AI)' },
          { id: 'C', text: 'Siêu trí tuệ (Super AI)' },
          { id: 'D', text: 'AI tự nhận thức bản thân' }
        ],
        correctOptionId: 'B',
        explanation: 'Chúng chỉ chuyên giải quyết một miền tác vụ cụ thể nên thuộc nhóm AI hẹp.',
        hint: 'Các hệ thống hiện nay chỉ giỏi một việc nhất định, chưa có trí tuệ toàn diện.',
        knowledgeTag: 'Phân loại AI'
      },
      {
        id: 'gq-4',
        text: 'Trong Học máy, phương pháp huấn luyện mô hình bằng dữ liệu đã có nhãn đầu ra gọi là gì?',
        options: [
          { id: 'A', text: 'Học có giám sát (Supervised Learning)' },
          { id: 'B', text: 'Học không giám sát (Unsupervised Learning)' },
          { id: 'C', text: 'Học tăng cường (Reinforcement Learning)' },
          { id: 'D', text: 'Học ngẫu nhiên' }
        ],
        correctOptionId: 'A',
        explanation: 'Học có giám sát sử dụng tập dữ liệu có sẵn cặp (input, target label).',
        hint: 'Từ khóa tiếng Anh là "Supervised".',
        knowledgeTag: 'Phương pháp Học máy'
      },
      {
        id: 'gq-5',
        text: 'Hiện tượng hệ thống AI đưa ra quyết định thiên vị (Data Bias) xuất phát chủ yếu từ đâu?',
        options: [
          { id: 'A', text: 'Do tập dữ liệu huấn luyện bị lệch hoặc thiếu đa dạng' },
          { id: 'B', text: 'Do tốc độ đường truyền Internet bị chậm' },
          { id: 'C', text: 'Do sử dụng màn hình máy tính có độ phân giải thấp' },
          { id: 'D', text: 'Do ngôn ngữ Python bị lỗi bộ nhớ' }
        ],
        correctOptionId: 'A',
        explanation: 'Mô hình AI phản ánh trung thực định kiến có sẵn trong tập dữ liệu nó được nạp vào để học.',
        hint: 'AI học từ dữ liệu con người cung cấp.',
        knowledgeTag: 'Đạo đức & Thiên vị dữ liệu'
      }
    ]
  },
  {
    id: 'game-flexbox-speed',
    title: 'Thử thách Cao thủ Web: Bậc thầy CSS Flexbox & Bộ chọn',
    description: 'Chinh phục các thuộc tính Flex Container, căn chỉnh 2 trục và lớp giả Pseudo-classes trong thiết kế giao diện hiện đại.',
    grade: '12',
    topicCode: 'Chủ đề E',
    mode: 'speed_quiz',
    timePerQuestionSeconds: 15,
    createdBy: 'ThS. Nguyễn Văn Hùng',
    createdAt: '2026-09-22',
    playCount: 38,
    highScore: 1180,
    questions: [
      {
        id: 'gq-fb-1',
        text: 'Để kích hoạt mô hình bố cục Flexbox cho phần tử cha, ta sử dụng cú pháp CSS nào?',
        options: [
          { id: 'A', text: 'display: flex;' },
          { id: 'B', text: 'display: block;' },
          { id: 'C', text: 'display: inline;' },
          { id: 'D', text: 'flex-direction: active;' }
        ],
        correctOptionId: 'A',
        explanation: 'Thuộc tính display: flex biến phần tử thành Flex Container.',
        hint: 'Giá trị của thuộc tính display bắt đầu bằng chữ "f".',
        knowledgeTag: 'Flex Container'
      },
      {
        id: 'gq-fb-2',
        text: 'Khi hướng là mặc định (flex-direction: row), trục chính (Main Axis) có phương nào?',
        options: [
          { id: 'A', text: 'Nằm ngang (từ trái sang phải)' },
          { id: 'B', text: 'Nằm dọc (từ trên xuống dưới)' },
          { id: 'C', text: 'Nằm chéo một góc 45 độ' },
          { id: 'D', text: 'Tùy thuộc vào kích cỡ màn hình' }
        ],
        correctOptionId: 'A',
        explanation: 'flex-direction: row đặt trục chính nằm ngang theo chiều đọc văn bản.',
        hint: '"Row" trong tiếng Anh có nghĩa là hàng ngang.',
        knowledgeTag: 'Trục chính Main Axis'
      },
      {
        id: 'gq-fb-3',
        text: 'Thuộc tính nào dùng để căn chỉnh các phần tử trên TRỤC CHÉO (Cross Axis)?',
        options: [
          { id: 'A', text: 'align-items' },
          { id: 'B', text: 'justify-content' },
          { id: 'C', text: 'flex-grow' },
          { id: 'D', text: 'flex-wrap' }
        ],
        correctOptionId: 'A',
        explanation: 'justify-content điều khiển trục chính, còn align-items điều khiển trục chéo.',
        hint: 'Bắt đầu bằng từ "align-".',
        knowledgeTag: 'Flexbox align-items'
      },
      {
        id: 'gq-fb-4',
        text: 'Lớp giả nào được kích hoạt khi người dùng rê chuột lên phần tử?',
        options: [
          { id: 'A', text: ':hover' },
          { id: 'B', text: ':active' },
          { id: 'C', text: ':focus' },
          { id: 'D', text: ':visited' }
        ],
        correctOptionId: 'A',
        explanation: ':hover kích hoạt hiệu ứng khi con trỏ chuột lướt trên phần tử.',
        hint: 'Hover nghĩa là lơ lửng, lướt qua.',
        knowledgeTag: 'CSS Pseudo-classes'
      },
      {
        id: 'gq-fb-5',
        text: 'Để chọn tất cả các dòng chẵn trong danh sách <li>, bộ chọn nào chính xác?',
        options: [
          { id: 'A', text: 'li:nth-child(even)' },
          { id: 'B', text: 'li:nth-child(odd)' },
          { id: 'C', text: 'li:first-child' },
          { id: 'D', text: 'li:last-child' }
        ],
        correctOptionId: 'A',
        explanation: 'even biểu diễn các vị trí chẵn 2, 4, 6, 8...',
        hint: '"Even" trong tiếng Anh là số chẵn.',
        knowledgeTag: 'CSS Pseudo-classes'
      }
    ]
  },
  {
    id: 'game-millionaire-py',
    title: 'Ai là Triệu phú Tin học 11: Lập trình Python & Đệ quy',
    description: 'Chinh phục 6 mốc thang kiến thức đỉnh cao với 3 quyền trợ giúp: 50:50, Hỏi Trợ lý AI và Khảo sát Khán giả!',
    grade: '11',
    topicCode: 'Chủ đề 5',
    mode: 'millionaire',
    timePerQuestionSeconds: 30,
    createdBy: 'Cô Phạm Hải Yến',
    createdAt: '2026-09-23',
    playCount: 29,
    highScore: 1000000,
    questions: [
      {
        id: 'gq-mil-1',
        text: 'Trong Python, từ khóa nào được dùng để định nghĩa một hàm?',
        options: [
          { id: 'A', text: 'def' },
          { id: 'B', text: 'function' },
          { id: 'C', text: 'func' },
          { id: 'D', text: 'define' }
        ],
        correctOptionId: 'A',
        explanation: 'Cú pháp định nghĩa hàm: def ten_ham(tham_so):',
        hint: 'Từ khóa gồm 3 ký tự viết tắt của define.',
        knowledgeTag: 'Định nghĩa hàm Python'
      },
      {
        id: 'gq-mil-2',
        text: 'Một hàm đệ quy bắt buộc phải có thành phần nào để không bị lặp vô tận?',
        options: [
          { id: 'A', text: 'Điều kiện dừng (Base case)' },
          { id: 'B', text: 'Lệnh break lồng nhau' },
          { id: 'C', text: 'Vòng lặp while True' },
          { id: 'D', text: 'Biến toàn cục global' }
        ],
        correctOptionId: 'A',
        explanation: 'Điều kiện dừng giúp hàm kết thúc đệ quy và quay lui trả về kết quả.',
        hint: 'Điểm neo để kết thúc lời gọi đệ quy.',
        knowledgeTag: 'Điều kiện dừng đệ quy'
      },
      {
        id: 'gq-mil-3',
        text: 'Nếu gọi hàm tính giai thừa giai_thua(4), số lần gọi đệ quy là bao nhiêu?',
        options: [
          { id: 'A', text: '4 lần' },
          { id: 'B', text: '1 lần' },
          { id: 'C', text: '16 lần' },
          { id: 'D', text: '24 lần' }
        ],
        correctOptionId: 'A',
        explanation: 'Gọi đệ quy: giai_thua(4) -> 3 -> 2 -> 1 (tổng 4 lần).',
        hint: 'Tương ứng với n giảm dần từ 4 về 1.',
        knowledgeTag: 'Thực thi hàm đệ quy'
      },
      {
        id: 'gq-mil-4',
        text: 'Kết quả của biểu thức [x**2 for x in range(4)] trong Python là gì?',
        options: [
          { id: 'A', text: '[0, 1, 4, 9]' },
          { id: 'B', text: '[1, 4, 9, 16]' },
          { id: 'C', text: '[0, 2, 4, 6]' },
          { id: 'D', text: '[1, 2, 3, 4]' }
        ],
        correctOptionId: 'A',
        explanation: 'range(4) sinh ra 0, 1, 2, 3. Bình phương là 0, 1, 4, 9.',
        hint: 'range(4) bắt đầu từ 0 đến 3.',
        knowledgeTag: 'List Comprehension'
      },
      {
        id: 'gq-mil-5',
        text: 'Lỗi RecursionError trong Python xảy ra khi nào?',
        options: [
          { id: 'A', text: 'Vượt quá giới hạn độ sâu đệ quy cho phép' },
          { id: 'B', text: 'Chia một số cho 0' },
          { id: 'C', text: 'Truy cập phần tử vượt ngoài chỉ số danh sách' },
          { id: 'D', text: 'Ép kiểu chuỗi sai định dạng' }
        ],
        correctOptionId: 'A',
        explanation: 'Python có giới hạn mặc định độ sâu đệ quy (thường là 1000) để bảo vệ bộ nhớ stack.',
        hint: 'Liên quan đến số tầng gọi lại hàm chính nó.',
        knowledgeTag: 'Xử lý lỗi Đệ quy'
      },
      {
        id: 'gq-mil-6',
        text: 'Giải thuật Tháp Hà Nội (Tower of Hanoi) với n đĩa có độ phức tạp số bước tối thiểu là:',
        options: [
          { id: 'A', text: '2^n - 1' },
          { id: 'B', text: 'n^2' },
          { id: 'C', text: 'n!' },
          { id: 'D', text: '2*n + 1' }
        ],
        correctOptionId: 'A',
        explanation: 'Công thức nghiệm đệ quy: T(n) = 2*T(n-1) + 1 = 2^n - 1 bước.',
        hint: 'Tăng theo cấp số nhân lũy thừa của 2.',
        knowledgeTag: 'Độ phức tạp Tháp Hà Nội'
      }
    ]
  },
  {
    id: 'game-match-terms',
    title: 'Ghép Thẻ Thuật ngữ: Định hướng Tin học THPT',
    description: 'Thử thách trí nhớ và liên kết khái niệm: Ghép các cặp thuật ngữ với định nghĩa tương ứng chuẩn SGK Kết nối tri thức.',
    grade: '12',
    topicCode: 'Tổng hợp',
    mode: 'match_pairs',
    timePerQuestionSeconds: 60,
    createdBy: 'ThS. Nguyễn Văn Hùng',
    createdAt: '2026-09-24',
    playCount: 56,
    highScore: 980,
    questions: [],
    matchPairs: [
      { id: 'mp-1', term: 'Turing Test', definition: 'Phép thử đánh giá máy móc có trí thông minh giống con người', category: 'Trí tuệ nhân tạo' },
      { id: 'mp-2', term: 'Narrow AI', definition: 'Hệ thống AI chuyên biệt thực hiện xuất sắc một tác vụ đơn lẻ', category: 'Trí tuệ nhân tạo' },
      { id: 'mp-3', term: 'justify-content', definition: 'Căn chỉnh các phần tử con dọc theo Trục chính (Main Axis)', category: 'CSS Flexbox' },
      { id: 'mp-4', term: 'align-items', definition: 'Căn chỉnh các phần tử con dọc theo Trục chéo (Cross Axis)', category: 'CSS Flexbox' },
      { id: 'mp-5', term: ':hover', definition: 'Lớp giả định kiểu khi người dùng rê chuột lên phần tử', category: 'CSS Selectors' },
      { id: 'mp-6', term: 'Supervised Learning', definition: 'Phương pháp huấn luyện mô hình bằng dữ liệu đã gán nhãn', category: 'Học máy' }
    ]
  }
];
