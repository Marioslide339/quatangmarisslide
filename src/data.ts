import { GiftItem, ReviewMessage } from './types';

export const giftItems: GiftItem[] = [
  {
    id: "1",
    title: "300 Game PowerPoint Đỉnh Cao",
    description: "Kho tài nguyên khổng lồ 300 trò chơi giáo dục bằng PowerPoint được thiết kế chuyên nghiệp, nhiều hiệu ứng sinh động, dễ dàng tùy biến cho mọi bài dạy lớp học.",
    category: "PowerPoint & Trò Chơi",
    url: "https://byvn.net/zApC",
    tags: ["PowerPoint", "Trò chơi lớp học", "Tương tác", "Không cần code"],
    bannerGradient: "from-[#FF4E50] to-[#F9D423]",
    iconName: "Presentation",
    badge: "Hot Nhất"
  },
  {
    id: "2",
    title: "Web App: Đấu Trường Trí Tuệ",
    description: "Ứng dụng tương tác tuyên truyền giáo dục về tác hại của thuốc lá, rượu bia, ma túy thông qua các câu hỏi trắc nghiệm kịch tính và bảng xếp hạng trực tiếp.",
    category: "Ứng Dụng Học Tập Số",
    url: "https://dautruongtritue-beta.vercel.app/",
    tags: ["Web Game", "Học liệu bổ trợ", "An toàn học đường", "Giao diện đẹp"],
    bannerGradient: "from-[#4776E6] to-[#8E54E9]",
    iconName: "Trophy",
    badge: "Phổ Biến"
  },
  {
    id: "3",
    title: "Web App: Viết Lệnh Tạo App Chuyên Nghiệp",
    description: "Trợ lý đắc lực giúp thầy cô viết prompts, câu lệnh tối ưu để tạo lập nhanh chóng các mini-app giáo dục, bài tập tương tác cực chất bằng AI.",
    category: "Công Nghệ AI",
    url: "https://apptaocaulenh.vercel.app/",
    tags: ["Prompt Engineering", "Trí tuệ nhân tạo (AI)", "Tự động hóa", "Sáng tạo nội dung"],
    bannerGradient: "from-[#11998e] to-[#38ef7d]",
    iconName: "Cpu",
    badge: "Khuyên Dùng"
  },
  {
    id: "4",
    title: "Web App: Quản Lý Học Sinh Lớp 5A",
    description: "Hệ thống số hóa giúp tối ưu hóa công tác theo dõi nề nếp, điểm thi đua, hoạt động rèn luyện và xuất báo cáo cho học sinh, phụ huynh cực kỳ tiện lợi.",
    category: "Hệ Thống Quản Lý",
    url: "https://appquanlylophoc5a.vercel.app/",
    tags: ["Quản lý lớp học", "Số hóa giáo dục", "Báo cáo nề nếp", "Dữ liệu nhanh"],
    bannerGradient: "from-[#FF007F] to-[#7F00FF]",
    iconName: "Users"
  },
  {
    id: "5",
    title: "Web App: Trợ Lý Viết Sáng Kiến Kinh Nghiệm (SKKN)",
    description: "Giải pháp ứng dụng trí tuệ nhân tạo đột phá hỗ trợ cấu trúc hóa luận điểm, gợi ý ý tưởng và soạn thảo Sáng kiến kinh nghiệm đạt giải tốt cấp trường, cấp Huyện/Tỉnh.",
    category: "Công cụ Giáo viên & AI",
    url: "https://appvietsangkienkinhnghiem.vercel.app/",
    tags: ["Ứng dụng AI", "Viết SKKN", "Khoa học giáo dục", "Chuẩn cấu trúc"],
    bannerGradient: "from-[#f12711] to-[#f5af19]",
    iconName: "FileText",
    badge: "Đặc Biệt"
  },
  {
    id: "7",
    title: "Phần Mềm: iSpring Suite 11 + Animiz",
    description: "Bộ cài đặt trọn vẹn phần mềm soạn bài giảng chuẩn E-learning quốc tế iSpring Suite 11 (tích hợp thẳng với PowerPoint) cùng phần mềm sản xuất video hoạt hình giáo dục Animiz ấn tượng.",
    category: "Bộ Cài Phần Mềm",
    url: "https://www.dropbox.com/scl/fo/x4bhor2bpxlop4wz34aok/ANbk9JRs0Mgfza3M2HGvuyo?rlkey=9qy6g79pfoar93ta6650cwncc&st=u47p45vs&e=1&dl=0v",
    tags: ["iSpring Suite 11", "Animiz", "Soạn bài giảng số", "E-Learning", "Dropbox Link"],
    bannerGradient: "from-[#ef32d9] to-[#89fffd]",
    iconName: "DownloadCloud"
  },
  {
    id: "8",
    title: "File Việt Hóa Giao Diện E-Learning Elearning (EL)",
    description: "Tài liệu và file dịch thuật, bản địa hóa trọn vẹn ngôn ngữ tiếng Việt cho phần mềm thiết kế bài giảng giúp thầy cô sử dụng dễ dàng, không sợ rào cản từ ngữ.",
    category: "Học Liệu Số Việt Hóa",
    url: "https://byvn.net/jv5O",
    tags: ["Việt hóa", "Phần mềm", "Giao diện chuẩn", "Dễ sử dụng"],
    bannerGradient: "from-[#ff9966] to-[#ff5e62]",
    iconName: "Globe"
  }
];

export const reviewsData: ReviewMessage[] = [
  {
    id: "r1",
    teacherName: "Cô Nguyễn Thị Hồng Hà",
    school: "Trường Tiểu Học Kim Đồng, TP.HCM",
    rating: 5,
    comment: "Nhờ kho 300 game Powerpoint và app AI viết SKKN của Maris Slide mà năm nay mình hoàn thành báo cáo chuyên đề xuất sắc, học sinh trong lớp thì hào hứng tham gia hoạt động hơn hẳn!",
    date: "14/06/2026"
  },
  {
    id: "r2",
    teacherName: "Thầy Lê Văn Thành",
    school: "Trường THPT Chu Văn An, Hà Nội",
    rating: 5,
    comment: "Phần mềm iSpring Suite 11 và file Việt hoá dùng cực mượt. Đặc biệt là app Viết lệnh tạo app bằng AI giúp tôi tự viết code cho các trò chơi vật lý cực kỳ độc đáo.",
    date: "12/06/2026"
  },
  {
    id: "r3",
    teacherName: "Cô Phạm Minh Huyền",
    school: "Trường THCS Lê Quý Đôn, Đà Nẵng",
    rating: 5,
    comment: "Một dự án cộng đồng rất ý nghĩa từ Maris Slide. Ứng dụng Đấu Trường Trí Tuệ tuyên truyền phòng chống tệ nạn học sinh hào hứng chơi suốt cả giờ sinh hoạt.",
    date: "10/06/2026"
  },
  {
    id: "r4",
    teacherName: "Cô Nguyễn Minh Phượng",
    school: "Trường THPT Chuyên Lương Thế Vinh, Đồng Nai",
    rating: 5,
    comment: "Dịch vụ thiết kế slide bài giảng của Maris Slide thực sự đẳng cấp. Bài thiết kế thi Giáo viên dạy giỏi cấp Tỉnh của tôi đạt giải Nhất tuyệt đối, ban giám khảo đánh giá rất cao sự sáng tạo và tính tương tác của slide!",
    date: "18/06/2026"
  },
  {
    id: "r5",
    teacherName: "Thầy Hoàng Ngô Bách",
    school: "Trường Tiểu Học Nguyễn Huệ, Hải Phòng",
    rating: 5,
    comment: "Khóa học Thiết kế học liệu số và AI của Maris Slide rất thực tế. Tôi đã tự tay viết lệnh AI để thiết kế các mini-app toán học cho học sinh, giúp tiết học sôi nổi hơn bao giờ hết. Rất đáng đồng tiền bát gạo!",
    date: "17/06/2026"
  },
  {
    id: "r6",
    teacherName: "Cô Lê Khánh Vân",
    school: "Trường THCS Phan Chu Trinh, Đắk Lắk",
    rating: 5,
    comment: "Mình đã đặt thiết kế bài E-Learning dự thi quốc gia tại Maris Slide. Sự chu đáo và trình độ kỹ thuật của team rất cao, bài thi đạt giải Nhì toàn quốc. Cảm ơn đội ngũ rất nhiều!",
    date: "15/06/2026"
  },
  {
    id: "r7",
    teacherName: "Cô Vũ Trúc Quỳnh",
    school: "Trường Tiểu Học Trần Quốc Toản, Quảng Ninh",
    rating: 5,
    comment: "Đã học xong 5 buổi khóa học AI giáo dục tại đây. Lộ trình khoa học, giảng viên chỉ bảo tận tình từ cách viết prompt đến tích hợp slide. Từ một người sợ công nghệ, giờ mình đã tự tin soạn bài giảng số chuẩn quốc tế.",
    date: "12/06/2026"
  },
  {
    id: "r8",
    teacherName: "Thầy Nguyễn Đức Nam",
    school: "Trường THPT Chuyên Quốc Học Huế",
    rating: 5,
    comment: "Cực kỳ ấn tượng với dịch vụ thiết kế Sáng kiến kinh nghiệm và báo cáo chuyên đề của Maris. Slide trực quan, chuyên nghiệp, giúp tôi bảo vệ thành công đề tài nghiên cứu cấp Tỉnh đạt loại Xuất sắc!",
    date: "10/06/2026"
  }
];
